document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        alias: document.getElementById('txtalias').value,
        contrasena: document.getElementById('txtcontrasena').value
    };

    fetch('http://localhost:3000/login', {
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
        const alias = document.getElementById('txtalias').value; // Obtener el valor del campo de texto
        localStorage.setItem('aliasUsuario', alias); // Almacena el alias en localStorage
        localStorage.setItem('idusuario', data.result_data.idusuario); // Guarda el idusuario del backend



        Swal.fire({
            icon: 'success',
            title: 'Inicio de sesion exitoso',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.replace('home2.html');
        });
    }
    })
    .catch(error => console.error('Error:', error));
});