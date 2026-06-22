/* ============================================
   cases-tray.js
   Lógica de la Bandeja de Casos.

   DEPENDE DE:
   - jQuery
   - data.js     (casosSimulados, cuentasDemo)
   - session.js  (protegerPagina, obtenerSesionActiva)
   - sidebar.js  (renderSidebar)
   ============================================ */

$(document).ready(function () {
  /* ------------------------------------------
     1. PROTEGER PÁGINA + RENDERIZAR SIDEBAR
     ------------------------------------------ */
  const usuario = protegerPagina("../login/login.html");
  if (!usuario) return;

  renderSidebar("cases-tray");

  /* ------------------------------------------
     2. ESTADO DE LA TABLA
     ------------------------------------------ */
  let casosFiltrados = casosSimulados.slice(); // copia del array original
  let paginaActual = 1;
  let porPagina = 10;

  /* ------------------------------------------
     3. HELPERS DE BADGES
     Traducción de valores de datos a clases CSS
     extraídas del HTML real del prototipo.
     ------------------------------------------ */

  function claseTipo(tipo) {
    const mapa = {
      Felicitación: "tipo-felicitacion",
      Sugerencia: "tipo-sugerencia",
      Petición: "tipo-peticion",
      Queja: "tipo-queja",
      Reclamo: "tipo-reclamo",
    };
    return mapa[tipo] || "tipo-peticion";
  }

  function clasePrioridad(prioridad) {
    const mapa = {
      Baja: "priority-baja",
      Normal: "priority-normal",
      Alta: "priority-alta",
      Crítica: "priority-critica",
    };
    return mapa[prioridad] || "priority-normal";
  }

  function claseEstado(estado) {
    const mapa = {
      Radicado: "status-radicado",
      Asignado: "status-asignado",
      "En Gestión": "status-engestion",
      "Pendiente de Información": "status-pendiente",
      Respondido: "status-respondido",
      Cerrado: "status-cerrado",
      Reabierto: "status-reabierto",
      Anulado: "status-anulado",
    };
    return mapa[estado] || "status-radicado";
  }

  function claseSemaforo(semaforo) {
    const mapa = {
      "En tiempo": "sla-verde",
      "Próximo a vencer": "sla-amarillo",
      Vencido: "sla-rojo",
      Cerrado: "sla-gris",
    };
    return mapa[semaforo] || "sla-gris";
  }

  function esFechaVencida(semaforo) {
    return semaforo === "Próximo a vencer" || semaforo === "Vencido";
  }

  /* ------------------------------------------
     4. RENDERIZAR FILAS DE LA TABLA
     ------------------------------------------ */
  function renderTabla() {
    const inicio = (paginaActual - 1) * porPagina;
    const fin = inicio + porPagina;
    const pagina = casosFiltrados.slice(inicio, fin);

    const $tbody = $("#tbody-casos");
    $tbody.empty();

    if (pagina.length === 0) {
      $tbody.append(`
        <tr>
          <td colspan="13" class="text-center py-4" style="color:var(--muted-foreground);">
            No se encontraron casos con los criterios de búsqueda.
          </td>
        </tr>
      `);
      actualizarInfo(0, 0, 0);
      renderPaginacion(0);
      return;
    }

    pagina.forEach(function (caso) {
      const claseFecha = esFechaVencida(caso.semaforo)
        ? "td-fecha td-fecha--vencida"
        : "td-fecha";
      const semaforoClase = claseSemaforo(caso.semaforo);

      const fila = `
        <tr>
          <td><span class="td-radicado">${caso.radicado}</span></td>
          <td><span class="${claseFecha}">${formatearFecha(caso.fechaRadicado)}</span></td>
          <td><span class="badge-pill ${claseTipo(caso.tipo)}">${caso.tipo}</span></td>
          <td><span class="text-xs" style="white-space:nowrap;">${caso.servicio}</span></td>
          <td><span class="text-xs">${caso.categoria}</span></td>
          <td><span class="td-truncate" title="${caso.subcategoria}">${caso.subcategoria}</span></td>
          <td><span class="td-truncate td-truncate--md" title="${caso.asociado}">${caso.asociado}</span></td>
          <td><span class="td-truncate td-truncate--sm" title="${caso.responsable}">${caso.responsable}</span></td>
          <td><span class="badge-pill ${clasePrioridad(caso.prioridad)}">${caso.prioridad}</span></td>
          <td><span class="badge-pill ${claseEstado(caso.estado)}">${caso.estado}</span></td>
          <td><span class="${claseFecha}">${formatearFecha(caso.limiteSLA)}</span></td>
          <td>
            <span class="badge-pill ${semaforoClase}">
              <span class="sla-punto" aria-hidden="true"></span>
              ${caso.semaforo}
            </span>
          </td>
          <td style="text-align:right;">
            <a href="../cases-details/cases-details.html"
               class="btn-ver-detalle"
               title="Ver detalle del caso ${caso.radicado}"
               aria-label="Ver detalle del caso ${caso.radicado}">
              <i class="bi bi-eye" aria-hidden="true"></i>
            </a>
          </td>
        </tr>
      `;
      $tbody.append(fila);
    });

    actualizarInfo(
      inicio + 1,
      Math.min(fin, casosFiltrados.length),
      casosFiltrados.length,
    );
    renderPaginacion(Math.ceil(casosFiltrados.length / porPagina));
  }

  /* ------------------------------------------
     5. PAGINACIÓN
     ------------------------------------------ */
  function renderPaginacion(totalPaginas) {
    const $cont = $("#contenedor-paginacion");
    $cont.empty();

    // Botón anterior
    $cont.append(`
      <button class="btn-pagina" id="btn-prev" aria-label="Página anterior" ${paginaActual === 1 ? "disabled" : ""}>
        <i class="bi bi-chevron-left" aria-hidden="true"></i>
      </button>
    `);

    // Botones de número de página (máx 5 visibles)
    const rango = calcularRango(paginaActual, totalPaginas, 5);
    for (let i = rango.inicio; i <= rango.fin; i++) {
      const claseActiva = i === paginaActual ? "activa" : "";
      $cont.append(
        `<button class="btn-pagina ${claseActiva}" data-pagina="${i}" aria-current="${i === paginaActual ? "page" : "false"}">${i}</button>`,
      );
    }

    // Botón siguiente
    $cont.append(`
      <button class="btn-pagina" id="btn-next" aria-label="Página siguiente" ${paginaActual === totalPaginas || totalPaginas === 0 ? "disabled" : ""}>
        <i class="bi bi-chevron-right" aria-hidden="true"></i>
      </button>
    `);
  }

  function calcularRango(actual, total, visible) {
    let inicio = Math.max(1, actual - Math.floor(visible / 2));
    let fin = Math.min(total, inicio + visible - 1);
    if (fin - inicio + 1 < visible) {
      inicio = Math.max(1, fin - visible + 1);
    }
    return { inicio, fin };
  }

  function actualizarInfo(desde, hasta, total) {
    $("#texto-mostrando").html(
      `Mostrando <strong>${desde}</strong>–<strong>${hasta}</strong> de <strong>${total}</strong> casos`,
    );
  }

  /* ------------------------------------------
     6. BÚSQUEDA
     ------------------------------------------ */
  $("#input-busqueda").on("input", function () {
    const termino = $(this).val().trim().toLowerCase();

    if (termino === "") {
      casosFiltrados = casosSimulados.slice();
    } else {
      casosFiltrados = casosSimulados.filter(function (caso) {
        return (
          caso.radicado.toLowerCase().includes(termino) ||
          caso.asociado.toLowerCase().includes(termino) ||
          caso.tipo.toLowerCase().includes(termino) ||
          caso.servicio.toLowerCase().includes(termino)
        );
      });
    }

    paginaActual = 1;
    renderTabla();
  });

  /* ------------------------------------------
     7. EVENTOS DE PAGINACIÓN — delegación
     ------------------------------------------ */
  $("#contenedor-paginacion").on(
    "click",
    ".btn-pagina[data-pagina]",
    function () {
      paginaActual = parseInt($(this).data("pagina"));
      renderTabla();
    },
  );

  $("#contenedor-paginacion").on("click", "#btn-prev", function () {
    if (paginaActual > 1) {
      paginaActual--;
      renderTabla();
    }
  });

  $("#contenedor-paginacion").on("click", "#btn-next", function () {
    const total = Math.ceil(casosFiltrados.length / porPagina);
    if (paginaActual < total) {
      paginaActual++;
      renderTabla();
    }
  });

  $("#select-por-pagina").on("change", function () {
    porPagina = parseInt($(this).val());
    paginaActual = 1;
    renderTabla();
  });

  /* ------------------------------------------
     8. HELPER — formato de fecha
     ------------------------------------------ */
  function formatearFecha(fechaISO) {
    if (!fechaISO) return "—";
    const partes = fechaISO.split("-");
    if (partes.length !== 3) return fechaISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  /* ------------------------------------------
     9. RENDER INICIAL
     ------------------------------------------ */
  renderTabla();
});
