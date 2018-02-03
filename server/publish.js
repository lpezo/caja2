Meteor.publish('autocompletUsers',function(){
	//return Meteor.users.find({}, {fields:{'profile.name':1, 'username':1}});
	//return Usuarios.find({}, {fields:{username:1, name:1, dni:1 }});
	return Usuarios.find({},{fields:{clave:0}});
});

Meteor.publish('Tipos', function(){
	return Tipos.find();
});

Meteor.publish('Solicitudes', function(xtipo, xfecha, xuser){
	if (xfecha){

		//console.log('xfecha:', xfecha);
		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

		//console.log(xtipo, start, end);
		if (xuser.role == 'gerente' || xuser.role == 'tesorero' || xuser.role == 'admin' || xuser.role == 'auditor')
			return Solicitudes.find({tipo:xtipo, 'fecha':{$gte: start, $lt: end}}, {fields:{img:0}});
		else 
			return Solicitudes.find({tipo:xtipo, 'fecha':{$gte: start, $lt: end}, $or: [ {'nombre.codigo': xuser.username}, {'resp.codigo': xuser.username}, {'codsocio': xuser.username} ] }, {fields:{img:0}});
		
			
	}
	else
		return [];
});

Meteor.publish('Mensajes', function(userId, role){
	let xuser = userId;
	if (role == 'gerente')
		xuser = role;
	return Solicitudes.find({userMsg: xuser}, 
		{limit: 10, fields:{nombre:1, fecha:1, tipo:1, userMsg:1, monto:1, moneda:1, estado:1}, sort:{fecha:-1}});
});

Meteor.publish('Clientes', function(){
	return Clientes.find();
});

Meteor.publish('Solicitud', function(id){
	return Solicitudes.find(id);
});

Meteor.publish('Usuarios', function(){
	return Usuarios.find();
});

Meteor.publish('Usuario', function(user){
	return Usuarios.find({'username':user});
});

Meteor.publish('Areas', function(){
	return Areas.find();
});

Meteor.publish('GetOpcion', function(){
	var opc = Opcion.findOne();
	if (!opc)
	{
		Opcion.insert({default:{cliente:'.'}, aGerente:{mayorSoles:0, mayorDol:0}});
		return Opcion.find();	
	}
	else
		return Opcion.find();
});

Meteor.publish('planilla', function(username, xfecha){
	const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
	const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

	return Solicitudes.find({'nombre.codigo': username, fecha: {$gte: start, $lt: end}});
});