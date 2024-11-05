document.getElementById('volver-dashboard').addEventListener('click', function() {
    window.location.href = 'dashboard.html'; // Cambia 'dashboard.html' por el nombre correcto de tu archivo del dashboard
});

const cargarUsuarios = async (pagina = 1) => {
    try {
        const respuesta = await fetch(`http://localhost:3000/usuarios?page=${pagina}&limit=10`);
        const datos = await respuesta.json();

        if (datos.result_estado === "ok") {
            const usuarios = datos.result_data;
            const tbody = document.getElementById("usuarios-tbody");
            tbody.innerHTML = "";  // Limpiar la tabla antes de cargar la nueva página

            usuarios.forEach((usuario) => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${usuario.idusuario}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.alias}</td>
                    <td>
                        <button class="editar" onclick="editarUsuario(${usuario.idusuario})">Editar</button>
                        <button class="eliminar" onclick="eliminarUsuario(${usuario.idusuario})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila);
            });

            // Actualizar la paginación
            mostrarPaginacion(datos.totalPages, pagina);
        } else {
            alert("Error al cargar usuarios: " + datos.result_message);
        }
    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
};

const mostrarPaginacion = (totalPages, paginaActual) => {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const prevLi = document.createElement("li");
    prevLi.className = "page-item";
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.onclick = () => {
        if (paginaActual > 1) cargarUsuarios(paginaActual - 1);
    };
    pagination.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === paginaActual ? "active" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.onclick = () => cargarUsuarios(i);
        pagination.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = "page-item";
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.onclick = () => {
        if (paginaActual < totalPages) cargarUsuarios(paginaActual + 1);
    };
    pagination.appendChild(nextLi);
};

function editarUsuario(idusuario) {
    alert(`Función de edición para el usuario con ID: ${idusuario}`);
}

async function eliminarUsuario(idusuario) {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            const respuesta = await fetch(`http://localhost:3000/usuario/${idusuario}`, {
                method: "DELETE",
            });
            const datos = await respuesta.json();

            if (datos.result_estado === "ok") {
                alert("Usuario eliminado correctamente");
                cargarUsuarios();  // Recargar la tabla después de eliminar el usuario
            } else {
                alert("Error al eliminar usuario: " + datos.result_message);
            }
        } catch (error) {
            alert("Error de conexión: " + error.message);
        }
    }
}

// Llamar a la función para cargar usuarios al iniciar la página
document.addEventListener("DOMContentLoaded", () => cargarUsuarios());