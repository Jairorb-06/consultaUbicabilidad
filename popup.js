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
                console.log("propietarios", propietarios)
                /* const input = document.getElementById(
                  "ConsultarAutomotorForm:automotorPlacaNumplaca"
                );
        
                if (input) {

                  function insertPlacaAndTab() {
                    if (currentIndex < placas.length) {
                      
                      console.log("Insertando placa: " + placas[currentIndex]);
                      input.value = placas[currentIndex];
                      currentIndex++;
                      const inputEvent = new Event("input", {
                        bubbles: true,
                        cancelable: true,
                      });
                      input.dispatchEvent(inputEvent);
                      input.focus();
                      const tabKeyCode = 9; // Código de tecla para "Tab"
                      const tabEvent = new KeyboardEvent("keydown", {
                        key: "Tab",
                        keyCode: tabKeyCode,
                        which: tabKeyCode,
                        bubbles: true,
                        cancelable: true,
                      });
                      input.dispatchEvent(tabEvent);

                      setTimeout(() => {
                        const buscarButton = document.getElementById(
                          "ConsultarAutomotorForm:btnconsultarAutomotor"
                        );
                        buscarButton.click(); 
                        chrome.runtime.sendMessage({ currentIndex: currentIndex });
                      }, 2000);
                    } else {
                      console.log("Automatización completada!");
                    }
                  }

                  insertPlacaAndTab();
                } else {
                } */
              },
              args: [datosPropietario, currentIndex], 
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
                  }, 5000);
                }

              }
            });

            
          }
        );


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

