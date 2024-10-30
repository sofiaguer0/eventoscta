const PORT = process.env.PORT || 3000; // aquí establezco el puerto
const ClaseExpress = require("express"); // aquí importo la biblioteca express
const cors = require("cors"); // Importa el paquete cors
const ServidorWeb = ClaseExpress(); // aquí instancio un obj a partir de la clase express


// Usar CORS en todas las rutas
ServidorWeb.use(cors());

ServidorWeb.use(ClaseExpress.static("frontend"));
ServidorWeb.use(ClaseExpress.json());
ServidorWeb.use(ClaseExpress.text());
ServidorWeb.use(ClaseExpress.urlencoded({ extended: false }));

const { Pool } = require("pg");

const ConexionDB = new Pool({
  host: "localhost",
  port: "5432",
  database: "eventoscta",
  user: "postgres",
  password: "123",
});

module.exports = { ConexionDB };

// EVENTO GET

ServidorWeb.post("/eventos/", async (req, res) => {
  // Agrega este console.log para ver los datos que estás recibiendo en el servidor
  console.log(req.body);

  const {
    titulo,
    descripcion,
    lugar,
    fechapublicacion,
    idtipo,
    horadesde,
    horahasta,
    linkevento,
    fechaevento,
    idusuario,
  } = req.body;

  let SQL =
    "insert into eventos (titulo, descripcion, lugar, fechapublicacion, idtipo, horadesde, horahasta, linkevento, fechaevento, idusuario) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning *";

  let Resultado = "";

  try {
    Resultado = await ConexionDB.query(SQL, [
      titulo,
      descripcion,
      lugar,
      fechapublicacion,
      idtipo,
      horadesde,
      horahasta,
      linkevento,
      fechaevento,
      idusuario,
    ]);

    Salida = {
      result_estado: "ok",
      result_message: "Insertado",
      result_rows: Resultado.rowCount,
      result_proceso: "POST",
      result_data: Resultado.rows[0],
    };
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_rows: 0,
      result_proceso: "POST",
      result_data: "",
    };
  }
  res.json(Salida);
});

// no se
// Supongamos que tienes una base de datos conectada y una función que obtiene eventos

//get evento

ServidorWeb.get("/eventos/:ID", async (req, res) => {
  const ID = req.params.ID;
  let SQL = "select * from eventos where idevento = $1";
  let Resultado = "";

  try {
    Resultado = await ConexionDB.query(SQL, [ID]);
    Salida = {
      result_estado: "ok",
      result_message: "usuario recuperado por ID",
      result_rows: Resultado.rowCount,
      result_proceso: "GET USUARIO POR ID",
      result_data: Resultado.rows[0],
    };
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_rows: 0,
      result_proceso: "GET USUARIO POR ID",
      result_data: "",
    };
  }
  res.json(Salida);
});

// USUARIO GET

ServidorWeb.get("/usuario1/:ID", async (req, res) => {
  const ID = req.params.ID;
  let SQL = "select * from usuario1 where idusuario = $1";
  let Resultado = "";

  try {
    Resultado = await ConexionDB.query(SQL, [ID]);
    Salida = {
      result_estado: "ok",
      result_message: "usuario recuperado por ID",
      result_rows: Resultado.rowCount,
      result_proceso: "GET USUARIO POR ID",
      result_data: Resultado.rows[0],
    };
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_rows: 0,
      result_proceso: "GET USUARIO POR ID",
      result_data: "",
    };
  }
  res.json(Salida);
});

// POST de usuario...

ServidorWeb.post("/usuario/", async (req, res) => {
  const { nombre, apellido, correo, alias, contrasena } = req.body;

  let SQL =
    "insert into usuario1 (nombre, apellido, correo, alias, contrasena) values ($1, $2, $3, $4, $5) returning *";

  let Resultado = "";

  try {
    Resultado = await ConexionDB.query(SQL, [
      nombre,
      apellido,
      correo,
      alias,
      contrasena,
    ]);

    Salida = {
      result_estado: "ok",
      result_message: "Insertado",
      result_rows: Resultado.rowCount,
      result_proceso: "POST",
      result_data: Resultado.rows[0],
    };
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_rows: 0,
      result_proceso: "POST",
      result_data: "",
    };
  }
  res.json(Salida);
});

// Endpoint para iniciar sesión
ServidorWeb.post("/login", async (req, res) => {
  const { alias, contrasena } = req.body;

  let SQL = "SELECT * FROM usuario1 WHERE alias = $1 AND contrasena = $2";

  let Salida = "";

  try {
    const Resultado = await ConexionDB.query(SQL, [alias, contrasena]);

    if (Resultado.rowCount > 0) {
      Salida = {
        result_estado: "ok",
        result_message: "Inicio de sesión exitoso",
        result_data: Resultado.rows[0],
      };
    } else {
      Salida = {
        result_estado: "error",
        result_message: "Alias o contraseña incorrectos",
        result_data: "",
      };
    }
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_data: "",
    };
  }
  res.json(Salida);
});

ServidorWeb.put("/eventos/", async (req, res) => {
  const {
    idevento,
    titulo,
    descripcion,
    lugar,
    fechapublicacion,
    idtipo,
    horadesde,
    horahasta,
    linkevento,
    fechaevento,
  } = req.body;

  const SQL = `UPDATE eventos 
                 SET titulo = $2, descripcion = $3, lugar = $4, fechapublicacion = $5, idtipo = $6, horadesde = $7, horahasta = $8, linkevento = $9, fechaevento = $10 
                 WHERE idevento = $1 
                 RETURNING *`;

  let Salida = "";

  let Resultado = "";

  try {
    Resultado = await ConexionDB.query(SQL, [
      idevento,
      titulo,
      descripcion,
      lugar,
      fechapublicacion,
      idtipo,
      horadesde,
      horahasta,
      linkevento,
      fechaevento,
    ]);

    Salida = {
      result_estado: "ok",
      result_message: "Actualizado",
      result_rows: Resultado.rowCount,
      result_proceso: "PUT",
      result_data: Resultado.rows[0],
    };
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_rows: 0,
      result_proceso: "PUT",
      result_data: "",
    };
  }
  res.json(Salida);
});

ServidorWeb.delete("/eventos/:id", async (req, res) => {
  const { id } = req.params;

  const SQL = `DELETE FROM eventos WHERE idevento = $1 RETURNING *`;

  try {
    const resultado = await ConexionDB.query(SQL, [id]);

    if (resultado.rowCount > 0) {
      res.json({
        result_estado: "ok",
        result_message: "Evento eliminado correctamente",
        result_data: resultado.rows[0],
      });
    } else {
      res.json({
        result_estado: "error",
        result_message: "No se encontró el evento con ese ID",
      });
    }
  } catch (error) {
    res.json({
      result_estado: "error",
      result_message: error.message,
    });
  }
});



ServidorWeb.post("/enviar-codigo", async (req, res) => {
    try {
      const { idusuario, correo } = req.body;
  
      // Generar el código de verificación y definir la expiración
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 15); // Expira en 15 minutos
  
      // Actualizar en la base de datos
      await connection.query(
        "UPDATE Usuarios SET CodigoVerificacion = ?, ExpiracionCodigo = ? WHERE ID = ?",
        [verificationCode, expiration, idusuario]
      );
  
      // Configuración de Mailjet
      const mailjet = require("node-mailjet").connect("API_KEY", "API_SECRET");
  
      // Envía el código por email
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: { Email: "tucorreo@gmail.com", Name: "Tu App" },
            To: [{ Email: correo }],
            Subject: "Código de verificación",
            TextPart: `Tu código de verificación es ${verificationCode}. Expira en 15 minutos.`,
          },
        ],
      });
  
      // Responder si todo está bien
      res.status(200).json({ message: "Código de verificación enviado." });
    } catch (error) {
        console.error("Error al enviar el código de verificación:", error);
        res.status(500).json({ message: "Error al enviar el código de verificación.", error: error.message });
    }
  });


 

// Endpoint para iniciar sesión
ServidorWeb.post("/login/admin", async (req, res) => {
  const { correo, contrasena } = req.body;

  let SQL = "SELECT * FROM administrador WHERE correo = $1 AND contrasena = $2";

  let Salida = "";

  try {
    const Resultado = await ConexionDB.query(SQL, [correo, contrasena]);

    if (Resultado.rowCount > 0) {
      Salida = {
        result_estado: "ok",
        result_message: "Inicio de sesión exitoso",
        result_data: Resultado.rows[0],
      };
    } else {
      Salida = {
        result_estado: "error",
        result_message: "Alias o contraseña incorrectos",
        result_data: "",
      };
    }
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_data: "",
    };
  }
  res.json(Salida);
});


// Endpoint para obtener usuarios
ServidorWeb.get("/usuarios", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const SQL = "SELECT idusuario, nombre, apellido, correo, alias FROM usuario1 LIMIT $1 OFFSET $2";
  try {
    const Resultado = await ConexionDB.query(SQL, [limit, offset]);
    const countResult = await ConexionDB.query("SELECT COUNT(*) FROM usuario1");
    const totalUsuarios = parseInt(countResult.rows[0].count);

    res.json({
      result_estado: "ok",
      result_message: "Usuarios obtenidos",
      result_data: Resultado.rows,
      totalUsuarios,
      totalPages: Math.ceil(totalUsuarios / limit),
    });
  } catch (error) {
    res.json({
      result_estado: "error",
      result_message: error.message,
      result_data: [],
    });
  }
});


// Endpoint para obtener usuarios
ServidorWeb.get("/eventos", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const SQL = "SELECT idevento, titulo, descripcion, lugar, fechapublicacion, idtipo, horadesde, horahasta, linkevento, fechaevento,idusuario FROM eventos LIMIT $1 OFFSET $2";
  try {
    const Resultado = await ConexionDB.query(SQL, [limit, offset]);
    const countResult = await ConexionDB.query("SELECT COUNT(*) FROM eventos");
    const totalUsuarios = parseInt(countResult.rows[0].count);

    res.json({
      result_estado: "ok",
      result_message: "Usuarios obtenidos",
      result_data: Resultado.rows,
      totalUsuarios,
      totalPages: Math.ceil(totalUsuarios / limit),
    });
  } catch (error) {
    res.json({
      result_estado: "error",
      result_message: error.message,
      result_data: [],
    });
  }
});









ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});
