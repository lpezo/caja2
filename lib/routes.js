/*
if(Meteor.isClient){
	Accounts.onLogin(function(){
		FlowRouter.go('solicitud');
	});

	Accounts.onLogout(function(){
		FlowRouter.go('home');
	});
}

*/

FlowRouter.triggers.enter([function(context, redirect){
	//if(!Meteor.userId()) {
	if (!Session.get('CurrentUser')) {
		FlowRouter.go('Login');
		//FlowRouter.go('/solicitud');
	} else {
		if (context.path == '/')
			FlowRouter.go('/dashboard');
		else
			FlowRouter.go(context.path);
	}
}]);




FlowRouter.route('/', {
	name: 'home',
	action() {
		BlazeLayout.render('HomeLayout');
		//FlowRouter.go('/solicitud');
	}
});

FlowRouter.route('/Login', {
	name: 'Login',
	action() {
		BlazeLayout.render('HomeLayout', {main: 'Login'});
	}
});

FlowRouter.route('/dashboard', {
	name: 'dashboard',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Dashboard'});
	}
});

FlowRouter.route('/reporte/planilla', {
	name: 'planilla',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Planilla'});
	}
});


FlowRouter.route('/solicitud/aceptar/:id', {
	name: 'solicitudAceptar',
	action() {
		BlazeLayout.render('MainLayout', {main: 'ReporteGasto'});
	}
});


FlowRouter.route('/solicitud', {
	name: 'solicitud',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Solicitud'});
	}
});


FlowRouter.route('/solicitud/:id', {
	name: 'solicitudview',
	action() {
		BlazeLayout.render('MainLayout', {main: 'SolicitudView'});
	}
});


FlowRouter.route('/importar/clientes', {
	name: 'impcliente',
	action() {
		BlazeLayout.render('MainLayout', {main: 'ImportaCliente'});
	}
});

FlowRouter.route('/importar/usuarios', {
	name: 'impusuario',
	action() {
		BlazeLayout.render('MainLayout', {main: 'ImportaUsuario'});
	}
});

FlowRouter.route('/tabla/usuarios', {
	name: 'tabusuarios',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Usuarios'});
	}
});

FlowRouter.route('/tabla/usuario/:user', {
	name: 'updusuario',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Usuario'});
	}
});

FlowRouter.route('/tabla/pwd/:user', {
	name: 'pwd_usuario',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Pwd'});
	}
});

FlowRouter.route('/opciones', {
	name: 'opciones',
	action() {
		BlazeLayout.render('MainLayout', {main: 'Opcion'});
	}
});



