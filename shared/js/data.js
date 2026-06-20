/* ============================================
   data.js
   "Base de datos" simulada del proyecto GestorFPQRS.
   Toda la información acá fue extraída fielmente del
   prototipo original (no inventada), para mantener
   consistencia.

   Este archivo NO depende de jQuery ni de ningún otro
   script.
   
   
   --------------------------------------------------
   ¿POR QUÉ .js Y NO .json?
 
   El correo permite explícitamente usar "datos estáticos,
   archivos JSON o cualquier mecanismo local".  
   Un .json es igual de válido en cuanto al REQUISITO que un .js 
   La razón de elegir .js en vez de .json es puramente técnica:
 
   Un archivo .json no se puede leer directo desde el HTML.
   Hay que pedirlo con fetch() o jquery con $.getJSON(), 
   que son peticiones AJAX. Bajo el protocolo file:// 
   que es lo que usa el navegador cuando se abre un .html con doble
   clic, sin servidor, los navegadores BLOQUEAN esas
   peticiones por política de seguridad (CORS). El error
   típico en consola es algo como:
 
     "Access to fetch at 'file:///.../casos.json' from
      origin 'null' has been blocked by CORS policy"
 
   En la práctica, significa que el JS de la página
   queda "vivo" pero nunca recibe los datos -> la tabla,
   el sidebar, o el formulario se ven vacíos o rotos,
   sin ningún error visible para el usuario del sistema 
   o alguien que no abra la consola del navegador.
 
   Un archivo .js, en cambio, se incluye con una etiqueta
   normal:
     <script src="../../shared/js/datos.js"></script>
 
   Cargar un <script> no es una petición fetch/AJAX, es
   la misma operación que carga jQuery o Bootstrap desde
   el CDN. El navegador la permite sin restricciones,
   incluso bajo file://. Esto garantiza que el proyecto
   funcione abriendo el .html directo con doble clic,
   sin necesitar Live Server, Python ni ningún servidor
   local (aunque en el README también se documenta esa
   alternativa, por si se prefiere).
 
   En resumen: la decisión no es de formato de datos
   (ambos son objetos JS al final), es de COMPATIBILIDAD
   con el método más simple posible de ejecutar el
   proyecto, sin agregar infraestructura adicional.
   ============================================ */
 

/* --------------------------------------------
   1. CUENTAS DEMO
   Tal como aparecen en la vista de login del prototipo.
   URL : https://fpqrslab.estrategiasegura.com/sign-up-login-screen
   -------------------------------------------- */
const cuentasDemo = {
  "admin@coopfinanzas.com.co": {
    password: "Admin@2026!",
    nombre: "Sofía Martínez",
    rol: "Administrador",
  },
  "operador@coopfinanzas.com.co": {
    password: "Oper@2026!",
    nombre: "Carlos Operador",
    rol: "Operador",
  },
  "supervisor@coopfinanzas.com.co": {
    password: "Super@2026!",
    nombre: "Laura Supervisora",
    rol: "Supervisor",
  },
};

/* --------------------------------------------
   2. SERVICIOS (los 12 del formulario de registro)
    URL: https://fpqrslab.estrategiasegura.com/fpqrs-registration-form
   -------------------------------------------- */
const servicios = [
  "Crédito",
  "Ahorro y Captación",
  "Canales Digitales",
  "Atención al Asociado",
  "Pagos y Transferencias",
  "Seguros y Protección",
  "Inversiones",
  "Centrales de Riesgo",
  "Educación Cooperativa",
  "Vinculación y Retiro",
  "Cartera y Cobranza",
  "Certificaciones y Documentos",
];

/* --------------------------------------------
   3. CASCADA: servicio -> categoría -> [subcategorías]

   Los pares marcados con (*) fueron confirmados viendo
   datos reales en la Bandeja de Casos y el Detalle del
   prototipo. El resto se completó de forma coherente
   con el mismo patrón.

   URL: https://fpqrslab.estrategiasegura.com/fpqrs-registration-form
   -------------------------------------------- */
const cascadaServicios = {
  Crédito: {
    "Crédito de Consumo": [
      "Solicitud de refinanciación", // (*) visto en bandeja
      "Reclamo por tasa de interés",
    ],
    "Refinanciación de Crédito": [
      "Inconformidad con condiciones de refinanciación", // (*) visto en bandeja
      "Demora en aprobación",
    ],
  },

  "Ahorro y Captación": {
    "Cuenta de Ahorro": [
      "Saldo incorrecto en cuenta", // (*) visto en bandeja
      "Bloqueo de cuenta sin notificación",
    ],
    CDT: [
      "Error en tasa de CDT", // (*) visto en bandeja
      "Renovación automática no autorizada",
    ],
  },

  "Canales Digitales": {
    "App Móvil": [
      "Sugerencia de nueva funcionalidad en app", // (*) visto en bandeja
      "Error al iniciar sesión en la app",
    ],
    "Portal Web": [
      "Sugerencia de mejora en portal web", // (*) visto en bandeja
      "Página no carga correctamente",
    ],
  },

  "Atención al Asociado": {
    "Atención Presencial": [
      "Felicitación por excelente atención", // (*) visto en bandeja
      "Demora en la atención en oficina",
    ],
    "Atención Virtual": [
      "Chat sin respuesta oportuna", // (*) visto en bandeja
      "Línea telefónica sin respuesta",
    ],
  },

  "Pagos y Transferencias": {
    "Transferencias Nacionales": [
      "Comprobante de transferencia", // (*) visto en bandeja
      "Transferencia no reflejada en destino",
    ],
    "Pago PSE": [
      "Pago PSE no acreditado en destino", // (*) visto en detalle de caso
      "Doble cobro en pago PSE",
    ],
  },

  "Seguros y Protección": {
    "Seguro de Vida": [
      "Solicitud de información de póliza",
      "Reclamo de siniestro",
    ],
    "Seguro de Deudores": [
      "Cobro indebido de prima",
      "Solicitud de certificado de cobertura",
    ],
  },

  Inversiones: {
    "Fondos de Inversión": [
      "Consulta de rendimientos",
      "Solicitud de retiro de fondo",
    ],
    "Bonos y Títulos": [
      "Error en liquidación de título",
      "Solicitud de extracto de inversión",
    ],
  },

  "Centrales de Riesgo": {
    "Reporte en Central": [
      "Solicitud de actualización de reporte",
      "Reclamo por reporte negativo indebido",
    ],
    "Score Crediticio": [
      "Consulta sobre score crediticio",
      "Solicitud de explicación de calificación",
    ],
  },

  "Educación Cooperativa": {
    Capacitaciones: [
      "Solicitud de cupo en capacitación",
      "Sugerencia de nuevo tema de formación",
    ],
    "Material Educativo": [
      "Solicitud de material informativo",
      "Error en contenido publicado",
    ],
  },

  "Vinculación y Retiro": {
    "Vinculación de Asociado": [
      "Demora en proceso de vinculación",
      "Solicitud de requisitos de ingreso",
    ],
    "Retiro de Asociado": [
      "Solicitud de retiro voluntario",
      "Consulta de saldos a devolver",
    ],
  },

  "Cartera y Cobranza": {
    "Reestructuración de Crédito": [
      "Demora en proceso de reestructuración", // (*) visto en bandeja
      "Inconformidad con nuevas condiciones",
    ],
    "Gestión de Cobranza": [
      "Reclamo por llamadas de cobranza",
      "Solicitud de acuerdo de pago",
    ],
  },

  "Certificaciones y Documentos": {
    "Certificados Bancarios": [
      "Solicitud de certificado de cuenta",
      "Error en datos del certificado",
    ],
    "Extractos y Estados de Cuenta": [
      "Solicitud de extracto histórico",
      "Extracto no llega al correo registrado",
    ],
  },
};

/* --------------------------------------------
   4. TIPOS DE CASO, PRIORIDADES Y ESTADOS
   Tal como aparecen en el prototipo (Bandeja + Formulario).

   URL: https://fpqrslab.estrategiasegura.com/fpqrs-registration-form  -- Formulario de registro
   URL: https://fpqrslab.estrategiasegura.com/case-management-inbox    -- Bandeja de Casos (tipos y estados)
   -------------------------------------------- */
const tiposCaso = [
  "Felicitación",
  "Petición",
  "Queja",
  "Reclamo",
  "Sugerencia",
];

const prioridades = ["Baja", "Normal", "Alta", "Crítica"];

const estadosCaso = [
  "Radicado",
  "En Gestión",
  "Pendiente de Información",
  "Cerrado",
];

const tiposIdentificacion = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "NIT",
  "Pasaporte",
];

/* --------------------------------------------
   5. CASOS SIMULADOS (para la Bandeja de Casos)

   Los primeros 10 son EXACTOS al prototipo real
   (mismo radicado, mismo asociado, mismo responsable).
   Del 11 en adelante se generan variaciones coherentes
   para tener suficiente volumen y que la paginación
   tenga sentido (el prototipo real muestra "205 casos").
   -------------------------------------------- */

// Los 10 casos reales vistos en el prototipo
const casosReales = [
  {
    radicado: "FPQRS-2026-04758",
    fechaRadicado: "2026-05-07",
    tipo: "Felicitación",
    servicio: "Atención al Asociado",
    categoria: "Atención Presencial",
    subcategoria: "Felicitación por excelente atención",
    asociado: "Sandra Milena Aguirre Torres",
    responsable: "Valentina Ospina Ríos",
    prioridad: "Baja",
    estado: "Cerrado",
    limiteSLA: "2026-05-09",
    semaforo: "Cerrado",
  },
  {
    radicado: "FPQRS-2026-04290",
    fechaRadicado: "2026-05-07",
    tipo: "Sugerencia",
    servicio: "Pagos y Transferencias",
    categoria: "Transferencias Nacionales",
    subcategoria: "Comprobante de transferencia",
    asociado: "Yolanda Cecilia Prada Niño",
    responsable: "Jorge Iván Castillo",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-08",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04760",
    fechaRadicado: "2026-05-07",
    tipo: "Sugerencia",
    servicio: "Canales Digitales",
    categoria: "App Móvil",
    subcategoria: "Sugerencia de nueva funcionalidad en app",
    asociado: "Andrés Camilo Rojas Velandia",
    responsable: "Iván Darío Zapata",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-12",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04510",
    fechaRadicado: "2026-05-07",
    tipo: "Sugerencia",
    servicio: "Atención al Asociado",
    categoria: "Atención Virtual",
    subcategoria: "Chat sin respuesta oportuna",
    asociado: "Beatriz Elena Montoya Arango",
    responsable: "Patricia Inés Agudelo",
    prioridad: "Normal",
    estado: "Radicado",
    limiteSLA: "2026-05-08",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04700",
    fechaRadicado: "2026-05-06",
    tipo: "Sugerencia",
    servicio: "Canales Digitales",
    categoria: "Portal Web",
    subcategoria: "Sugerencia de mejora en portal web",
    asociado: "Patricia Inés Londoño Vélez",
    responsable: "Iván Darío Zapata",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-07",
    semaforo: "Próximo a vencer",
  },
  {
    radicado: "FPQRS-2026-04035",
    fechaRadicado: "2026-05-06",
    tipo: "Sugerencia",
    servicio: "Ahorro y Captación",
    categoria: "CDT",
    subcategoria: "Error en tasa de CDT",
    asociado: "Diana Marcela Ríos Castillo",
    responsable: "Camilo Ernesto Herrera",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-11",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04610",
    fechaRadicado: "2026-05-06",
    tipo: "Sugerencia",
    servicio: "Crédito",
    categoria: "Refinanciación de Crédito",
    subcategoria: "Inconformidad con condiciones de refinanciación",
    asociado: "Beatriz Elena Montoya Arango",
    responsable: "Diana Carolina Ríos",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-09",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04200",
    fechaRadicado: "2026-05-06",
    tipo: "Sugerencia",
    servicio: "Cartera y Cobranza",
    categoria: "Reestructuración de Crédito",
    subcategoria: "Demora en proceso de reestructuración",
    asociado: "Patricia Inés Londoño Vélez",
    responsable: "Adriana Milena Cortés",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-09",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04450",
    fechaRadicado: "2026-05-06",
    tipo: "Sugerencia",
    servicio: "Crédito",
    categoria: "Crédito de Consumo",
    subcategoria: "Solicitud de refinanciación",
    asociado: "Andrés Camilo Rojas Velandia",
    responsable: "Carlos Andrés Moreno",
    prioridad: "Baja",
    estado: "Radicado",
    limiteSLA: "2026-05-11",
    semaforo: "En tiempo",
  },
  {
    radicado: "FPQRS-2026-04751",
    fechaRadicado: "2026-05-06",
    tipo: "Reclamo",
    servicio: "Ahorro y Captación",
    categoria: "Cuenta de Ahorro",
    subcategoria: "Saldo incorrecto en cuenta",
    asociado: "Hernán Darío Quintero Salazar",
    responsable: "Marcela Suárez Peña",
    prioridad: "Alta",
    estado: "En Gestión",
    limiteSLA: "2026-05-07",
    semaforo: "Próximo a vencer",
  },
  // El caso completo visto en la vista de Detalle
  {
    radicado: "FPQRS-2026-04779",
    fechaRadicado: "2026-05-04",
    tipo: "Queja",
    servicio: "Pagos y Transferencias",
    categoria: "Pago PSE",
    subcategoria: "Pago PSE no acreditado en destino",
    asociado: "Jorge Luis Patiño Restrepo",
    responsable: "Rodrigo Esteban Muñoz",
    prioridad: "Crítica",
    estado: "Pendiente de Información",
    limiteSLA: "2026-05-04",
    semaforo: "Vencido",
    // Datos adicionales solo presentes en este caso (vista de Detalle)
    identificacion: "CC 71456023",
    correo: "jl.patino@empresa.com.co",
    celular: "3209876543",
    direccion: "Av El Poblado #12-45, Medellín",
    canal: "App Móvil",
    slaAplicado: "4h",
    tipoCausa: "Falla en pasarela de pago PSE",
    descripcion:
      "Pago PSE por $2.350.000 al banco Davivienda no fue acreditado. Código: PSE-20260503-8847.",
    areaResponsable: "Operaciones Financieras",
  },
];

// Nombres y apellidos colombianos para generar más casos de ejemplo coherentes
const nombresEjemplo = [
  "Mariana Gómez Salcedo",
  "Felipe Ortiz Mendoza",
  "Catalina Vargas Buitrago",
  "Santiago Ramírez Cuesta",
  "Laura Daniela Pérez",
  "Esteban Ríos Quintero",
  "Valentina Cardona Restrepo",
  "Juan Pablo Sánchez",
  "Isabella Torres Marín",
  "Daniel Felipe Castaño",
];

const responsablesEjemplo = [
  "Camilo Ernesto Herrera",
  "Diana Carolina Ríos",
  "Marcela Suárez Peña",
  "Jorge Iván Castillo",
  "Iván Darío Zapata",
  "Adriana Milena Cortés",
  "Carlos Andrés Moreno",
  "Patricia Inés Agudelo",
  "Valentina Ospina Ríos",
];

/* --------------------------------------------
   Funcion que genera casos adicionales coherentes con el prototipo,
   combinando aleatoriamente servicios/categorías válidos
   de la cascada, para llegar a un volumen razonable e igual al propuesto (205 casos).
   -------------------------------------------- */
function generarCasosAdicionales(cantidad) {
  const casos = [];
  const listaServicios = Object.keys(cascadaServicios);

  for (let i = 0; i < cantidad; i++) {
    const servicio = listaServicios[i % listaServicios.length];
    const categorias = Object.keys(cascadaServicios[servicio]);
    const categoria = categorias[i % categorias.length];
    const subcategorias = cascadaServicios[servicio][categoria];
    const subcategoria = subcategorias[i % subcategorias.length];

    const semaforos = [
      "En tiempo",
      "En tiempo",
      "En tiempo",
      "Próximo a vencer",
      "Vencido",
    ];
    const semaforo = semaforos[i % semaforos.length];
    const estado =
      semaforo === "Vencido"
        ? "Pendiente de Información"
        : i % 4 === 0
          ? "En Gestión"
          : "Radicado";

    casos.push({
      radicado: `FPQRS-2026-0${3000 + i}`,
      fechaRadicado: `2026-05-0${(i % 7) + 1}`,
      tipo: tiposCaso[i % tiposCaso.length],
      servicio: servicio,
      categoria: categoria,
      subcategoria: subcategoria,
      asociado: nombresEjemplo[i % nombresEjemplo.length],
      responsable: responsablesEjemplo[i % responsablesEjemplo.length],
      prioridad: prioridades[i % prioridades.length],
      estado: estado,
      limiteSLA: `2026-05-${10 + (i % 15)}`,
      semaforo: semaforo,
    });
  }

  return casos;
}

// Array final que vamos a usar en la Bandeja de Casos:
// los 11 reales + 194 generados = 205 casos en total
const casosSimulados = casosReales.concat(generarCasosAdicionales(194));


/*----------By juliandev - 2026-06-19----------
Resumen:
En este archivo se simula una "base de datos" local con objetos JS, 
que luego se incluyen en el HTML con una etiqueta <script>. 
Esto es para evitar problemas de CORS al usar fetch() o $.getJSON() con archivos .json bajo file://, 
Garantiza que el proyecto funcione abriendo el .html directo con doble clic, sin necesidad de un servidor local.
Ademas contiene datos reales extraídos del prototipo, y una función para generar casos adicionales coherentes, llegando al volumen propuesto de 205 casos.
---*/