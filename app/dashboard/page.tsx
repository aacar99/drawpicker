"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase-client";
import { getPlan } from "@/lib/plans";
import LangPicker from "@/components/LangPicker";

const D: Record<string, Record<string, string>> = {
  tr: { back: "← Ana Sayfa", logout: "Çıkış", title: "Hesabım", profile: "Profil", photo: "Profil Fotoğrafı", change: "Değiştir", uploading: "Yükleniyor...", displayName: "İsim", displayNamePh: "Adınız", username: "Kullanıcı Adı", usernamePh: "kullaniciadi", save: "Kaydet", saved: "Kaydedildi ✓", emailSection: "E-posta", currentEmail: "Mevcut E-posta", newEmail: "Yeni E-posta", updateEmail: "E-postayı Güncelle", emailSent: "Onay e-postası gönderildi.", passwordSection: "Şifre", newPassword: "Yeni Şifre", confirmPassword: "Şifre Tekrar", updatePassword: "Şifreyi Güncelle", passwordUpdated: "Şifre güncellendi ✓", passwordMismatch: "Şifreler eşleşmiyor.", passwordShort: "Şifre en az 6 karakter olmalı.", subscription: "Abonelik", planLabel: "Mevcut Plan", planStart: "Başlangıç", planEnd: "Bitiş", nextBilling: "Sonraki Ödeme", drawsThisMonth: "Bu ay çekiliş", participantsUsed: "Katılımcı kullanımı", remainingDraws: "Kalan çekiliş", unlimited: "Sınırsız", managePlan: "Aboneliği Yönet", viewPlans: "Planları Gör", upgrade: "🚀 Planı Yükselt →", myDraws: "Çekilişlerim", noDraws: "Henüz çekiliş yapmadınız.", viewResult: "Sonucu Gör →", parts: "katılımcı", win: "kazanan", errorGeneric: "Bir hata oluştu.", loading: "Yükleniyor..." },
  en: { back: "← Home", logout: "Log out", title: "My Account", profile: "Profile", photo: "Profile Photo", change: "Change", uploading: "Uploading...", displayName: "Name", displayNamePh: "Your name", username: "Username", usernamePh: "username", save: "Save", saved: "Saved ✓", emailSection: "Email", currentEmail: "Current Email", newEmail: "New Email", updateEmail: "Update Email", emailSent: "Confirmation email sent.", passwordSection: "Password", newPassword: "New Password", confirmPassword: "Confirm Password", updatePassword: "Update Password", passwordUpdated: "Password updated ✓", passwordMismatch: "Passwords do not match.", passwordShort: "Password must be at least 6 characters.", subscription: "Subscription", planLabel: "Current Plan", planStart: "Start", planEnd: "End", nextBilling: "Next Payment", drawsThisMonth: "Draws this month", participantsUsed: "Participants used", remainingDraws: "Draws remaining", unlimited: "Unlimited", managePlan: "Manage Subscription", viewPlans: "View Plans", upgrade: "🚀 Upgrade Plan →", myDraws: "My Draws", noDraws: "You haven't run any draws yet.", viewResult: "View Result →", parts: "participants", win: "winners", errorGeneric: "An error occurred.", loading: "Loading..." },
  de: { back: "← Startseite", logout: "Abmelden", title: "Mein Konto", profile: "Profil", photo: "Profilbild", change: "Ändern", uploading: "Wird hochgeladen...", displayName: "Name", displayNamePh: "Ihr Name", username: "Benutzername", usernamePh: "benutzername", save: "Speichern", saved: "Gespeichert ✓", emailSection: "E-Mail", currentEmail: "Aktuelle E-Mail", newEmail: "Neue E-Mail", updateEmail: "E-Mail aktualisieren", emailSent: "Bestätigungs-E-Mail gesendet.", passwordSection: "Passwort", newPassword: "Neues Passwort", confirmPassword: "Passwort bestätigen", updatePassword: "Passwort aktualisieren", passwordUpdated: "Passwort aktualisiert ✓", passwordMismatch: "Passwörter stimmen nicht überein.", passwordShort: "Passwort muss mind. 6 Zeichen haben.", subscription: "Abonnement", planLabel: "Aktueller Plan", planStart: "Beginn", planEnd: "Ende", nextBilling: "Nächste Zahlung", drawsThisMonth: "Ziehungen diesen Monat", participantsUsed: "Teilnehmer genutzt", remainingDraws: "Verbleibende Ziehungen", unlimited: "Unbegrenzt", managePlan: "Abo verwalten", viewPlans: "Pläne ansehen", upgrade: "🚀 Plan upgraden →", myDraws: "Meine Ziehungen", noDraws: "Noch keine Ziehungen durchgeführt.", viewResult: "Ergebnis ansehen →", parts: "Teilnehmer", win: "Gewinner", errorGeneric: "Ein Fehler ist aufgetreten.", loading: "Lädt..." },
  zh: { back: "← 首页", logout: "退出", title: "我的账户", profile: "个人资料", photo: "头像", change: "更换", uploading: "上传中...", displayName: "姓名", displayNamePh: "你的名字", username: "用户名", usernamePh: "用户名", save: "保存", saved: "已保存 ✓", emailSection: "邮箱", currentEmail: "当前邮箱", newEmail: "新邮箱", updateEmail: "更新邮箱", emailSent: "确认邮件已发送。", passwordSection: "密码", newPassword: "新密码", confirmPassword: "确认密码", updatePassword: "更新密码", passwordUpdated: "密码已更新 ✓", passwordMismatch: "密码不匹配。", passwordShort: "密码至少6位。", subscription: "订阅", planLabel: "当前套餐", planStart: "开始", planEnd: "结束", nextBilling: "下次付款", drawsThisMonth: "本月抽奖", participantsUsed: "已用参与者", remainingDraws: "剩余抽奖", unlimited: "无限", managePlan: "管理订阅", viewPlans: "查看套餐", upgrade: "🚀 升级套餐 →", myDraws: "我的抽奖", noDraws: "您还没有进行抽奖。", viewResult: "查看结果 →", parts: "参与者", win: "获奖者", errorGeneric: "发生错误。", loading: "加载中..." },
  ru: { back: "← Главная", logout: "Выйти", title: "Мой аккаунт", profile: "Профиль", photo: "Фото профиля", change: "Изменить", uploading: "Загрузка...", displayName: "Имя", displayNamePh: "Ваше имя", username: "Имя пользователя", usernamePh: "username", save: "Сохранить", saved: "Сохранено ✓", emailSection: "Эл. почта", currentEmail: "Текущая почта", newEmail: "Новая почта", updateEmail: "Обновить почту", emailSent: "Письмо подтверждения отправлено.", passwordSection: "Пароль", newPassword: "Новый пароль", confirmPassword: "Повторите пароль", updatePassword: "Обновить пароль", passwordUpdated: "Пароль обновлён ✓", passwordMismatch: "Пароли не совпадают.", passwordShort: "Пароль не менее 6 символов.", subscription: "Подписка", planLabel: "Текущий план", planStart: "Начало", planEnd: "Окончание", nextBilling: "Следующий платёж", drawsThisMonth: "Розыгрышей в этом месяце", participantsUsed: "Использовано участников", remainingDraws: "Осталось розыгрышей", unlimited: "Безлимит", managePlan: "Управление подпиской", viewPlans: "Посмотреть планы", upgrade: "🚀 Улучшить план →", myDraws: "Мои розыгрыши", noDraws: "Вы ещё не проводили розыгрыши.", viewResult: "Открыть результат →", parts: "участников", win: "победителей", errorGeneric: "Произошла ошибка.", loading: "Загрузка..." },
  ko: { back: "← 홈", logout: "로그아웃", title: "내 계정", profile: "프로필", photo: "프로필 사진", change: "변경", uploading: "업로드 중...", displayName: "이름", displayNamePh: "이름", username: "사용자 이름", usernamePh: "username", save: "저장", saved: "저장됨 ✓", emailSection: "이메일", currentEmail: "현재 이메일", newEmail: "새 이메일", updateEmail: "이메일 업데이트", emailSent: "확인 이메일을 보냈습니다.", passwordSection: "비밀번호", newPassword: "새 비밀번호", confirmPassword: "비밀번호 확인", updatePassword: "비밀번호 업데이트", passwordUpdated: "비밀번호 변경됨 ✓", passwordMismatch: "비밀번호가 일치하지 않습니다.", passwordShort: "비밀번호는 6자 이상이어야 합니다.", subscription: "구독", planLabel: "현재 플랜", planStart: "시작", planEnd: "종료", nextBilling: "다음 결제", drawsThisMonth: "이번 달 추첨", participantsUsed: "사용한 참여자", remainingDraws: "남은 추첨", unlimited: "무제한", managePlan: "구독 관리", viewPlans: "플랜 보기", upgrade: "🚀 플랜 업그레이드 →", myDraws: "내 추첨", noDraws: "아직 추첨을 진행하지 않았습니다.", viewResult: "결과 보기 →", parts: "참여자", win: "당첨자", errorGeneric: "오류가 발생했습니다.", loading: "로딩 중..." },
  es: { back: "← Inicio", logout: "Cerrar sesión", title: "Mi cuenta", profile: "Perfil", photo: "Foto de perfil", change: "Cambiar", uploading: "Subiendo...", displayName: "Nombre", displayNamePh: "Tu nombre", username: "Usuario", usernamePh: "usuario", save: "Guardar", saved: "Guardado ✓", emailSection: "Correo", currentEmail: "Correo actual", newEmail: "Nuevo correo", updateEmail: "Actualizar correo", emailSent: "Correo de confirmación enviado.", passwordSection: "Contraseña", newPassword: "Nueva contraseña", confirmPassword: "Confirmar contraseña", updatePassword: "Actualizar contraseña", passwordUpdated: "Contraseña actualizada ✓", passwordMismatch: "Las contraseñas no coinciden.", passwordShort: "La contraseña debe tener al menos 6 caracteres.", subscription: "Suscripción", planLabel: "Plan actual", planStart: "Inicio", planEnd: "Fin", nextBilling: "Próximo pago", drawsThisMonth: "Sorteos este mes", participantsUsed: "Participantes usados", remainingDraws: "Sorteos restantes", unlimited: "Ilimitado", managePlan: "Gestionar suscripción", viewPlans: "Ver planes", upgrade: "🚀 Mejorar plan →", myDraws: "Mis sorteos", noDraws: "Aún no has hecho sorteos.", viewResult: "Ver resultado →", parts: "participantes", win: "ganadores", errorGeneric: "Ocurrió un error.", loading: "Cargando..." },
  it: { back: "← Home", logout: "Esci", title: "Il mio account", profile: "Profilo", photo: "Foto profilo", change: "Cambia", uploading: "Caricamento...", displayName: "Nome", displayNamePh: "Il tuo nome", username: "Nome utente", usernamePh: "utente", save: "Salva", saved: "Salvato ✓", emailSection: "Email", currentEmail: "Email attuale", newEmail: "Nuova email", updateEmail: "Aggiorna email", emailSent: "Email di conferma inviata.", passwordSection: "Password", newPassword: "Nuova password", confirmPassword: "Conferma password", updatePassword: "Aggiorna password", passwordUpdated: "Password aggiornata ✓", passwordMismatch: "Le password non coincidono.", passwordShort: "La password deve avere almeno 6 caratteri.", subscription: "Abbonamento", planLabel: "Piano attuale", planStart: "Inizio", planEnd: "Fine", nextBilling: "Prossimo pagamento", drawsThisMonth: "Sorteggi questo mese", participantsUsed: "Partecipanti usati", remainingDraws: "Sorteggi rimanenti", unlimited: "Illimitato", managePlan: "Gestisci abbonamento", viewPlans: "Vedi piani", upgrade: "🚀 Migliora piano →", myDraws: "I miei sorteggi", noDraws: "Non hai ancora fatto sorteggi.", viewResult: "Vedi risultato →", parts: "partecipanti", win: "vincitori", errorGeneric: "Si è verificato un errore.", loading: "Caricamento..." },
  fr: { back: "← Accueil", logout: "Déconnexion", title: "Mon compte", profile: "Profil", photo: "Photo de profil", change: "Changer", uploading: "Téléversement...", displayName: "Nom", displayNamePh: "Votre nom", username: "Nom d'utilisateur", usernamePh: "utilisateur", save: "Enregistrer", saved: "Enregistré ✓", emailSection: "E-mail", currentEmail: "E-mail actuel", newEmail: "Nouvel e-mail", updateEmail: "Mettre à jour l'e-mail", emailSent: "E-mail de confirmation envoyé.", passwordSection: "Mot de passe", newPassword: "Nouveau mot de passe", confirmPassword: "Confirmer le mot de passe", updatePassword: "Mettre à jour le mot de passe", passwordUpdated: "Mot de passe mis à jour ✓", passwordMismatch: "Les mots de passe ne correspondent pas.", passwordShort: "Le mot de passe doit comporter au moins 6 caractères.", subscription: "Abonnement", planLabel: "Forfait actuel", planStart: "Début", planEnd: "Fin", nextBilling: "Prochain paiement", drawsThisMonth: "Tirages ce mois-ci", participantsUsed: "Participants utilisés", remainingDraws: "Tirages restants", unlimited: "Illimité", managePlan: "Gérer l'abonnement", viewPlans: "Voir les forfaits", upgrade: "🚀 Améliorer le forfait →", myDraws: "Mes tirages", noDraws: "Vous n'avez pas encore fait de tirage.", viewResult: "Voir le résultat →", parts: "participants", win: "gagnants", errorGeneric: "Une erreur est survenue.", loading: "Chargement..." },
  el: { back: "← Αρχική", logout: "Αποσύνδεση", title: "Ο λογαριασμός μου", profile: "Προφίλ", photo: "Φωτογραφία προφίλ", change: "Αλλαγή", uploading: "Μεταφόρτωση...", displayName: "Όνομα", displayNamePh: "Το όνομά σας", username: "Όνομα χρήστη", usernamePh: "χρήστης", save: "Αποθήκευση", saved: "Αποθηκεύτηκε ✓", emailSection: "Email", currentEmail: "Τρέχον email", newEmail: "Νέο email", updateEmail: "Ενημέρωση email", emailSent: "Στάλθηκε email επιβεβαίωσης.", passwordSection: "Κωδικός", newPassword: "Νέος κωδικός", confirmPassword: "Επιβεβαίωση κωδικού", updatePassword: "Ενημέρωση κωδικού", passwordUpdated: "Ο κωδικός ενημερώθηκε ✓", passwordMismatch: "Οι κωδικοί δεν ταιριάζουν.", passwordShort: "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.", subscription: "Συνδρομή", planLabel: "Τρέχον πλάνο", planStart: "Έναρξη", planEnd: "Λήξη", nextBilling: "Επόμενη πληρωμή", drawsThisMonth: "Κληρώσεις αυτόν τον μήνα", participantsUsed: "Συμμετέχοντες που χρησιμοποιήθηκαν", remainingDraws: "Υπόλοιπες κληρώσεις", unlimited: "Απεριόριστο", managePlan: "Διαχείριση συνδρομής", viewPlans: "Δείτε τα πλάνα", upgrade: "🚀 Αναβάθμιση πλάνου →", myDraws: "Οι κληρώσεις μου", noDraws: "Δεν έχετε κάνει ακόμα κληρώσεις.", viewResult: "Προβολή αποτελέσματος →", parts: "συμμετέχοντες", win: "νικητές", errorGeneric: "Παρουσιάστηκε σφάλμα.", loading: "Φόρτωση..." },
  pl: { back: "← Strona główna", logout: "Wyloguj", title: "Moje konto", profile: "Profil", photo: "Zdjęcie profilowe", change: "Zmień", uploading: "Przesyłanie...", displayName: "Imię", displayNamePh: "Twoje imię", username: "Nazwa użytkownika", usernamePh: "uzytkownik", save: "Zapisz", saved: "Zapisano ✓", emailSection: "E-mail", currentEmail: "Obecny e-mail", newEmail: "Nowy e-mail", updateEmail: "Zaktualizuj e-mail", emailSent: "Wysłano e-mail potwierdzający.", passwordSection: "Hasło", newPassword: "Nowe hasło", confirmPassword: "Potwierdź hasło", updatePassword: "Zaktualizuj hasło", passwordUpdated: "Hasło zaktualizowane ✓", passwordMismatch: "Hasła nie pasują.", passwordShort: "Hasło musi mieć co najmniej 6 znaków.", subscription: "Subskrypcja", planLabel: "Obecny plan", planStart: "Początek", planEnd: "Koniec", nextBilling: "Następna płatność", drawsThisMonth: "Losowania w tym miesiącu", participantsUsed: "Wykorzystani uczestnicy", remainingDraws: "Pozostałe losowania", unlimited: "Bez limitu", managePlan: "Zarządzaj subskrypcją", viewPlans: "Zobacz plany", upgrade: "🚀 Ulepsz plan →", myDraws: "Moje losowania", noDraws: "Nie przeprowadziłeś jeszcze losowań.", viewResult: "Zobacz wynik →", parts: "uczestnicy", win: "zwycięzcy", errorGeneric: "Wystąpił błąd.", loading: "Ładowanie..." },
  ro: { back: "← Acasă", logout: "Deconectare", title: "Contul meu", profile: "Profil", photo: "Poză de profil", change: "Schimbă", uploading: "Se încarcă...", displayName: "Nume", displayNamePh: "Numele tău", username: "Nume utilizator", usernamePh: "utilizator", save: "Salvează", saved: "Salvat ✓", emailSection: "E-mail", currentEmail: "E-mail actual", newEmail: "E-mail nou", updateEmail: "Actualizează e-mailul", emailSent: "E-mail de confirmare trimis.", passwordSection: "Parolă", newPassword: "Parolă nouă", confirmPassword: "Confirmă parola", updatePassword: "Actualizează parola", passwordUpdated: "Parolă actualizată ✓", passwordMismatch: "Parolele nu se potrivesc.", passwordShort: "Parola trebuie să aibă cel puțin 6 caractere.", subscription: "Abonament", planLabel: "Plan curent", planStart: "Început", planEnd: "Sfârșit", nextBilling: "Următoarea plată", drawsThisMonth: "Extrageri luna aceasta", participantsUsed: "Participanți folosiți", remainingDraws: "Extrageri rămase", unlimited: "Nelimitat", managePlan: "Gestionează abonamentul", viewPlans: "Vezi planurile", upgrade: "🚀 Upgrade plan →", myDraws: "Extragerile mele", noDraws: "Nu ai făcut încă extrageri.", viewResult: "Vezi rezultatul →", parts: "participanți", win: "câștigători", errorGeneric: "A apărut o eroare.", loading: "Se încarcă..." },
};

const LOCALE_MAP: Record<string, string> = {
  tr: "tr-TR", en: "en-US", de: "de-DE", zh: "zh-CN", ru: "ru-RU", ko: "ko-KR",
  es: "es-ES", it: "it-IT", fr: "fr-FR", el: "el-GR", pl: "pl-PL", ro: "ro-RO",
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("tr");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const [draws, setDraws] = useState<any[]>([]);

  const t = D[lang] || D.tr;
  const loc = LOCALE_MAP[lang] || "en-US";

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dp_lang") || localStorage.getItem("drawpicker_lang");
      if (saved && D[saved]) setLang(saved);
    } catch {}

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        window.location.href = "/auth/login";
        return;
      }
      setUser(data.user);
      const { data: db } = await supabase.from("users").select("*").eq("id", data.user.id).single();
      setDbUser(db);
      setName(db?.name || "");
      setUsername(db?.username || "");
      setAvatarUrl(db?.avatar_url || "");
      setLoading(false);
    });

    fetch("/api/my-draws")
      .then((r) => r.json())
      .then((d) => { if (d.success) setDraws(d.draws || []); })
      .catch(() => {});
  }, []);

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    setProfileMsg("");
    try {
      const supabase = createClient();
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${pub.publicUrl}?v=${Date.now()}`;
      await supabase.from("users").update({ avatar_url: url }).eq("id", user.id);
      setAvatarUrl(url);
    } catch {
      setProfileMsg(t.errorGeneric);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("users").update({ name, username }).eq("id", user.id);
      if (error) throw error;
      setProfileMsg(t.saved);
      setTimeout(() => setProfileMsg(""), 2500);
    } catch {
      setProfileMsg(t.errorGeneric);
    } finally {
      setSavingProfile(false);
    }
  }

  async function saveEmail() {
    if (!newEmail) return;
    setEmailMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setEmailMsg(t.emailSent);
      setNewEmail("");
    } catch {
      setEmailMsg(t.errorGeneric);
    }
  }

  async function savePassword() {
    setPwMsg("");
    if (pw1.length < 6) { setPwMsg(t.passwordShort); return; }
    if (pw1 !== pw2) { setPwMsg(t.passwordMismatch); return; }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) throw error;
      setPwMsg(t.passwordUpdated);
      setPw1(""); setPw2("");
      setTimeout(() => setPwMsg(""), 2500);
    } catch {
      setPwMsg(t.errorGeneric);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
        <div className="text-zinc-400">⏳ {D[lang]?.loading || "Yükleniyor..."}</div>
      </main>
    );
  }

  const plan = getPlan(dbUser?.plan || "free");
  const drawsUsed = dbUser?.draws_this_month || 0;
  const drawsTotal = plan.drawsPerMonth;
  const unlimited = drawsTotal >= 999999;
  const pct = unlimited ? 100 : Math.min((drawsUsed / drawsTotal) * 100, 100);
  const remainingDraws = unlimited ? t.unlimited : Math.max(drawsTotal - drawsUsed, 0);

  const maxParts = Number(plan.maxParticipants || 0);
  const partsUsed = Number(dbUser?.participants_used_this_month || 0);

  const fmt = (v: any) => (v ? new Date(v).toLocaleDateString(loc) : null);
  const planStart = fmt(dbUser?.current_period_start || dbUser?.plan_started_at);
  const planEnd = fmt(dbUser?.current_period_end);
  const nextBilling = fmt(dbUser?.next_billing_date || dbUser?.current_period_end);

  const inputCls = "w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition";
  const cardCls = "bg-[#16161f] border border-white/10 rounded-3xl p-6 mb-4";
  const labelCls = "text-zinc-500 text-xs uppercase tracking-widest mb-2";

  return (
    <main className="min-h-screen bg-[#080812] text-white px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0ea5e933,transparent_40%),radial-gradient(circle_at_bottom_right,#a855f733,transparent_40%)]" />
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-3">
          <a href="/" className="text-zinc-500 text-sm hover:text-white transition whitespace-nowrap">{t.back}</a>
          <div className="flex items-center gap-3">
            <LangPicker lang={lang} setLang={setLang} accentHover="hover:border-sky-500" accentCheck="text-sky-400" />
            <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-red-400 transition whitespace-nowrap">{t.logout}</button>
          </div>
        </div>

        <h1 className="text-3xl font-black mb-8">👤 {t.title}</h1>

        {/* Profil: foto + isim + kullanici adi */}
        <div className={cardCls}>
          <div className={labelCls}>{t.profile}</div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploadingAvatar} className="text-sm font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition disabled:opacity-50">
                {uploadingAvatar ? t.uploading : `📷 ${t.photo}`}
              </button>
            </div>
          </div>

          <label className="text-xs text-zinc-400 mb-1.5 block">{t.displayName}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.displayNamePh} className={`${inputCls} mb-3`} />

          <label className="text-xs text-zinc-400 mb-1.5 block">{t.username}</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.usernamePh} className={`${inputCls} mb-4`} />

          <button onClick={saveProfile} disabled={savingProfile} className="w-full bg-gradient-to-r from-sky-600 to-sky-500 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
            {savingProfile ? "..." : t.save}
          </button>
          {profileMsg && <p className="text-center text-sm text-sky-400 mt-3">{profileMsg}</p>}
        </div>

        {/* E-posta */}
        <div className={cardCls}>
          <div className={labelCls}>{t.emailSection}</div>
          <div className="text-zinc-400 text-xs mb-1">{t.currentEmail}</div>
          <div className="font-bold mb-4 break-all">{user?.email}</div>
          <label className="text-xs text-zinc-400 mb-1.5 block">{t.newEmail}</label>
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="yeni@email.com" className={`${inputCls} mb-4`} />
          <button onClick={saveEmail} className="w-full border border-white/15 hover:border-sky-500 py-3 rounded-xl font-bold text-sm transition">
            {t.updateEmail}
          </button>
          {emailMsg && <p className="text-center text-sm text-sky-400 mt-3">{emailMsg}</p>}
        </div>

        {/* Sifre */}
        <div className={cardCls}>
          <div className={labelCls}>{t.passwordSection}</div>
          <label className="text-xs text-zinc-400 mb-1.5 block">{t.newPassword}</label>
          <input type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} className={`${inputCls} mb-3`} />
          <label className="text-xs text-zinc-400 mb-1.5 block">{t.confirmPassword}</label>
          <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={`${inputCls} mb-4`} />
          <button onClick={savePassword} className="w-full border border-white/15 hover:border-sky-500 py-3 rounded-xl font-bold text-sm transition">
            {t.updatePassword}
          </button>
          {pwMsg && <p className="text-center text-sm text-sky-400 mt-3">{pwMsg}</p>}
        </div>

        {/* Abonelik */}
        <div className={cardCls}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={labelCls}>{t.planLabel}</div>
              <div className="text-2xl font-black text-sky-400">{plan.name}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {planStart && (
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-zinc-500 text-[11px] mb-1">{t.planStart}</div>
                <div className="text-sm font-bold">{planStart}</div>
              </div>
            )}
            {planEnd && (
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-zinc-500 text-[11px] mb-1">{t.planEnd}</div>
                <div className="text-sm font-bold">{planEnd}</div>
              </div>
            )}
            {nextBilling && (
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-zinc-500 text-[11px] mb-1">{t.nextBilling}</div>
                <div className="text-sm font-bold">{nextBilling}</div>
              </div>
            )}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="text-zinc-500 text-[11px] mb-1">{t.remainingDraws}</div>
              <div className="text-sm font-bold">{remainingDraws}</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">{t.drawsThisMonth}</span>
              <span className="font-bold">{drawsUsed} / {unlimited ? "∞" : drawsTotal}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-sky-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {maxParts > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-400">{t.participantsUsed}</span>
                <span className="font-bold">{partsUsed.toLocaleString()} / {maxParts.toLocaleString()}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((partsUsed / maxParts) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Plan butonu */}
        {dbUser?.plan === "free" || dbUser?.plan === "starter" ? (
          <a href="/pricing" className="block w-full bg-gradient-to-r from-sky-600 to-purple-600 py-4 rounded-2xl font-black text-center text-lg hover:opacity-90 transition mb-4">
            {t.upgrade}
          </a>
        ) : (
          <a href="/pricing" className="block w-full border border-white/10 hover:border-sky-500 py-4 rounded-2xl font-bold text-center text-sm transition text-zinc-400 mb-4">
            {t.viewPlans}
          </a>
        )}

        {/* Cekilislerim */}
        <div className={cardCls}>
          <div className="text-white font-black text-lg mb-4">🎯 {t.myDraws}</div>
          {draws.length === 0 ? (
            <div className="text-zinc-500 text-sm text-center py-4">{t.noDraws}</div>
          ) : (
            <div className="space-y-3">
              {draws.map((d) => (
                <a key={d.id} href={`/result/${d.id}`} className="block rounded-2xl p-4 bg-white/5 hover:bg-white/10 border border-white/10 transition">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{d.platform === "twitter" ? "𝕏" : "▶️"}</span>
                        <span className="text-sm font-bold truncate">{d.title || d.cert_code}</span>
                      </div>
                      <div className="text-zinc-500 text-xs">
                        {d.created_at ? new Date(d.created_at).toLocaleDateString(loc) : ""} · {(d.total || 0).toLocaleString()} {t.parts} · {(d.winners?.length || 0)} {t.win}
                      </div>
                    </div>
                    <span className="text-sky-400 text-xs font-bold whitespace-nowrap flex-shrink-0">{t.viewResult}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
