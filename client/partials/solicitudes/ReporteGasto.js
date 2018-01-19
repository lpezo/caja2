Template.ReporteGasto.onCreated(function(){
	Session.set('error', '');
	this.data.fechaDate = moment(this.data.fecha).utc().format('DD/MM/YYYY');
	this.data.origen = this.data.lugar && this.data.lugar.length ? this.data.lugar[0].org : '';
	this.data.destino = this.data.lugar && this.data.lugar.length ? this.data.lugar[0].dest : '';
	this.data.hora = moment(this.data.fecha).utc().format('HH:mm');
});

