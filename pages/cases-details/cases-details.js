/* ============================================
   CASES-DETAILS.JS
   Lógica del Detalle de Caso.
   ============================================ */

$(document).ready(function () {
  /* ------------------------------------------
     1. PROTEGER + SIDEBAR
     ------------------------------------------ */
  const usuario = protegerPagina("../login/login.html");
  if (!usuario) return;

  renderSidebar("cases-details");

  /* ------------------------------------------
     2. TABS — sistema de pestañas accesible
     ------------------------------------------ */
  $(".tab-btn").on("click", function () {
    const tabId = $(this).data("tab");

    // Actualizar botones
    $(".tab-btn").removeClass("tab-btn--activo").attr("aria-selected", "false");
    $(this).addClass("tab-btn--activo").attr("aria-selected", "true");

    // Actualizar paneles
    $(".tab-panel").attr("hidden", true);
    $("#panel-" + tabId).removeAttr("hidden");
  });

  /* ------------------------------------------
     3. CAMBIAR ESTADO (simulado)
     ------------------------------------------ */
  const clasesPorEstado = {
    Radicado: "status-radicado",
    "En Gestión": "status-engestion",
    "Pendiente de Información": "status-pendiente",
    Respondido: "status-respondido",
    Cerrado: "status-cerrado",
  };

  $("#btn-aplicar-estado").on("click", function () {
    const nuevoEstado = $("#select-estado").val();
    const $badge = $("#badge-estado-actual");

    // Quitar todas las clases de estado anteriores
    Object.values(clasesPorEstado).forEach(function (cls) {
      $badge.removeClass(cls);
    });

    $badge.addClass(clasesPorEstado[nuevoEstado] || "status-radicado");
    $badge.text(nuevoEstado);

    mostrarToast("Estado actualizado a: " + nuevoEstado);
  });

  /* ------------------------------------------
     4. CAMBIAR PRIORIDAD (simulado)
     ------------------------------------------ */
  const clasesPorPrioridad = {
    Baja: "priority-baja",
    Normal: "priority-normal",
    Alta: "priority-alta",
    Crítica: "priority-critica",
  };

  $("#select-prioridad").on("change", function () {
    const valor = $(this).val();
    const $badge = $("#badge-prioridad-actual");

    Object.values(clasesPorPrioridad).forEach(function (cls) {
      $badge.removeClass(cls);
    });

    $badge.addClass(clasesPorPrioridad[valor] || "priority-normal");
    $badge.text(valor);

    mostrarToast("Prioridad actualizada a: " + valor);
  });

  /* ------------------------------------------
     5. REASIGNAR RESPONSABLE (simulado)
     ------------------------------------------ */
  $("#select-responsable").on("change", function () {
    const nuevoResponsable = $(this).val();
    $("#texto-responsable-actual").text(nuevoResponsable);
    mostrarToast("Caso reasignado a: " + nuevoResponsable);
  });

  /* ------------------------------------------
     6. REGISTRAR OBSERVACIÓN (simulado)
     ------------------------------------------ */
  $("#form-observacion").on("submit", function (e) {
    e.preventDefault();

    const texto = $("#textarea-observacion").val().trim();

    if (!texto) {
      $("#textarea-observacion").addClass("is-invalid");
      return;
    }

    $("#textarea-observacion").removeClass("is-invalid");

    const esRespuesta = $("#chk-notificar").is(":checked");
    const mensaje = esRespuesta
      ? "Observación registrada y notificación enviada al asociado."
      : "Observación interna registrada correctamente.";

    mostrarToast(mensaje);
    $("#textarea-observacion").val("");
    $("#chk-notificar").prop("checked", false);
  });

  /* ------------------------------------------
     7. BOTONES CERRAR / ANULAR (simulado)
     ------------------------------------------ */
  $("#btn-cerrar-caso, #btn-reasignar-header").on("click", function () {
    const accion =
      $(this).attr("id") === "btn-cerrar-caso" ? "cerrar" : "reasignar";

    if (accion === "cerrar") {
      if (
        confirm(
          "¿Confirma que desea CERRAR este caso? Esta acción quedará registrada en la trazabilidad.",
        )
      ) {
        const $badge = $("#badge-estado-actual");
        Object.values(clasesPorEstado).forEach(function (cls) {
          $badge.removeClass(cls);
        });
        $badge.addClass("status-cerrado").text("Cerrado");
        $("#select-estado").val("Cerrado");
        mostrarToast("Caso cerrado exitosamente.");
      }
    }
  });

  $("#btn-anular-caso").on("click", function () {
    if (
      confirm(
        "¿Confirma que desea ANULAR este caso? Esta acción es irreversible.",
      )
    ) {
      mostrarToast("Caso anulado. Redirigiendo a la bandeja...");
      setTimeout(function () {
        window.location.href = "../cases-tray/cases-tray.html";
      }, 1500);
    }
  });

  /* ------------------------------------------
     8. TOAST de confirmación simple
     ------------------------------------------ */
  function mostrarToast(mensaje) {
    // Remueve toast anterior si existe
    $("#toast-detalle").remove();

    const $toast = $(`
      <div id="toast-detalle" style="
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: var(--primary);
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(15,28,46,0.2);
        z-index: 9999;
        animation: fadeIn 200ms ease;
      ">${mensaje}</div>
    `);

    $("body").append($toast);

    setTimeout(function () {
      $toast.fadeOut(300, function () {
        $(this).remove();
      });
    }, 2500);
  }
});
