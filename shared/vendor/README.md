# vendor/

> **Esta carpeta se deja vacía intencionalmente.**

---

## ¿Por qué está vacía?

El proyecto usa **Bootstrap 5** y **jQuery** vía **CDN** en lugar de archivos locales.

### Razones de esta decisión

- No hay requisito de funcionamiento *offline* en el alcance de la prueba.
- El CDN simplifica el mantenimiento de versiones.
- Reduce el peso del repositorio — no se versiona código de terceros.
- Es la práctica estándar para proyectos de maquetación de este tipo.

---

## ¿Cuándo SÍ se usaría esta carpeta?

Si el proyecto requiriera una versión **100% offline**, los archivos correspondientes irían aquí:

```
vendor/
├── bootstrap.min.css
├── bootstrap.bundle.min.js
└── jquery.min.js
```

---

> **Nota:** al mantener esta carpeta vacia y documentada, dejo constancia que la decisión de usar CDN fue **INTENSIONAL**
>> juliandev