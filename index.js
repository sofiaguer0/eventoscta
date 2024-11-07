const PORT = process.env.PORT || 3000; // aquí establezco el puerto
const ClaseExpress = require("express"); // aquí importo la biblioteca express
const cors = require("cors"); // Importa el paquete cors
const ServidorWeb = ClaseExpress(); // aquí instancio un obj a partir de la clase express
const multer = require('multer'); // Agregamos multer
const path = require('path'); // Agregamos path
const fs = require('fs'); // Agregamos fs

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadDir = 'public/uploads/eventos';
      // Crear el directorio si no existe
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      // Generar nombre único para el archivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `evento-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configurar filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
      cb(null, true);
  } else {
      cb(new Error('El archivo debe ser una imagen'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});




// Usar CORS en todas las rutas
ServidorWeb.use(cors());

ServidorWeb.use(ClaseExpress.static("frontend"));
ServidorWeb.use(ClaseExpress.json());
ServidorWeb.use(ClaseExpress.text());
ServidorWeb.use(ClaseExpress.urlencoded({ extended: false }));
ServidorWeb.use(ClaseExpress.static("public")); // Agregar esta línea para servir archivos estáticos


const { Pool } = require("pg");

const ConexionDB = new Pool({
  host: "localhost",
  port: "5432",
  database: "eventoscta",
  user: "postgres",
  password: "123",
});

module.exports = { ConexionDB };



ServidorWeb.post("/upload-imagen", upload.single('imagen'), (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ 
              result_estado: "error",
              result_message: "No se subió ningún archivo",
          });
      }
      
      // Devolver solo el nombre del archivo
      const imagePath = `/uploads/eventos/${req.file.filename}`;
      console.log('Ruta de imagen guardada:', imagePath); // Debug

      res.json({ 
          result_estado: "ok",
          result_message: "Imagen subida exitosamente",
          imagePath: imagePath 
      });
  } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({ 
          result_estado: "error",
          result_message: "Error al procesar la imagen" 
      });
  }
});
// EVENTO GET
// POST - Crear evento
ServidorWeb.post("/eventos/", async (req, res) => {
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
        imagen_path,
        estado = 'PENDIENTE',
    } = req.body;

    let SQL =
        "INSERT INTO eventos (titulo, descripcion, lugar, fechapublicacion, idtipo, horadesde, horahasta, linkevento, fechaevento, idusuario, estado, imagen_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";

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
            estado,
            imagen_path
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
  let SQL = "SELECT *, (SELECT descripcion FROM tipoevento1 WHERE idtipo = eventos.idtipo) as tipoevento1 FROM eventos WHERE idevento = $1";
  let Resultado = "";

  try {
    Resultado = await ConexionDB.query(SQL, [ID]);
    Salida = {
      result_estado: "ok",
      result_message: "Evento recuperado por ID",
      result_rows: Resultado.rowCount,
      result_proceso: "GET EVENTO POR ID",
      result_data: Resultado.rows[0],
    };
  } catch (error) {
    Salida = {
      result_estado: "error",
      result_message: error.message,
      result_rows: 0,
      result_proceso: "GET EVENTO POR ID",
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

ServidorWeb.get('/eventos/usuario/:idusuario', async (req, res) => {
  const { idusuario } = req.params;

  try {
      const query = 'SELECT * FROM eventos WHERE idusuario = $1 ORDER BY fechaevento DESC';
      const resultado = await ConexionDB.query(query, [idusuario]);

      res.json({ result_estado: 'ok', result_data: resultado.rows });
  } catch (error) {
      console.error("Error en la consulta:", error);
      res.status(500).json({
          result_estado: 'error',
          result_message: 'Error en la base de datos'
      });
  }
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
// GET - Obtener todos los eventos con paginación
ServidorWeb.get("/eventos", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const SQL = `
    SELECT 
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
      idusuario,
      estado
    FROM eventos
    ORDER BY fechaevento ASC
    LIMIT $1 OFFSET $2
  `;
  
  try {
    const Resultado = await ConexionDB.query(SQL, [limit, offset]);
    const countResult = await ConexionDB.query("SELECT COUNT(*) FROM eventos");
    const totalEventos = parseInt(countResult.rows[0].count);

    res.json({
      result_estado: "ok",
      result_message: "Eventos obtenidos",
      result_data: Resultado.rows,
      totalEventos,
      totalPages: Math.ceil(totalEventos / limit),
    });
  } catch (error) {
    res.json({
      result_estado: "error",
      result_message: error.message,
      result_data: [],
    });
  }
});

ServidorWeb.put("/eventos/:ID/estado", async (req, res) => {
  try {
      const ID = req.params.ID;
      const { estado } = req.body;

      // Validar que el estado sea válido
      const estadosValidos = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];
      if (!estadosValidos.includes(estado)) {
          return res.json({
              result_estado: "error",
              result_message: "Estado no válido",
              result_rows: 0,
              result_proceso: "PUT ESTADO EVENTO",
              result_data: "",
          });
      }

      // Actualizar el estado en la base de datos
      const resultUpdate = await ConexionDB.query(
          "UPDATE eventos SET estado = $1 WHERE idevento = $2 RETURNING *",
          [estado, ID]
      );

      // Verificar si se actualizó el evento
      if (resultUpdate.rowCount === 0) {
          return res.json({
              result_estado: "error",
              result_message: "No se encontró el evento",
              result_rows: 0,
              result_proceso: "PUT ESTADO EVENTO",
              result_data: "",
          });
      }

      // Obtener el evento actualizado
      const resultEvento = await ConexionDB.query(
          "SELECT * FROM eventos WHERE idevento = $1 LIMIT 1",
          [ID]
      );

      const eventoActualizado = resultEvento.rows[0];

      res.json({
          result_estado: "ok",
          result_message: "Estado actualizado correctamente",
          result_rows: resultUpdate.rowCount,
          result_proceso: "PUT ESTADO EVENTO",
          result_data: eventoActualizado
      });

  } catch (error) {
      console.error("Error en la actualización:", error);
      res.json({
          result_estado: "error",
          result_message: error.message,
          result_rows: 0,
          result_proceso: "PUT ESTADO EVENTO",
          result_data: "",
      });
  }
});

ServidorWeb.use('/uploads', ClaseExpress.static(path.join(__dirname, 'public/uploads')));

// Ruta para obtener eventos aprobados
ServidorWeb.get('/eventos/aprobados', async (req, res) => {
  try {
      const result = await ConexionDB.query(
          'SELECT * FROM eventos WHERE estado = $1 ORDER BY fechaevento DESC',
          ['APROBADO']
      );
      
      res.json({
          result_estado: "ok",
          result_data: result.rows
      });
  } catch (error) {
      console.error('Error al obtener eventos:', error);
      res.status(500).json({
          result_estado: "error",
          result_message: "Error al obtener eventos"
      });
  }
});



ServidorWeb.post('/notificaciones', async (req, res) => {
  try {
      const { idusuario, idevento, fecha_notificacion, tipo, mensaje } = req.body;
      const result = await pool.query(
          `INSERT INTO notificaciones (idusuario, idevento, fecha_notificacion, tipo, mensaje) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [idusuario, idevento, fecha_notificacion, tipo, mensaje]
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la notificación' });
  }
});

// Obtener todas las notificaciones de un usuario
ServidorWeb.get('/notificaciones/:idusuario', async (req, res) => {
  try {
      const { idusuario } = req.params;
      const result = await pool.query(
          `SELECT * FROM notificaciones WHERE idusuario = $1`,
          [idusuario]
      );
      res.status(200).json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// Eliminar una notificación específica
ServidorWeb.delete('/notificaciones/:idnoti', async (req, res) => {
  try {
      const { idnoti } = req.params;
      await pool.query(`DELETE FROM notificaciones WHERE idnoti = $1`, [idnoti]);
      res.status(200).json({ message: 'Notificación eliminada' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
});








ServidorWeb.listen(PORT, () => {
  console.log("Application is running on port", PORT);
});
