Clientes = new Mongo.Collection('clientes');

Clientes.allow({
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

ClienteSchema = new SimpleSchema({
	nombre: {
		type: String,
		label: 'Nombre Corto',
		unique: true
	},
	descripcion: {
		type: String,
		label: 'Descripción'
	},
	responsable: {
		type: String,
		label: 'Responsable',
		optional: true
	},
	contacto: {
		type: [String],
		label: 'Contacto',
		optional: true
	},
	categoria: {
		type: String,
		label: 'Categoria',
		optional: true
	}
});

Clientes.attachSchema(ClienteSchema);