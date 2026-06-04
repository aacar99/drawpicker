"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

const T: any = {
  tr: { sub: "Email adresini gir, sıfırlama linki gönderelim.", placeholder: "Email adresin", btn: "Şifre Sıfırlama Linki Gönder", sent: "Email gönderildi!", sentSub: "Emailini kontrol et ve linke tıkla.", back: "← Giriş sayfasına dön" },
  en: { sub: "Enter your email and we'll send a reset link.", placeholder: "Your email", btn: "Send Reset Link", sent: "Email sent!", sentSub: "Check your email and click the link.", back: "← Back to login" },
  de: { sub: "Gib deine E-Mail ein.", placeholder: "Deine E-Mail", btn: "Reset-Link senden", sent: "E-Mail gesendet!", sentSub: "Überprüfe deine E-Mail.", back: "← Zurück" },
  fr: { sub: "Entrez votre email.", placeholder: "Votre email", btn: "Envoyer le lien", sent: "Email envoyé!", sentSub: "Vérifiez votre email.", back: "← Retour" },
  es: { sub: "Ingresa tu email.", placeholder: "Tu email", btn: "Enviar enlace", sent: "¡Email enviado!", sentSub: "Revisa tu email.", back: "← Volver" },
  it: { sub: "Inserisci la tua email.", placeholder: "La tua email", btn: "Invia link", sent: "Email inviata!", sentSub: "Controlla la tua email.", back: "← Torna" },
  ru: { sub: "Введите ваш email.", placeholder: "Ваш email", btn: "Отправить ссылку", sent: "Email отправлен!", sentSub: "Проверьте почту.", back: "← Назад" },
  zh: { sub: "输入您的邮箱。", placeholder: "您的邮箱", btn: "发送重置链接", sent: "邮件已发送!", sentSub: "请检查您的邮箱。", back: "← 返回" },
  ko: { sub: "이메일을 입력하세요.", placeholder: "이메일", btn: "재설정 링크 보내기", sent: "이메일 전송됨!", sentSub: "이메일을 확인하세요.", back: "← 돌아가기" },
  pl: { sub: "Podaj swój email.", placeholder: "Twój email", btn: "Wyślij link", sent: "Email wysłany!", sentSub: "Sprawdź emaila.", back: "← Powrót" },
  ro: { sub: "Introduceți emailul.", placeholder: "Emailul tău", btn: "Trimite link", sent: "Email trimis!", sentSub: "Verificați emailul.", back: "← Înapoi" },
  el: { sub: "Εισάγετε το email σας.", placeholder: "Το email σας", btn: "Αποστολή", sent: "Email στάλθηκε!", sentSub: "Ελέγξτε το email σας.", back: "← Πίσω" },
};

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("dp_lang");
    if (saved && T[saved]) setLang(saved);
  }, []);

  const t = T[lang] || T.en;

  async function handleReset() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://drawpicker.io/auth/callback?type=recovery`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-black text-center mb-2">
          🔑 <span className="text-sky-400">DrawPicker</span>
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">{t.sub}</p>
        {sent ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <p className="text-green-400 font-bold">{t.sent}</p>
            <p className="text-zinc-400 text-sm mt-2">{t.sentSub}</p>
          </div>
        ) : (
          <>
            <input type="email" placeholder={t.placeholder} value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#16161f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition mb-4" />
            {error && <p className="text-red-400 text-sm mb-3">❌ {error}</p>}
            <button onClick={handleReset} disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm transition disabled:opacity-50">
              {loading ? "..." : t.btn}
            </button>
          </>
        )}
        <p className="text-center text-zinc-500 text-sm mt-4">
          <a href="/auth/login" className="text-sky-400 hover:underline">{t.back}</a>
        </p>
      </div>
    </main>
  );
}
