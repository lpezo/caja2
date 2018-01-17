Solicitudes = new Mongo.Collection('solicitudes');

Solicitudes.allow({
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

var autocomplete = {
        type: 'autocomplete-input',
        placeholder: 'Ingrese nombre',
        settings: function() {
          return {
            position: 'top',
            limit: 8,  // more than 20, to emphasize matches outside strings *starting* with the filter
            rules: [
              {
                token: '',
                // string means a server-side collection; otherwise, assume a client-side collection
                //collection: Meteor.users,
                collection: Usuarios,
                field: 'name',
                options: 'i', // Use case-sensitive match to take advantage of server index.
                matchAll: true,
                template: Template.userPill
              }
            ]
          }
        }
      };

NombreSchema = new SimpleSchema({
  nombre: {
    type: String,
    label: 'Nombre',
    optional: true,
    autoform: {
      afFieldInput: autocomplete
    }
  },
  codigo: {
    type: String,
    label: 'Código:',
    optional: true,
    index: true,
    autoform: {
      type: 'hidden'
    }    
  },
  dni: {
    type: String,
    label: 'Dni',
    optional: true,
    autoform: {
      type: 'hidden'
    }
  },
  area: {
    type: String,
    label: 'Area',
    optional: true,
    autoform: {
      type: 'hidden'
    }
  }
});


FechasSchema = new SimpleSchema({
  fecha1: {
    type: Date,
    label: 'Fecha1',
    optional: true,
    autoform: {
      type: 'bootstrap-datepicker',
      datePickerOptions:
      {
        format: 'dd/mm/yyyy',
        language: 'en-ES'
      }
    }
  },
  fecha2: {
    type: Date,
    label: 'Fecha2',
    optional: true,
    autoform: {
      type: 'bootstrap-datepicker',
      datePickerOptions:
      {
        format: 'dd/mm/yyyy',
        language: 'en-ES'
      }
    }  
  }
});

lugarschema = new SimpleSchema({
  org: {
    type: String,
    label: 'Origen',
    optional: true,
    autoValue: function(){
      if (this.isSet && typeof this.value === "string") {
        return this.value.toUpperCase();
      }      
    }
  },

  distOrg: {
    type: String,
    label: 'Distrito',
    optional: true
  },

  dest: {
    type: String,
    label: 'Destino',
    optional: true,
      autoValue: function(){
      if (this.isSet && typeof this.value === "string") {
        return this.value.toUpperCase();
      }
    }
  },

  distDest: {
    type: String,
    label: 'Distrito',
    optional: true
  }

});

SolicitudSchema = new SimpleSchema({
  num: {
    type: Number,
    optional: true
  },
  tipo : {
    type : String,
    label : "Tipo",
    autoform : {
      options: function(){
        var tipos = Tipos.find().fetch();
        //console.log('tipos:', tipos);
        return _.map(tipos, function(tipo){
          return {
            label: tipo.desc,
            value: tipo.name
          };
        });
      }
    }
  },

  fecha: {
    type: Date,
    label: 'Fecha',
    autoform: {
      type: 'bootstrap-datepicker',
      datePickerOptions:
      {
        format: 'dd/mm/yyyy',
        language: 'en-ES',
        todayBtn: true
      }
    }
  },

  resp: {
    type: NombreSchema,
    label: 'Responsable'
  },

  /*
  monto: {
    type: MontoSchema,
    label: 'Monto'
  },
  */

  monto: {
    type: String,
    label: 'Valor'
  },

  gastado: {
    type: String,
    label: 'Gastado'
  },


  moneda: {
    type: String,
    label: 'Moneda',
    autoform: {
      options: [{value:'PEN', label:'PEN'}, {value:'USD', label:'USD'}]
    }
  },

  lugar: {
    type: [lugarschema],
    optional: true,
    blackbox: true
  },

  fviaje: {
    type: FechasSchema,
    label: 'Fec. Viaje',
    optional: true
    /*,
    autoform: {
      afFormGroup: {
        class: 'col-lg-4'
      }
    }
    */
  },

  mot: {
    type: String,
    label: 'Motivo',
    optional: true,
      autoValue: function(){
      if (this.isSet && typeof this.value === "string") {
        return this.value.toUpperCase();
      }
    },
    autoform: {
      rows: 5
    }
  },

  cli: {
    type: String,
    label: 'Cliente',
    autoform: {
      afFieldInput: {
        type: 'autocomplete-input',
        placeholder: 'Ingrese nombre',
        settings: function() {
          return {
            position: 'top',
            limit: 8,  // more than 20, to emphasize matches outside strings *starting* with the filter
            rules: [
              {
                token: '',
                // string means a server-side collection; otherwise, assume a client-side collection
                collection: Clientes,
                field: 'descripcion',
                options: 'i', // Use case-sensitive match to take advantage of server index.
                matchAll: true,
                template: Template.clientePill
              }
            ]
          }
        }
      }
    }
  },

  cont: {
    type: String,
    label: 'Contacto',
    optional: true
  },

  proy: {
    type: String,
    label: 'Proceso',
    optional: true,
      autoValue: function(){
      if (this.isSet && typeof this.value === "string") {
        return this.value.toUpperCase();
      }
    }
  },

  nombre: {
    type: NombreSchema,
    label: 'Solicitante'
  },

  costo: {
    type: String,
    label: 'Tratamiento de gasto',
    autoform: {
      options: function(){
        return [
        {label: '01 Cobro Directo', value: 'C'},
        {label: '02 Refacturar', value: 'R'},
        {label: '03 Por horas', value: 'H'},
        {label: '04 Costo de área', value: 'A'}
        ];
      }
    }
  },


  glosa: {
    type: String,
    label: 'Glosa',
    autoform: {
      rows: 8
    },
    optional: true
  },

  createdAt: {
    type: Date,
    autoValue: function(){
      return new Date();
    },
    optional: true
  },

  author: {
    type: String,
    optional: true
  },

  estado: {
    type: String,
    label: 'Estado',
    optional: true
  },

  userMsg: {
    type: String,
    label: 'Usuarios para Mensaje',
    optional: true
  },

  areapra: {
    type: String,
    label: 'Área de práctica',
    optional: true
  },

  codsocio: {
    type: String,
    optional: true
  },

});

Solicitudes.attachSchema(SolicitudSchema);

if (Meteor.isServer){
  Solicitudes._ensureIndex( {userMsg: 1, fecha: -1} );
  Solicitudes._ensureIndex( {fecha: 1} );
}