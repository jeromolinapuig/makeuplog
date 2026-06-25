# Changelog

## Unreleased

- Implementada la aplicación MakeUpLog con dashboard, catálogo de productos, detalle, favoritos, gestión de categorías y lista compartible.
- Añadida persistencia local en `localStorage` para productos, categorías e imágenes.
- Añadidos formularios con validación, carga de imágenes con vista previa, filtros, búsqueda, ordenación y diseño responsive en blanco y negro.
- Rediseñado el tema visual a modo oscuro con tipografía clara y color celeste como acento principal.
- Añadido inicio de sesión y registro exclusivamente con Google mediante Supabase Auth.
- Sustituida la persistencia local por tablas de Supabase para productos y categorías asociadas a cada usuario.
- Añadido `.gitignore` para dependencias, builds, variables de entorno locales y artefactos temporales.
- Configuradas las variables locales de Supabase usando `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Añadido fallback para `VITE_SUPABASE_ANON_KEY` y documentación de variables en Vercel.
