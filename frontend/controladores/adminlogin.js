

document.getElementById('adminLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        correo: document.getElementById('txtcorreo').value,
        contrasena: document.getElementById('txtcontrasena').value
    };

    fetch('http://localhost:3000/login/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.result_estado === 'ok') {
            // Guarda el alias del usuario en localStorage
           // Asegúrate de que esta parte del código se ejecute en el momento adecuado, como al guardar el alias
           const correo = document.getElementById('txtcorreo').value; // Obtener el valor del campo de texto
           localStorage.setItem('CorreoUsuario', correo); // Almacena el alias en localStorage
           localStorage.setItem('idadmin', data.result_data.idadmin); // Guarda el idusuario del backend

        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesion exitoso',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.replace('dashboard.html');
        });
    }
    })
    .catch(error => console.error('Error:', error));
});
