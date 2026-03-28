<<<<<<< HEAD
import React from 'react';
export function Input({
  label,
  error,
  as = 'input',
  options,
  className = '',
  ...props
}) {
  const baseInputStyle =
  'w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all backdrop-blur-sm';
  const errorStyle = error ? 'border-red-500 focus:ring-red-500' : '';
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>

      {as === 'select' ?
      <select
        className={`${baseInputStyle} ${errorStyle}`}
        {...props}>
        
          <option value="" disabled>
            Select {label}
          </option>
          {options?.map((opt) =>
        <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
        )}
        </select> :
      as === 'textarea' ?
      <textarea
        className={`${baseInputStyle} ${errorStyle} min-h-[100px] resize-y`}
        {...props} /> :


      <input
        className={`${baseInputStyle} ${errorStyle}`}
        {...props} />

      }

      {error &&
      <span className="text-xs text-red-500 ml-1 animate-fade-in">
          {error}
        </span>
      }
    </div>);

}
=======
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
>>>>>>> ea163fd0e8677a6b312d155408fea424ad87be78
