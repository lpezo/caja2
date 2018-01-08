Mensajes = new Mongo.Collection('mensaje');

Mensajes.allow({
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

MensajeSchema = new SimpleSchema({
	username: {
		type: String,
		label: 'username',
		index: true
	},
	idsol: {
		type: String
	},
	fromName: {
		type: String
	},
	fecha: {
		type: Date
	},
	estado: {
		type: String,
		optional: true
	}
});

Mensajes.attachSchema(MensajeSchema);