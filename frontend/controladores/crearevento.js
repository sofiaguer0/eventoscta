const btnGuardarCambios = document.querySelector("#btnGuardarCambios"); // me vinculo con el boton Guardar Cambios 



btnGuardarCambios.addEventListener("click", async () => {
    let clienteidParaActualizar = txtIdevento.value; // saco el ID de la caja de texto
    let clientetituloParaActualizar = txttitulo.value; // saco el CUIT de la caja de texto
    let clientedescripcionParaActualizar = txtdescripcion.value; // saco el NOMBRE de la caja de texto
    let clientelugarParaActualizar = txtlugar.value;
    let clientefechapublicacionParaActualizar = txtfechapublicacion.value; // saco el NOMBRE de la caja de texto
    let clientetipoParaActualizar = txttipo.value;
    let clientehoradesdeParaActualizar = txthoradesde.value;
    let clientehorahastaParaActualizar = txthorahasta.value;
    let clientelinkeventoParaActualizar = txtlinkevento.value;
    let clientefechaParaActualizar = txtfecha.value;

    /* aqui armo un objeto literal */
    let clienteParaActualizar = {
        titulo: clientetituloParaActualizar,
        descripcion: clientedescripcionParaActualizar,
        lugar: clientelugarParaActualizar,
        fechapublicacion: clientefechapublicacionParaActualizar,
        idtipo: clientetipoParaActualizar,
        horadesde: clientehoradesdeParaActualizar,
        horahasta: clientehorahastaParaActualizar,
        linkevento: clientelinkeventoParaActualizar,
        fechaevento: clientefechaParaActualizar
    };

    /* Previo a Insertar / actualizar se debería verificar que el CUIT sea válido, que el nombre no esté vacio, etc */

    if (parseInt(clienteidParaActualizar) === 0) // por el Lado verdadero intento INSERTAR REGISTRO NUEVO
    {
        await fnActualizarCliente(JSON.stringify(clienteParaActualizar), 'POST');
        alert("insertando uno nuevo");
    }
    else // por el Lado Falso MODIFICO UN REGISTRO EXISTENTE
    {
        await fnActualizarCliente(JSON.stringify(clienteParaActualizar), 'PUT');
        alert("modificando uno existente");
    }
}) 




const fnActualizarCliente = async (clienteEnFormatoJSON, VerboHTTP) => {

    try {
        let URLEndPoint = `http://localhost:3000/evento`; // Apunto al End Point Correspondiente

        /* Creo las Opciones del Fetch */
        const OpcionesDelFetch = {
            method: VerboHTTP, // le indico el verbo // debe llevar la palabra POST ó PUT
            headers: {
                'Content-Type': 'application/json', // En la cabecera le digo que recibirá datos en formato JSON
            },
            body: clienteEnFormatoJSON, // En el cuerpo del mensaje envío el Cliente en formato JSON
        };

        let Resultado = await fetch(URLEndPoint, OpcionesDelFetch); // hago el fetch y le digo que espere a terminar y que devuelva los datos y lo guarde en Resultado

        let Datos = await Resultado.json(); // Convierto el Resultado a formato JSON

        if (Datos.result_estado === 'ok') // Si todo salió bien
        {
            if (Datos.result_rows > 0) // Si devolvió mas de un registro
            {
                fnActualizarCliente(Datos.result_data); // muestro el cliente completo invocando a la función correspondiente y pasandole como parametro el cliente        
            }
        }
        else {
            alert(`Se produjo un error en el BACK END: => ${Datos.result_message}`); // Si detecto que hubo un error en el BACK END muestro el error
        }
    }
    catch (error) {
        alert(`Se produjo un error en el FRONT END: => ${error.message}`); // Si se produjo un error en el FRONTEND lo muestro
    }
}