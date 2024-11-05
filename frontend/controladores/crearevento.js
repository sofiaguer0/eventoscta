async function subirImagen(imageFile) {
    const formData = new FormData();
    formData.append('imagen', imageFile);

    try {
        const response = await fetch('http://localhost:3000/upload-imagen', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        return data.imagePath; // Retorna la ruta de la imagen en el servidor
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEvento');
    const btnGuardarCambios = document.querySelector("#btnGuardarCambios");

    // Funciones de validación
    function validarHoras() {
        const horaDesde = document.getElementById('txthoradesde').value;
        const horaHasta = document.getElementById('txthorahasta').value;
        
        if (horaDesde && horaHasta) {
            if (horaHasta <= horaDesde) {
                mostrarError('horaHasta', 'La hora de finalización debe ser posterior a la hora de inicio');
                return false;
            }
            ocultarError('horaHasta');
            return true;
        }
        return true;
    }

    function validarFechas() {
        const fechaPublicacion = new Date(document.getElementById('txtfechapublicacion').value);
        const fechaEvento = new Date(document.getElementById('txtfecha').value);
        
        if (fechaPublicacion && fechaEvento) {
            if (fechaEvento < fechaPublicacion) {
                mostrarError('fecha', 'La fecha del evento debe ser posterior a la fecha de publicación');
                return false;
            }
            ocultarError('fecha');
            return true;
        }
        return true;
    }

    function mostrarError(campo, mensaje) {
        const errorDiv = document.getElementById(campo + 'Error');
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
    }

    function ocultarError(campo) {
        const errorDiv = document.getElementById(campo + 'Error');
        errorDiv.style.display = 'none';
    }

    function validarFormulario() {
        let esValido = true;

        // Validar título
        const titulo = document.getElementById('txttitulo');
        if (!titulo.value || titulo.value.length < 3 || titulo.value.length > 100) {
            mostrarError('titulo', 'El título es requerido y debe tener entre 3 y 100 caracteres');
            esValido = false;
        } else {
            ocultarError('titulo');
        }

        // Validar descripción
        const descripcion = document.getElementById('txtdescripcion');
        if (!descripcion.value || descripcion.value.length < 10 || descripcion.value.length > 500) {
            mostrarError('descripcion', 'La descripción es requerida y debe tener entre 10 y 500 caracteres');
            esValido = false;
        } else {
            ocultarError('descripcion');
        }

        // Validar lugar
        const lugar = document.getElementById('txtlugar');
        if (!lugar.value) {
            mostrarError('lugar', 'El lugar es requerido');
            esValido = false;
        } else {
            ocultarError('lugar');
        }

        // Validar tipo
        const tipo = document.getElementById('txttipo');
        if (!tipo.value) {
            mostrarError('tipo', 'Debes seleccionar un tipo de evento');
            esValido = false;
        } else {
            ocultarError('tipo');
        }

        // Validar link (si se proporciona)
        const link = document.getElementById('txtlinkevento');
        if (link.value && !link.value.match(/^(http|https):\/\/[^ "]+$/)) {
            mostrarError('linkEvento', 'El link debe tener un formato válido');
            esValido = false;
        } else {
            ocultarError('linkEvento');
        }

        // Validar imagen
        const imagen = document.getElementById('formFile');
        if (imagen.files.length > 0) {
            const file = imagen.files[0];
            if (!file.type.startsWith('image/')) {
                mostrarError('imagen', 'El archivo debe ser una imagen');
                esValido = false;
            } else {
                ocultarError('imagen');
            }
        }

        // Validar horas y fechas
        if (!validarHoras()) esValido = false;
        if (!validarFechas()) esValido = false;

        return esValido;
    }

    // Event listeners para validación en tiempo real
    document.getElementById('txthoradesde').addEventListener('change', validarHoras);
    document.getElementById('txthorahasta').addEventListener('change', validarHoras);
    document.getElementById('txtfechapublicacion').addEventListener('change', validarFechas);
    document.getElementById('txtfecha').addEventListener('change', validarFechas);

    // Manejador principal del botón guardar
    btnGuardarCambios.addEventListener("click", async (event) => {

        event.preventDefault();

        if (!validarFormulario()) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'Por favor, revisa todos los campos requeridos.',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            let clienteidParaActualizar = txtIdevento.value;
            let idusuario = localStorage.getItem('idusuario');

            const imageFile = document.getElementById('formFile').files[0];
            let imagePath = null;

            if (imageFile) {
                imagePath = await subirImagen(imageFile);
            }

            let evento = {
                titulo: txttitulo.value,
                descripcion: txtdescripcion.value,
                lugar: txtlugar.value,
                fechapublicacion: txtfechapublicacion.value,
                idtipo: txttipo.value,
                horadesde: txthoradesde.value,
                horahasta: txthorahasta.value,
                linkevento: txtlinkevento.value,
                fechaevento: txtfecha.value,
                idusuario: idusuario,
                imagen_path: imagePath 
            };

            if (parseInt(clienteidParaActualizar) === 0) {
                await fnActualizarCliente(JSON.stringify(evento), 'POST');
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Evento creado con éxito',
                    text: 'Su evento ha sido creado, se le notificará cuando sea aprobado.',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                
                window.location.href = 'miseventos.html';
            } else {
                await fnActualizarCliente(JSON.stringify(evento), 'PUT');
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Evento actualizado con éxito',
                    text: 'El evento ha sido actualizado correctamente.',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                
                window.location.href = 'miseventos.html';
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar el evento. Por favor, intente nuevamente.',
                confirmButtonText: 'OK'
            });
        }
    });
});
// Función para realizar la actualización o inserción de cliente
const fnActualizarCliente = async (clienteEnFormatoJSON, VerboHTTP) => {
    try {
        let URLEndPoint = `http://localhost:3000/eventos/`;

        const OpcionesDelFetch = {
            method: VerboHTTP,
            headers: {
                'Content-Type': 'application/json',
            },
            body: clienteEnFormatoJSON,
        };

        let Resultado = await fetch(URLEndPoint, OpcionesDelFetch);
        let Datos = await Resultado.json();
        console.log(Datos);

        if (Datos.result_estado === 'ok') {
            if (Datos.result_rows > 0) {
                fnActualizarCliente(Datos.result_data);
            }
        } else {
            throw new Error(Datos.result_message);
        }
    } catch (error) {
        console.error('Error en la operación:', error);
        throw error;
    }
};
