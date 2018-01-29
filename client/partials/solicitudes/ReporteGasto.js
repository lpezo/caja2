Blob = require('blob-util');

Template.ReporteGasto.onCreated(function(){
	var self = this;
	this.autorun(()=> {
		Session.set('error', '');
		var id = FlowRouter.getParam('id');
		self.subscribe('Solicitud', id);
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
	'click #btnEditarMonto': function(event, template){
		event.preventDefault();
		let xrecibido = template.find('[name=editRecibido]').value;

		if (xrecibido)
		{
			xrecibido = Meteor.Util.strFormat(xrecibo);
			Solicitudes.update({_id: this._id}, {$set: {recibido: xrecibido, estado: 'E'}});

			var id = document.getElementById("content");
			Blaze.renderWithData(Template.ReporteGasto, this, id)
			
			/*
			Blaze.saveAsPDF(Template.ReporteGasto, {
				filename: 'ReporteGasto.pdf',
				data: this,
				orientation: 'landscape',
				format: 'a4'
			});
			*/
		}
		else
			alert('Ingrese valor entregado');
	},
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

		Meteor.call('ReporteGasto', 1, function(error, response){
			//window.open("data:application/pdf;base64, " + response);
			var iframe = template.find("[name=framepdf]");
			//console.log(response);
			//console.log("data:application/pdf;base64, " + response);
			Blob.arrayBufferToBlob(response, 'application/pdf').then(function(blob){
				var blobURL = Blob.createObjectURL(blob);
				console.log(blobURL);
				if (iframe)
					iframe.src = blobURL;
			});
		});
	}

});

