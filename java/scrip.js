/* ===================================================
   PEGA AQUÍ LOS ENLACES DE TUS IMÁGENES
   Conserva las comillas y las comas.

   Ejemplo:
   portada: "https://tusitio.com/fotos/oficina.jpg",

   También puedes usar imágenes locales:
   portada: "./imagenes/oficina.jpg",
   =================================================== */

const imagenes = {
  logo: "",       // LOGO
  portada: "",    // FOTO PRINCIPAL
  producto1: "",  // FOTO DEL PRODUCTO 1
  producto2: "",  // FOTO DEL PRODUCTO 2
  producto3: "",  // FOTO DEL PRODUCTO 3
  trabajo: ""     // FOTO DE UN TRABAJO REALIZADO
};

const numeroWhatsApp = "593995656347";

/* CARGAR IMÁGENES */
document.querySelectorAll("[data-imagen]").forEach((imagen) => {
  const enlace = imagenes[imagen.dataset.imagen];

  if (!enlace || !enlace.trim()) return;

  const placeholder = imagen.parentElement.querySelector(".placeholder");
  const nombreMarca = document.getElementById("nombre-marca");
  const esLogo = imagen.dataset.imagen === "logo";

  imagen.addEventListener("load", () => {
    imagen.hidden = false;

    if (placeholder) placeholder.hidden = true;
    if (esLogo && nombreMarca) nombreMarca.hidden = true;
  });

  imagen.addEventListener("error", () => {
    imagen.hidden = true;

    if (placeholder) placeholder.hidden = false;
    if (esLogo && nombreMarca) nombreMarca.hidden = false;
  });

  imagen.src = enlace.trim();
});

/* BOTONES DE WHATSAPP */
document.querySelectorAll("[data-mensaje]").forEach((boton) => {
  boton.href =
    "https://wa.me/" +
    numeroWhatsApp +
    "?text=" +
    encodeURIComponent(boton.dataset.mensaje);

  boton.target = "_blank";
  boton.rel = "noopener noreferrer";
});

/* AÑO DEL PIE DE PÁGINA */
const anio = document.getElementById("anio");

if (anio) {
  anio.textContent = new Date().getFullYear();
}

/* ANIMACIONES AL HACER SCROLL */
const elementos = [...document.querySelectorAll("[data-animar]")];

const reducirMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let observador;

function mostrar(elemento) {
  elemento.classList.remove("pendiente");
  elemento.classList.add("visible");

  if (observador) {
    observador.unobserve(elemento);
  }
}

if (
  "IntersectionObserver" in window &&
  !reducirMovimiento.matches
) {
  observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          mostrar(entrada.target);
        }
      });
    },
    {
      threshold: 0.08
    }
  );

  elementos.forEach((elemento) => {
    const posicion = elemento.getBoundingClientRect();

    // El contenido que ya está en pantalla permanece visible.
    if (posicion.top < window.innerHeight) return;

    if (elemento.matches(".servicio, .producto")) {
      const hermanos = [...elemento.parentElement.children];
      const indice = hermanos.indexOf(elemento);

      elemento.style.setProperty(
        "--retraso",
        `${(indice % 4) * 70}ms`
      );
    }

    elemento.classList.add("pendiente");
    observador.observe(elemento);
  });
}

/* ACCESIBILIDAD CON TECLADO */
document.addEventListener("focusin", (evento) => {
  if (!(evento.target instanceof Element)) return;

  const elemento = evento.target.closest("[data-animar]");

  if (elemento) {
    mostrar(elemento);
  }
});

/* RESPETAR LA OPCIÓN DE REDUCIR MOVIMIENTO */
reducirMovimiento.addEventListener("change", (evento) => {
  if (!evento.matches) return;

  if (observador) {
    observador.disconnect();
  }

  elementos.forEach(mostrar);
});

/* SOMBRA DEL MENÚ AL DESPLAZARSE */
const encabezado = document.querySelector(".encabezado");

function actualizarEncabezado() {
  if (encabezado) {
    encabezado.classList.toggle("con-sombra", window.scrollY > 12);
  }
}

window.addEventListener("scroll", actualizarEncabezado, {
  passive: true
});

actualizarEncabezado();