window.addEventListener("message", function (event) {
  if (event.data.allDatosPropietario) {
    const datosPropietario = event.data.allDatosPropietario;
    console.log("propietarios ", datosPropietario);
    let currentIndex = 0;
    
    document.getElementById("startAutomation").addEventListener("click", function () {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: (datosPropietario, currentIndex) => {
              const propietarios = datosPropietario;
              console.log("propietarios", propietarios);
              const tipoDocumentoSelect = document.querySelector('.form-control.input-sm.required');
              const numeroDocumentoInput = document.querySelector('#prenda');
              console.log("currentIndex",currentIndex)
              console.log("propietarios.length", propietarios.length)
              if (currentIndex >= 0 && currentIndex < propietarios.length) {
                const tipoDocumento = propietarios[currentIndex]['Tipo documento'];
                const numeroDocumento = propietarios[currentIndex]['Nro. documento'];
                const placa = propietarios[currentIndex]['placa'];
                seleccionarOpcionSelect(tipoDocumentoSelect, tipoDocumento);
                simularEvento(tipoDocumentoSelect, 'change');
                numeroDocumentoInput.value = numeroDocumento.replace(/\./g, '');
                simularEvento(numeroDocumentoInput, 'input');
                
                const botonBuscar = document.querySelector('.btn.btn-primary.btn-sm.small');
                if (botonBuscar) {
                  botonBuscar.click();
                  setTimeout(() => {
                    currentIndex++;
                    var panelBody = document.querySelector('.panel-body');
                    var informacionPersona = {};
                    var filas = panelBody.querySelectorAll('.row');
                    filas.forEach(function (fila) {
                      var columnas = fila.querySelectorAll('.col-xs-3, .col-md-3, .ng-binding');
                      if (columnas.length >= 4) {
                        for (var i = 0; i < columnas.length; i += 2) {
                          var etiqueta = columnas[i].textContent.trim().replace(':', ''); 
                          var valor = columnas[i + 1].textContent.trim();
                          informacionPersona[etiqueta] = valor;
                        }
                      }
                    });
                    console.log("info persona", informacionPersona);

                    var tablaDirecciones = document.querySelector('.tablaAjustada');
                    var datosDirecciones = [];

                    if (tablaDirecciones) {
                      var filasDirecciones = tablaDirecciones.querySelectorAll('tbody tr');
                      if (filasDirecciones.length > 0) {
                        var encabezadoDirecciones = tablaDirecciones.querySelectorAll('thead th');
                        var nombresColumnasDirecciones = Array.from(encabezadoDirecciones).map(columna => columna.textContent.trim());

                        filasDirecciones.forEach(function (fila) {
                          var celdasDirecciones = fila.querySelectorAll('td');
                          if (celdasDirecciones.length > 0) {
                            var filaDatosDirecciones = {};
                            celdasDirecciones.forEach(function (celda, index) {
                              filaDatosDirecciones[nombresColumnasDirecciones[index]] = celda.textContent.trim();
                            });
                            datosDirecciones.push(filaDatosDirecciones);
                          }
                        });
                      } else {
                        console.log('No se encontraron direcciones registradas para la persona consultada.');
                      }
                    }
                    console.log('Datos Direcciones:', datosDirecciones);
let mensajeEnviado = false;

if (Object.keys(informacionPersona).length > 0 && datosDirecciones.length > 0 && !mensajeEnviado) {
    mensajeEnviado = true; // Marca como mensaje enviado para evitar múltiples envíos

    (async () => {
        const response = await new Promise(resolve => {
            chrome.runtime.sendMessage({
                informacionPersona: informacionPersona,
                datosDirecciones: datosDirecciones,
                placa: placa,
                currentIndex: currentIndex
            }, resolve);
        });
        console.log("response", response);

        if (response) {
            console.log("llega response");
            mensajeEnviado = false; // Marca como no enviado para permitir el siguiente envío
        }
    })();
}

                  }, 1000)
                };
              } else {
                console.log("consulta finalizada!");
                chrome.runtime.sendMessage({ action: "cerrarExtension" });
              }

              function seleccionarOpcionSelect(select, tipoDocumento) {
                if (tipoDocumento === "C.C." || "NIT") {
                  select.value = obtenerValorSelect(select, "C - Cédula Ciudadanía");
                } else {
                  select.value = obtenerValorSelect(select, tipoDocumento);
                }
              }

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

          chrome.runtime.onMessage.addListener(function (request, sender, sendResponse, message) {
            if (request.currentIndex !== undefined) {
              currentIndex = request.currentIndex;
              console.log("currentIndex inc", currentIndex);
      
              const startAutomationButton = document.getElementById("startAutomation");
              if (startAutomationButton) {
                  setTimeout(() => {
                      startAutomationButton.click();
                  }, 1500);
              }
          } if (request.informacionPersona && request.datosDirecciones && request.placa) {
            const datosUbicabilidad = {
              informacionPersona: request.informacionPersona,
              datosDirecciones: request.datosDirecciones,
              placa: request.placa,
              currentIndex: request.currentIndex + 1, // Incrementa currentIndex antes de enviar
            };
            console.log("informacion", datosUbicabilidad)
              window.frames[0].postMessage(JSON.stringify(datosUbicabilidad), "*");
      
              // Envía el segundo mensaje
            //  chrome.runtime.sendMessage({ currentIndex: currentIndex + 1 });
          } else if (message.action === "cerrarExtension") {
              // Cerrar la ventana emergente
              window.close();
          }
          if (request.informacionPersona && request.currentIndex) {
            console.log("trae informacion", request.currentIndex);
            setTimeout(function () {
                sendResponse({ currentIndex: request.currentIndex + 1 });
            },2000);
            return true;
        }
        });

         
        
/*
chrome.runtime.onMessage.addListener(function (message) {  
  //setTimeout(() => {      
               const datosUbicabilidad = {
                 informacionPersona: message.informacionPersona,
                 datosDirecciones: message.datosDirecciones,
                 placa: message.placa
                };
                // if (!historialTramitesEnviado) {
                  const currentIndex = message.currentIndex;
                  console.log("currentIndex inc", currentIndex)
                  console.log("recibe index", currentIndex)
                  if(message.informacionPersona && message.datosDirecciones && message.placa && message.currentIndex){
                    window.frames[0].postMessage(JSON.stringify(datosUbicabilidad), "*");
                  }
                  //window.frames[0].postMessage(JSON.stringify(datosUbicabilidad), "*");
                  //}, 1000);
                  // historialTramitesEnviado = true;
                  // }
                  //window.frames[0].postMessage(JSON.stringify(platesData), "*");
                });
                
            chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

              if (message.currentIndex !== undefined) {
                currentIndex = message.currentIndex;
                
                const startAutomationButton = document.getElementById("startAutomation");

                if (startAutomationButton) {
                  setTimeout(() => {
                    startAutomationButton.click();
                    // consultarAutomotorButtonClicked = false;
                  }, 3000);
                }

              }
            });

            chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
              if (message.action === "cerrarExtension") {
                // Cerrar la ventana emergente
                window.close();
              }
            });
            */
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
  }
});



