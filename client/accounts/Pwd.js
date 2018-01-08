Template.Pwd.onCreated(function(){
	Session.set('error', '');
});

Template.Pwd.events({
	'submit form': function(event, template) {
		event.preventDefault();
		let pwd1 = template.find("input[name=pwd1]");
		let pwd2 = template.find('input[name=pwd2]');

		if (pwd1.value == pwd2.value)
		{
			Meteor.call('setClave', FlowRouter.getParam('user'), pwd1.value, function(error, response){
				if (error){
					Bert.alert( error.reason, 'danger', 'growl-top-left' );
					Session.set('error', error.reason);
				}
				else
					FlowRouter.go('/');
			});
		}
		else
		{
			Bert.alert( "Claves diferentes", 'danger', 'growl-top-left' );
			Session.set('error', 'Claves diferentes');
		}

		/*
		Meteor.call('loginUser', xuser.value, xdesc.value, (error, response) => {

			if (error){
				Session.set('error', error.reason);
			}
			else {
				//Session.set('CurrentUser', 'user');
				Session.setAuth('CurrentUser', response);
				FlowRouter.go('/');
			}
		});
		*/
	}
});