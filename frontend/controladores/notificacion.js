document.addEventListener('DOMContentLoaded', () => {
    const evento = JSON.parse(localStorage.getItem('eventoNotificacion'));

    if (evento) {
        console.log('Evento recuperado:', evento);
        const eventoDetalle = document.getElementById('evento-detalle');
        
        eventoDetalle.innerHTML = `
            <div class="event-card">
                <div class="event-image">
                    <img src="${evento.imagen_path || '/ruta/imagen/default.jpg'}" alt="${evento.titulo}">
                    <div class="event-tag">${evento.tipo}</div>
                </div>
                <div class="event-content">
                    <h3>${evento.titulo}</h3>
                    <p><strong>Fecha:</strong> ${formatearFecha(evento.fechaevento)}</p>
                    <p><strong>Ubicación:</strong> ${evento.lugar}</p>
                </div>
            </div>
        `;
    } else {
        console.log('No se encontró ningún evento en localStorage.');
    }
});

function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    return `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
}

function guardarNotificacion() {
    const evento = JSON.parse(localStorage.getItem('eventoNotificacion'));
    const notify3Days = document.getElementById('notify-3days').checked;
    const notify1Day = document.getElementById('notify-1day').checked;

    if (evento) {
        const configuracionNotificacion = {
            eventId: evento.id,
            notify3Days: notify3Days,
            notify1Day: notify1Day
        };

        localStorage.setItem(`notificacion_${evento.id}`, JSON.stringify(configuracionNotificacion));

        alert('Configuración de notificación guardada');
        window.location.href = '.html';
    } else {
        alert('Error: No se encontró el evento.');
    }
}