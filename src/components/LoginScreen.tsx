import { isSupabaseConfigured } from '../lib/supabase';

type LoginScreenProps = {
  onSignIn: () => Promise<void>;
};

export function LoginScreen({ onSignIn }: LoginScreenProps) {
  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <p className="eyebrow">MakeUpLog privado</p>
        <h1>Inicia sesion con Google</h1>
        <p>Tu catalogo se guarda en Supabase y queda asociado a tu cuenta. No hay registro con email, contrasena ni otros proveedores.</p>
        {isSupabaseConfigured ? (
          <button className="primary-button" type="button" onClick={onSignIn}>
            Continuar con Google
          </button>
        ) : (
          <div className="empty-state">
            <p>Faltan las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Copia `.env.example` a `.env.local` y rellena los datos del proyecto Supabase.</p>
          </div>
        )}
      </section>
    </main>
  );
}
