# Changelog

## 1.3.0

- Agregado autocompletado con productos y marcas ya registrados en el formulario de alta y edicion.
- Mejorada la accesibilidad del boton para anadir productos en inicio movil y el ajuste visual de las cards de producto.

## 1.2.0

- Restaurado el modo oscuro permanente y recuperado el acento celeste original en el tema visual.

## 1.1.0

- Rediseñado el tema visual con una estética más cute: paleta blush, mint y lila, tarjetas más suaves, fondos con patrón y botones más expresivos.
- Añadida iconografía en login, navegación y acciones principales para reforzar la estética visual de la aplicación.

## 1.0.0

- Implementada la aplicación MakeUpLog con dashboard, catálogo de productos, detalle, favoritos, gestión de categorías y lista compartible.
- Añadida persistencia local inicial en `localStorage` para productos, categorías e imágenes.
- Añadidos formularios con validación, carga de imágenes con vista previa, filtros, búsqueda, ordenación y diseño responsive.
- Rediseñado el tema visual a modo oscuro con tipografía clara y color celeste como acento principal.
- Añadido inicio de sesión y registro exclusivamente con Google mediante Supabase Auth.
- Sustituida la persistencia local por tablas de Supabase para productos y categorías asociadas a cada usuario.
- Añadido `.gitignore` para dependencias, builds, variables de entorno locales y artefactos temporales.
- Configuradas las variables locales de Supabase usando `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Añadido fallback para `VITE_SUPABASE_ANON_KEY` y documentación de variables en Vercel.
- Eliminado el campo de fecha de compra del formulario, detalle, modelo y schema de Supabase.
- Corregidos textos en español para restaurar ñ y acentos en la interfaz y documentación.
- Reestructurado el layout visual con barra lateral en escritorio, navegación inferior en móvil y estilos minimalistas más pulidos.
