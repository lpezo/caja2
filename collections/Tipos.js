Tipos = new Mongo.Collection('tipos');

Tipos.allow({
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

TipoSchema = new SimpleSchema({
	name: {
		type: String,
		label: 'Name',
		unique: true
	},
	desc: {
		type: String,
		label: 'Descripción'
	}
});

Tipos.attachSchema(TipoSchema);
