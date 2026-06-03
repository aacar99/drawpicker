"use client";

export default function Rule({
  label,
  val,
  toggle,
  fixed = false,
  locked = false,
  plan = "",
  onClass,
  chkClass,
}: {
  label: string;
  val: boolean;
  toggle?: () => void;
  fixed?: boolean;
  locked?: boolean;
  plan?: string;
  onClass: string;
  chkClass: string;
}) {
  return (
    <div
      onClick={
        locked
          ? () => (window.location.href = "/pricing")
          : fixed
          ? undefined
          : toggle
      }
      className={`relative flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition select-none ${
        val ? onClass : "border-white/10 hover:border-white/20"
      } ${
        fixed ? "cursor-default opacity-90" : "cursor-pointer"
      } ${locked ? "opacity-60" : ""}`}
    >
      {locked && (
        <div className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black">
          {plan.toUpperCase()}
        </div>
      )}

      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black flex-shrink-0 ${
          val
            ? `${chkClass} text-white`
            : "border border-white/20"
        }`}
      >
        {locked ? "🔒" : val ? "✓" : ""}
      </div>

      <span className="text-sm font-medium">
        {label}
      </span>
    </div>
  );
}