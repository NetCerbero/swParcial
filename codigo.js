 function obserbarCambios(){
      // Select the node that will be observed for mutations
      var targetNode = document.getElementById('contenedor-diagramador');

      // Options for the observer (which mutations to observe)
      var config = { attributes: true, childList: true, subtree: true };

      // Callback function to execute when mutations are observed
      var callback = function(mutationsList, observer) {
          for(var mutation of mutationsList) {
              var data = JSON.stringify(app.schema.serialize());
              data = JSON.parse(data);
              var id = getQueryVariable('id');
              data.db = "Nombre bd";
              if (mutation.type == 'childList' && !swChange) {
                //mandar a firebase
                  console.log('A child node has been added or removed.');
                  
                  if( id ){
                    firebase.database().ref().child('salas').child(id).update({
                      tablas: data
                    });
                  }
                  //swChange = true;
                  console.log(mutation);
              }
              // else if (mutation.type == 'attributes') {
              //   //mandar a firebase cuando el nombre del atributo es id
              //   if(mutation.attributeName == 'style' && swChange){
              //     if( id && data.tables.length){
              //       firebase.database().ref().child('salas').child(id).update({
              //         tablas: data
              //       });
              //     }
              //   }
              //   console.log('The ' + mutation.attributeName + ' attribute was modified.');
              // }
          }
      };

      // Create an observer instance linked to the callback function
      var observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

    }

    function enviarDatos(){
      if(swChange){
        setTimeout(()=>console.log("enviando datos"), 1000);
        swChange = false;
      }
      var data = JSON.stringify(app.schema.serialize().tables);
      data = JSON.parse(data);
      var id = getQueryVariable('id');
      data.db = "Nombre bd";
      console.log("subiendo datos a firebase");
      firebase.database().ref().child('salas').child(id).child('tablas').update({tables:data});
    }

    function mergeDatos(local, remoto){
        swChange = true;
        var data = Object.assign([],local,remoto)
        console.log("segundo aqui");
        app.schema.resetSchema();
        app.schema.addTables(JSON.stringify(data));
    }

    function hayCambio(){
      var id = getQueryVariable('id');
      firebase.database().ref().child('salas').child(id).child('tablas').once('value')
          .then(snap =>{
            let row = snap.val();
            if( row.tables){
                var dataNew = row.tables;
                //aqui hacemos los cambios necesarios
                var dataOld = JSON.stringify(app.schema.serialize());
                dataOld = JSON.parse(dataOld).tables;
                //var dataOld = app.schema.serialize().tables;
                for( e in dataOld){
                    if(!dataOld[e].fields.length){
                        delete dataOld[e].fields
                    }else{
                      for(i in dataOld[e].fields){
                        if(!dataOld[e].fields[i].order){
                          delete dataOld[e].fields[i].order;
                        }
                      }
                    }
                    if(!dataOld[e].color){
                        delete dataOld[e].color
                    } 
                }
                if(!equals(dataOld, dataNew) && Array.isArray(dataNew)){
                    return true;
                }
            }else{
              console.log("No hay el atributo tables");
            }
          })
        .catch( e => console.log(e));
      return false;
    }

    function doSomething() {
        firebase.auth().onAuthStateChanged((usr) =>{
          if(!usr){
            location.href = "./login";
          }
        });

        var id = getQueryVariable('id');
        if( id ){
          console.log("Revisando la bd firebase");
          firebase.database().ref().child('salas').child(id).child('tablas').on('value',snap =>{
            let row = snap.val();
            if( row.tables){
                var dataNew = row.tables;
                //aqui hacemos los cambios necesarios
                var dataOld = JSON.stringify(app.schema.serialize());
                dataOld = JSON.parse(dataOld).tables;
                //var dataOld = app.schema.serialize().tables;
                for( e in dataOld){
                    if(!dataOld[e].fields.length){
                        delete dataOld[e].fields
                    }else{
                      for(i in dataOld[e].fields){
                        if(!dataOld[e].fields[i].order){
                          delete dataOld[e].fields[i].order;
                        }
                      }
                    }
                    if(!dataOld[e].color){
                        delete dataOld[e].color
                    } 
                }
                
                console.log(dataOld);
                console.log(dataNew);
                console.log("Trayendo cambios");
                if(!equals(dataOld, dataNew) && Array.isArray(dataNew)){
                    mergeDatos(dataOld, dataNew);
                    console.log("haciendo cambios");
                }else{
                  console.log("esta actualizado");
                }
            }else{
              console.log("No hay el atributo tables");
            }
          })
        }
        //obserbarCambios();

    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", doSomething);
    } else {  // `DOMContentLoaded` already fired
        doSomething();
    }