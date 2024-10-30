console.log("Script cargado");

window.onload = function() {
    console.log("DOM completamente cargado, llamando a obtenerEvento...");
    obtenerEvento(43);  // Llama a la función con un ID de prueba
};

// Función para obtener los datos del evento desde el servidor
async function obtenerEvento(idevento) {
    try {
        const response = await fetch(`http://localhost:3000/eventos/${idevento}`);
        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos del servidor:", data);

        if (data.result_estado === 'ok') {
            const evento = data.result_data;
            fnMostrarEvento(evento);  // Llama a la función para mostrar los datos en el DOM
        } else {
            console.error('Error:', data.result_message);
        }
    } catch (error) {
        console.error('Error al obtener el evento:', error);
    }
}

// Función para mostrar los datos del evento en el DOM
const fnMostrarEvento = (evento) => {
    console.log('Mostrando datos del evento en el DOM:', evento);

    // Función auxiliar para actualizar los elementos del DOM de manera segura
    const actualizarElemento = (selector, valor) => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            elemento.innerText = valor;
        } else {
            console.error(`No se encontró el elemento: ${selector}`);
        }
    };

    // Actualizar los elementos del DOM con los datos del evento
    actualizarElemento('.widget-49-pro-title', evento.titulo);
    actualizarElemento('.widget-49-date-day', new Date(evento.fechaevento).getDate());
    actualizarElemento('.widget-49-date-month', new Date(evento.fechaevento).toLocaleString('default', { month: 'short' }));
    actualizarElemento('.widget-49-meeting-time:nth-child(2)', `Desde: ${evento.horadesde}`);
    actualizarElemento('.widget-49-meeting-time:nth-child(3)', `Hasta: ${evento.horahasta}`);
    actualizarElemento('.widget-49-meeting-item span', evento.lugar);
};

const fnEliminarEvento = async (idevento) => {
  Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              const URLEndPoint = `http://localhost:3000/eventos/${idevento}`;
              const OpcionesDelFetch = {
                  method: "DELETE",
                  headers: {
                      "Content-Type": "application/json"
                  }
              };
              
              const Resultado = await fetch(URLEndPoint, OpcionesDelFetch);
              const Datos = await Resultado.json();
              
              if (Datos.result_estado === "ok") {
                  Swal.fire(
                      'Eliminado!',
                      'El evento ha sido eliminado correctamente.',
                      'success'
                  );
                  // Lógica para actualizar la lista de eventos en la UI
              } else {
                  Swal.fire(
                      'Error',
                      `Error al eliminar el evento: ${Datos.result_message}`,
                      'error'
                  );
              }
          } catch (error) {
              Swal.fire(
                  'Error',
                  `Se produjo un error en el frontend: ${error.message}`,
                  'error'
              );
          }
      }
  });
};