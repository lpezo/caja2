Template.Planilla.onCreated(function(){
	var self = this;
	self.reporte = new ReactiveVar();
	this.autorun(() => {
		self.subscribe('autocompletUsers');
		if (!Session.get('xfecha')){
			let hoy = new Date();
			let ant = new Date(hoy);
			ant.setDate(ant.getDate() - 7);
			Session.set('xfecha', {fecha1: ant, fecha2: hoy} );
		}
		//self.subscribe('Solicitudes', Session.get('xtipo'), Session.get('xfecha'));
	});
});

Template.Planilla.helpers({
	settings: function() {
	  return {
	    position: 'bottom',
	    limit: 8,  // more than 20, to emphasize matches outside strings *starting* with the filter
	    rules: [
	      {
	        token: '',
	        // string means a server-side collection; otherwise, assume a client-side collection
	        //collection: Meteor.users,
	        collection: Usuarios,
	        field: 'name',
	        options: 'i', // Use case-sensitive match to take advantage of server index.
	        matchAll: true,
	        template: Template.userPill
	      }
	    ]
	  }
	},
	
	settingTable: function(){
	return {
		rowsPerPage: 20,
		showFilter: true,
		fields: [
			//{key: 'num', label: 'Número', cellClass: 'user_id'},
			//{key:'tipo', label: 'Tipo'},
			{key:'fecha', label: 'Fecha',
				fn: function(value) { return moment(value).utc().format('DD/MM/YYYY'); }
			},
			{key:'nombre.nombre', label: 'Nombre'},
			{key:'areapra', label: 'Area'},
			{key:'mot', label: 'Motivo'},
			{key:'origen', label: 'Origen', fn: function(value, doc){
				if (doc.lugar && doc.lugar.length > 0)
					return doc.lugar[0].org;
				else
					return '';
			}},
			{key:'orgdist', label: 'Dist Org', fn: function(value, doc){
				if (doc.lugar && doc.lugar.length > 0)
					return doc.lugar[0].distOrg;
				else
					return '';
			}},
			{key:'destino', label: 'Destino', fn: function(value, doc){
				if (doc.lugar && doc.lugar.length > 0)
					return doc.lugar[0].dest;
				else
					return '';
			}},
			{key:'dstdist', label: 'Dist Dest', fn: function(value, doc){
				if (doc.lugar && doc.lugar.length > 0)
					return doc.lugar[0].distDest;
			}},
			{key:'monto', label: 'Importe'},
			{key:'moneda', label: 'Moneda'},
			{key:'estado', label: 'Estado'}
		]};
	},

	usuarioActual: function() {
		let user = Usuarios.findOne({username: Session.get('username')});
		if (user)
			return user.name;
		else
			return '';
	},

	fechaActual: function(){
		//return moment(Session.get('xfecha')).utc().format("DD/MM/YYYY");
		return moment(Session.get('xfecha').fecha2).utc().format("DD/MM/YYYY");
	},
	fechaAntes: function(){
		//return moment(Session.get('xfecha')).add(-7, 'days').utc().format("DD/MM/YYYY");
		return moment(Session.get('xfecha').fecha1).utc().format("DD/MM/YYYY");
	},

	reporte: function(){
		//return Template.instance().reporte.get();

		let xfecha = Session.get('xfecha');

		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

		return Solicitudes.find({'nombre.codigo': Session.get('username'), fecha: {$gte: start, $lt: end}});
	}

});

Template.Planilla.events({

	'autocompleteselect input': function(event, template, doc) {
    	//console.log("selected ", doc);
    	Session.set('username', doc.username);
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
				//template.subscribe('Solicitudes', xtipo, xfecha);
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
				//template.subscribe('Solicitudes', xtipo, xfecha);
			}
		});
	},

	'click #dataview-consulta': function(e, t) {
		//console.log('xfecha:', Session.get('xfecha'));
		//console.log('username:', Session.get('username'));
		/*	
		Meteor.call('planilla', Session.get('username'), Session.get('xfecha'), function(error, response){
			if (error)
				console.log('error:', error);
			else
			{
				console.log(response);
				t.instance().reporte.set(response);
			}
		});
		*/
		Meteor.subscribe('planilla', Session.get('username'), Session.get('xfecha'))
	},

	'click .reactive-table tbody tr': function (event) {
	    //event.preventDefault();
	    var solicitud = this;
	    // checks if the actual clicked element has the class `delete`
	    //console.log('solicitud:', solicitud);	
	    if (event.target.className == 'user_id'){
	    	Session.set('pag_ant', '/reporte/planilla');
	    	FlowRouter.go('/Solicitud/' + solicitud._id);
	    }
    },

    'click #dataview-export-csv': function(e, t) {
	   e.preventDefault();

		 //var str = convertArrayOfObjects(data, exportFields, fileType);

		let xfecha = Session.get('xfecha');
		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

		let mapa = Solicitudes.find({'nombre.codigo':Session.get('username'), fecha:{$gte:start, $lt:end}}).map(function(obj){
			let reg = {num: obj.num, tipo: obj.tipo, fecha: obj.fecha, nombre: obj.nombre.nombre, area: obj.nombre.area,
				motivo: obj.mot, monto: obj.monto, moneda: obj.moneda};
			if (obj.lugar && obj.lugar.length > 0){
				reg['org'] = obj.lugar[0].org;
				reg['dist_org'] = obj.lugar[0].distOrg;
				reg['dest'] = obj.lugar[0].dest;
				reg['dist_dest'] = obj.lugar[0].distDest;
			}
			else{
				reg['org'] = '';
				reg['dest'] = '';
				reg['dist_org'] = '';
				reg['dist_dest'] = '';
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