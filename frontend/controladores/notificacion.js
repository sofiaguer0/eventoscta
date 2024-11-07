async function activarNotificacion(evento) {
    try {
        const idusuario = localStorage.getItem('idusuario'); // Obtener el ID del usuario desde el almacenamiento local
        const fechaNotificacion = new Date(evento.fechaevento); // Ajusta según el evento
        fechaNotificacion.setDate(fechaNotificacion.getDate() - 3); // Notificación 3 días antes del evento

        const response = await fetch('/api/notificaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idusuario,
                idevento: evento.id,
                fecha_notificacion: fechaNotificacion,
                tipo: evento.tipo,
                mensaje: `Recordatorio del evento: ${evento.titulo}`
            })
        });

        if (response.ok) {
            const data = await response.json();
            Swal.fire('Notificación activada', 'Notificación guardada correctamente', 'success');
            window.location.href = 'notificacion.html';
        } else {
            console.error('Error al activar notificación');
        }
    } catch (error) {
        console.error('Error en activarNotificacion:', error);
    }
}

// Obtener notificaciones del usuario y mostrarlas
async function obtenerNotificaciones() {
    try {
        const idusuario = localStorage.getItem('idusuario');
        const response = await fetch(`/api/notificaciones/${idusuario}`);
        
        if (response.ok) {
            const notificaciones = await response.json();
            mostrarNotificaciones(notificaciones);
        } else {
            console.error('Error al obtener notificaciones');
        }
    } catch (error) {
        console.error('Error en obtenerNotificaciones:', error);
    }
}

// Mostrar notificaciones en el DOM
function mostrarNotificaciones(notificaciones) {
    const notificacionesContainer = document.getElementById('notificaciones-container');
    
    if (notificaciones.length > 0) {
        notificacionesContainer.innerHTML = notificaciones.map((notificacion) => `
            <div class="notification-card">
                <div class="notification-header ${notificacion.tipo.toLowerCase()}">
                    <span>${notificacion.tipo}</span>
                    <button class="btn-remove" onclick="eliminarNotificacion(${notificacion.idnoti})">X</button>
                </div>
                <div class="notification-body">
                    <h3>${notificacion.mensaje}</h3>
                    <p><strong>Fecha:</strong> ${formatearFecha(notificacion.fecha_notificacion)}</p>
                </div>
            </div>
        `).join('');
    } else {
        notificacionesContainer.innerHTML = `<p>No hay notificaciones activas</p>`;
    }
}

// Eliminar una notificación
async function eliminarNotificacion(idnoti) {
    try {
        const response = await fetch(`/api/notificaciones/${idnoti}`, { method: 'DELETE' });

        if (response.ok) {
            Swal.fire('Notificación eliminada', 'La notificación ha sido eliminada correctamente', 'success')
                .then(() => obtenerNotificaciones()); // Recargar lista de notificaciones
        } else {
            console.error('Error al eliminar la notificación');
        }
    } catch (error) {
        console.error('Error en eliminarNotificacion:', error);
    }
}

// Formatear fecha
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha);
    return `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
}

// Cargar notificaciones al cargar la página
document.addEventListener('DOMContentLoaded', obtenerNotificaciones);