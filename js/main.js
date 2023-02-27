let servicios = [];
//la ruta se pone como si estuvisiemos paradoos en la carpeta raíz.
fetch("./js/servicios.json")
  .then((response) => response.json())
  .then((data) => {
    servicios = data;
    cargarServicios(servicios);
  });

//variables//
const contenedorServicios = document.querySelector("#contenedor-servicios");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".servicio-agregar");
const cantidad = document.querySelector("#cantidad");

function cargarServicios(serviciosElegidos) {
  contenedorServicios.innerHTML = "";
  serviciosElegidos.forEach((servicio) => {
    const div = document.createElement("div");
    div.classList.add("servicio");
    div.innerHTML = `
        <img class="servicio-imagen"
              src="${servicio.imagen}"
              alt="${servicio.titulo}"
            />
            <div class="servicio-detalle">
              <h3 class="servicio-titulo">${servicio.titulo}</h3>
              <p class="servicio-precio">$${servicio.precio}</p>
              <button class="servicio-agregar" id="${servicio.id}">Contratar</button>
            </div>`;
    contenedorServicios.append(div);
  });
  actualizarBotonesAgregar();
}
cargarServicios(servicios);

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id != "todos") {
      const tituloPrincipalCategoria = servicios.find(
        (servicio) => servicio.categoria === e.currentTarget.id
      );
      tituloPrincipal.innerText = tituloPrincipalCategoria.categoria;

      const serviciosBoton = servicios.filter(
        (servicio) => servicio.categoria === e.currentTarget.id
      );
      cargarServicios(serviciosBoton);
    } else {
      tituloPrincipal.innerText = "Todos los servicios";
      cargarServicios(servicios);
    }
  });
});
/*Agregando productos al carrito. La complicación es que las tarjetas que tiene el boton agregar NO están fijas en el HTML, sino que son dinámicas, se generan en el JS al ejecutar la funciòn cargarServicios.*/

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".servicio-agregar");
  //esta función busca las nuevas etiquetas que se generan dinamicamente. Notar que la invoco dentro de la función cargarServicios//
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}
let serviciosEnCarrito;
let serviciosEnCarritoLS = localStorage.getItem("servicios-en-carrito");

if (serviciosEnCarritoLS) {
  serviciosEnCarrito = JSON.parse(serviciosEnCarritoLS);
  actualizarCantidad();
} else {
  serviciosEnCarrito = [];
}

//const serviciosEnCarrito = [];
function agregarAlCarrito(e) {
  Toastify({
    text: "Servicio agregado",
    duration: 1000,
    gravity: "top",
    position: "center",
    style: {
      background: "rgba(37, 172, 19, 0.801)",
      borderRadius: "2rem",
    },
  }).showToast();

  const idBoton = e.currentTarget.id;
  const servicioAgregado = servicios.find(
    (servicio) => servicio.id === idBoton
  );

  if (serviciosEnCarrito.some((servicio) => servicio.id === idBoton)) {
    const index = serviciosEnCarrito.findIndex(
      (servicio) => servicio.id === idBoton
    );
    serviciosEnCarrito[index].cantidad++;
  } else {
    servicioAgregado.cantidad = 1;
    serviciosEnCarrito.push(servicioAgregado);
  }

  actualizarCantidad();

  localStorage.setItem(
    "servicios-en-carrito",
    JSON.stringify(serviciosEnCarrito)
  ); //esta es la info a recuperar desde la pag del carrito//
}
function actualizarCantidad() {
  let nuevaCantidad = serviciosEnCarrito.reduce(
    (acc, servicio) => acc + servicio.cantidad,
    0
  );
  cantidad.innerText = nuevaCantidad;
}
//ahora tengo que llevar el array serviciosEnCarrito a la página del carrito. Para esto uso el local storage. Lo hago n el dominnio local de la función agregarAlCarrito//
