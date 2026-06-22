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
        icono: "bi-folder2-open",
        badge: 5,
        archivo: "cases-tray.html",
        carpeta: "cases-tray",
      },
      {
        texto: "Detalle de Caso",
        icono: "bi-file-earmark-text",
        badge: null,
        archivo: "cases-details.html",
        carpeta: "cases-details",
      },
      {
        texto: "Registrar FPQRS",
        icono: "bi-list-check",
        badge: null,
        archivo: "fpqrs-register.html",
        carpeta: "fpqrs-register",
      },
      // Nota: "Crear Caso (Operador)", "Métricas", "Analítica" y "Exportar Casos"
      // existen en el prototipo pero NO están dentro del alcance de las 4 vistas
      // pedidas en la prueba. Se listan como enlaces visuales deshabilitados
      // para mantener fidelidad visual completa del sidebar, sin implementar
      // su funcionalidad (fuera de alcance).
    ],
    linksFueraDeAlcance: [
      {
        texto: "Crear Caso (Operador)",
        icono: "bi-plus-square",
      },
      {
        texto: "Métricas",
        icono: "bi-bar-chart-line",
      },
      {
        texto: "Analítica",
        icono: "bi-graph-up-arrow",
      },
      {
        texto: "Exportar Casos",
        icono: "bi-box-arrow-down",
      },
    ],
  },
  administracion: {
    titulo: "Administración",
    links: [],
    // Las 4 vistas de Administración (Auditoría, Parametrización,
    // Parámetros Alt., Modelo Cat. Resp.) tampoco están en el
    // alcance pedido. Se muestran como deshabilitadas, igual
    // que los links de Operación fuera de alcance.
    linksFueraDeAlcance: [
      {
        texto: "Auditoría",
        icono: "bi-shield-check",
      },
      {
        texto: "Parametrización",
        icono: "bi-gear",
      },
      {
        texto: "Parámetros Alt.",
        icono: "bi-sliders",
      },
      {
        texto: "Modelo Cat. Resp.",
        icono: "bi-card-list",
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
  const claseActiva = esActivo ? "sidebar-link-activo" : "";
  const ariaActual = esActivo ? 'aria-current="page"' : "";

  const badgeHTML = link.badge
    ? `<span class="sidebar-badge">${link.badge}</span>`
    : "";

  const ruta = `../${link.carpeta}/${link.archivo}`;

  // Reemplazo de los Bootstrap Icons (bi) por los SVGs de Lucide del prototipo para fidelidad total
  let iconSVG = "";
  if (link.archivo === "cases-tray.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-open" aria-hidden="true"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"></path></svg>`;
  } else if (link.archivo === "cases-details.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`;
  } else if (link.archivo === "fpqrs-register.html") {
    iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks" aria-hidden="true"><path d="M13 5h8"></path><path d="M13 12h8"></path><path d="M13 19h8"></path><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path></svg>`;
  }

  return `
    <li>
      <a href="${ruta}" class="sidebar-link text-decoration-none ${claseActiva}" ${ariaActual}>
        <span class="sidebar-icon-wrapper">${iconSVG}</span>
        <span class="sidebar-link-texto-interno">${link.texto}</span>
        ${badgeHTML}
      </a>
    </li>
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
  let linksHTML = "";

  seccion.links.forEach(function (link) {
    linksHTML += construirLinkHabilitado(link, carpetaActiva);
  });

  seccion.linksFueraDeAlcance.forEach(function (linkInfo) {
    linksHTML += construirLinkDeshabilitado(linkInfo);
  });

  return `
    <div class="sidebar-seccion">
      <h2 class="sidebar-titulo-seccion">${seccion.titulo}</h2>
      <ul>
        ${linksHTML}
      </ul>
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
function renderSidebar(carpetaActiva,) {
  const html = `
    <div class="sidebar-logo-fila">
      <img src="../../assets/img/logo-prototipo.png" alt="" width="32" height="32" class="sidebar-logo-img">
      <span class="sidebar-logo-texto">GestorFPQRS</span>
    </div>
 
    <nav id="sidebar" aria-label="Navegación principal">
      ${construirSeccion(navegacionSidebar.operacion, carpetaActiva)}
      ${construirSeccion(navegacionSidebar.administracion, carpetaActiva)}
 
      <div id="sidebar-usuario-contenedor"></div>
    </nav>

    <button type="button" id="sidebar-toggle" class="sidebar-toggle-btn-flotante" aria-label="Contraer u ocultar menú de navegación" aria-expanded="true" aria-controls="sidebar">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
    </button>
  `;

  $("#sidebar-contenedor").html(html);

  renderUsuarioSidebar();
  activarToggleResponsive();
}