async function sendVerificationCode() {
    const email = document.getElementById("email").value;
    if (!email) {
        alert("Por favor, ingresa un correo electrónico.");
        return;
    }
    // Enviar correo al servidor para generar y enviar el código
    const response = await fetch('/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    });

    if (response.ok) {
        document.getElementById("email-step").style.display = "none";
        document.getElementById("code-step").style.display = "block";
    } else {
        alert("Hubo un error al enviar el código. Intenta de nuevo.");
    }
}

async function verifyCode() {
    const digits = [
        document.getElementById("digit-1").value,
        document.getElementById("digit-2").value,
        document.getElementById("digit-3").value,
        document.getElementById("digit-4").value,
        document.getElementById("digit-5").value,
        document.getElementById("digit-6").value
    ].join('');

    const response = await fetch('/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: digits })
    });

    if (response.ok) {
        alert("Código verificado correctamente.");
    } else {
        alert("Código incorrecto.");
    }
}