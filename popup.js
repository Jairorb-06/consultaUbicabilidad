window.addEventListener("message", function (event) {
  if (event.data.allDatosPropietario) {
    const datosPropietario = event.data.allDatosPropietario;
    console.log("propietarios ", datosPropietario);
    let currentIndex = 0;
    
    const startButton = document.getElementById("startAutomation");
    if (startButton) {
      // Remover event listener previo si existe
      startButton.removeEventListener("click", startAutomation);

      // Añadir el nuevo event listener
      startButton.addEventListener("click", startAutomation);
    }
      function startAutomation() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: (datosPropietario, currentIndex) => {
              const propietarios = datosPropietario;
              console.log("propietarios", propietarios);
              console.log(currentIndex);
              const tipoDocumentoSelect = document.querySelector(".form-control.input-sm.required");
              const numeroDocumentoInput = document.querySelector("#prenda");
  
              if (currentIndex >= 0 && currentIndex < propietarios.length) {
                const tipoDocumento = propietarios[currentIndex]["Tipo documento"];
                const numeroDocumento = propietarios[currentIndex]["Nro. documento"];
                const placa = propietarios[currentIndex]["placa"];
                console.log(placa);
                console.log(tipoDocumento);
                console.log(numeroDocumento);
  
                seleccionarOpcionSelect(tipoDocumentoSelect, tipoDocumento);
                simularEvento(tipoDocumentoSelect, "change");
                numeroDocumentoInput.value = numeroDocumento.replace(/\./g, "");
                simularEvento(numeroDocumentoInput, "input");
                currentIndex++;
  
                const botonBuscar = document.querySelector(".btn.btn-primary.btn-sm.small");
  
                if (botonBuscar) {
                  botonBuscar.click();
  
                  //setTimeout(() => {
                    var panelBody = document.querySelector(".panel-body");
                    var informacionPersona = {};
                    var filas = panelBody.querySelectorAll(".row");
                    filas.forEach(function (fila) {
                      var columnas = fila.querySelectorAll(".col-xs-3, .col-md-3, .ng-binding");
                      if (columnas.length >= 4) {
                        for (var i = 0; i < columnas.length; i += 2) {
                          var etiqueta = columnas[i].textContent.trim().replace(":", "");
                          var valor = columnas[i + 1].textContent.trim();
                          informacionPersona[etiqueta] = valor;
                        }
                      }
                    });
                    console.log("info persona", informacionPersona);
  
                    var tablaDirecciones = document.querySelector(".tablaAjustada");
                    var datosDirecciones = [];
  
                    if (tablaDirecciones) {
                      var filasDirecciones = tablaDirecciones.querySelectorAll("tbody tr");
  
                      if (filasDirecciones.length > 0) {
                        var encabezadoDirecciones = tablaDirecciones.querySelectorAll("thead th");
                        var nombresColumnasDirecciones = Array.from(encabezadoDirecciones).map((columna) => columna.textContent.trim());
  
                        filasDirecciones.forEach(function (fila) {
                          var celdasDirecciones = fila.querySelectorAll("td");
  
                          if (celdasDirecciones.length > 0) {
                            var filaDatosDirecciones = {};
  
                            celdasDirecciones.forEach(function (celda, index) {
                              filaDatosDirecciones[nombresColumnasDirecciones[index]] = celda.textContent.trim();
                            });
  
                            datosDirecciones.push(filaDatosDirecciones);
                          }
                        });
                      } else {
                        console.log("No se encontraron direcciones registradas para la persona consultada.");
                      }
                    }
  
                    console.log("Datos Direcciones:", datosDirecciones);
  
                    if (Object.keys(informacionPersona).length > 0 && datosDirecciones.length > 0) {
                      chrome.runtime.sendMessage({
                        informacionPersona: informacionPersona,
                        datosDirecciones: datosDirecciones,
                        placa: placa,
                        currentIndex: currentIndex 
                      });
                    }
                  //}, 3000);
  
                  //chrome.runtime.sendMessage({ currentIndex: currentIndex });
                }
              } else {
                console.log("consulta finalizada!");
              }
  
              function seleccionarOpcionSelect(select, tipoDocumento) {
                if (tipoDocumento === "C.C." || tipoDocumento === "NIT") {
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
                return "";
              }
  
              function simularEvento(elemento, tipoEvento) {
                const evento = new Event(tipoEvento, { bubbles: true, cancelable: true });
                elemento.dispatchEvent(evento);
              }
            },
            args: [datosPropietario, currentIndex],
          });
  
        });
      }

    


      chrome.runtime.onMessage.addListener(function (message) {
        const datosUbicabilidad = {
          informacionPersona: message.informacionPersona,
          datosDirecciones: message.datosDirecciones,
          placa: message.placa,
          currentIndex: message.currentIndex,
        };

        window.frames[0].postMessage(JSON.stringify(datosUbicabilidad), "*");
      });


      chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.currentIndex !== undefined) {
          currentIndex = message.currentIndex;
          console.log("currentIndex inc", currentIndex);

          const startAutomationButton = document.getElementById("startAutomation");
          
          if (startAutomationButton) {
            setTimeout(() => {
              startAutomationButton.click();
            }, 3000);
          }
        }
      });
    
  }
});

