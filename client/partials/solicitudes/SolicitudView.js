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

	estadoObj: function(){
		//let sol = Template.instance().SolicitudActual.get();
		let sol = Solicitudes.findOne(FlowRouter.getParam('id'));
		if (sol){
			let desc = sol.estado == 'A' ? '(aceptado)' : (sol.estado == 'R' ? '(rechazado)' : '')
			return {estado: sol.estado, desc: desc};
		}
	}
});

//jfernandez@sccourierperu.com


