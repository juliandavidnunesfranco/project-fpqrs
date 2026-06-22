# GestorFPQRS — Prueba Técnica Maquetador Web
**Estrategia Segura S.A.S. · Junio 2026**

Maquetación web del sistema de gestión de casos FPQRS para CoopFinanzas, desarrollada como prueba técnica para el cargo de Maquetador Web.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| HTML5 | — | Estructura semántica de las 4 vistas |
| CSS3 | — | Estilos propios, variables CSS, responsive |
| Bootstrap | 5.3.8 | Grid, utilidades, componentes base |
| Bootstrap Icons | 1.11.3 | Íconos de la interfaz |
| JavaScript | ES6 | Lógica de cada vista |
| jQuery | 3.7.1 | Manipulación del DOM, eventos, AJAX-free |
| Plus Jakarta Sans | — | Tipografía real del prototipo (Google Fonts) |

Todas las dependencias se cargan vía CDN. No se utilizó Tailwind CSS, React, Angular, Vue ni ningún otro framework JavaScript.

---

## Estructura del proyecto

```
project-fpqrs/
├── README.md
├── assets/
│   └── img/
│       └── logo-prototipo.png          # Logo real descargado del prototipo
├── pages/
│   ├── login/
│   │   ├── login.html
│   │   ├── login.css
│   │   └── login.js
│   ├── cases-tray/
│   │   ├── cases-tray.html
│   │   ├── cases-tray.css
│   │   └── cases-tray.js
│   ├── cases-details/
│   │   ├── cases-details.html
│   │   ├── cases-details.css
│   │   └── cases-details.js
│   └── fpqrs-register/
│       ├── fpqrs-register.html
│       ├── fpqrs-register.css
│       └── fpqrs-register.js
└── shared/
    ├── css/
    │   ├── variables.css               # Custom properties del sistema de diseño
    │   ├── reset.css                   # Normalización del navegador
    │   └── components.css             # Sidebar, badges, KPI cards, utilidades
    └── js/
        ├── data.js                     # Datos simulados (cuentas, casos, servicios)
        ├── session.js                  # Manejo de sesión con localStorage/sessionStorage
        ├── sidebar.js                  # Sidebar generado dinámicamente con JS
        └── validations.js             # Funciones de validación reutilizables
```

---

## Instrucciones para ejecutar

### Opción recomendada — Live Server (VS Code)

1. Clonar o descomprimir el proyecto
2. Abrir la carpeta raíz en VS Code
3. Instalar la extensión **Live Server** (ritwickdey.LiveServer) si no la tiene
4. Click derecho sobre `pages/login/login.html` → **Open with Live Server**
5. El proyecto abre en `http://127.0.0.1:5500/pages/login/login.html`

### Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@coopfinanzas.com.co | Admin@2026! |
| Operador | operador@coopfinanzas.com.co | Oper@2026! |
| Supervisor | supervisor@coopfinanzas.com.co | Super@2026! |

Las cuentas aparecen en el formulario de login y se pueden seleccionar con un clic para autocompletar.

### Flujo de navegación

```
login.html → cases-tray.html → cases-details.html
                             → fpqrs-register.html (vista pública, sin sesión)
```

---

## Vistas implementadas

### 1. Inicio de sesión (`pages/login/login.html`)
- Layout de 2 columnas: panel azul marino con información de la plataforma + panel blanco con formulario
- Toggle mostrar/ocultar contraseña
- Checkbox "Recordar sesión" (localStorage vs sessionStorage)
- Cuentas de demostración con autocompletado al hacer clic
- Validación de credenciales contra datos simulados
- Mini-logo visible en pantallas menores a 1024px (mejora de UX documentada: el prototipo original oculta completamente el panel de marca sin reemplazo en mobile)

### 2. Bandeja de Casos (`pages/cases-tray/cases-tray.html`)
- Sidebar colapsable con 11 links (4 habilitados, 7 en estado visual de fuera de alcance)
- 4 KPI cards con indicadores en tiempo real
- Tabla de 13 columnas con badges de tipo, prioridad, estado y semáforo SLA
- Búsqueda en tiempo real por radicado, asociado, tipo y servicio
- Paginación client-side con ventana de páginas visibles
- 205 casos simulados (11 reales del prototipo + 194 generados coherentemente)

### 3. Detalle de Caso (`pages/cases-details/cases-details.html`)
- Header con breadcrumb, badges de estado y alerta SLA
- Grid de 2 columnas: datos del caso (izquierda) + panel de acciones (derecha)
- 5 tabs accesibles: Descripción, Comentarios, Adjuntos, Historial, Respuestas
- Cambio de estado, prioridad y responsable simulado con toast de confirmación
- Registro de observaciones con opción de notificar al asociado

### 4. Formulario de Radicación FPQRS (`pages/fpqrs-register/fpqrs-register.html`)
- Vista pública — no requiere autenticación, no tiene sidebar
- Header azul marino con logo e indicador de disponibilidad del servicio
- 3 fieldsets: Datos personales, Datos del caso, Documentos de soporte
- Selects en cascada reales: Servicio → Categoría → Subcategoría (datos del prototipo)
- Drag & drop de archivos con validación (máx. 5 archivos, 5 MB c/u)
- Autorización Ley 1581 de 2012
- Modal de éxito con número de radicado generado (`FPQRS-YYYY-XXXXX`)

---

## Consideraciones técnicas relevantes

### Paleta de colores extraída del DOM real
Los colores no son aproximaciones visuales — fueron extraídos inspeccionando el DOM del prototipo con DevTools (pestaña Elementos → Estilos → `:root`). Esto incluye los 8 estados de caso, 4 prioridades y 4 semáforos SLA con sus valores hexadecimales exactos.

### `data.js` como `.js` en vez de `.json`
Los datos simulados se definen como variables JavaScript en vez de un archivo `.json`. Motivo: bajo el protocolo `file://` (abrir HTML sin servidor), el navegador bloquea `fetch()` y `$.getJSON()` por restricciones CORS. Un `<script src="">` no tiene esa restricción, garantizando que el proyecto funcione sin servidor Node.js ni configuración adicional.

### Sidebar generado dinámicamente
El sidebar se genera con template strings en `sidebar.js` en vez de `$.load()` o `fetch()`. Misma razón CORS bajo `file://`. Esto también facilita que cada página pueda indicar cuál link es el activo pasando su identificador a `renderSidebar('cases-tray')`.

### Sesión con `localStorage` y `sessionStorage`
El checkbox "Recordar sesión" del login determina en cuál de los dos se guarda la sesión. `protegerPagina()` busca en ambos storages, garantizando compatibilidad con ambos casos.

### Paginación manual con `.slice()`
Se implementó paginación propia con JavaScript en vez de DataTables u otra librería. Demuestra dominio del fundamento y evita dependencias externas no especificadas en los requisitos técnicos.

### Breakpoint responsive en 1024px
El prototipo usa `hidden lg:flex` (Tailwind) en el panel azul del login, lo que corresponde a exactamente 1024px — no al breakpoint `lg` de Bootstrap (991.98px). Se replicó este comportamiento con `@media (max-width: 1023.98px)` para mantener fidelidad exacta.

### Tipografía `Plus Jakarta Sans`
Fuente real del prototipo, identificada inspeccionando la regla `@font-face` y la clase `.__className_a11773` en el DOM. Se carga vía Google Fonts con los pesos 400, 500, 600, 700 y 800.

---

## Repositorio

[https://github.com/juliandavidnunesfranco/project-fpqrs](https://github.com/juliandavidnunesfranco/project-fpqrs)

---

*Desarrollado por Julián David Núñez Franco — Junio 2026*