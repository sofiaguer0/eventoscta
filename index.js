const PORT = 3000; // aqui establezco el puerto
const ClaseExpress = require("express"); // aqui importo la biblioteca express
const ServidorWeb = ClaseExpress(); // aqui instancio un obj a partir de la clase express


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
    })

module.exports = { ConexionDB };



//USUARIO GET


ServidorWeb.get("/usuario/:ID", async (req, res) => {
    const ID = req.params.ID;
    let SQL = 'select * from usuario where idusuario = $1';
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
})

ServidorWeb.get("/usuarionombre/", async (req, res) => {
    const nombre = req.query.nombre; // Obtener el parámetro nombre de la solicitud GET
    let SQL = 'SELECT * FROM usuario WHERE nombre LIKE $1 LIMIT 100';

    let Salida = ''; // Declara la variable Salida aquí para evitar errores de referencia

    try {
        const Resultado = await ConexionDB.query(SQL, [`%${nombre}%`]); // Usar nombre como parámetro en la consulta SQL

        Salida = {
            result_estado: 'ok',
            result_message: 'nombre recuperado :)',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET USUARIO POR NOMBRE',
            result_data: Resultado.rows
        }

    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET USUARIO POR NOMBRE',
            result_data: ''
        }
    }
    res.json(Salida);
});

ServidorWeb.get("/usuarioapellido/", async (req, res) => {
    const apellido = req.query.apellido; // Obtener el ap nombre de la solicitud GET
    let SQL = 'SELECT * FROM usuario WHERE apellido LIKE $1 LIMIT 100';

    let Salida = ''; // Declara la variable Salida aquí para evitar errores de referencia

    try {
        const Resultado = await ConexionDB.query(SQL, [`%${apellido}%`]); // Usar ap como parámetro en la consulta SQL

        Salida = {
            result_estado: 'ok',
            result_message: 'apellido recuperado :)',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET USUARIO POR APELLIDO',
            result_data: Resultado.rows
        }

    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET USUARIO POR NOMBRE',
            result_data: ''
        }
    }
    res.json(Salida);
});

ServidorWeb.get("/usuariocorreo/", async (req, res) => {
    const nombre = req.query.nombre; // Obtener el parámetro nombre de la solicitud GET
    let SQL = 'SELECT * FROM usuario WHERE correo LIKE $1 LIMIT 100';

    let Salida = ''; // Declara la variable Salida aquí para evitar errores de referencia

    try {
        const Resultado = await ConexionDB.query(SQL, [`%${nombre}%`]); // Usar nombre como parámetro en la consulta SQL

        Salida = {
            result_estado: 'ok',
            result_message: 'correo recuperado :)',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET correo ',
            result_data: Resultado.rows
        }

    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET correo ',
            result_data: ''
        }
    }
    res.json(Salida);
});

ServidorWeb.get("/usuarioalias/", async (req, res) => {
    const nombre = req.query.nombre; // Obtener el parámetro nombre de la solicitud GET
    let SQL = 'SELECT * FROM usuario WHERE alias LIKE $1 LIMIT 100';

    let Salida = ''; // Declara la variable Salida aquí para evitar errores de referencia

    try {
        const Resultado = await ConexionDB.query(SQL, [`%${nombre}%`]); // Usar nombre como parámetro en la consulta SQL

        Salida = {
            result_estado: 'ok',
            result_message: 'alias recuperado :)',
            result_rows: Resultado.rowCount,
            result_proceso: 'GET USUARIO POR alias',
            result_data: Resultado.rows
        }

    } catch (error) {
        Salida = {
            result_estado: 'error',
            result_message: error.message,
            result_rows: 0,
            result_proceso: 'GET USUARIO POR alias',
            result_data: ''
        }
    }
    res.json(Salida);
});

///////////////////////////////////////////////////////////7
//POST USUARIO//////////////////////77///////////////////////


ServidorWeb.post("/usuario/",async(req,res)=>
    {
        const {nombre,apellido,correo,alias,contrasena} = req.body;
    
        let SQL = 'insert into usuario (nombre,apellido,correo,alias,contrasena) values ($1,$2,$3,$4,$5) returning *';
    
        let Resultado = '';
    
        try {
            
            Resultado = await ConexionDB.query(SQL,[nombre,apellido,correo,alias,contrasena]);
    
            Salida = 
            {
                result_estado:'ok',
                result_message:'Insertado',
                result_rows:Resultado.rowCount,
                result_proceso:'POST',
                result_data:Resultado.rows[0]
            }          
    
        } catch (error) 
        {
            Salida = 
            {
                result_estado:'error',
                result_message:error.message,
                result_rows:0,
                result_proceso:'POSt',
                result_data:''
            }        
        }
        res.json(Salida);
    })
    








ServidorWeb.listen(PORT, () => {
    console.log("aplication is running");
})
