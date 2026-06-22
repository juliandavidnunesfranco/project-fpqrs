/* ============================================
   session.js
   Maneja la sesión simulada del usuario usando localStorage.
   
   DEPENDE DE: data.js (necesita el objeto cuentasDemo)
   Por eso en el <head>/<body> de cada página, este script
   debe cargarse DESPUÉS de data.js y justo en ese orden.

   No depende de jQuery — son funciones JS puro, reutilizables
   desde cualquier script de página (login.js, bandeja-casos.js,
   etc.) sin importar si ya cargó jQuery o no todavía.

   Sirve como "sistema de autenticación" para el prototipo, aunque no es un sistema real ni seguro, obviamente.
   ============================================ */

const CLAVE_SESSION = "fpqrs_usuario_activo";

/* --------------------------------------------
   la funcion validarCredenciales intenta autenticar los parametros recibidos (correo + password) 
   contra las cuentas demo. Devuelve el objeto de usuario si es válido, o null si no coincide.
   -------------------------------------------- */
function validarCredenciales(correo, password) {
  const cuenta = cuentasDemo[correo]; // cuentasDemo viene de data.js, es un objeto con las cuentas mock del prototipo. js permite acceder a sus propiedades con la sintaxis de corchetes, usando el correo como clave.

  if (!cuenta || cuenta.password !== password) {
    return null;
  }

  return {
    nombre: cuenta.nombre,
    rol: cuenta.rol,
    correo: correo,
  };
}

/* --------------------------------------------
   La funcion iniciarSession guarda la sesión activa en localStorage.
   Se llama una sola vez, cuando el login fue exitoso.
   Recibe como parametro un objeto con los datos del usuario (nombre, rol, correo)
   lo guarda como JSON en localStorage bajo la clave definida en CLAVE_SESSION.
   En el caso que el parametro usuario sea inválido (null, undefined o sin correo), se loguea un error y no podra acceder.
   En el caso que no se cuente con localStorage (navegador muy antiguo o modo incógnito), se loguea un error y no podra acceder adicionalmente se le notifica al usuario.
   -------------------------------------------- */
function iniciarSesion(usuario, recordar) {
  if (!usuario || !usuario.correo) {
    console.error("Usuario inválido para iniciar sesión:", usuario);
    return;
  }

  if (typeof window.localStorage === "undefined") {
    alert(
      "No se pudo iniciar sesión\n\n" +
        "Tu navegador no permite guardar la sesión en este modo.\n" +
        "Intenta desactivar el modo incógnito o usar otro navegador.",
    );
    console.error(
      "localStorage no está disponible en este navegador. La sesión no se podrá mantener.",
    );
    return;
  }
  const storage = recordar ? window.localStorage : window.sessionStorage;

  try {
    storage.setItem(CLAVE_SESSION, JSON.stringify(usuario));
  } catch (error) {
    alert(
      "No se pudo iniciar sesión\n\n" +
        "Ocurrió un error al guardar sesión.\n" +
        "Intenta en otro navegador o desactiva el modo incógnito.",
    );
    console.error("Error al guardar la sesión:", error);
  }
}

/* --------------------------------------------
   La funcion obtenerSesionActiva lee la sesión actual desde localStorage.
   Devuelve el objeto usuario:{ nombre, rol, correo } o null si no hay nadie logueado.
   -------------------------------------------- */
function obtenerSesionActiva() {
  const data =
    localStorage.getItem(CLAVE_SESSION) ||
    sessionStorage.getItem(CLAVE_SESSION);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    // Si por algún motivo el dato guardado está corrupto,
    // lo tratamos como si no hubiera sesión, en vez de
    // romper toda la página con un error de JSON.parse.
    console.error("Sesión corrupta, se ignora:", error);
    localStorage.removeItem(CLAVE_SESSION);
    sessionStorage.removeItem(CLAVE_SESSION);
    return null;
  }
}

/* --------------------------------------------
   La funcion cerrarSesion, cierra la sesión: borra el dato de localStorage
   y redirige al login.

   Recibe la ruta relativa al login porque cada página
   está a una profundidad distinta dentro de /pages/.
   -------------------------------------------- */
function cerrarSesion(rutaLogin) {
  localStorage.removeItem(CLAVE_SESSION);
  sessionStorage.removeItem(CLAVE_SESSION);
  window.location.href = rutaLogin || "../login/login.html";
}

/* --------------------------------------------
   La funcion protegerPagina: es un guardia que se llama al inicio de cada página protegida
   (todas excepto login). Si no hay sesión activa, redirige al login y devuelve null para que el script que llamó
   pueda cortar su propia ejecución con un "return".

   Uso típico en cada página protegida:

     const usuario = protegerPagina('../login/login.html');
     if (!usuario) return;
     // a partir de acá, ya sabemos que hay sesión válida
   -------------------------------------------- */
function protegerPagina(rutaLogin) {
  const usuario = obtenerSesionActiva();

  if (!usuario) {
    window.location.href = rutaLogin || "../login/login.html";
    // permite no pasar el parametro y usar la ruta por defecto:"../login/login.html",
    // aplica para este caso donde todas las páginas protegidas tienen la misma ruta relativa al login
    // es decir la misma profundidad dentro de /pages/, pero podria ser necesario si el proyecto crece y se agregan páginas protegidas a distintas profundidades.
    return null;
  }

  return usuario;
}
