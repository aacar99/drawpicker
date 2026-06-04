"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

const T: any = {
  tr: { title: "Giriş Yap", signUp: "Kayıt Ol", login: "Giriş Yap", google: "Google ile devam et", or: "veya", email: "Email", password: "Şifre", forgot: "Şifremi Unuttum?", noAccount: "Hesabın yok mu?", hasAccount: "Zaten hesabın var mı?", register: "Kayıt ol", verified: "Email adresinize doğrulama linki gönderildi!" },
  en: { title: "Login", signUp: "Sign Up", login: "Login", google: "Continue with Google", or: "or", email: "Email", password: "Password", forgot: "Forgot password?", noAccount: "No account?", hasAccount: "Already have an account?", register: "Register", verified: "Verification link sent to your email!" },
  de: { title: "Anmelden", signUp: "Registrieren", login: "Anmelden", google: "Mit Google fortfahren", or: "oder", email: "E-Mail", password: "Passwort", forgot: "Passwort vergessen?", noAccount: "Kein Konto?", hasAccount: "Bereits ein Konto?", register: "Registrieren", verified: "Bestätigungslink wurde gesendet!" },
  fr: { title: "Connexion", signUp: "S'inscrire", login: "Se connecter", google: "Continuer avec Google", or: "ou", email: "Email", password: "Mot de passe", forgot: "Mot de passe oublié?", noAccount: "Pas de compte?", hasAccount: "Déjà un compte?", register: "S'inscrire", verified: "Lien de vérification envoyé!" },
  es: { title: "Iniciar sesión", signUp: "Registrarse", login: "Iniciar sesión", google: "Continuar con Google", or: "o", email: "Correo", password: "Contraseña", forgot: "¿Olvidaste tu contraseña?", noAccount: "¿Sin cuenta?", hasAccount: "¿Ya tienes cuenta?", register: "Registrarse", verified: "¡Enlace de verificación enviado!" },
  it: { title: "Accedi", signUp: "Registrati", login: "Accedi", google: "Continua con Google", or: "o", email: "Email", password: "Password", forgot: "Password dimenticata?", noAccount: "Nessun account?", hasAccount: "Hai già un account?", register: "Registrati", verified: "Link di verifica inviato!" },
  ru: { title: "Войти", signUp: "Регистрация", login: "Войти", google: "Продолжить с Google", or: "или", email: "Email", password: "Пароль", forgot: "Забыли пароль?", noAccount: "Нет аккаунта?", hasAccount: "Уже есть аккаунт?", register: "Зарегистрироваться", verified: "Ссылка подтверждения отправлена!" },
  zh: { title: "登录", signUp: "注册", login: "登录", google: "使用 Google 继续", or: "或", email: "邮箱", password: "密码", forgot: "忘记密码?", noAccount: "没有账户?", hasAccount: "已有账户?", register: "注册", verified: "验证链接已发送!" },
  ko: { title: "로그인", signUp: "회원가입", login: "로그인", google: "Google로 계속", or: "또는", email: "이메일", password: "비밀번호", forgot: "비밀번호 찾기", noAccount: "계정이 없으신가요?", hasAccount: "이미 계정이 있으신가요?", register: "회원가입", verified: "인증 링크가 전송되었습니다!" },
  pl: { title: "Zaloguj się", signUp: "Zarejestruj się", login: "Zaloguj się", google: "Kontynuuj z Google", or: "lub", email: "Email", password: "Hasło", forgot: "Zapomniałeś hasła?", noAccount: "Brak konta?", hasAccount: "Masz już konto?", register: "Zarejestruj się", verified: "Link weryfikacyjny wysłany!" },
  ro: { title: "Autentificare", signUp: "Înregistrare", login: "Autentificare", google: "Continuă cu Google", or: "sau", email: "Email", password: "Parolă", forgot: "Ai uitat parola?", noAccount: "Nu ai cont?", hasAccount: "Ai deja cont?", register: "Înregistrează-te", verified: "Link de verificare trimis!" },
  el: { title: "Σύνδεση", signUp: "Εγγραφή", login: "Σύνδεση", google: "Συνέχεια με Google", or: "ή", email: "Email", password: "Κωδικός", forgot: "Ξεχάσατε τον κωδικό;", noAccount: "Δεν έχετε λογαριασμό;", hasAccount: "Έχετε ήδη λογαριασμό;", register: "Εγγραφή", verified: "Ο σύνδεσμος επαλήθευσης εστάλη!" },
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const lang = typeof navigator !== "undefined"
    ? navigator.language.slice(0, 2)
    : "en";
  const t = T[lang] || T.en;

  const supabase = createClient();

  async function handleEmail() {
    setLoading(true);
    setError("");
    setMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setMessage(t.verified);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else location.href = "/";
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-2">
          🎉 <span className="text-sky-400">DrawPicker</span>
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">
          {isSignUp ? t.signUp : t.login}
        </p>
        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-3 rounded-xl mb-4 hover:bg-gray-100 transition">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          {t.google}
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-zinc-600 text-xs">{t.or}</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <input type="email" placeholder={t.email} value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition mb-3" />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition pr-12"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition text-lg">
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mb-3">❌ {error}</p>}
        {message && <p className="text-green-400 text-sm mb-3">✅ {message}</p>}
        <button onClick={handleEmail} disabled={loading}
          className="w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50">
          {loading ? "..." : isSignUp ? t.signUp : t.login}
        </button>
        <p className="text-center mt-2 mb-2">
          <a href="/auth/reset" className="text-sky-400 hover:underline text-sm">{t.forgot}</a>
        </p>
        <p className="text-center text-zinc-500 text-sm mt-2">
          {isSignUp ? t.hasAccount : t.noAccount}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sky-400 hover:underline">
            {isSignUp ? t.login : t.register}
          </button>
        </p>
      </div>
    </main>
  );
}
