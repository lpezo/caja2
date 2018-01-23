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
		}
		return data;
	}
});

