Template.ImportaUsuario.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.ImportaUsuario.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});

Template.ImportaUsuario.events({
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Meteor.call( 'parseUploadUsuario', results.data, ( error, response ) => {
          if ( error ) {
            console.log( 'error:', error.reason);
            Bert.alert( error.reason, 'danger', 'growl-top-left' );
            template.uploading.set( false );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Importacion completa!', 'success', 'growl-top-right' );
            console.log('response:', response);
          }
        });
      }
    });
  }
});