"use client";

import { useEffect, useRef, useState } from "react";
import Flag from "./Flag";
import { LANGS } from "@/lib/i18n";

export default function LangPicker({
  lang,
  setLang,
  accentHover,
  accentCheck,
}: {
  lang: string;
  setLang: (c: string) => void;
  accentHover: string;
  accentCheck: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    const saved = localStorage.getItem("drawpicker_lang");
    if (saved && LANGS.some((l) => l.code === saved)) {
      setLang(saved);
    }
  }, [setLang]);

  useEffect(() => {
    function click(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("click", click);
    return () => window.removeEventListener("click", click);
  }, []);

  function changeLang(code: string) {
    localStorage.setItem("drawpicker_lang", code);
    setLang(code);
    setOpen(false);
  }

  return (
    <div className="relative z-50" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 bg-[#16161f]/90 backdrop-blur border border-white/10 text-white rounded-2xl px-4 py-2.5 text-sm outline-none transition ${accentHover}`}
      >
        <Flag code={selected.flag} name={selected.name} />
        <span>{selected.name}</span>
        <span className="text-zinc-500">⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 max-h-[70vh] overflow-y-auto bg-[#16161f] border border-white/10 rounded-3xl shadow-2xl p-2 z-50 backdrop-blur">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => changeLang(l.code)}
              className="w-full flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-white/5 text-sm transition"
            >
              <span className="flex items-center gap-3">
                <Flag code={l.flag} name={l.name} />
                {l.name}
              </span>

              {lang === l.code && <span className={accentCheck}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}