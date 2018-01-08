Template.Usuarios.onCreated(function(){
	var self = this;
	this.autorun(() => {
		self.subscribe('Usuarios');
	});
});

Template.Usuarios.helpers({
	usuarios: function(){
		return Usuarios.find();
	},
	settings: function() {
	return {
		rowsPerPage: 20,
		showFilter: true,
		fields: [
			{key: 'username', label: 'User', cellClass: 'user_id'},
			{key:'name', label: 'Nombre'},
			{key:'email', label: 'Email'},
			{key:'dni', label: 'Dni'},
			{key:'area', label: 'Area'},
		]};
	}

});

Template.Usuarios.events({
	'click .reactive-table tbody tr': function (event) {
	    //event.preventDefault();
	    var user = this;
	    // checks if the actual clicked element has the class `delete`
	    if (event.target.className == 'user_id'){
	    	Session.set('pag_ant', '/tabla/usuarios');
	    	FlowRouter.go('/tabla/usuario/' + user.username);
	    }
    }
});