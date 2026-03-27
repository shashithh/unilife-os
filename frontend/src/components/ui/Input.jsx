import { forwardRef } from "react";
export const Input = forwardRef(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return <div className={`flex flex-col gap-1.5 ${className}`}>{label && <label className="text-sm font-medium text-slate-700">{label}</label>}<input
      ref={ref}
      className={`
            px-4 py-2.5 rounded-xl border bg-white/50 backdrop-blur-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            disabled:opacity-60 disabled:bg-slate-50
            ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : "border-slate-200 hover:border-slate-300"}
          `}
      {...props}
    />{error && <span className="text-xs font-medium text-rose-500 mt-0.5">{error}</span>}{helperText && !error && <span className="text-xs text-slate-500 mt-0.5">{helperText}</span>}</div>;
  }
);
Input.displayName = "Input";
