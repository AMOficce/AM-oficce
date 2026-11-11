/* =====================================================
   WHATSAPP: NÚMERO Y MENSAJE PROPORCIONADOS
   ===================================================== */

const enlaceWhatsApp =
  "https://wa.me/593998228348?text=%C2%A1Hola,%20AM%20OFFICE!%20%F0%9F%91%8B%20Estoy%20interesado%20en%20sus%20servicios%20de%20mobiliario%20y%20amoblamiento.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20y%20una%20cotizaci%C3%B3n.";

document.querySelectorAll("[data-whatsapp]").forEach((enlace) => {
  enlace.href = enlaceWhatsApp;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
});

/* =====================================================
   IMÁGENES
   Las rutas se editan únicamente en el HTML.
   Oculta el recuadro de reserva cuando la imagen carga.
   ===================================================== */

document.querySelectorAll(".foto img, .marca .logo").forEach((imagen) => {
  const placeholder = imagen.parentElement.querySelector(".placeholder");
  const esLogo = imagen.classList.contains("logo");
  const nombreMarca = document.getElementById("nombre-marca");

  function mostrarImagen() {
    imagen.hidden = false;

    if (placeholder) {
      placeholder.hidden = true;
    }

    if (esLogo && nombreMarca) {
      nombreMarca.hidden = true;
    }
  }

  function mostrarReserva() {
    imagen.hidden = true;

    if (placeholder) {
      placeholder.hidden = false;
    }

    if (esLogo && nombreMarca) {
      nombreMarca.hidden = false;
    }
  }

  imagen.addEventListener("load", mostrarImagen);
  imagen.addEventListener("error", mostrarReserva);

  // También funciona si la imagen ya estaba en caché.
  if (imagen.complete) {
    if (imagen.naturalWidth > 0) {
      mostrarImagen();
    } else {
      mostrarReserva();
    }
  }
});

/* AÑO ACTUAL */
const anio = document.getElementById("anio");

if (anio) {
  anio.textContent = new Date().getFullYear();
}

/* =====================================================
   ANIMACIONES AL HACER SCROLL
   ===================================================== */

const reducirMovimiento = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const elementos = [
  ...document.querySelectorAll("[data-animar]")
];

let observador;

function mostrarElemento(elemento) {
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
          mostrarElemento(entrada.target);
        }
      });
    },
    {
      threshold: 0.08
    }
  );

  elementos.forEach((elemento) => {
    const posicion = elemento.getBoundingClientRect();

    if (posicion.top < window.innerHeight) {
      return;
    }

    if (elemento.classList.contains("servicio")) {
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

/* NAVEGACIÓN CON TECLADO */
document.addEventListener("focusin", (evento) => {
  if (!(evento.target instanceof Element)) {
    return;
  }

  const elemento = evento.target.closest("[data-animar]");

  if (elemento) {
    mostrarElemento(elemento);
  }
});

/* REDUCIR MOVIMIENTO */
reducirMovimiento.addEventListener("change", (evento) => {
  if (!evento.matches) {
    return;
  }

  if (observador) {
    observador.disconnect();
  }

  elementos.forEach(mostrarElemento);
});

/* SOMBRA DEL ENCABEZADO */
const encabezado = document.querySelector(".encabezado");

function actualizarEncabezado() {
  if (encabezado) {
    encabezado.classList.toggle(
      "con-sombra",
      window.scrollY > 12
    );
  }
}

window.addEventListener("scroll", actualizarEncabezado, {
  passive: true
});

actualizarEncabezado();

/* =====================================================
   CARRUSEL DE CUATRO CATEGORÍAS
   Flechas, teclado y desplazamiento táctil.
   ===================================================== */

const carrusel = document.getElementById("carrusel-productos");
const anterior = document.getElementById("producto-anterior");
const siguiente = document.getElementById("producto-siguiente");
const controles = document.querySelector(".carrusel-controles");

if (carrusel && anterior && siguiente && controles) {
  controles.hidden = false;

  function actualizarControles() {
    const maximo = carrusel.scrollWidth - carrusel.clientWidth;

    anterior.disabled = carrusel.scrollLeft <= 2;
    siguiente.disabled = carrusel.scrollLeft >= maximo - 2;
  }

  function desplazar(direccion) {
    const tarjeta = carrusel.querySelector(".producto");

    if (!tarjeta) {
      return;
    }

    const separacion =
      parseFloat(getComputedStyle(carrusel).columnGap) || 0;

    const distancia =
      tarjeta.getBoundingClientRect().width + separacion;

    carrusel.scrollBy({
      left: direccion * distancia,
      behavior: reducirMovimiento.matches ? "instant" : "smooth"
    });
  }

  anterior.addEventListener("click", () => {
    desplazar(-1);
  });

  siguiente.addEventListener("click", () => {
    desplazar(1);
  });

  carrusel.addEventListener("keydown", (evento) => {
    if (evento.target !== carrusel) {
      return;
    }

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      desplazar(1);
    }

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      desplazar(-1);
    }
  });

  carrusel.addEventListener("scroll", actualizarControles, {
    passive: true
  });

  window.addEventListener("resize", actualizarControles);
  window.addEventListener("load", actualizarControles);

  actualizarControles();
}
