Usuarios = new Mongo.Collection('usuarios');

Usuarios.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});

UsuarioSchema = new SimpleSchema({
	username: {
		type: String,
		label: 'Código',
		unique: true
	},
	name: {
		type: String,
		label: 'Nombre'
	},
	email: {
		type: String,
		label: 'Email'
	},
	dni: {
		type: String,
		label: 'Dni'
	},
	area: {
		type: String,
		label: 'Area',
	    autoform : {
	      options: function(){
	        var lista = Areas.find().fetch();
	        //console.log('tipos:', tipos);
	        return _.map(lista, function(item){
	          return {
	            label: item.name,
	            value: item.desc
	          };
	        });
	      }
	    }
	},
	clave: {
		type: String,
		label: 'Clave'
	},
	tipo: {
		type: String,
		label: 'Tipo',
		autoform: {
			options: [{value:'S', label: 'Por Sunat'}, {value:'R', label:'Por Recibo'}]
		}
	},
	role: {
		type: String,
		label: 'Role',
		optional: true
	},
	resp: {
		type: String,
		label: 'Código Responsable',
		optional: true
	},
	jefe: {
		type: String,
		label: 'Jefe'
	},
	socio: {
		type: String,
		label: 'Socio'
	}
});

Usuarios.attachSchema(UsuarioSchema);