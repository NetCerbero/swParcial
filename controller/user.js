var admin = require("firebase-admin");


var Crear = (nombre,email,password) => {
	admin.auth().createUser({
	  email,
	  emailVerified: false,
	  phoneNumber: "+11234567890",
	  password,
	  displayName: nombre,
	  photoURL: "http://www.example.com/12345678/photo.png",
	  disabled: false
	})
  .then(function(userRecord) {
    console.log("Se a creado un usuario:", userRecord.uid);
  })
  .catch(function(error) {
    console.log("Error al crear el usuario:", error);
  });
}

module.exports ={
	Crear
}
