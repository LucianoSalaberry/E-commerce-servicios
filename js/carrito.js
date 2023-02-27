//saber si hay algo en el carrito//
//traigo la info del local storage//
let serviciosEnCarrito = localStorage.getItem("servicios-en-carrito");
serviciosEnCarrito = JSON.parse(serviciosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoServicios = document.querySelector("#carrito-servicios");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-servicio-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const carritoTotal = document.querySelector("#carrito-total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

//si el localStorage esta vacío se devuelve null, no error, enconces puedo usar un if() sin condiciones//

function cargarServiciosCarrito() {
  if (serviciosEnCarrito && serviciosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoServicios.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoServicios.innerHTML = "";

    serviciosEnCarrito.forEach((servicio) => {
      const div = document.createElement("div");
      div.classList.add("carrito-servicio");
      div.innerHTML = `
             <img class="carrito-servicio-imagen" src="${
               servicio.imagen
             }" alt="${servicio.titulo}">
             <div class="carrito-titulo">
               
                <h3>${servicio.titulo}</h3>
             </div>
             <div class="carrito-servicio-cantidad">
                 <small>Cantidad</small>
                 <p>${servicio.cantidad}</p>
             </div>
             <div class="carrito-servicio-precio">
                         <small>Precio</small>
                         <p>$${servicio.precio}</p>
            </div>
            <div class="carrito-servicio-subtotal">
                        <small>Subtotal</small>
                        <p>$${servicio.precio * servicio.cantidad}</p>
            </div>
            <button class="carrito-servicio-eliminar" id = "${
              servicio.id
            }">Descartar</button>
          `;
      contenedorCarritoServicios.append(div);
    });
  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoServicios.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
  actualizarBotonesEliminar();
  actualizarTotal();
}

cargarServiciosCarrito();

//a borrar productos//

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-servicio-eliminar");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}
//los botonesEliminar tambien son dinámicos, porque se generan con el innerHTML (por eso la variable botonesEliminar es let y no const), es decir que los botones eliminar se reasignan cada vez que se ejecuta la el if que tiene el .forEach
function eliminarDelCarrito(e) {
  Toastify({
    text: "Servicio eliminado",
    duration: 1000,
    gravity: "top",
    position: "center",
    style: {
      background: "red",
      borderRadius: "2rem",
    },
  }).showToast();

  const idBoton = e.currentTarget.id;
  const index = serviciosEnCarrito.findIndex(
    (servicio) => servicio.id === idBoton
  );
  serviciosEnCarrito.splice(index, 1);

  cargarServiciosCarrito();

  localStorage.setItem(
    "servicios-en-carrito",
    JSON.stringify(serviciosEnCarrito)
  );
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
  Swal.fire({
    title: "Está seguro?",
    text: "Esta acción no puede ser revertida.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      serviciosEnCarrito.length = 0;
      localStorage.setItem(
        "servicios-en-carrito",
        JSON.stringify(serviciosEnCarrito)
      );
      cargarServiciosCarrito();
      Swal.fire("Compra cancelada", "El carrito está vacío.", "success");
    }
  });
}

function actualizarTotal() {
  const precioTotal = serviciosEnCarrito.reduce(
    (acc, servicio) => acc + servicio.precio * servicio.cantidad,
    0
  );
  carritoTotal.innerText = `TOTAL   $${precioTotal}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
  serviciosEnCarrito.length = 0;
  localStorage.setItem(
    "servicios-en-carrito",
    JSON.stringify(serviciosEnCarrito)
  );
  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoServicios.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}
