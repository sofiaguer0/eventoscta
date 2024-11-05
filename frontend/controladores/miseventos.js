console.log("Script cargado");

// Función que se ejecuta al cargar completamente el DOM
window.onload = function() {
    console.log("DOM completamente cargado, llamando a obtenerEventosDeUsuario...");
    obtenerEventosDeUsuario();
};

// Función para obtener los eventos del usuario desde el servidor
async function obtenerEventosDeUsuario() {
    const idusuario = localStorage.getItem("idusuario");
    if (!idusuario) {
        console.error("ID de usuario no encontrado en localStorage.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/eventos/usuario/${idusuario}`);
        const data = await response.json();

        if (data.result_estado === "ok") {
            data.result_data.forEach(eventos => {
                fnMostrarEvento(eventos); // Muestra cada evento en el DOM
            });
        } else {
            console.error('Error al obtener eventos:', data.result_message);
        }
    } catch (error) {
        console.error('Error en la solicitud de eventos:', error);
    }
}

// Función para mostrar los datos del evento en el DOM
function fnMostrarEvento(eventos) {
    const contenedorEventos = document.getElementById("contenedor-eventos");
    
    // Función para obtener la clase CSS según el estado
    const getEstadoClass = (estado) => {
        const clases = {
            'PENDIENTE': 'estado-pendiente',
            'APROBADO': 'estado-aprobado',
            'RECHAZADO': 'estado-rechazado'
        };
        return clases[estado] || 'estado-pendiente';
    };

    const eventoHTML = `
        <div id="evento-${eventos.idevento}" class="col-lg-4">
            <div class="card card-margin">
                <div class="card-header no-border">
                    <h5 class="card-title">
                        <span class="estado-badge ${getEstadoClass(eventos.estado)}">${eventos.estado || 'PENDIENTE'}</span>
                    </h5>
                </div>
                <div class="card-body pt-0">
                    <div class="widget-49">
                        <div class="widget-49-title-wrapper">
                            <div class="widget-49-date-primary">
                                <span class="widget-49-date-day">${new Date(eventos.fechaevento).getDate()}</span>
                                <span class="widget-49-date-month">${new Date(eventos.fechaevento).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div class="widget-49-meeting-info">
                               <span class="widget-49-pro-title">
                                    ${eventos.titulo}
                                    <div class="event-image-container">
                                        <img src="${eventos.imagen_path}" class="card-img-top" alt="${eventos.titulo}">
                                    </div>
                                    
                                </span>
                                <span class="widget-49-meeting-time">Desde: ${eventos.horadesde}</span>
                                <span class="widget-49-meeting-time">Hasta: ${eventos.horahasta}</span>
                            </div>
                        </div>
                        <ol class="widget-49-meeting-points">
                            <li class="widget-49-meeting-item"><span>${eventos.lugar}</span></li>
                        </ol>
                        <div class="widget-49-meeting-action">
                            <a href="detallevento.html">
                                <button type="button" class="btn-registrate">Ver más detalles</button>
                            </a>
                            <a href="editarevento.html?id=${eventos.idevento}">
    <button type="button" class="btn-registrate btn-editar">Editar</button>
</a>
                            <a>
                                <button onclick="fnEliminarEvento(${eventos.idevento})" type="button" class="btn-registrate btn-eliminar">Eliminar</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    contenedorEventos.insertAdjacentHTML('beforeend', eventoHTML);
}
// Función para eliminar un evento del servidor y actualizar la UI
async function fnEliminarEvento(idevento) {
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
                    // Remueve el elemento del DOM
                    const eventoElement = document.getElementById(`evento-${idevento}`);
                    if (eventoElement) {
                        eventoElement.remove();
                    }
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
}
