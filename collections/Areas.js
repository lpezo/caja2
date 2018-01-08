Areas = new Mongo.Collection('areas');


Areas.allow({
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

AreaSchema = new SimpleSchema({
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

Areas.attachSchema(AreaSchema);