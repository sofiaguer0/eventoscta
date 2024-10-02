const PORT = 3000; // aquí establezco el puerto
const ClaseExpress = require("express"); // aquí importo la biblioteca express
const cors = require('cors'); // Importa el paquete cors
const ServidorWeb = ClaseExpress(); // aquí instancio un obj a partir de la clase express

// Usar CORS en todas las rutas
ServidorWeb.use(cors());

ServidorWeb.use(ClaseExpress.static("frontend"));
ServidorWeb.use(ClaseExpress.json());
ServidorWeb.use(ClaseExpress.text());
ServidorWeb.use(ClaseExpress.urlencoded({ extended: false }));

const { Pool } = require("pg");

const ConexionDB = new Pool(
    {
        host: 'localhost',
        port: '5432',
        database: 'eventoscta',
        user: 'postgres',
        password: '123'
    }
);

module.exports = { ConexionDB };

// USUARIO GET

ServidorWeb.get("/usuario1/:ID", async (req, res) => {
    const ID = req.params.ID;
    let SQL = 'select * from usuario1 where idusuario = $1';
    let Resultado = '';

    try {
        Resultado = await ConexionDB.query(SQL, [ID]);
        Salida =
        {
            result_estado: 'ok',
            result_message: 'usuario recuperado por ID',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET USUARIO POR ID',
            result_data: Resultado.rows[0]
        }

    } catch (error) {
        Salida =
        {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET USUARIO POR ID',
            result_data: ''
        }
    }
    res.json(Salida);
});

// Otros GET de usuario...

ServidorWeb.post("/usuario1/", async (req, res) => {
    const { nombre, apellido, correo, alias, contrasena } = req.body;

    let SQL = 'insert into usuario1 (nombre, apellido, correo, alias, contrasena) values ($1, $2, $3, $4, $5) returning *';

    let Resultado = '';

    try {
        Resultado = await ConexionDB.query(SQL, [nombre, apellido, correo, alias, contrasena]);

        Salida =
        {
            result_estado: 'ok',
            result_message: 'Insertado',
            result_rows: Resultado.rowCount,
            result_proceso: 'POST',
            result_data: Resultado.rows[0]
        }

    } catch (error) {
        Salida =
        {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'POST',
            result_data: ''
        }
    }
    res.json(Salida);
});

// Endpoint para iniciar sesión
ServidorWeb.post("/login", async (req, res) => {
    const { alias, contrasena } = req.body;

    let SQL = 'SELECT * FROM usuario1 WHERE alias = $1 AND contrasena = $2';

    let Salida = '';

    try {
        const Resultado = await ConexionDB.query(SQL, [alias, contrasena]);

        if (Resultado.rowCount > 0) {
            Salida = {
                result_estado: 'ok',
                result_message: 'Inicio de sesión exitoso',
                result_data: Resultado.rows[0]
            };
        } else {
            Salida = {
                result_estado: 'error',
                result_message: 'Alias o contraseña incorrectos',
                result_data: ''
            };
        }
    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_data: ''
        };
    }
    res.json(Salida);
});



ServidorWeb.listen(PORT, () => {
    console.log("Application is running on port", PORT);
});
