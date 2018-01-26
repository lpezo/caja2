Template.Solicitud.onCreated(function(){
	var self = this;
	this.autorun(() => {
		self.subscribe('Tipos');
		self.subscribe('autocompletUsers');
        self.subscribe('Clientes');
        self.subscribe('GetOpcion');
        //self.VarContactos = new ReactiveVar('contactos', []);
        Session.set('error', '');
	});
});

Template.Solicitud.helpers({
	byDefault: function() {
        //console.log('User: ', Meteor.user());
        //if (Meteor.user())
        var usu = Session.get('CurrentUser');
        var xcliente = '';
        var opc = Opcion.findOne();
        if (opc && usu){
            xcliente = opc.default.cliente;

            /*
            let cliente = Clientes.findOne({descripcion: xcliente});
            if (cliente)
                Template.instance().VarContactos.set('contacto', cliente.contacto);
            */
    		let doc = {num: 0, fecha: new Date(new Date().getTime()), moneda:'PEN', 
                nombre: {nombre: usu.name}, cli: xcliente};

            //if (usu.hasOwnProperty('resp')){
            if (usu.hasOwnProperty('jefe')){
                let resp = Usuarios.findOne({username: usu.jefe});
                if (resp)
                    doc['resp'] = {nombre: resp.name};
                if (usu.socio)
                    doc['codsocio'] = usu.socio;
            }
            //console.log('byDefault:', doc);
            return doc;
        }
        else
            return {};
	},
    clientes: function() {
        return Clientes.find();
    }
    /*,
    contactos: function(){
        return Template.instance().VarContactos.get();
    }
    */
});

/*
Template.userPill.helpers({
	labelClass: function() {
	  if (this._id == Meteor.userId())
	    return "label-warning";
	  else if (this.profile.online)
	    return "label-success";
	  else
	    return "";
	}
});
*/

Template.Solicitud.events({
  "autocompleteselect input": function(event, template, doc) {
    if (event.target.name == 'nombre.nombre'){
        //console.log("selected ", doc);
        let input_resp = template.find('[name="resp.nombre"]');
        //if (input_resp){
            //if (doc.resp){
            if (doc.jefe){
                //let find_resp = Usuarios.findOne({username: doc.resp});
                let find_resp = Usuarios.findOne({username: doc.jefe});
                if (find_resp)
                    input_resp.value = find_resp.name;
            }
    }
    //console.log('event: ', event);
  }
});

AutoForm.hooks({
    insertSolicitudForm: {
        onError: function(formType, error){
            if (error){
                console.log('error:', error.message);
                Session.set('error:', error.message);
            }
        },
        before:{
            insert: function(doc){

                //console.log(this);
                if (!AutoForm.validateForm(this.formId))
                {
                    Session.set('error', 'El form no valida!');
                    console.log(this);
                    return false;
                }

                if (doc.resp){
                    var user = Usuarios.findOne({ 'name': doc.resp.nombre});
                    if (user){
                        doc.resp.codigo = user.username;
                        doc.resp.dni = user.dni;
                        doc.resp.area = user.area;
                    }
                }


                var opc = Opcion.findOne();

                let valor = parseFloat(doc.monto.replace(',', ''));
                //console.log(valor, opcion.mayorA);
                if (doc.moneda == 'PEN' && valor > opc.aGerente.mayorSoles)
                    doc.userMsg = 'socio';  // por gerente
                else if (doc.moneda == 'USD' && valor > opc.aGerente.mayorDol)
                    doc.userMsg = 'socio';  // por gerente
                else    
                    doc.userMsg = doc.resp.codigo;    //por responsable

                var xtipo = 'S';

                if (doc.nombre){
                    user = Usuarios.findOne({ 'name': doc.nombre.nombre });
                    if (user){
                        doc.nombre.codigo = user.username;
                        doc.nombre.dni = user.dni;
                        doc.nombre.area = user.area;
                        xtipo = user.tipo;
                    }
                }

                var usu = Session.get('CurrentUser');

                doc.author = usu.username;
                doc.estado = 'N';
                if (usu.socio)
                    doc.codsocio = usu.socio;

                if (doc.monto){
                    doc.monto = Meteor.Util.strFormat(doc.monto);
                }

                var self = this;
                let year = doc.fecha.getFullYear().toString();
                Meteor.call('getNum', doc.tipo, year, xtipo, function(error, response){
                    console.log('response:', response);
                    doc.num = response;
                    //this.result(doc)
                    //return doc;


                    self.result(doc);
                });
            }
        },
        onSuccess: function(formType, result){
            Session.set('pag_ant', '/solicitud');
            //Actualizar Responsable si es diferente
            let doc = this.insertDoc;
            //console.log('doc:', doc);

            //Meteor.call('updateResponsable', doc.nombre.codigo, doc.resp.codigo, function(error, response){
                Meteor.call('updateResponsable', doc, result, function(error, response){
                //console.log('cant:', response);

                //Guardar en Sessino
                //solo si ha hecho el update con condicion de que sea diferente el resposable
                let xusu = Session.get('CurrentUser');
                if (xusu.username == doc.nombre.codigo){
                    //Si la session es igual al nombre
                    if (!xusu.hasOwnProperty('resp') || xusu.resp !== doc.resp.codigo){
                        //So no ha cambiado el resposable
                        xusu['resp'] = doc.resp.codigo;
                        Session.set('CurrentUser', xusu);
                    }
                }
                FlowRouter.go('/solicitud/' + result);
            });


        }
    }
});