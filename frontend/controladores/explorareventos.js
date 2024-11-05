// En explorar.html
document.addEventListener('DOMContentLoaded', cargarEventosAprobados);

let currentPage = 0;
const itemsPerPage = 4;

async function cargarEventosAprobados() {
    try {
        // Obtener eventos del localStorage
        const eventosGuardados = [];
        for(let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if(key && key.startsWith('evento_')) {
                const eventoStr = localStorage.getItem(key);
                if(eventoStr) {
                    try {
                        const evento = JSON.parse(eventoStr);
                        if(evento && evento.estado === 'APROBADO') {
                            eventosGuardados.push(evento);
                        }
                    } catch (parseError) {
                        console.error("Error al parsear evento:", parseError);
                        localStorage.removeItem(key);
                    }
                }
            }
        }

        // Obtener eventos del servidor
        const respuesta = await fetch('http://localhost:3000/eventos/aprobados');
        const datosServidor = await respuesta.json();

        console.log('Respuesta completa del servidor:', datosServidor);
        if (datosServidor.result_data && datosServidor.result_data.length > 0) {
            console.log('Primer evento de ejemplo:', datosServidor.result_data[0]);
        }
        
        let eventosServidor = [];
        if (datosServidor.result_estado === "ok") {
            eventosServidor = datosServidor.result_data || [];
        }

        // Combinar eventos sin duplicados
        const todosLosEventos = [...eventosGuardados];
        eventosServidor.forEach(eventoServidor => {
            if (!todosLosEventos.some(e => e.ID === eventoServidor.ID)) {
                todosLosEventos.push(eventoServidor);
            }
        });

        // Ordenar eventos por fecha
        todosLosEventos.sort((a, b) => new Date(b.fechaevento) - new Date(a.fechaevento));

        mostrarEventos(todosLosEventos);
        initializeCarousel(todosLosEventos);
    } catch (error) {
        console.error("Error al cargar eventos:", error);
    }
}

function mostrarEventos(eventos) {
    const container = document.getElementById('eventos-container');
    if (!container) return;

    container.innerHTML = '';
    eventos.forEach(evento => {
        const card = crearEventCard(evento);
        container.appendChild(card);
    });
}

function crearEventCard(evento) {
    console.log('Procesando evento:', evento);
    console.log('Ruta de imagen del evento:', evento.imagen_path);

    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Construir la URL completa de la imagen
    const imagenUrl = evento.imagen_path ? 
        `http://localhost:3000${evento.imagen_path}` : 
        'https://via.placeholder.com/300x200?text=Imagen+no+disponible';

    console.log('URL final de la imagen:', imagenUrl);
    
    card.innerHTML = `
         <div class="event-image">
        <img src="${imagenUrl}" 
             alt="${evento.titulo}"
             onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
        <div class="event-tag">${evento.tipo}</div>
    </div>
        <div class="event-content">
            <h3>${evento.titulo}</h3>
            <p><strong>Fecha:</strong> ${formatearFecha(evento.fechaevento)}</p>
            <p><strong>Ubicación:</strong> ${evento.lugar}</p>
            <button onclick="verDetallesEvento(${evento.idevento || evento.id})">Ver más detalles</button>
            <button class="notification-btn" onclick="toggleNotificacion(this, ${evento.idevento || evento.id})">
                <i class="fas fa-bell"></i>
            </button>
        </div>
    `;
    
    return card;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function initializeCarousel(eventos) {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const container = document.getElementById('eventos-container');
    const totalPages = Math.ceil(eventos.length / itemsPerPage);

    function updateCarousel() {
        const offset = currentPage * itemsPerPage;
        const eventosVisibles = eventos.slice(offset, offset + itemsPerPage);
        mostrarEventos(eventosVisibles);

        // Actualizar estado de los botones
        prevButton.style.opacity = currentPage === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentPage >= totalPages - 1 ? '0.5' : '1';
    }

    prevButton.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCarousel();
        }
    });

    // Cargar primera página
    updateCarousel();
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarEventosAprobados);

// Actualizar eventos cada minuto
setInterval(cargarEventosAprobados, 60000);
// Tu función existente de agregarEventoAlDOM con una pequeña modificación
function agregarEventoAlDOM(eventos) {
    const eventosContainer = document.getElementById('eventos-container');
    const nuevoEventoDiv = document.createElement('div');
    
    nuevoEventoDiv.className = 'event-card';
    nuevoEventoDiv.innerHTML = `
        <div class="event-image">
        <img src="${evento.imagen_path}" 
             alt="${evento.titulo}"
             onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+no+disponible'">
        <div class="event-tag">${evento.tipo}</div>
    </div>
        <div class="event-content">
            <h3>${eventos.titulo}</h3>
            <p><strong>Fecha:</strong> ${eventos.fechaevento}</p>
            <p><strong>Ubicación:</strong> ${eventos.lugar}</p>
            <button onclick="verDetallesEvento(${eventos.id})">Ver más detalles</button>
             onclick="toggleNotificacion(evento)"
        </div>
    `;
    
    eventosContainer.appendChild(nuevoEventoDiv);
}

// Función para ver detalles (puedes implementarla según tus necesidades)
function verDetallesEvento(eventoId) {
    // Aquí puedes implementar la lógica para mostrar más detalles
    // Por ejemplo, redirigir a una página de detalles
    window.location.href = `detalles-evento.html?id=${eventoId}`;
}

function toggleNotificacion(evento) {
    console.log("Evento antes de guardarlo en localStorage:", evento); // Verifica el evento

    const isNotificationActive = localStorage.getItem('eventoNotificacion') !== null;

    if (!isNotificationActive) {
        localStorage.setItem('eventoNotificacion', JSON.stringify(evento));
        console.log('Evento guardado en localStorage:', evento);
        Swal.fire({
            icon: 'success',
            title: 'Notificación guardada',
            text: 'Serás redirigido a la página de notificación.',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            window.location.href = 'notificacion.html';
        });
    } else {
        localStorage.removeItem('eventoNotificacion');
        Swal.fire({
            icon: 'info',
            title: 'Notificación desactivada',
            text: 'La notificación ha sido desactivada.'
        });
    }
}

function verificarImagen(evento) {
    console.log('Ruta de imagen:', evento.imagen_path);
    const img = new Image();
    img.onload = () => console.log('Imagen cargada correctamente:', evento.imagen_path);
    img.onerror = () => console.error('Error cargando imagen:', evento.imagen_path);
    img.src = evento.imagen_path;
}

// Llama a esta función cuando recibas los datos del evento
verificarImagen(evento);