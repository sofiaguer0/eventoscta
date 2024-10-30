const btnGuardarCambios = document.querySelector("#btnGuardarCambios"); // me vinculo con el boton Guardar Cambios 

let clientetipoParaActualizar = txttipo.value; // Captura el idtipo seleccionado

const successModal = document.getElementById("successModal");


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
    
    


    let idusuario = localStorage.getItem('idusuario'); // Obtener el ID del usuario autenticado

    let evento = {
        titulo: txttitulo.value,
        descripcion: txtdescripcion.value,
        lugar: txtlugar.value,
        fechapublicacion: txtfechapublicacion.value,
        idtipo: txttipo.value,
        horadesde: txthoradesde.value,
        horahasta: txthorahasta.value,
        linkevento: txtlinkevento.value,
        fechaevento: txtfecha.value,
        idusuario: idusuario // Asegúrate de incluir el idusuario
    };
    /* Previo a Insertar / actualizar se debería verificar que el CUIT sea válido, que el nombre no esté vacio, etc */

    if (parseInt(clienteidParaActualizar) === 0) // por el Lado verdadero intento INSERTAR REGISTRO NUEVO
    {

        await fnActualizarCliente(JSON.stringify(evento), 'POST');

        Swal.fire({
            icon: 'success',
            title: 'Evento creado con éxito',
            text: 'Su evento ha sido creado, se le notificará cuando sea aprobado.',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.replace('miseventos.html');
        });



    }
    else // por el Lado Falso MODIFICO UN REGISTRO EXISTENTE
    {
        await fnActualizarCliente(JSON.stringify(evento), 'PUT');
        //alert("modificando uno existente");
    }
}) 


 

const fnActualizarCliente = async (clienteEnFormatoJSON, VerboHTTP) => {

    try {
        let URLEndPoint = `http://localhost:3000/eventos/`; // Apunto al End Point Correspondiente

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
        console.log(Datos); // Agrega el console.log para ver los datos recibidos


        if (Datos.result_estado === 'ok') // Si todo salió bien
        {               


            if (Datos.result_rows > 0) // Si devolvió mas de un registro
            {       
                fnActualizarCliente(Datos.result_data); // muestro el cliente completo invocando a la función correspondiente y pasandole como parametro el cliente 

            }


        }
        else {
          //  alert(`Se produjo un error en el BACK END: => ${Datos.result_message}`); // Si detecto que hubo un error en el BACK END muestro el error
        }
    }
    catch (error) {
      //  alert(`Se produjo un error en el FRONT END: => ${error.message}`); // Si se produjo un error en el FRONTEND lo muestro
    }
}

function showModal() {
    document.getElementById("successModal").style.display = "flex";
  }

  function closeModal() {
    document.getElementById("successModal").style.display = "none";
  }
 