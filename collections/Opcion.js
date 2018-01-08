Opcion = new Mongo.Collection('opcion');

Opcion.allow({
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

DefaultSchema = new SimpleSchema({
	cliente: {
		type: String,
		label: 'Cliente',
		optional: true
	}
});

AGerenteSchema = new SimpleSchema({
	mayorSoles: {
		type: Number,
		label: 'Soles'
	},
	mayorDol: {
		type: Number,
		label: 'Dolares'
	}
});

EmailSchema = new SimpleSchema({
	from: {
		type: String,
		label: 'From',
		optional: true
	},
	subject: {
		type: String,
		label: 'Subject',
		optional: true
	},
	html: {
		type: String,
		label: "Body",
		optional: true,
		autoform: {
			type: 'summernote',
			class: 'editor'
		}
	}
});

OpcionSchema = new SimpleSchema({
	default: {
		type: DefaultSchema,
		label: 'Por Default'
	},
	aGerente: {
		//Si mayor a este monto enviar al Gerente
		type: AGerenteSchema,
		label: 'A Gerente si es mayor a:'
	},
	email: {
		type: EmailSchema,
		label: "Email"
	}
});

Opcion.attachSchema(OpcionSchema);