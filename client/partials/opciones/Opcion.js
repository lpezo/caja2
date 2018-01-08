Template.Opcion.onCreated(function(){
	var self = this;
	this.autorun(() => {
        self.subscribe('GetOpcion');
        Session.set('error', '');
	});
});

Template.Opcion.helpers({
	docOpcion: function() {
        return Opcion.findOne(); 
	}
});

AutoForm.hooks({
    updateOpcionForm: {
        onSuccess: function(formType, result){
            Bert.alert( 'Grabado!', 'success', 'growl-top-left' );
        }
    }
});