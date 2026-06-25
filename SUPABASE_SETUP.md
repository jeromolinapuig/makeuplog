# Supabase setup

MakeUpLog usa Supabase para:

- Autenticacion y registro exclusivamente con Google.
- Persistencia remota de productos y categorias por usuario.
- Aislamiento de datos mediante Row Level Security.

## 1. Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 2. Base de datos

Ejecuta el contenido de `supabase/schema.sql` en el SQL editor de Supabase.

Esto crea:

- `makeuplog_categories`
- `makeuplog_products`
- indices basicos
- politicas RLS para que cada usuario solo lea y modifique sus propios datos

## 3. Google Auth

En Supabase, activa Google como provider de autenticacion.

Configura tambien las redirect URLs que uses en desarrollo y produccion. Para desarrollo local con Vite, por ejemplo:

```text
http://127.0.0.1:5173
http://127.0.0.1:5174
http://localhost:5173
```

La app llama a `signInWithOAuth` con `provider: 'google'` y `redirectTo: window.location.origin`.

## 4. Donde se guardan los datos

Los productos y categorias se guardan en Supabase Postgres:

- Productos: `public.makeuplog_products`
- Categorias: `public.makeuplog_categories`

Las imagenes se guardan actualmente como texto base64 en las columnas:

- `main_image`
- `extra_images`

Para una fase posterior, si las imagenes crecen mucho, conviene moverlas a Supabase Storage y guardar solo las URLs en la tabla.
