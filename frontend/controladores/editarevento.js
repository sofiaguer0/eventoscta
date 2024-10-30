document.addEventListener("DOMContentLoaded", async () => {
  // ID del evento que quieres cargar al iniciar la página
  const idevento = 82;

  // Llamamos a la función que carga el evento por su ID
  await fnCargarEvento(idevento);
});

const fnCargarEvento = async (idevento) => {
  try {
    // Hacemos una petición GET al servidor, enviando el id del evento
    const response = await fetch(`http://localhost:3000/eventos/${idevento}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Convertimos la respuesta a formato JSON
    const evento = await response.json();

    // Verificamos si la respuesta contiene datos válidos
    if (evento.result_estado === "ok") {
      fnMostrarProducto(evento.result_data); // Llamamos a la función para mostrar los datos en el formulario
    } else {
      alert(`Error al cargar el evento: ${evento.result_message}`);
    }
  } catch (error) {
    alert(`Se produjo un error en la carga del evento: ${error.message}`);
  }
};
const fnMostrarProducto = (eventos) => {
  txtIdevento.value = eventos.idevento;
  txttitulo.value = eventos.titulo;
  txtdescripcion.value = eventos.descripcion;
  txtlugar.value = eventos.lugar;

  // Convertimos la fecha de publicación a formato YYYY-MM-DD
  txtfechapublicacion.value = convertirFechaISO(eventos.fechapublicacion);

  txttipo.value = eventos.idtipo;
  txthoradesde.value = eventos.horadesde;
  txthorahasta.value = eventos.horahasta;
  txtlinkevento.value = eventos.linkevento;

  // Convertimos la fecha del evento a formato YYYY-MM-DD
  txtfecha.value = convertirFechaISO(eventos.fechaevento);
};

// Esta función convierte una fecha en formato ISO a YYYY-MM-DD
const convertirFechaISO = (fechaISO) => {
  if (!fechaISO) return ""; // Si no hay fecha, devolvemos cadena vacía
  const fecha = new Date(fechaISO); // Creamos una instancia de Date
  const anio = fecha.getFullYear(); // Obtenemos el año
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Obtenemos el mes (agregamos 1 porque los meses van de 0 a 11)
  const dia = String(fecha.getDate()).padStart(2, "0"); // Obtenemos el día

  return `${anio}-${mes}-${dia}`; // Retornamos en formato YYYY-MM-DD
};

const btnGuardarCambios = document.querySelector("#btnGuardarCambios"); // me vinculo con el boton Guardar Cambios

btnGuardarCambios.addEventListener("click", async () => {
  let idactualizar = txtIdevento.value; // Obtener el ID del evento
  console.log("ID del evento a actualizar:", idactualizar); // Verifica que no sea undefined

  let acttitulo = txttitulo.value;
  let actdescripcion = txtdescripcion.value;
  let actlugar = txtlugar.value;
  let actfechapublicacion = txtfechapublicacion.value;
  let acttipo = txttipo.value;
  let acthoradesde = txthoradesde.value;
  let acthorahasta = txthorahasta.value;
  let actlinkevento = txtlinkevento.value;
  let actfecha = txtfecha.value;

  let eventoactualizar = {
    idevento: idactualizar,
    titulo: acttitulo,
    descripcion: actdescripcion,
    lugar: actlugar,
    fechapublicacion: actfechapublicacion,
    idtipo: acttipo,
    horadesde: acthoradesde,
    horahasta: acthorahasta,
    linkevento: actlinkevento,
    fechaevento: actfecha,
  };

  console.log("Objeto evento a actualizar:", eventoactualizar); // Verifica que el objeto esté bien formado

  if (parseInt(idactualizar) === 0) {
    await fnActualizarCliente(JSON.stringify(eventoactualizar), "POST");
    Swal.fire({
        icon: 'success',
        title: 'Evento Creado con éxito',
        confirmButtonText: 'OK'
    }).then(() => {
        window.location.href = 'miseventos.html';
    });
} else {
    await fnActualizarCliente(JSON.stringify(eventoactualizar), "PUT");
    Swal.fire({
        icon: 'success',
        title: 'Evento modificado con éxito',
        confirmButtonText: 'OK'
    }).then(() => {
        window.location.href = 'miseventos.html';
    });
}
});

// Insertar o actualizar artículo
const fnActualizarCliente = async (articuloEnFormatoJSON, verboHTTP) => {
  try {
    let URLEndPoint = `http://localhost:3000/eventos/`;
    const opcionesDelFetch = {
      method: verboHTTP,
      headers: {
        "Content-Type": "application/json",
      },
      body: articuloEnFormatoJSON,
    };

    let resultado = await fetch(URLEndPoint, opcionesDelFetch);
    console.log("paso");
    let datos = await resultado.json();

    if (datos.result_estado === "ok") {
      if (datos.result_rows > 0) {
        fnMostrarProducto(datos.result_data);
      }
    } else {
      alert(`Se produjo un error en el BACK END: ${datos.result_message}`);
    }
  } catch (error) {
    alert(`Se produjo un error en el FRONT END: ${error.message}`);
  }
};
