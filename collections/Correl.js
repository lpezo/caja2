Correl = new Mongo.Collection('correl');

CorrelSchema = new SimpleSchema({
	tipo: {
		type: String
	},
	year: {
		type: String
	},
	tipoUsu: {
		type: String
	},
	num: {
		type: Number
	}
});

//CorrelSchema._ensureIndex({tipo:1, year:1});

Correl.attachSchema(CorrelSchema);