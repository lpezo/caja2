Template.ReporteGasto.onCreated(function(){
	var self = this;
	this.autorun(()=> {
		Session.set('error', '');
		var id = FlowRouter.getParam('id');
		self.subscribe('Solicitud', id);
		self.subscribe('autocompletUsers');
		this.dataUrl = new ReactiveVar();
	});
});

Template.ReporteGasto.helpers({
	'data': function(){
		var id = FlowRouter.getParam('id');
		var data = Solicitudes.findOne(id);
		if (data){
			data.fechaDate = moment(data.fecha).utc().format('DD/MM/YYYY');
			data.origen = data.lugar && data.lugar.length ? data.lugar[0].org : '';
			data.destino = data.lugar && data.lugar.length ? data.lugar[0].dest : '';
			data.hora = moment(data.fecha).utc().format('HH:mm');

			if (data.recibido && data.gastado)
			{
				let frecibido = parseFloat(data.recibido);
				let fgastado = parseFloat(data.gastado);
				data.dif = Meteor.Util.strFormat((frecibido - fgastado).toString());
			}



		}
		return data;
	},
	'dataDarDinero': function(){
		var id = FlowRouter.getParam('id');
		var data = Solicitudes.findOne(id);
		if (data)
			data.recibidoPor = data.nombre.nombre;
		return data;
	},
	autorizador: function(){
		let userActual = Session.get('CurrentUser');
		let solicitud = Solicitudes.findOne(FlowRouter.getParam('id'));
		if (solicitud && userActual){

			if (solicitud.userMsg == 'socio'){ // monto mayor
				if (userActual.username == solicitud.codsocio && solicitud.estado == 'N')
					return true;
				else
					return false;
			}
			else	//monto menores
			{
				if (userActual.role && userActual.role == 'tesorero' && solicitud.estado == 'N')
					return true;
				else
					return false;
			}

			//let valor = parseFloat(solicitud.monto.replace(',', ''));
			//console.log(valor, opcion.mayorA);
			/*
			if (solicitud.moneda == 'PEN' && valor > opcion.aGerente.mayorSoles)
				return (userActual.role == 'gerente');	// por gerente
			else if (solicitud.moneda == 'USD' && valor > opcion.aGerente.mayorDol)
				return (userActual.role == 'gerente');	// por gerente
			else	
				return (userActual.username == solicitud.resp.codigo);	//por responsable
			*/
		}
		else
			return false;
	},
	esDarDinero: function(){
		let userActual = Session.get('CurrentUser');
		let solicitud = Solicitudes.findOne(FlowRouter.getParam('id'));
		if (solicitud){
			if (userActual.role && userActual.role == 'tesorero' && solicitud.estado == 'A')
				return true;
			else
				return false;
		}
		else
			return false;
	},
	esRendirCuenta: function() {
		let userActual = Session.get('CurrentUser');
		let solicitud = Solicitudes.findOne(FlowRouter.getParam('id'));
		if (userActual && solicitud){
			if (solicitud.estado == 'E' && userActual.username == solicitud.nombre.codigo)
				return true;
			else
				return false;
		}
		else
			return false;
	},
	auditar: function() {
		let userActual = Session.get('CurrentUser');
		if (userActual.role && userActual.role == 'auditor'){
			return true;
		}
		return false;
	},
	'imageUrl': function(){
  		return Template.instance().dataUrl.get();
  	}
});


Template.ReporteGasto.events({
	'click #btnAceptar': function(event, template){
		event.preventDefault();
		Meteor.call('aceptarRechazar', FlowRouter.getParam('id'), 'A', function(error, response){
			if (error)
				Session.set('error', error.reason);
			else
				FlowRouter.go(Session.get('pag_ant'));
		});
	},
	'click #btnCancelar': function(event, template){
		event.preventDefault();
		Meteor.call('aceptarRechazar', FlowRouter.getParam('id'), 'R', function(error, response){
			if (error)
				Session.set('error', error.reason);
			else
				FlowRouter.go(Session.get('pag_ant'));
		});
	},
	/*
	'click #btnEditarMonto': function(event, template){
		event.preventDefault();
		let xrecibido = template.find('[name=editRecibido]').value;

		if (xrecibido)
		{
			xrecibido = Meteor.Util.strFormat(xrecibido);
			Solicitudes.update({_id: this._id}, {$set: {recibido: xrecibido, estado: 'E'}});

			var id = document.getElementById("content");
			Blaze.renderWithData(Template.ReporteGasto, this, id)
			
		}
		else
			alert('Ingrese valor entregado');
	},
	*/
	'click #btnRendirCuenta': function(event, template){
		event.preventDefault();
		let xgastado = template.find('[name=editGastado]').value;

		if (xgastado)
		{
			xgastado = Meteor.Util.strFormat(xgastado);
			Solicitudes.update({_id: this._id}, {$set: {gastado: xgastado, estado: 'C'}});
		}
		else
			alert('Ingrese valor gastado');
	},

	'click #btnPdf': (event, template) => {

		event.preventDefault();
		Meteor.call('ReporteGasto', FlowRouter.getParam('id'), function(error, response){
			if (error)
				console.log('error:', error);
			else
				alert('Generado!');
		});
	},

	'click #aud_nada': () => {
		let id = FlowRouter.getParam('id');
		Solicitudes.update(id, {$set: {auditado: ''}});
	},

	'click #aud_ok': () => {
		let id = FlowRouter.getParam('id');
		Solicitudes.update(id, {$set: {auditado: 'OK'}});
	},

	'click #aud_obs': () => {
		let id = FlowRouter.getParam('id');
		Solicitudes.update(id, {$set: {auditado: 'OBS'}});	
	},

	'change input[type="file"]': function(event,template){
	    var files=event.target.files;
	    if(files.length===0){
	      return;
	    }
	    var file=files[0];
	    //
	    var fileReader=new FileReader();
	    fileReader.onload=function(event){
	      var dataUrl=event.target.result;
	      template.dataUrl.set(dataUrl);
	    };
	    fileReader.readAsDataURL(file);
  	}


});

AutoForm.hooks({
    tesoreriaSolicitudForm: {
        onError: function(formType, error){
            if (error){
                console.log('error:', error.message);
                Session.set('error:', error.message);
            }
        },
        before:{
            update: function(doc){
            	//console.log(this.event.currentTarget.img.src);
            	doc.$set.recibido = Meteor.Util.strFormat(doc.$set.recibido);
            	doc.$set.img = this.event.currentTarget.img.src;
            	doc.$set.estado = 'E';
            	return doc;
        	}
        }
    }
});
