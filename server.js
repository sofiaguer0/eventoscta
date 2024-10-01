const express = require("express"); // Importa express
const nodemailer = require("nodemailer"); // Importa nodemailer
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 3000; // Define el puerto
const app = express(); // Instancia de express

// Middleware para servir archivos estáticos desde la carpeta "frontend"
app.use(express.static("frontend"));
app.use(express.json()); // Para manejar JSON
app.use(express.urlencoded({ extended: false })); // Para manejar URL-encoded
app.use(cors()); // Habilita CORS para todas las solicitudes

let verificationCode = null; // Aquí almacenamos temporalmente el código

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sofiaguer0111@gmail.com", // Cambia por tu correo de Gmail
    pass: "Babyblue420", // Cambia por tu contraseña de Gmail o usa una contraseña de aplicaciones
  },
});
app.post('/send-code', (req, res) => {
    const email = req.body.email;
    console.log(`Correo recibido: ${email}`); // Verifica que se está recibiendo correctamente el correo

    if (!email) {
        return res.status(400).send("El correo es obligatorio.");
    }

    verificationCode = generateCode(6);  // Generamos un código de 6 dígitos
    console.log(`Código de verificación generado: ${verificationCode}`); // Verifica si se está generando el código

    const mailOptions = {
        from: 'sofiaguer0111@gmail.com', // Cambia por tu correo
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error al enviar el correo: ${error}`); // Muestra el error en la consola
            return res.status(500).send("Error enviando el correo.");
        } else {
            console.log(`Correo enviado: ${info.response}`); // Confirma que el correo se envió correctamente
            return res.status(200).send("Código enviado.");
        }
    });
});



// Ruta para verificar el código
app.post("/verify-code", (req, res) => {
  const code = req.body.code;
  if (code === verificationCode) {
    res.status(200).send("Código correcto.");
  } else {
    res.status(400).send("Código incorrecto.");
  }
});

// Función para generar un código aleatorio de n dígitos
function generateCode(length) {
  let result = "";
  const characters = "0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
