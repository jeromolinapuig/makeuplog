import { LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

type LoginScreenProps = {
  onSignIn: () => Promise<void>;
};

export function LoginScreen({ onSignIn }: LoginScreenProps) {
  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="login-brand">
          <span className="brand-mark" aria-hidden="true"><Sparkles size={22} /></span>
          <div>
            <p className="eyebrow">MakeUpLog privado</p>
            <h1>MakeUpLog</h1>
          </div>
        </div>
        <p>Tu catálogo se guarda en Supabase y queda asociado a tu cuenta. No hay registro con email, contraseña ni otros proveedores.</p>
        <div className="auth-note">
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Acceso privado con Google</span>
        </div>
        {isSupabaseConfigured ? (
          <button className="primary-button" type="button" onClick={onSignIn}>
            <LogIn className="button-icon" size={18} aria-hidden="true" />
            Continuar con Google
          </button>
        ) : (
          <div className="empty-state">
            <p>Faltan las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. En Vercel debes añadirlas en Environment Variables y redeplegar la app.</p>
          </div>
        )}
      </section>
    </main>
  );
}
