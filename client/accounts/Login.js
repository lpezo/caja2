Template.Login.onCreated(function(){
	Session.set('error', '');
});

Template.Login.events({
	'submit form': function(event, template) {
		event.preventDefault();
		xuser = template.find("input[name=user]");
		xdesc = template.find('input[name=pwd]');
		if (xuser.value.length == 0){
			Session.set('error', 'Usuario está vacío');
		} else if (xdesc.value.length == 0){
			Session.set('error', 'Password está vacío');
		}

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
	}
});