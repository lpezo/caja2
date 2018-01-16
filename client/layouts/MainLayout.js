Template.MainLayout.onCreated(function(){
	var self = this;
	this.autorun(() => {
		let user = Session.get('CurrentUser');
		if (user)
			self.subscribe('Mensajes', user.username, user.role);
	});
});

Template.MainLayout.helpers({
	mensajes: function(){
		let user = Session.get('CurrentUser');
		if (user){
			//if (user.role == 'gerente')
			//	return Solicitudes.find({userMsg: user.role}, {sort:{fecha:-1}});
			//else
				return Solicitudes.find({userMsg: user.username}, {sort:{fecha:-1}});
		}
	},
	xfecha: function(){
		return moment(this.fecha).utc().format('DD/MM/YYYY');
	},
	xicon: function(){
		if (this.tipo == 'movil')
			return 'fa-car';
		else if (this.tipo == 'gasto')
			return 'fa-money';
		else if (this.tipo == 'viaje')
			return 'fa-plane';
		else
			return 'fa-code';
	},
	currentUser: function(){
		return Session.get('CurrentUser');
	},
	xiconestado: function(){
		if (this.estado == 'A')
			return 'fa-thumbs-o-up';
		else if (this.estado == 'R')
			return 'fa-thumbs-o-down';
	}

});

Template.MainLayout.events({
	'click .fa-power-off': function() {

		//console.log('click .fa-power-off');
		//AccountsTemplates.logout();
		Session.clear('CurrentUser');
		FlowRouter.go('/');
	}
});
