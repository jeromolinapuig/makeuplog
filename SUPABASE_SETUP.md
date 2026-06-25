# Supabase setup

MakeUpLog usa Supabase para:

- Autenticación y registro exclusivamente con Google.
- Persistencia remota de productos y categorías por usuario.
- Aislamiento de datos mediante Row Level Security.

## 1. Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

También se acepta `VITE_SUPABASE_ANON_KEY` como fallback si el proyecto usa la nomenclatura antigua de Supabase, pero la variable recomendada es `VITE_SUPABASE_PUBLISHABLE_KEY`.

### Vercel

En producción, `.env.local` no se sube al repositorio ni llega a Vercel. Debes crear las mismas variables en:

```text
Vercel > Project > Settings > Environment Variables
```

Añade estas variables para `Production`, `Preview` y `Development` si quieres que funcionen todos los entornos:

```bash
VITE_SUPABASE_URL=https://bzqsfjjkjepkmazhedyy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_RphJPm-EbrGKSaeLbBXrng_T9wgaybO
```

Después de guardarlas, haz un redeploy. En Vite, las variables `VITE_*` se incrustan durante el build, así que no basta con guardarlas: hay que desplegar de nuevo.

## 2. Base de datos

Ejecuta el contenido de `supabase/schema.sql` en el SQL editor de Supabase.

Esto crea:

- `makeuplog_categories`
- `makeuplog_products`
- índices básicos
- políticas RLS para que cada usuario solo lea y modifique sus propios datos

## 3. Google Auth

En Supabase, activa Google como provider de autenticacion.

Configura también las redirect URLs que uses en desarrollo y producción. Para desarrollo local con Vite, por ejemplo:

```text
http://127.0.0.1:5173
http://127.0.0.1:5174
http://localhost:5173
```

Para Vercel, añade también la URL real de producción, por ejemplo:

```text
https://tu-dominio.vercel.app
```

La app llama a `signInWithOAuth` con `provider: 'google'` y `redirectTo: window.location.origin`.

## 4. Donde se guardan los datos

Los productos y categorías se guardan en Supabase Postgres:

- Productos: `public.makeuplog_products`
- Categorías: `public.makeuplog_categories`

Las imágenes se guardan actualmente como texto base64 en las columnas:

- `main_image`
- `extra_images`

Para una fase posterior, si las imágenes crecen mucho, conviene moverlas a Supabase Storage y guardar solo las URLs en la tabla.
