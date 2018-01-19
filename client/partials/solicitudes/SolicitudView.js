Template.SolicitudView.onCreated(function(){
	var self = this;
	//self.SolicitudActual = new ReactiveVar();
	this.autorun(() => {
		var id = FlowRouter.getParam('id');
		self.subscribe('Tipos');
		self.subscribe('Solicitud', id);

		//let sol = Solicitudes.findOne(FlowRouter.getParam('id'));
		//this.SolicitudActual.set(sol);
	});

});

Template.SolicitudView.helpers({
	byDefault: function(){
		return Solicitudes.findOne(FlowRouter.getParam('id'));
		//return Template.instance().SolicitudActual.get();
	},
	autorizador: function(){
		//let instance = Template.instance();
		let userActual = Session.get('CurrentUser');
		//let solicitud = instance.SolicitudActual.get();
		let solicitud = Solicitudes.findOne(FlowRouter.getParam('id'));
		//let opcion = instance.Opcion.get();
		if (solicitud && userActual){
			//console.log('solicitud:', solicitud);
			//console.log('opcion:', opcion);
			//if (userActual.role == 'gerente')
			//	return true;
			//return (userActual.username == solicitud.userMsg);

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
	estadoObj: function(){
		//let sol = Template.instance().SolicitudActual.get();
		let sol = Solicitudes.findOne(FlowRouter.getParam('id'));
		if (sol){
			let desc = sol.estado == 'A' ? '(aceptado)' : (sol.estado == 'R' ? '(rechazado)' : '')
			return {estado: sol.estado, desc: desc};
		}
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

//jfernandez@sccourierperu.com

Template.SolicitudView.events({
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
			Solicitudes.update({_id: this._id}, {$set: {gastado: xgastado, estado: 'C'}});
		}
		else
			alert('Ingrese valor gastado');
	}
});


