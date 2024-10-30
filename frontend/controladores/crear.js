const btnGuardarCambios = document.querySelector("#btnGuardarCambios"); // Vinculamos el botón "Guardar Cambios"

// Escuchamos el evento "submit" en el formulario
document.getElementById("registroForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitamos que el formulario se envíe automáticamente

    // Obtenemos los valores de los campos de contraseña
    const contrasena = document.getElementById("txtcontrasena").value;
    const confirmarContrasena = document.getElementById("txtconfirmarContrasena").value;

    // Verificamos si las contraseñas coinciden
    if (contrasena !== confirmarContrasena) {
        // Mostramos una alerta con SweetAlert2 si no coinciden las contraseñas
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden, por favor intentá de nuevo.',
                    timer: 1500

        });
        return; // Salimos de la función para evitar que se continúe con el registro
    }

    // Si las contraseñas coinciden, seguimos con la lógica para registrar al usuario
    let clienteidParaActualizar = txtIdusuario.value;
    let clientenombreParaActualizar = txtnombre.value;
    let clienteapellidoParaActualizar = txtapellido.value;
    let clientecorreoParaActualizar = txtcorreo.value;
    let clientealiasParaActualizar = txtalias.value;
    let clientecontrasenaParaActualizar = txtcontrasena.value;

    let clienteParaActualizar = {
        nombre: clientenombreParaActualizar,
        apellido: clienteapellidoParaActualizar,
        correo: clientecorreoParaActualizar,
        alias: clientealiasParaActualizar,
        contrasena: clientecontrasenaParaActualizar
    };

    if (parseInt(clienteidParaActualizar) === 0) {
        await fnActualizarCliente(JSON.stringify(clienteParaActualizar), 'POST');
        Swal.fire({
            icon: 'success',
            title: 'Cuenta creada',
            text: 'Cuenta creada exitosamente. Inicia sesión ahora.',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.replace('iniciarsesion.html');
        });
    } else {
        await fnActualizarCliente(JSON.stringify(clienteParaActualizar), 'PUT');
        Swal.fire({
            icon: 'success',
            title: 'Modificación exitosa',
            text: 'Los datos del usuario se modificaron correctamente.',
            confirmButtonText: 'OK'
        });
    }
});

/*document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Obtén el correo del formulario de registro
    const email = document.getElementById("txtcorreo").value;

    // Guardar el correo en el localStorage
    localStorage.setItem("emailToVerify", email);

    // Redirigir a la página de verificación
    window.location.href = "verifmail.html";
});
*/

const fnActualizarCliente = async (clienteEnFormatoJSON, VerboHTTP) => {
    try {
        let URLEndPoint = `http://localhost:3000/usuario/`;

        const OpcionesDelFetch = {
            method: VerboHTTP,
            headers: {
                'Content-Type': 'application/json',
            },
            body: clienteEnFormatoJSON,
        };

        let Resultado = await fetch(URLEndPoint, OpcionesDelFetch);
        let Datos = await Resultado.json();

        if (Datos.result_estado === 'ok') {
            if (Datos.result_rows > 0) {
                console.log(Datos.result_data);
            }
        } else {
            alert(`Error en el backend: ${Datos.result_message}`);
        }
    } catch (error) {
        alert(`Error en el frontend: ${error.message}`);
    }
};
