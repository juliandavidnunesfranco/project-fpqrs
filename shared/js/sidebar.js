/* ============================================
   sidebar.js
   Genera el sidebar COMPLETO con JavaScript puro + jQuery:
   navegación, sección de usuario (notificaciones, nombre,
   rol, logout) y comportamiento responsive con toggle.

   Este archivo, esta dividido en dos funciones:

     renderSidebar()        -> navegación (Operación/Admin)
     renderUsuarioSidebar() -> notificaciones + usuario + logout

   DEPENDE DE: jQuery, session.js (necesita obtenerSesionActiva y cerrarSesion para la sección de usuario)

   Por qué generarlo usando JS en vez de un archivo .html
   mismo motivo documentado en data.js — $.load() usa AJAX, que falla bajo file://
   sin servidor. 
   Un <script> normal no tiene ese problema.

   Los 11 links y las 2 secciones ("Operación" y "Administración") + Notificacione, Perfil y Logout, 
   son exactamente iguales a los del prototipo, aunque algunos no estén en el alcance de las 4 vistas pedidas en la prueba técnica. 
   Se muestran todos para mantener fidelidad visual completa al prototipo, pero los que no están en alcance se ven deshabilitados y
   no navegan.
   ============================================ */

/* --------------------------------------------
   Estructura de navegación, igual a la vista del prototipo.
   "archivo" es el nombre exacto del .html de cada vista en
   este proyecto — se usa para armar la ruta Y para detectar
   cuál es la página activa.
   -------------------------------------------- */
const navegacionSidebar = {
  operacion: {
    titulo: "Operación",
    links: [
      {
        texto: "Bandeja de Casos",
        carpeta: "cases-tray",
        archivo: "cases-tray.html",
        badge: "5",
      },
      {
        texto: "Detalle de Caso",
        carpeta: "cases-details",
        archivo: "cases-details.html",
      },
      {
        texto: "Registrar FPQRS",
        carpeta: "fpqrs-register",
        archivo: "fpqrs-register.html",
      },
      {
        texto: "Crear Caso (Operador)",
        carpeta: "crear-caso",
        archivo: "crear-caso.html",
      },
      { texto: "Métricas", carpeta: "metricas", archivo: "metricas.html" },
      { texto: "Analítica", carpeta: "analitica", archivo: "analitica.html" },
      {
        texto: "Exportar Casos",
        carpeta: "exportar-casos",
        archivo: "exportar-casos.html",
      },
    ],
  },
  administracion: {
    titulo: "Administración",
    links: [
      { texto: "Auditoría", carpeta: "auditoria", archivo: "auditoria.html" },
      {
        texto: "Parametrización",
        carpeta: "parametrizacion",
        archivo: "parametrizacion.html",
      },
      {
        texto: "Parámetros Alt.",
        carpeta: "parametros-alt",
        archivo: "parametros-alt.html",
      },
      {
        texto: "Modelo Cat. Resp.",
        carpeta: "modelo-categoria",
        archivo: "modelo-categoria.html",
      },
    ],
  },
};
/* --------------------------------------------
   La funcion construirLinkHabilitado: Construye el HTML de un link habilitado 
   (una de las 4 vistas que sí implementamos).
   -------------------------------------------- */
function construirLinkHabilitado(link, carpetaActiva) {
  const esActivo = link.carpeta === carpetaActiva;
  const claseActiva = esActivo
    ? "sidebar-link-activo fw-semibold text-white"
    : "text-white-70";
  const ariaActual = esActivo ? 'aria-current="page"' : "";

  const badgeHTML = link.badge
    ? `<span class="sidebar-badge ms-auto d-flex align-items-center justify-content-center bg-danger rounded-pill text-white font-700">${link.badge}</span>`
    : "";

  const ruta = `../${link.carpeta}/${link.archivo}`;

  let iconSVG = "";
  if (link.archivo === "cases-tray.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-open"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>`;
  } else if (link.archivo === "cases-details.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`;
  } else if (link.archivo === "fpqrs-register.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="M13 5h8"></path><path d="M13 12h8"></path><path d="M13 19h8"></path><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path></svg>`;
  } else if (link.archivo === "crear-caso.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M8 12h8"></path><path d="M12 8v8"></path></svg>`;
  } else if (link.archivo === "metricas.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-no-axes-column"><path d="M5 21v-6"></path><path d="M12 21V3"></path><path d="M19 21V9"></path></svg>`;
  } else if (link.archivo === "analitica.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up"><path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>`;
  } else if (link.archivo === "exportar-casos.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path></svg>`;
  } else if (link.archivo === "auditoria.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>`;
  } else if (link.archivo === "parametrizacion.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  } else if (link.archivo === "parametros-alt.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>`;
  } else if (link.archivo === "modelo-categoria.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>`;
  }

  return `
    <a href="${ruta}" class="sidebar-link text-decoration-none ${claseActiva}" ${ariaActual}>
      <span class="sidebar-icon-wrapper">${iconSVG}</span>
      <span class="sidebar-link-texto">${link.texto}</span>
      ${badgeHTML}
    </a>
  `;
}

/* --------------------------------------------
   La funcion construirLinkDeshabilitado: Construye el HTML de un link FUERA de alcance: se ve
   igual visualmente (fidelidad al prototipo), pero no
   navega a ningún lado real. Usamos <span> en vez de <a>
   a propósito: no es semánticamente correcto usar un link
   <a href="#"> para algo que no navega.
   -------------------------------------------- */
function construirLinkDeshabilitado(linkInfo) {
  return `
    <li>
      <span class="sidebar-link sidebar-link-deshabilitado" aria-disabled="true" title="No implementado en esta prueba técnica">
        <i class="bi ${linkInfo.icono}" aria-hidden="true"></i>
        ${linkInfo.texto}
      </span>
    </li>
  `;
}

/* --------------------------------------------
   La funcion construirSeccion: arma una sección completa del sidebar 
   (título + lista de links habilitados y deshabilitados).
   -------------------------------------------- */
function construirSeccion(seccion, carpetaActiva) {
  const linksHTML = seccion.links
    .map((link) => construirLinkHabilitado(link, carpetaActiva))
    .join("");
  return `
    <div class="sidebar-seccion mb-4">
      <p class="sidebar-seccion-titulo text-uppercase px-4 mb-2">${seccion.titulo}</p>
      <div class="d-flex flex-column gap-0.5">
        ${linksHTML}
      </div>
    </div>
  `;
}
/* --------------------------------------------
   La funcion construirSeccionUsuario: construye el HTML de la sección de usuario: notificaciones,
   nombre + rol del usuario activo, y botón de logout.

   Toma los datos del usuario desde la sesión activa
   (obtenerSesionActiva, de session.js) — no recibe el
   usuario como parámetro, porque siempre debe reflejar
   quién está realmente logueado en este momento.
   -------------------------------------------- */
function construirSeccionUsuario() {
  const usuario = obtenerSesionActiva();

  // Si por algún motivo se llama esto sin sesión activa
  // (no debería pasar, protegerPagina ya lo evita), mostramos
  // un estado vacío en vez de romper con un error de undefined.
  if (!usuario) {
    return '<div class="sidebar-usuario sidebar-usuario-vacio">Sin sesión activa</div>';
  }
  const inicial = usuario.nombre.charAt(0).toUpperCase();
  return `
    <div class="sidebar-notificaciones-fila">
      <i class="bi bi-bell" aria-hidden="true"></i>
      <span>Notificaciones</span>
    </div>
 
    <div class="sidebar-usuario">
      <span class="sidebar-avatar" aria-hidden="true">${inicial}</span>
 
      <div class="sidebar-usuario-info">
        <span class="sidebar-usuario-nombre">${usuario.nombre}</span>
        <span class="sidebar-usuario-rol">${usuario.rol}</span>
      </div>
    </div>
 
    <button type="button" id="btn-cerrar-sesion" class="sidebar-logout">
      <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
      Cerrar sesión
    </button>
  `;
}

/* --------------------------------------------
   la función renderUsuarioSidebar: pinta la sección de usuario dentro de #sidebar-usuario-contenedor
   y conecta el evento de logout.

   Separada de renderSidebar() porque conceptualmente son dos
   cosas distintas (navegación vs. identidad del usuario),
   aunque en el prototipo compartan el mismo bloque visual.
   -------------------------------------------- */
function renderUsuarioSidebar() {
  $("#sidebar-usuario-contenedor").html(construirSeccionUsuario()); //jquery para insertar el HTML generado por construirSeccionUsuario() dentro del contenedor específico del sidebar.

  // Delegación de evento: el botón se crea dinámicamente
  // arriba, así que no existe todavía cuando el script carga.
  $("#sidebar-usuario-contenedor").on(
    "click",
    "#btn-cerrar-sesion",
    function () {
      cerrarSesion("../login/login.html");
    },
  );
}

/* --------------------------------------------
   Comportamiento responsive: en pantallas chicas el sidebar
   arranca oculto, y un botón toggle lo muestra/oculta.

   El prototipo no muestra explícitamente su versión mobile,
   así que este es el patrón estándar para sidebars de
   dashboards: colapsa por defecto, botón hamburguesa lo abre.
   -------------------------------------------- */
function activarToggleResponsive() {
  $("#sidebar-toggle").on("click", function () {
    $("#sidebar").toggleClass("sidebar-abierto");

    const expandido = $("#sidebar").hasClass("sidebar-abierto");
    $(this).attr("aria-expanded", expandido);
  });

  // Si la pantalla crece a tamaño desktop mientras el sidebar
  // estaba abierto en mobile, lo dejamos en su estado natural
  // de desktop (visible siempre), sin la clase de toggle.
  $(window).on("resize", function () {
    if ($(window).width() >= 992) {
      $("#sidebar").removeClass("sidebar-abierto");
    }
  });
}

/* --------------------------------------------
   FUNCIÓN PRINCIPAL: pinta el sidebar de navegación completo
   (logo + botón toggle + las 2 secciones) dentro de
   #sidebar-contenedor, y activa el comportamiento responsive.

   carpetaActiva: el nombre de carpeta de la página actual
   (ej: 'bandeja-casos'), usado para resaltar el link activo.

   Uso típico en cada página protegida (ambas funciones,
   ya que en el prototipo son un solo bloque visual):

     renderSidebar('bandeja-casos');
     renderUsuarioSidebar();
   -------------------------------------------- */
function renderSidebar(carpetaActiva) {
  const html = `
    <aside id="sidebar" class="d-flex flex-column bg-primary text-white sidebar-transition h-100 position-relative z-20">
      
      <div class="sidebar-logo-fila d-flex align-items-center gap-3 px-4 py-5 border-b-custom overflow-hidden">
        <div class="shrink-0 d-flex align-items-center">
          <img src="../../assets/img/logo-prototipo.png" alt="Logo" width="32" height="32" class="flex-shrink-0">
        </div>
        <span class="sidebar-logo-texto fw-bold fs-6 tracking-tight text-nowrap">GestorFPQRS</span>
      </div>
 
      <nav class="flex-grow-1 py-4 overflow-hidden">
        ${construirSeccion(navegacionSidebar.operacion, carpetaActiva)}
        ${construirSeccion(navegacionSidebar.administracion, carpetaActiva)}
      </nav>
 
      <div class="border-t-custom p-3 sidebar-user-footer">
        <button type="button" class="sidebar-user-btn d-flex align-items-center gap-3 w-full px-3 py-2.5 rounded-3 text-white-70 text-decoration-none bg-transparent border-0 text-start group">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell shrink-0"><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg>
          <span class="sidebar-link-texto text-sm">Notificaciones</span>
        </button>
        
        <div class="d-flex align-items-center gap-3 px-3 py-2.5 overflow-hidden">
          <div class="w-7 h-7 rounded-circle bg-white-20 d-flex align-items-center justify-content-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="flex-grow-1 min-w-0 sidebar-link-texto">
            <p class="text-xs fw-semibold text-white mb-0 text-truncate">Sofía Martínez</p>
            <p class="text-muted-custom mb-0 text-truncate">Administrador</p>
          </div>
        </div>
        
        <button type="button" id="btn-cerrar-sesion" class="sidebar-user-btn d-flex align-items-center gap-3 w-full px-3 py-2 rounded-3 text-white-60 text-decoration-none text-start border-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out shrink-0"><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path></svg>
          <span class="sidebar-link-texto text-xs">Cerrar sesión</span>
        </button>
      </div>

      <button type="button" id="sidebar-toggle" class="sidebar-toggle-btn-flotante" aria-label="Colapsar menú" aria-expanded="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"></path></svg>
      </button>

    </aside>
  `;

  $("#sidebar-contenedor").html(html);

  // Ejecutamos los Event Listeners de colapsado directo en jQuery
  activarFuncionalidadColapsar();
}

function activarFuncionalidadColapsar() {
  // Colapsar en desktop
  $("#sidebar-toggle").on("click", function () {
    const contenedor = $("#sidebar-contenedor");
    contenedor.toggleClass("colapsado");
    const esColapsado = contenedor.hasClass("colapsado");
    $(this).attr("aria-expanded", !esColapsado);
  });

  // Cerrar sesión
  $(document).on("click", "#btn-cerrar-sesion", function () {
    cerrarSesion("../login/login.html");
  });

  // Inyectar botón hamburguesa y overlay para mobile
  if ($("#btn-hamburguesa").length === 0) {
    $("body").prepend(
      '<div class="sidebar-overlay" id="sidebar-overlay"></div>',
    );
    // Insertar hamburguesa en el page-header si existe, si no al inicio del main
    const $header = $(".page-header, .detalle-header").first();
    if ($header.length) {
      $header.prepend(
        '<button type="button" id="btn-hamburguesa" class="btn-hamburguesa me-2" aria-label="Abrir menú"><i class="bi bi-list"></i></button>',
      );
    }
  }

  // Abrir sidebar en mobile
  $(document).on("click", "#btn-hamburguesa", function () {
    const $s = $("#sidebar-contenedor");
    // Forzar visibilidad via style directo por si algún CSS lo oculta
    $s.css({
      display: "flex",
      "flex-direction": "column",
      position: "fixed",
      top: "0",
      left: "0",
      width: "240px",
      height: "100vh",
      "z-index": "1040",
      transform: "translateX(0)",
      transition: "transform 0.25s ease",
      "box-shadow": "4px 0 20px rgba(0,0,0,0.3)",
    });
    $s.addClass("sidebar-mobile-abierto");
    $("#sidebar-overlay").addClass("activo");
  });

  // Cerrar sidebar al tocar el overlay
  $(document).on("click", "#sidebar-overlay", function () {
    const $s = $("#sidebar-contenedor");
    $s.css("transform", "translateX(-100%)");
    $s.css("box-shadow", "none");
    setTimeout(function () {
      $s.removeClass("sidebar-mobile-abierto");
      $s.css({ transform: "", "box-shadow": "" });
    }, 250);
    $("#sidebar-overlay").removeClass("activo");
  });
}
