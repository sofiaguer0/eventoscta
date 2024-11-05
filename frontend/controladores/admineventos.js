document.getElementById('volver-dashboard').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
});

const cargarEventos = async (pagina = 1) => {
    try {
        const respuesta = await fetch(`http://localhost:3000/eventos?page=${pagina}&limit=10`);
        const datos = await respuesta.json();

        if (datos.result_estado === "ok") {
            const usuarios = datos.result_data;
            const tbody = document.getElementById("usuarios-tbody");
            tbody.innerHTML = "";  // Limpiar la tabla antes de cargar la nueva página

            usuarios.forEach((evento) => {
                // Función para obtener la clase CSS según el estado
                const getEstadoClass = (estado) => {
                    const clases = {
                        'PENDIENTE': 'estado-pendiente',
                        'APROBADO': 'estado-aprobado',
                        'RECHAZADO': 'estado-rechazado'
                    };
                    return clases[estado] || 'estado-pendiente';
                };

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${evento.idevento}</td>
                    <td>${evento.titulo}</td>
                    <td>${evento.descripcion}</td>
                    <td>${evento.lugar}</td>
                    <td>${evento.fechapublicacion}</td>
                    <td>${evento.idtipo}</td>
                    <td>${evento.horadesde}</td>                    
                    <td>${evento.horahasta}</td>
                    <td>${evento.linkevento}</td>
                    <td>${evento.fechaevento}</td>
                    <td>${evento.idusuario}</td>
                    <td>
                        <span class="estado-badge ${getEstadoClass(evento.estado)}">
                            ${evento.estado || 'PENDIENTE'}
                        </span>
                    </td>
                    <td>
                        ${evento.estado !== 'APROBADO' ? 
                            `<button class="aprobar" onclick="aprobarEvento(${evento.idevento})">Aprobar</button>` : 
                            ''
                        }
                        ${evento.estado !== 'RECHAZADO' ? 
                            `<button class="rechazar" onclick="rechazarEvento(${evento.idevento})">Rechazar</button>` : 
                            ''
                        }
                    </td>
                `;
                tbody.appendChild(fila);
            });

            // Actualizar la paginación
            mostrarPaginacion(datos.totalPages, pagina);
        } else {
            alert("Error al cargar eventos: " + datos.result_message);
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
};

const mostrarPaginacion = (totalPages, paginaActual) => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const prevLi = document.createElement("li");
    prevLi.className = "page-item";
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.onclick = () => {
        if (paginaActual > 1) cargarEventos(paginaActual - 1);
    };
    pagination.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === paginaActual ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.onclick = () => cargarEventos(i);
        pagination.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = "page-item";
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.onclick = () => {
        if (paginaActual < totalPages) cargarEventos(paginaActual + 1);
    };
    pagination.appendChild(nextLi);
};

async function aprobarEvento(idevento) {
    try {
        const respuesta = await fetch(`http://localhost:3000/eventos/${idevento}/estado`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 'APROBADO' })
        });
        const datos = await respuesta.json();

        if (datos.result_estado === "ok") {
            // Verificamos que tenemos los datos del evento
            if (datos.result_data) {
                // Guardamos el evento completo en localStorage
                localStorage.setItem(`evento_${idevento}`, JSON.stringify(datos.result_data));
                alert("Evento aprobado correctamente");
                cargarEventos();  // Recargar la tabla
            } else {
                alert("Error: No se recibieron datos del evento");
            }
        } else {
            alert("Error al aprobar evento: " + datos.result_message);
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
}

async function rechazarEvento(idevento) {
    try {
        const respuesta = await fetch(`http://localhost:3000/eventos/${idevento}/estado`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: 'RECHAZADO' })
        });
        const datos = await respuesta.json();

        if (datos.result_estado === "ok") {
            alert("Evento rechazado correctamente");
            cargarEventos();  // Recargar la tabla
        } else {
            alert("Error al rechazar evento: " + datos.result_message);
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
}

// Cargar eventos al iniciar la página
document.addEventListener("DOMContentLoaded", () => cargarEventos());