/* ============================================
   LOGIN.JS
   Lógica específica de la vista de Login.

   DEPENDE DE (cargados antes en login.html):
   - jQuery
   - datos.js     (cuentasDemo)
   - sesion.js    (validarCredenciales, iniciarSesion, obtenerSesionActiva)
   - validaciones.js (validarEmail, validarCampoRequerido,
     mostrarErrorCampo, limpiarErrorCampo)
   ============================================ */

$(document).ready(function () {
  /* --------------------------------------------
     Si ya hay sesión activa (en localStorage o
     sessionStorage) y alguien vuelve a abrir el login,
     lo mandamos directo a la bandeja en vez de mostrarle
     el formulario de nuevo.
     -------------------------------------------- */
  if (obtenerSesionActiva()) {
    window.location.href = "../cases-tray/cases-tray.html";
    return;
  }

  /* --------------------------------------------
     Pintar la lista de cuentas demo a partir de
     cuentasDemo (datos.js), en vez de tenerlas
     hardcodeadas en el HTML — una sola fuente de verdad.
     -------------------------------------------- */
  function renderCuentasDemo() {
    let html = "";

    Object.keys(cuentasDemo).forEach(function (correo) {
      const cuenta = cuentasDemo[correo];

      html += `
      <li class="login-cuenta-demo" data-correo="${correo}" data-password="${cuenta.password}" tabindex="0" role="button">
        <div class="login-cuenta-demo-info">
          <span class="login-cuenta-demo-rol">${cuenta.rol}</span>
          <p class="login-cuenta-demo-correo">${correo}</p>
          <p class="login-cuenta-demo-password">${cuenta.password}</p>
        </div>
      </li>
    `;
    });

    $("#lista-cuentas-demo").html(html);
  }
  renderCuentasDemo();

  /* --------------------------------------------
     Click (o Enter, por accesibilidad de teclado) en
     una fila de cuenta demo -> autocompleta el formulario.
     Delegación de evento porque las filas se crean
     dinámicamente arriba.
     -------------------------------------------- */
  $("#lista-cuentas-demo").on("click", ".login-cuenta-demo", function () {
    autocompletarDesdeFila($(this));
  });

  $("#lista-cuentas-demo").on(
    "keydown",
    ".login-cuenta-demo",
    function (evento) {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        autocompletarDesdeFila($(this));
      }
    },
  );

  function autocompletarDesdeFila($fila) {
    $("#correo").val($fila.data("correo"));
    $("#password").val($fila.data("password"));
    limpiarErrorCampo($("#correo"));
    limpiarErrorCampo($("#password"));
    $("#mensaje-error-login").addClass("d-none");
  }

  /* --------------------------------------------
     Toggle de mostrar/ocultar contraseña.
     -------------------------------------------- */
  $("#btn-toggle-password").on("click", function () {
    const $input = $("#password");
    const $icono = $(this).find("i");
    const mostrando = $input.attr("type") === "text";

    if (mostrando) {
      $input.attr("type", "password");
      $icono.removeClass("bi-eye-slash").addClass("bi-eye");
      $(this)
        .attr("aria-label", "Mostrar contraseña")
        .attr("aria-pressed", "false");
    } else {
      $input.attr("type", "text");
      $icono.removeClass("bi-eye").addClass("bi-eye-slash");
      $(this)
        .attr("aria-label", "Ocultar contraseña")
        .attr("aria-pressed", "true");
    }
  });

  /* --------------------------------------------
     Submit del formulario: valida, autentica, y si
     todo sale bien, inicia sesión y redirige.
     -------------------------------------------- */
  $("#form-login").on("submit", function (evento) {
    evento.preventDefault();

    const $correo = $("#correo");
    const $password = $("#password");
    const correo = $correo.val().trim();
    const password = $password.val();

    let formularioValido = true;

    // Limpiar errores previos antes de revalidar
    limpiarErrorCampo($correo);
    limpiarErrorCampo($password);
    $("#mensaje-error-login").addClass("d-none");

    if (!validarCampoRequerido(correo)) {
      mostrarErrorCampo($correo, "El correo es obligatorio.");
      formularioValido = false;
    } else if (!validarEmail(correo)) {
      mostrarErrorCampo($correo, "Ingrese un correo electrónico válido.");
      formularioValido = false;
    }

    if (!validarCampoRequerido(password)) {
      mostrarErrorCampo($password, "La contraseña es obligatoria.");
      formularioValido = false;
    }

    if (!formularioValido) {
      return;
    }

    // Formato válido -> ahora sí, autenticar contra las cuentas demo
    const usuario = validarCredenciales(correo, password);

    if (!usuario) {
      $("#mensaje-error-login")
        .removeClass("d-none")
        .text(
          "Correo o contraseña incorrectos. Verifique sus credenciales o use una cuenta de demostración.",
        );
      return;
    }

    // Login exitoso: el checkbox decide si la sesión se
    // recuerda (localStorage) o dura solo esta pestaña (sessionStorage)
    const recordar = $("#recordar-sesion").is(":checked");
    iniciarSesion(usuario, recordar);

    window.location.href = "../cases-tray/cases-tray.html";
  });
});
