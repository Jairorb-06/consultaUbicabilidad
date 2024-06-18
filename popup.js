window.addEventListener("message", function (event) {
  if (event.data.allDatosPropietario) {
    const datosPropietario = event.data.allDatosPropietario;
    let currentIndex = 0;

    document.getElementById("startAutomation").addEventListener("click", function () {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: (datosPropietario, currentIndex) => {
              const propietarios = datosPropietario;

              if (currentIndex >= 0 && currentIndex < propietarios.length) {
                console.log("Procesando propietario:", propietarios[currentIndex]);

                // Actualiza el índice para el próximo propietario
                currentIndex++;

                // Envía un mensaje al runtime con el nuevo índice
                chrome.runtime.sendMessage({ currentIndex: currentIndex });

              } else {
                console.log("Consulta finalizada!");
                chrome.runtime.sendMessage({ action: "cerrarExtension" });
              }
            },
            args: [datosPropietario, currentIndex],
          });

          chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.currentIndex !== undefined) {
              currentIndex = request.currentIndex;

              const startAutomationButton = document.getElementById("startAutomation");
              if (startAutomationButton) {
                setTimeout(() => {
                  startAutomationButton.click();
                }, 2000); // Espera 2 segundos antes de continuar con el siguiente propietario
              }
            } else if (request.action === "cerrarExtension") {
              window.close();
            }
          });
        }
      );
    });

    // Simula el clic en el botón de inicio de automatización después de recibir los datos del propietario
    document.getElementById("startAutomation").click();
  }
});
