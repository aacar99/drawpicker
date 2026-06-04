"use client";

import { useState } from "react";
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
  const selected = LANGS.find((l) => l.code === lang) || LANGS[0];

  function handleSelect(code: string) {
    setLang(code);
    localStorage.setItem("dp_lang", code);
    setOpen(false);
  }

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 bg-[#16161f] border border-white/10 text-white rounded-xl px-3 py-2 text-sm outline-none transition ${accentHover}`}
      >
        <Flag code={selected.flag} name={selected.name} />
        <span>{selected.name}</span>
        <span>⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 max-h-[70vh] overflow-y-auto bg-[#16161f] border border-white/10 rounded-2xl shadow-xl p-2 z-50">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-sm"
            >
              <span className="flex items-center gap-2">
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
