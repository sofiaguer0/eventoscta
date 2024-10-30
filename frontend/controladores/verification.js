window.addEventListener("load", function() {
    const email = localStorage.getItem("emailToVerify");
    if (email) {
        document.getElementById("email").value = email;
    } else {
        alert("No se encontró un correo para verificar.");
        window.location.href = "registro.html"; // Redirige al formulario de registro si no hay correo
    }
});

document.querySelector("#btnVerificar").addEventListener("click", async (e) => {
    e.preventDefault();
    const codigo = document.querySelector("#codigoVerificacion").value;

    const respuesta = await fetch('/confirmar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idusuario, codigo })
    });

    const data = await respuesta.json();
    if (data.estado === 'ok') {
        Swal.fire("¡Cuenta verificada!", "Tu cuenta ha sido activada", "success")
            .then(() => { window.location.href = 'iniciarsesion.html'; });
    } else {
        Swal.fire("Error", "Código incorrecto o expirado", "error");
    }
});


async function sendVerificationCode() {
    const email = document.getElementById("email").value;
    
    if (!email) {
        alert("Por favor, ingresa un correo electrónico.");
        return;
    }
    
    try {
        const response = await fetch('http://localhost:3000/enviar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (data.result_estado === "ok") {
            document.getElementById("email-step").style.display = "none";
            document.getElementById("code-step").style.display = "block";
        } else {
            alert(data.result_message);
        }
    } catch (error) {
        console.error("Error al enviar el código de verificación:", error);
        alert("Error al enviar el código de verificación.");
    }
}

async function verifyCode() {
    const code = Array.from({ length: 6 }, (_, i) => document.getElementById(`digit-${i + 1}`).value).join('');
    
    if (code.length !== 6) {
        alert("Por favor, ingresa los 6 dígitos del código de verificación.");
        return;
    }
    
    try {
        const response = await fetch('/verificar-codigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (data.result_estado === "ok") {
            alert("¡Cuenta verificada con éxito!");
            window.location.href = "iniciarsesion.html";
        } else {
            alert(data.result_message);
        }
    } catch (error) {
        console.error("Error al verificar el código:", error);
        alert("Error al verificar el código.");
    }
}
