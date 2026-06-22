/* ============================================
   FPQRS-REGISTER.JS
   Lógica del formulario público de registro FPQRS.

   DEPENDE DE:
   - jQuery
   - data.js       (servicios, cascadaServicios, tiposCaso)
   - validations.js (validarEmail, validarCelular, validarCedula,
                     validarCampoRequerido, validarArchivos,
                     mostrarErrorCampo, limpiarErrorCampo)

   NO depende de session.js — esta vista es pública,
   no requiere autenticación.
   ============================================ */

$(document).ready(function () {
  /* ------------------------------------------
     1. POBLAR SELECTS ESTÁTICOS (Servicios)
     ------------------------------------------ */
  servicios.forEach(function (srv) {
    $("#servicio").append(`<option value="${srv}">${srv}</option>`);
  });

  /* ------------------------------------------
     2. CASCADA: Servicio → Categoría → Subcategoría
     ------------------------------------------ */
  $("#servicio").on("change", function () {
    const srv = $(this).val();

    // Resetear categoría y subcategoría
    $("#categoria")
      .empty()
      .append('<option value="">Seleccionar categoría...</option>')
      .prop("disabled", true);
    $("#subcategoria")
      .empty()
      .append('<option value="">Seleccionar subcategoría...</option>')
      .prop("disabled", true);

    limpiarErrorCampo($("#servicio"));
    limpiarErrorCampo($("#categoria"));
    limpiarErrorCampo($("#subcategoria"));

    if (!srv || !cascadaServicios[srv]) return;

    // Poblar categorías
    Object.keys(cascadaServicios[srv]).forEach(function (cat) {
      $("#categoria").append(`<option value="${cat}">${cat}</option>`);
    });

    $("#categoria").prop("disabled", false);
    $("#hint-categoria").text(
      "Seleccione la categoría que corresponde a su caso",
    );
  });

  $("#categoria").on("change", function () {
    const srv = $("#servicio").val();
    const cat = $(this).val();

    $("#subcategoria")
      .empty()
      .append('<option value="">Seleccionar subcategoría...</option>')
      .prop("disabled", true);
    limpiarErrorCampo($("#subcategoria"));

    if (!cat || !cascadaServicios[srv] || !cascadaServicios[srv][cat]) return;

    cascadaServicios[srv][cat].forEach(function (sub) {
      $("#subcategoria").append(`<option value="${sub}">${sub}</option>`);
    });

    $("#subcategoria").prop("disabled", false);
    $("#hint-subcategoria").text(
      "Seleccione la subcategoría que mejor describe su caso",
    );
  });

  /* ------------------------------------------
     3. DRAG & DROP DE ARCHIVOS
     ------------------------------------------ */
  const MAX_ARCHIVOS = 5;
  const MAX_MB = 5;
  let archivosSeleccionados = [];

  const $zona = $("#zona-archivos");
  const $inputArchivos = $("#input-archivos");

  // Clic en la zona activa el input file
  $zona.on("click", function () {
    $inputArchivos.trigger("click");
  });

  // Accesibilidad: Enter/Space también activa
  $zona.on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      $inputArchivos.trigger("click");
    }
  });

  // Drag events
  $zona.on("dragover dragenter", function (e) {
    e.preventDefault();
    $zona.addClass("drag-over");
  });

  $zona.on("dragleave drop", function (e) {
    e.preventDefault();
    $zona.removeClass("drag-over");
  });

  $zona.on("drop", function (e) {
    const archivos = e.originalEvent.dataTransfer.files;
    procesarArchivos(archivos);
  });

  // Selección por input
  $inputArchivos.on("change", function () {
    procesarArchivos(this.files);
    // Reset input para permitir seleccionar el mismo archivo de nuevo
    this.value = "";
  });

  function procesarArchivos(nuevos) {
    const resultado = validarArchivos(
      nuevos,
      MAX_ARCHIVOS - archivosSeleccionados.length,
      MAX_MB,
    );

    if (!resultado.valido) {
      $("#error-archivos").text(resultado.mensaje);
      return;
    }

    $("#error-archivos").text("");

    Array.from(nuevos).forEach(function (archivo) {
      if (archivosSeleccionados.length >= MAX_ARCHIVOS) {
        $("#error-archivos").text(
          `Solo se permiten máximo ${MAX_ARCHIVOS} archivos.`,
        );
        return;
      }
      archivosSeleccionados.push(archivo);
    });

    renderListaArchivos();
  }

  function renderListaArchivos() {
    const $lista = $("#lista-archivos");
    $lista.empty();

    archivosSeleccionados.forEach(function (archivo, idx) {
      const kb = (archivo.size / 1024).toFixed(0);
      const tamano =
        archivo.size >= 1024 * 1024
          ? (archivo.size / 1024 / 1024).toFixed(1) + " MB"
          : kb + " KB";

      $lista.append(`
        <li class="archivo-item">
          <i class="bi bi-file-earmark" aria-hidden="true"></i>
          <span class="archivo-item__nombre">${archivo.name}</span>
          <span class="archivo-item__tamano">${tamano}</span>
          <button type="button" class="archivo-item__borrar" data-idx="${idx}" aria-label="Eliminar ${archivo.name}">
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        </li>
      `);
    });
  }

  // Borrar archivo de la lista
  $("#lista-archivos").on("click", ".archivo-item__borrar", function () {
    const idx = parseInt($(this).data("idx"));
    archivosSeleccionados.splice(idx, 1);
    $("#error-archivos").text("");
    renderListaArchivos();
  });

  /* ------------------------------------------
     4. LIMPIAR ERRORES EN TIEMPO REAL
     ------------------------------------------ */
  $("#form-fpqrs").on("change input", "input, select, textarea", function () {
    if ($(this).hasClass("is-invalid")) {
      limpiarErrorCampo($(this));
    }
  });

  /* ------------------------------------------
     5. VALIDACIÓN Y ENVÍO DEL FORMULARIO
     ------------------------------------------ */
  $("#form-fpqrs").on("submit", function (e) {
    e.preventDefault();

    let formularioValido = true;

    // Helper
    function validar($campo, condicion, mensaje) {
      if (!condicion) {
        mostrarErrorCampo($campo, mensaje);
        formularioValido = false;
      } else {
        limpiarErrorCampo($campo);
      }
    }

    // Tipo de identificación
    validar(
      $("#tipo-id"),
      validarCampoRequerido($("#tipo-id").val()),
      "Seleccione el tipo de identificación.",
    );

    // Número de identificación
    validar(
      $("#numero-id"),
      validarCedula($("#numero-id").val()),
      "Ingrese un número de identificación válido (6–12 dígitos).",
    );

    // Nombre completo
    validar(
      $("#nombre-completo"),
      validarCampoRequerido($("#nombre-completo").val()),
      "Ingrese su nombre completo.",
    );

    // Correo
    validar(
      $("#correo"),
      validarEmail($("#correo").val()),
      "Ingrese un correo electrónico válido.",
    );

    // Celular
    validar(
      $("#celular"),
      validarCelular($("#celular").val()),
      "Ingrese un celular colombiano válido (10 dígitos, inicia en 3).",
    );

    // Tipo de caso
    validar(
      $("#tipo-caso"),
      validarCampoRequerido($("#tipo-caso").val()),
      "Seleccione el tipo de caso.",
    );

    // Servicio
    validar(
      $("#servicio"),
      validarCampoRequerido($("#servicio").val()),
      "Seleccione el servicio.",
    );

    // Categoría
    validar(
      $("#categoria"),
      validarCampoRequerido($("#categoria").val()),
      "Seleccione la categoría.",
    );

    // Subcategoría
    validar(
      $("#subcategoria"),
      validarCampoRequerido($("#subcategoria").val()),
      "Seleccione la subcategoría.",
    );

    // Descripción
    validar(
      $("#descripcion"),
      validarCampoRequerido($("#descripcion").val()),
      "Ingrese una descripción del caso.",
    );

    // Autorización
    if (!$("#chk-autorizacion").is(":checked")) {
      $("#error-autorizacion").text(
        "Debe autorizar el tratamiento de datos personales para continuar.",
      );
      formularioValido = false;
    } else {
      $("#error-autorizacion").text("");
    }

    if (!formularioValido) {
      // Scroll al primer error
      const $primerError = $(".is-invalid").first();
      if ($primerError.length) {
        $("html, body").animate(
          { scrollTop: $primerError.offset().top - 100 },
          300,
        );
      }
      return;
    }

    // Formulario válido — simular radicado
    simularRadicado();
  });

  /* ------------------------------------------
     6. SIMULAR RADICADO EXITOSO
     ------------------------------------------ */
  function simularRadicado() {
    const $btn = $("#btn-radicar");
    $btn
      .prop("disabled", true)
      .html('<i class="bi bi-hourglass-split"></i> Radicando...');

    setTimeout(function () {
      const numeroRadicado = generarNumeroRadicado();

      // Mostrar modal de éxito
      $("#exito-radicado").text(`Número de radicado: ${numeroRadicado}`);
      $("#modal-exito").removeAttr("hidden");
      $("#modal-exito").focus();

      $btn
        .prop("disabled", false)
        .html('Radicar caso FPQRS <i class="bi bi-chevron-right"></i>');
    }, 1200);
  }

  function generarNumeroRadicado() {
    const año = new Date().getFullYear();
    const consecutivo = String(Math.floor(Math.random() * 90000) + 10000);
    return `FPQRS-${año}-${consecutivo}`;
  }

  /* ------------------------------------------
     7. BOTÓN "RADICAR OTRO CASO"
     ------------------------------------------ */
  $("#btn-nuevo-caso").on("click", function () {
    $("#modal-exito").attr("hidden", true);
    $("#form-fpqrs")[0].reset();
    archivosSeleccionados = [];
    renderListaArchivos();
    $("#categoria")
      .empty()
      .append('<option value="">Seleccionar categoría...</option>')
      .prop("disabled", true);
    $("#subcategoria")
      .empty()
      .append('<option value="">Seleccionar subcategoría...</option>')
      .prop("disabled", true);
    $("html, body").animate({ scrollTop: 0 }, 300);
  });
});
