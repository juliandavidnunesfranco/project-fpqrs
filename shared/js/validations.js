/* ============================================
   validations.js
   Funciones de validación reutilizables para formularios.

   Son funciones puras de JS: reciben un valor, devuelven true/false.
   Eso las hace fáciles de leer y de probar unitariamente.

   Las dos últimas funciones SÍ usan jQuery porque tocan
   el DOM directamente (mostrar/ocultar mensajes de error).
   ============================================ */

/* --------------------------------------------
   Funcion validarEmail: valida el formato de correo electrónico.
   Regex simple, suficiente para validación de formulario
   (no pretende cubrir el 100% del RFC de email, eso es
   responsabilidad del backend en un sistema real).
   -------------------------------------------- */
function validarEmail(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(valor.trim());
}

/* --------------------------------------------
   La funcion validarCelular: valida el formato de número de celular colombiano.
   Exactamente 10 dígitos, solo números.
   Exige que empiece en 3 (los celulares colombianos
   siempre empiezan así), porque ya es suficientemente
   estricto para esta prueba y evita falsos negativos
   si en el futuro cambia el esquema de numeración.
   -------------------------------------------- */
function validarCelular(valor) {
  const valorLimpio = valor.trim();
  const patron = /^[0-9]{10}$/;
  return patron.test(valorLimpio) && valorLimpio.startsWith("3"); // devuelve true si tiene 10 dígitos y empieza con 3 sin espacios.
}
/* --------------------------------------------
   La funcion validarCedula: valida el formato de número de identificación.
   Solo números, entre 6 y 12 dígitos — cubre cédulas, NIT y cédulas de extranjería colombianas en su rango
   típico de longitud.
   -------------------------------------------- */
function validarCedula(valor) {
  const patron = /^[0-9]{6,12}$/; // solo admite números, entre 6 y 12 dígitos
  return patron.test(valor.trim());
}

/* --------------------------------------------
   La funcion validarCampoRequerido: valida que un campo no esté vacío.
   -------------------------------------------- */
function validarCampoRequerido(valor) {
  return valor !== undefined && valor !== null && valor.trim() !== ""; // devueleve true si el valor no es undefined, null o vacío
}

/* --------------------------------------------
   La funcion validarArchivos: valida la lista de archivos adjuntos al formulario FPQRS 
   Máximo de cantidad y de tamaño por archivo.

   Recibe un FileList (lo que da un <input type="file">
   o un evento de drag&drop) y los límites a aplicar.

   Devuelve un objeto { valido, mensaje } en vez de solo
   true/false, porque acá SÍ es útil saber cuál de los
   dos límites fue el que falló, para mostrar un mensaje
   específico al usuario.
   -------------------------------------------- */
function validarArchivos(listaArchivos, maxCantidad, maxTamanoMB) {
  if (listaArchivos.length > maxCantidad) {
    return {
      valido: false,
      mensaje: `Solo se permiten máximo ${maxCantidad} archivos.`,
    };
  }

  const maxTamanoBytes = maxTamanoMB * 1024 * 1024; // convertir MB a bytes

  for (let i = 0; i < listaArchivos.length; i++) {
    if (listaArchivos[i].size > maxTamanoBytes) {
      return {
        valido: false,
        mensaje: `El archivo "${listaArchivos[i].name}" supera el tamaño máximo de ${maxTamanoMB}MB.`,
      };
    }
  }

  return { valido: true, mensaje: "Archivos validados correctamente." };
}

/* --------------------------------------------
   
   La funcion mostrarErrorCampo: Marca visualmente un campo como inválido
   usando las clases nativas de validación de Bootstrap, y muestra
   el mensaje de error correspondiente.

   $campo: el input/select como objeto jQuery, ej: $('#correo')
   mensaje: el texto a mostrar

   Requiere que en el HTML, justo después del input, exista
   un elemento con la clase .invalid-feedback (es el patrón
   estándar de Bootstrap). 
   Ejemplo:
     <input type="email" id="correo" class="form-control">
     <div class="invalid-feedback">Mensaje de error acá</div>
   -------------------------------------------- */
function mostrarErrorCampo($campo, mensaje) {
  // $campo es un objeto jQuery, ej: $('#correo'), manipula el DOM para mostrar el error
  $campo.addClass("is-invalid");
  $campo.next(".invalid-feedback").text(mensaje);
}

/* --------------------------------------------
   La funcion limpiarErrorCampo: Quita el estado de error de un campo, dejándolo limpio.
   -------------------------------------------- */
function limpiarErrorCampo($campo) {
  // $campo es un objeto jQuery, ej: $('#correo')
  $campo.removeClass("is-invalid");
  $campo.next(".invalid-feedback").text("");
}
