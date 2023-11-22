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
                      const botonSalir = document.querySelector('.btn.btn-default');
                      if (botonSalir) {
                        botonSalir.click();
                        setTimeout(() => {
                          // Buscar y hacer clic en el botón "Consulta Ubicabilidad"
                          const botonConsultaUbicabilidad = document.querySelector('.div_interno');
                          if (botonConsultaUbicabilidad) {
                            botonConsultaUbicabilidad.click();
                          }
                        }, 3000); 
                      }
                    }, 3000);
                  }; 
                 /* setTimeout(() => {
                    const botonBuscar = document.querySelector('.btn.btn-primary.btn-sm.small');
                    if (botonBuscar) {
                      botonBuscar.click();
                      chrome.runtime.sendMessage({ currentIndex: currentIndex });
                    }
                  }, 3000);*/
                  
                }

                function seleccionarOpcionSelect(select, tipoDocumento) {
                  // Verificar si el tipo de documento es "C.C." y seleccionar la opción correspondiente
                  if (tipoDocumento === "C.C.") {
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

            /*chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

              if (message.currentIndex !== undefined) {
                currentIndex = message.currentIndex;
                console.log("currentIndex inc", currentIndex)
                const startAutomationButton = document.getElementById("startAutomation");
                
                if (startAutomationButton) {
                  setTimeout(() => {
                    consultarAutomotorButtonClicked = false;
                    startAutomationButton.click();
                  }, 5000);
                }

              }
            });*/
            
          }
        );
      });

      let pressBotonUbicabilidad = false;
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
          if (!pressBotonUbicabilidad) {
            setTimeout(function () {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                  console.log("scriptong");
                    const botonUbicabilidad = document.getElementById('apy_t0i185btn');
                    console.log("buton", botonUbicabilidad)
                    if (botonUbicabilidad) {
                      botonUbicabilidad.click();
                    }
                  }
              });
              pressBotonUbicabilidad = true;
            }, 1000); 
          }
        }
      });
      
      
      
      

      
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

