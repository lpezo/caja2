Template.Usuario.onCreated(function(){
	var self = this;
	this.autorun(() => {
		var user = FlowRouter.getParam('user');
		self.subscribe('Areas');
        self.subscribe('Usuario', user);
        Session.set('error', '');
	});
});

Template.Usuario.helpers({
	byDefault: function() {
        return Usuarios.findOne({username:FlowRouter.getParam('user')});
	}
});

AutoForm.hooks({
    updateUsuarioForm: {
        onError: function(formType, error){
            if (error){
                console.log('error:', error.message);
                Session.set('error', error.message);
            }
        },
        onSuccess: function(formType, result){
            FlowRouter.go('/tabla/usuarios');
        }
    }
});

