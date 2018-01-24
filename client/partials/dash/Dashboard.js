Template.Dashboard.onCreated(function(){
	var self = this;
	this.autorun(() => {
		if (!Session.get('xtipo'))
			Session.set('xtipo', 'movil');
		if (!Session.get('xfecha')){
			let hoy = new Date();
			let ant = new Date(hoy);
			ant.setDate(ant.getDate() - 7);
			Session.set('xfecha', {fecha1: ant, fecha2: hoy} );
		}

		self.subscribe('Solicitudes', Session.get('xtipo'), Session.get('xfecha'), Session.get('CurrentUser'));
		self.subscribe('Tipos');

		Session.set('pag_ant', '/dashboard');

	});
});

Template.Dashboard.helpers({
	mayores: function(){
		let xfecha = Session.get('xfecha');
		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

		return Solicitudes.find({tipo:Session.get('xtipo'), fecha:{$gte:start, $lt:end}, userMsg: 'socio'});
	},
	menores: function(){
		let xfecha = Session.get('xfecha');
		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

		return Solicitudes.find({tipo:Session.get('xtipo'), fecha:{$gte:start, $lt:end}, userMsg: {$ne: 'socio'}});
	},
	tipos: function(){
		return Tipos.find();
	},
	settings: function() {
		let usuario = Session.get('CurrentUser');
		let estesorero = usuario.role && usuario.role == 'tesorero';
	return {
		rowsPerPage: 20,
		showFilter: true,
		fields: [
			{key: 'num', label: 'Número', cellClass: 'user_id'},
			{key:'fecha', label: 'Fecha', sortOrder: 0, sortDirection: -1,
				fn: function(value) { return moment(value).utc().format('DD/MM/YYYY'); }
			},
			{key:'nombre.dni', label: 'Dni'},
			{key:'nombre.nombre', label: 'Solicitante'},
			{key:'resp.codigo', label: 'Responsable'},
			{key: 'codsocio', label: 'Socio'},
			{key:'resp.area', label: 'Area'},
			{key:'monto', label: 'Monto'},
			{key:'recibido', label: 'Recibido'},
			{key:'gastado', label: 'Gastado'},
			{key:'moneda', label: 'Moneda'},
			{key:'estado', label: 'Estado', fn: function(value, doc){
				if (value){
					if (value == 'A')
						return new Spacebars.SafeString("<a href='/solicitud/aceptar/" + doc._id + "'' class='btn btn-default' title='Enviar Dinero' ><i class='icon_estado fa fa-thumbs-o-up'></i></a>");
					else if (value == 'R')
						return new Spacebars.SafeString("<a href='/solicitud/aceptar/" + doc._id + "'' class='btn btn-default' title='OK' href='/solicitud/aceptar/" + doc._id + "'><i class='icon_estado fa fa-thumbs-o-down'></i></a>");
					else if (value == 'E')
						return new Spacebars.SafeString("<a href='/solicitud/aceptar/" + doc._id + "'' class='btn btn-default' title='Rendir Cuenta' href='/solicitud/aceptar/" + doc._id + "'><i class='icon_estado fa fa-money'></i></a>");
					else if (value == 'C')
						return new Spacebars.SafeString("<a href='/solicitud/aceptar/" + doc._id + "'' class='btn btn-default' title='' href='/solicitud/aceptar/" + doc._id + "'><i class='icon_estado fa fa-check'></i></a>");
					else
						return new Spacebars.SafeString("<a href='/solicitud/aceptar/" + doc._id + "'' class='btn btn-default' title='Aceptar'><i class='icon_estado fa fa-square-o'></i></a>");
				}
				else
					return '';

			}},
			{key: 'cerrado', label: 'Cerrado', fn: function(value, doc){
				if (doc.estado == 'C' && estesorero){
					if (!value)
						return new Spacebars.SafeString("<a class='btn btn-primary' title='Cerrar' >Cerrar</a>");
					else
						return new Spacebars.SafeString("<a class='btn btn-default' title='Cerrado' disabled ><i class='fa fa-check'></i></a>");
				}
				else
					return "";
			}}
		]};
	},
	fechaActual: function(){
		//return moment(Session.get('xfecha')).utc().format("DD/MM/YYYY");
		return moment(Session.get('xfecha').fecha2).utc().format("DD/MM/YYYY");
	},
	fechaAntes: function(){
		//return moment(Session.get('xfecha')).add(-7, 'days').utc().format("DD/MM/YYYY");
		return moment(Session.get('xfecha').fecha1).utc().format("DD/MM/YYYY");
	}

});

Template.Dashboard.events({
	'click #item' : function(event, template) {
		let xfech = Session.get('xfecha');
		console.log('item:', this, xfech);
		template.subscribe('Solicitudes', this.name, xfech, Session.get('CurrentUser'));
		Session.set('xtipo', this.name);
	},
	'click .reactive-table tbody tr': function (event) {
	    //event.preventDefault();
	    var solicitud = this;

	    // checks if the actual clicked element has the class `delete`
	    //console.log('solicitud:', solicitud);	
	    if (event.target.className == 'user_id'){
	    	Session.set('pag_ant', '/dashboard');
	    	if (solicitud.estado == 'A')
	    		FlowRouter.go('/solicitud/' + solicitud._id + '#tesoreria');
	    	else if (solicitud.estado == 'E')
	    		FlowRouter.go('/solicitud/' + solicitud._id + '#rendir');
	    	else
	    		FlowRouter.go('/solicitud/' + solicitud._id);
	    }
	    else if (event.target.className == 'btn btn-primary'){
	    	if (confirm('Esta seguro de cerrar'))
	    		Solicitudes.update({_id:solicitud._id}, {$set: {cerrado: true}});
		}

	    /*
	    else if (event.target.className == 'btn btn-default'){
	    	Session.set('pag_ant', '/dashboard');
	    	FlowRouter.go('/solicitud/aceptar/' + solicitud._id);
	    }
	    */
    },
	
	'click #datetimepicker1': function(event, template){
		$('#datetimepicker1').datepicker({
			format: "dd/mm/yyyy",
			autoclose: true,
			todayBtn: true,
			todayHighlight: true
		}).on('changeDate', function(e){
			let xfecha = Session.get('xfecha');
			if (xfecha.fecha1.getTime() != e.date.getTime()){
				xfecha.fecha1 = e.date;
				Session.set('xfecha', xfecha);
				let xtipo = Session.get('xtipo');
				template.subscribe('Solicitudes', xtipo, xfecha, Session.get('CurrentUser'));
				//console.log(xfecha, Session.get('xfecha'));
			}
		});
	},

	'click #datetimepicker2': function(event, template){
		$('#datetimepicker2').datepicker({
			format: "dd/mm/yyyy",
			autoclose: true,
			todayBtn: true,
			todayHighlight: true
		}).on('changeDate', function(e){
			let xfecha = Session.get('xfecha');
			if (xfecha.fecha2.getTime() != e.date.getTime()){
				xfecha.fecha2 = e.date;
				Session.set('xfecha', xfecha);
				let xtipo = Session.get('xtipo');
				template.subscribe('Solicitudes', xtipo, xfecha, Session.get('CurrentUser'));
				//console.log(xfecha, Session.get('xfecha'));
			}
		});
	},

	'click #dataview-export-csv': function(e, t) {
	   e.preventDefault();

		 //var str = convertArrayOfObjects(data, exportFields, fileType);

		let xfecha = Session.get('xfecha');
		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

		let mapa = Solicitudes.find({tipo:Session.get('xtipo'), fecha:{$gte:start, $lt:end}}).map(function(obj){
			let reg = {num: obj.num, tipo: obj.tipo, fecha: obj.fecha, nombre: obj.nombre.nombre, dni: obj.nombre.dni, area: obj.nombre.area, monto: obj.monto, moneda: obj.moneda};
			if (obj.lugar && obj.lugar.length > 0){
				reg['org'] = obj.lugar[0].org;
				reg['dest'] = obj.lugar[0].dest;
			}
			else{
				reg['org'] = '';
				reg['dest'] = '';
			}
			return reg;
		});

		var str = Papa.unparse(mapa, {quotes:true});
		//console.log(str);

		//var filename = "export." + '.csv';
		//downloadLocalResource(str, filename, "application/octet-stream");

		window.open(encodeURI('data:text/csv;charset=utf-8,' + str));


	 }

});
