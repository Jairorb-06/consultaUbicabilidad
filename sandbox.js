const config = {
  apiKey: "AIzaSyCrHSBkkDtgv5zmdQnaxtPp2ftehhPUkqU",
  authDomain: "proyectplateregistration.firebaseapp.com",
  databaseURL: "https://proyectplateregistration-default-rtdb.firebaseio.com",
  projectId: "proyectplateregistration",
  storageBucket: "proyectplateregistration.appspot.com",
  messagingSenderId: "1091378837166",
  appId: "1:1091378837166:web:79133e45a006015b485f3f",
  measurementId: "G-YLGDWC3H2P",
};
firebase.initializeApp(config);


let placaActual = '';
let guardandoRespuesta = false;

window.addEventListener("message", async function(event) {
  console.log("Respuesta recibida en sandbox.js:", event.data);
  
  if (guardandoRespuesta) {
    console.log("Esperando para guardar la siguiente respuesta...");
    return;
  }

  guardandoRespuesta = true;

  try {
    // Parsear la cadena JSON
    const datos = JSON.parse(event.data);

    // Acceder a cada objeto por separado
    const informacionPersona = datos.informacionPersona || {};
    const datosUbicacion = datos.datosDirecciones || {};
    
    const placa = datos.placa;

    const firestore = firebase.firestore();

    const informacionCollection = await firestore.collection("ubicabilidad").get();
    let placaEncontradaInformacion = false;
    
    informacionCollection.forEach((doc) => {
      const datos = doc.data();
      if (datos.placa === placa) {
        placaEncontradaInformacion = true;
      }
    });
    
    console.log("placaEncontradaInformacion", placaEncontradaInformacion);

    if (!placaEncontradaInformacion) {
      // Enviar a Firestore   
      console.log("placa", placa);
      
      if (Object.keys(informacionPersona).length > 0 && placa !== undefined) {
        const respuestasCollection = firestore.collection("ubicabilidad");
        respuestasCollection.add({
          informacionPersona: informacionPersona,
          datosUbicacion: datosUbicacion,
          placa: placa,
        })
        .then((docRef) => {
          console.log("Respuesta guardada en Firestore con ID:", docRef.id);
        })
        .catch((error) => {
          console.error("Error al guardar la respuesta en Firestore:", error);
        });
      }
    } else {
      console.log("Placa ya consultada!");
    }
    
  } catch (error) {
    console.error("Error al analizar el mensaje JSON:", error);
  } finally {
    // Establecer un tiempo de espera antes de permitir el próximo guardado.
    setTimeout(() => {
      guardandoRespuesta = false;
    }, 3000); // Espera 3 segundos antes de permitir el próximo guardado.
  }
});


async function fetchData() {
  const app = firebase.initializeApp(config);
  const firestore = firebase.firestore();

  try {
    const platesCollection = firestore.collection("Placas");
    const querySnapshot = await platesCollection.get();

    const allDatosPropietario = [];
    querySnapshot.forEach(async (doc) => {
      const columnData = doc.data().placasUbicabilidad;
      console.log(columnData);
      if (Array.isArray(columnData)) {
        for (const plate of columnData) {
          const informacionCollection = firestore.collection("informacion");
          const informacionQuery = await informacionCollection
            .where("datosBasicos.Placa", "==", plate)
            .get();

          informacionQuery.forEach((informacionDoc) => {
            // Obtener y manejar los datosPropietario si se encuentra la placa
            const datosPropietario = informacionDoc.data().datosPropietario;
            console.log(`Datos Propietario para la placa ${plate}:`, datosPropietario);

            // Agregar la placa al objeto de datosPropietario
            datosPropietario.forEach((datos) => {
              datos.placa = plate;
              allDatosPropietario.push(datos);
            });
          });
        }

        // Enviar el array completo como mensaje
        window.parent.postMessage({ allDatosPropietario }, "*");
      } else {
        console.log("No se encontraron datos de placas.");
      }
    });
  } catch (error) {
    console.error("Error al consultar la colección 'plates':", error);
  }
}


fetchData();
