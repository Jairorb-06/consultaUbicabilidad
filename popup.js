window.addEventListener("message", function (event) {
  if (event.data.allDatosPropietario) {
    const datosPropietario = event.data.allDatosPropietario;
    console.log("propietarios ", datosPropietario);
    let currentIndex = 0;
    document
      .getElementById("startAutomation")
      .addEventListener("click", function () {
        //console.log("Botón 'Iniciar Automatización' clickeado.");
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            //console.log("Extensión button clicked.");

            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: (datosPropietario, currentIndex) => {
                //console.log("Detectando campo de entrada...");
                const propietarios = datosPropietario;
                console.log("propietarios", propietarios);
                // const currentIndex = currentIndex;
                console.log(currentIndex)
                // Obtener los elementos select e input en la página
                //const tipoDocumentoSelect = document.querySelector('#tipoIdentificacion');
                const tipoDocumentoSelect = document.querySelector('.form-control.input-sm.required');
                const numeroDocumentoInput = document.querySelector('#prenda');
                // Verificar si currentIndex está dentro del rango de propietarios
                if (currentIndex >= 0 && currentIndex < propietarios.length) {
                  // Obtener el tipo de documento y número del propietario actual
                  const tipoDocumento = propietarios[currentIndex]['Tipo documento'];
                  const numeroDocumento = propietarios[currentIndex]['Nro. documento'];
                  console.log(tipoDocumento)
                  console.log(numeroDocumento)
                  // Seleccionar la opción correspondiente en el select
                  //tipoDocumentoSelect.value = obtenerValorSelect(tipoDocumentoSelect, tipoDocumento);
                  seleccionarOpcionSelect(tipoDocumentoSelect, tipoDocumento);
                  // Ingresar el número de documento en el input
                  // numeroDocumentoInput.value = numeroDocumento;
                  simularEvento(tipoDocumentoSelect, 'change');

                  numeroDocumentoInput.value = numeroDocumento.replace(/\./g, '');

                  simularEvento(numeroDocumentoInput, 'input');
                  currentIndex++;

                  const botonBuscar = document.querySelector('.btn.btn-primary.btn-sm.small');
                  if (botonBuscar) {
                    botonBuscar.click();
                    setTimeout(() => {
                      // Obtener el elemento que contiene la información
                      var panelBody = document.querySelector('.panel-body');

                      // Crear un objeto para almacenar la información
                      var informacionPersona = {};

                      // Obtener todas las filas dentro del panel
                      var filas = panelBody.querySelectorAll('.row');

                      // Iterar sobre cada fila y extraer la información
                      filas.forEach(function (fila) {
                        // Obtener todas las columnas de la fila
                        var columnas = fila.querySelectorAll('.col-xs-3, .col-md-3, .ng-binding');

                        // Verificar si hay suficientes columnas
                        if (columnas.length >= 4) {
                          // Iterar sobre las columnas en pasos de 2
                          for (var i = 0; i < columnas.length; i += 2) {
                            // Obtener la etiqueta y el valor
                            var etiqueta = columnas[i].textContent.trim().replace(':', ''); // Eliminar los dos puntos
                            var valor = columnas[i + 1].textContent.trim();

                            // Almacenar en el objeto de información
                            informacionPersona[etiqueta] = valor;
                          }
                        }
                      });

                      // Mostrar la información en la consola
                      console.log("info persona", informacionPersona);

                      var tablaDirecciones = document.querySelector('.tablaAjustada');

                      // Obtén la información de la tabla de direcciones
                      var datosDirecciones = [];

                      if (tablaDirecciones) {
                        // Obtén todas las filas de la tabla
                        var filasDirecciones = tablaDirecciones.querySelectorAll('tbody tr');

                        // Verifica si la tabla tiene direcciones
                        if (filasDirecciones.length > 0) {
                          // Obtén los nombres de las columnas desde el encabezado
                          var encabezadoDirecciones = tablaDirecciones.querySelectorAll('thead th');
                          var nombresColumnasDirecciones = Array.from(encabezadoDirecciones).map(columna => columna.textContent.trim());

                          // Itera sobre las filas
                          filasDirecciones.forEach(function (fila) {
                            // Obtén todas las celdas de la fila actual
                            var celdasDirecciones = fila.querySelectorAll('td');

                            // Verifica si la fila no está vacía
                            if (celdasDirecciones.length > 0) {
                              // Inicializa un objeto para almacenar los datos de la fila
                              var filaDatosDirecciones = {};

                              // Itera sobre las celdas
                              celdasDirecciones.forEach(function (celda, index) {
                                // Asigna el contenido al objeto con el nombre de la columna correspondiente
                                filaDatosDirecciones[nombresColumnasDirecciones[index]] = celda.textContent.trim();
                              });

                              // Agrega el objeto de la fila al array principal
                              datosDirecciones.push(filaDatosDirecciones);
                            }
                          });

                        } else {
                          console.log('No se encontraron direcciones registradas para la persona consultada.');
                        }
                      }
                      console.log('Datos Direcciones:', datosDirecciones);
                      //historialTramitesEnviado = true;
                      if (Object.keys(informacionPersona).length > 0 && datosDirecciones.length > 0  ) {
                        // Enviar los datos de vuelta al contexto del evento
                        chrome.runtime.sendMessage({
                          informacionPersona: informacionPersona,
                          datosDirecciones: datosDirecciones,
                          // placa : placa
                        });
                      }
                    }, 3000)

                    /*setTimeout(()=>{
                      if (Object.keys(informacionPersona).length > 0 ) {
                        // Enviar los datos de vuelta al contexto del evento
                        chrome.runtime.sendMessage({
                          informacionPersona: informacionPersona,
                          datosDirecciones: datosDirecciones,
                          // placa : placa
                        });
                      }
                    }, 2000)*/

                    chrome.runtime.sendMessage({ currentIndex: currentIndex });
                    /* setTimeout(() => {
                       const botonSalir = document.querySelector('.btn.btn-default');
                       if (botonSalir) {
                        // botonSalir.click();
                         chrome.runtime.sendMessage({ currentIndex: currentIndex });
                        // pressBotonUbicabilidad = false;
                       }
                     }, 5000);*/
                  };
                  /* setTimeout(() => {
                     const botonBuscar = document.querySelector('.btn.btn-primary.btn-sm.small');
                     if (botonBuscar) {
                       botonBuscar.click();
                       chrome.runtime.sendMessage({ currentIndex: currentIndex });
                     }
                   }, 3000);*/

                }else{
                  console.log("consulta finalizada!");
                  //alert("Consulta finalizada!");

                  // Close the extension popup after a delay (e.g., 3 seconds)
                  setTimeout(() => {
                    window.close();
                  }, 3000);
              }

                function seleccionarOpcionSelect(select, tipoDocumento) {
                  // Verificar si el tipo de documento es "C.C." y seleccionar la opción correspondiente
                  if (tipoDocumento === "C.C." || "NIT") {
                    select.value = obtenerValorSelect(select, "C - Cédula Ciudadanía");
                  } else {
                    select.value = obtenerValorSelect(select, tipoDocumento);
                  }
                }

                // Función auxiliar para obtener el valor correcto en el select
                function obtenerValorSelect(select, value) {
                  for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].text.includes(value)) {
                      return select.options[i].value;
                    }
                  }
                  return '';
                }

                function simularEvento(elemento, tipoEvento) {
                  const evento = new Event(tipoEvento, {
                    bubbles: true,
                    cancelable: true,
                  });
                  elemento.dispatchEvent(evento);
                }

              },
              args: [datosPropietario, currentIndex],
            });
            //let historialTramitesEnviado = false;
             chrome.runtime.onMessage.addListener(function (message) {  
                        
               const datosUbicabilidad = {
                 informacionPersona: message.informacionPersona,
                 datosDirecciones: message.datosDirecciones,
                 // placa: message.placa
               };
              // if (!historialTramitesEnviado) {
                 window.frames[0].postMessage(JSON.stringify(datosUbicabilidad), "*");
               // historialTramitesEnviado = true;
               // }
               //window.frames[0].postMessage(JSON.stringify(platesData), "*");
             });

            chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

              if (message.currentIndex !== undefined) {
                currentIndex = message.currentIndex;
                console.log("currentIndex inc", currentIndex)
                const startAutomationButton = document.getElementById("startAutomation");

                if (startAutomationButton) {
                  setTimeout(() => {
                    consultarAutomotorButtonClicked = false;
                    startAutomationButton.click();
                  }, 4000);
                }

              }
            });

          }
        );
      });

  /*  let pressBotonUbicabilidad = false;
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status === "complete") {
        // if (!pressBotonUbicabilidad) {
        //setTimeout(function () {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            //console.log("scriptong");
            const botonUbicabilidad = document.getElementById('apy_t0i185btn');
            //console.log("buton", botonUbicabilidad)
            if (botonUbicabilidad) {
              botonUbicabilidad.click();
            }
          }
        });
        pressBotonUbicabilidad = true;
        // }, 1000); 
        //}
      }
    });
*/





    /*  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
       if (changeInfo.status === "complete") {
           chrome.scripting.executeScript({
             target: { tabId: tab.id },
             function: function () {
               var tablaDatosBasicos = document.getElementById("ConsultarAutomotorForm:pGridContentInputColumns1");
               var datosBasicos = {};
                 if (tablaDatosBasicos) {
                   var filas =
                     tablaDatosBasicos.querySelectorAll("tr.row, tr.row_odd");
                   for (var i = 0; i < filas.length; i++) {
                     var celdas = filas[i].querySelectorAll("td");
                     for (var j = 0; j < celdas.length; j++) {
                       var contenido = celdas[j].textContent.trim();
                       var esEtiqueta = contenido.endsWith(":");
                       if (esEtiqueta && j + 1 < celdas.length) {
                         var etiqueta = contenido.slice(0, -1).trim();
                         var valor = celdas[j + 1].textContent.trim();
                         datosBasicos[etiqueta] = valor;
                       }
                     }
                   }
                 }
 
                 var tablaPropietario = document.getElementById('ConsultarAutomotorForm:pagedTablePropietario');
                 var datosPropietario = [];
                 if (tablaPropietario) {
                   var filasPropietario = tablaPropietario.querySelectorAll('tr.row, tr.row_odd');
                   var encabezadoPropietario = tablaPropietario.querySelector('thead');
                   var nombresColumnasPropietario = [];
                   if (encabezadoPropietario) {
                     var celdasEncabezadoPropietario = encabezadoPropietario.querySelectorAll('th');
                     nombresColumnasPropietario = Array.from(celdasEncabezadoPropietario).map(celda => celda.textContent.trim());
                   }
                   for (var i = 0; i < filasPropietario.length; i++) {
                     var celdasPropietario = filasPropietario[i].querySelectorAll('td');
                     var filaDatosPropietario = {};
                     for (var j = 0; j < celdasPropietario.length; j++) {
                       var contenidoPropietario = celdasPropietario[j].textContent.trim();
                       filaDatosPropietario[nombresColumnasPropietario[j]] = contenidoPropietario;
                     }
                     datosPropietario.push(filaDatosPropietario);
                   }
                 }
                  
                   if (Object.keys(datosBasicos).length > 0 && Object.keys(infoVehiculo).length > 0 ) {                   
                     // Enviar los datos de vuelta al contexto del evento
                     chrome.runtime.sendMessage({
                       datosBasicos: datosBasicos,
                       infoVehiculo: infoVehiculo,
                       datosSoat: datosSoat,
                       datosRevisionTM: datosRevisionTM,
                       datosCertificaciones: datosCertificaciones,
                       datosGravamenes: datosGravamenes,
                       datosLimitaciones: datosLimitaciones,
                       datosPropietario: datosPropietario,
                       placa : placa
                       //historialTramites: historialTramites,
                     });
                   }else {
                     if(historialTramites.length > 0   ){
                       chrome.runtime.sendMessage({ historialTramites: historialTramites});  
                     }
                   }
 
             },
           });
           let historialTramitesEnviado = false;
           chrome.runtime.onMessage.addListener(function (message) {
             const datosPropietario = {
               datosBasicos: message.datosBasicos,
               infoVehiculo: message.infoVehiculo,
               datosSoat: message.datosSoat,
               datosRevisionTM: message.datosRevisionTM,
               datosCertificaciones: message.datosCertificaciones,
               datosGravamenes: message.datosGravamenes,
               datosLimitaciones: message.datosLimitaciones,
               datosPropietario: message.datosPropietario,
               historialTramites: message.historialTramites,
               placa: message.placa
             };
             if (!historialTramitesEnviado) {
               window.frames[0].postMessage(JSON.stringify(datosPropietario), "*");
               historialTramitesEnviado = true;
             }
             //window.frames[0].postMessage(JSON.stringify(datosPropietario), "*");
           });
           
        // }, 500);
       }
     }); */

    /*   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
         // setTimeout(function () {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              function: () => {
                const generarHistorialButton = document.getElementById(
                  "ConsultarAutomotorForm:btnAction2"
                );
                if (generarHistorialButton) {
                  generarHistorialButton.click();
                }
              },
            });
         // }, 200);
        }
      }); */




    let consultarAutomotorButtonClicked = false;

    /* 
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {  
      if (changeInfo.status === "complete") {
        if (!consultarAutomotorButtonClicked) {
          setTimeout(function () {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              function: () => {
                const consultarAutomotorButton = document.querySelector('table[id="apy_t0i26"]');
                if (consultarAutomotorButton) {
                  consultarAutomotorButton.click();
                  consultarAutomotorButtonClicked = true;
                }
              }
            });
            consultarAutomotorButtonClicked = true;        
          }, 700);
        }
      }
    }); 
    */

  }
});



