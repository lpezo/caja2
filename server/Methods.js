import { Base64 } from 'meteor/ostrio:base64';
//const nativeB64 = new base64({ useNative: true });

Meteor.methods({
	/*
	toggleAdmin(id) {
		if (Roles.userIsInRole(id, 'admin')) {
			Roles.removeUsersFromRoles(id, 'admin');
		} else {
			Roles.addUsersToRoles(id, 'admin');
		}
	},
	*/
	sendEmail(to, from, subject, text) {
		// Make sure that all arguments are strings.
		check([to, from, subject, text], [String]);
		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		this.unblock();
		Email.send({ to, from, subject, text });
	},
	parseUpload( data ) {
		check( data, Array );

		for ( let i = 0; i < data.length; i++ ) {
			/*
		  let item   = data[ i ],
		      exists = Clientes.findOne( { saleId: item.saleId } );

		  if ( !exists ) {
		    Clientes.insert( item );
		  } else {
		    console.warn( 'Rejected. This item already exists.' );
		  }
		  */
		  let item = data[ i ];
		  console.log('item:', item);

		  if (!item.nombre){
		  	//return "No existe campo nombre";
		  	if (item.nombre == '')
		  		return;
		  	throw new Meteor.Error(404, "No existe campo nombre");
		  }
		  if (!item.descripcion)
		  	throw new Meteor.Error(404, "No existe campo descripcion");

		  if (!item.accion)
		  	item.accion = '1';

		  let exists = Clientes.findOne({nombre: item.nombre});
		  if (item.accion == '1' || item.accion == 'i'){
			if (!exists)
				Clientes.insert({nombre: item.nombre, descripcion: item.descripcion});
		  }
		  else if (item.accion == '0' || item.accion == 'x'){
		  	if (exists)
		  		Clientes.remove({nombre: item.nombre});
		  }
		}
		return "";
	},

	parseUploadUsuario( data ) {
		check( data, Array );

		ultArea = " ";
		for ( let i = 0; i < data.length; i++ ) {
		  let item = data[ i ];

		  if (!item.username){
		  	//return "No existe campo nombre";
		  	if (item.username == '')
		  		return;
		  	throw new Meteor.Error(404, "No existe campo username");
		  }
		  if (!item.name)
		  	throw new Meteor.Error(404, "No existe campo name");

		  if (!item.accion)
		  	throw new Meteor.Error(404, "No existe campo accion");

		  //if (!item.accion)
		  //	item.accion = '1';


		  let accion = item.accion;
		  delete item.accion;

		  let exists = Usuarios.findOne({username: item.username});
		  if (accion == '1' || accion == 'u'){
			  console.log('item:', item);

		  	//Areas
		  	if (ultArea != item.area){
			  	let area = Areas.findOne({name:item.area});
			  	if (!area)
			  		Areas.insert({name:item.area, desc:item.area});
			  	ultArea = item.area;
		  	}

		  	/*
		  	let user = Meteor.users.findOne({username:item.username});
		  	if (!user)
		  		Accounts.createUser(item.email, item.clave, item.username);
		  	else
		  		Accounts.setPassword(user._id, item.clave, false);
			*/
			
			if (!exists)
			{
				if (!item.clave)
					item.clave = item.username;
				Usuarios.insert(item);
			}
			else {
				let username = item.username;
				delete item.username;
				if (!item.clave)
					delete item.clave;
				Usuarios.update({username:username}, {$set:item});
			}

		  }
		  else if (accion == '0' || accion == 'x'){
			  console.log('item:', item);
		  	if (exists){
		  		if (Meteor.user().username != item.username){
		  			Usuarios.remove({username: item.username});
		  			Meteor.users.remove({username: item.username});
		  		}
		  	}
		  }
		}
		return "";
	},


	getNum: function(xtipo, xyear, xtipoUsu){
		check( xtipo, String);
		check( xyear, String);
		check( xtipoUsu, String);

		var reg = Correl.findOne({tipo:xtipo, year:xyear, tipoUsu: xtipoUsu});
		//console.log('correl:', xtipo, xyear, reg);
		if (reg){
			let xnum = reg.num + 1;
			Correl.update(reg._id, {$set: {num: xnum}});
			return xnum;
		}
		else {
			Correl.insert({tipo: xtipo, year: xyear, tipoUsu: xtipoUsu, num: 1});
			return 1;
		}
	},

	loginUser: function(xuser, xpass){
		check( xuser, String );
		check( xpass, String );
		var reg = Usuarios.findOne({username: xuser});
		
		if (!reg){
			if (xuser == 'admin' && xpass == 'abc')
				return {username:'admin', name:'admin', role:'admin', 'email': 'lpezo777@gmail.com'};
			throw new Meteor.Error(404, "No existe el usuario");
		}

		if (reg.clave != xpass)
			throw new Meteor.Error(404, "No es la clave");

		delete reg.clave;

		return reg;
	},

	setClave: function(user, pwd)
	{
		check(user, String);
		check(pwd, String);

		Usuarios.update({username: user}, {$set: {clave: pwd}});
	},

	updateResponsable: function(doc, id){
		//codigoUsu, codigoResp){
		/*
     	var sol = Solicitudes.findOne(id);
     	if (sol){
     		let msg = {username: }
     	}
		*/

		var opcion = Opcion.findOne();
		//Solicitudes.findOne(doc._id, function(error, sol){
			doc['_id'] = id;
			console.log(doc);
			var body = Spacebars.toHTML(doc, opcion.email.html);
			//body = opcion.email.html;
			//var body = new Handlebars.SafeString(opcion.email.html, doc);
			console.log(body);

			//if (process.env.MAIL_URL){
				//this.unblock();
				/*
				if (doc.resp.codigo !== 'gerente')
				{
					//find email resp
					let usuario = Usuarios.findOne({username: doc.resp.codigo});
					console.log('send usuario:', usuario);
					//Email.send(usuario.email, opcion.email.from, opcion.email.subject, body);
					Meteor.defer(function(){
						Email.send({
						  to: usuario.email,
						  from: opcion.email.from,
						  subject: opcion.email.subject,
						  html: body
						});
					});
				}
				else {
					let usuario = Usuarios.findOne({role: 'gerente'});
					console.log('send usuario:', usuario);
					//Email.send(usuario.email, opcion.email.from, opcion.email.subject, body);
					Email.send({
					  to: usuario.email,
					  from: opcion.email.from,
					  subject: opcion.email.subject,
					  html: body
					});
				}
				*/


				//Enviar correo a tesorero al jefe y socio


			//}

		//});

        let curnombre = Usuarios.findOne({username: doc.nombre.codigo});
        if (curnombre){
            //console.log('curnombre:', curnombre);
            //si tiene no tiene codigo de resp or
            //es diferente, grabar

            let xto = "";
            let curTesorero = Usuarios.findOne({role:'tesorero'});
            if (curTesorero)
            	xto += curTesorero.email;
            //if (curnombre.jefe)
            if (doc.resp.codigo)
            {
            	//let usuJefe = Usuarios.findOne({username: curnombre.jefe});
            	let usuResp = Usuarios.findOne({username: doc.resp.codigo});
            	if (usuResp)
            		xto += ";" + usuResp.email;
            }
            if (curnombre.socio && doc.userMsg == 'socio')	//Si es monto mayores, usrMsg tiene la palabra socio
            {
            	let usuSocio = Usuarios.findOne({username: curnombre.socio});
            	if (usuSocio)
            		xto += ";" + usuSocio.email;
            }
            /*
            if (!curnombre.hasOwnProperty('resp') || curnombre.resp !== doc.resp.codigo){
                //console.log('update:', codigoUsu, codigoResp);
                Usuarios.update({username: doc.nombre.codigo}, {$set: {resp: doc.resp.codigo}}, function(error, cant){
                    return true;
                });
            }
            */
            console.log('email to: ', xto);
            console.log('Aviso!: ', 'Correo Desactivado');
            /*
			Meteor.defer(function(){
				Email.send({
				  to: xto,
				  from: opcion.email.from,
				  subject: opcion.email.subject,
				  html: body
				});
			});
			*/
        }
        return false;
     },


     aceptarRechazar: function(id, estado){
     	Solicitudes.update(id, {$set:{estado: estado}, function(error, response){
	     	return 'OK';
     	}});
     },

     planilla: function(username, xfecha)
     {

		const start = moment.utc(xfecha.fecha1).startOf('day').toDate();
		const end = moment.utc(xfecha.fecha2).endOf('day').toDate();

     	console.log(username, start, end);

     	return Solicitudes.find({'nombre.codigo': username});
     	//, 'fecha':{$gte: start, $lt: end}});
     },

     ReporteGasto: function(id){
     	var doc = new PDFDocument({size: 'A4', margin: 50});
		doc.fontSize(12);
		doc.text('PDFKit is simple', 10, 30, {align: 'center', width: 200});

		return Base64.encode(doc.outputSync());
		doc.writeSync(process.env.PWD + '/public/pdf/unpdf.pdf');
		//return doc.outputSync();
		
	  }



});