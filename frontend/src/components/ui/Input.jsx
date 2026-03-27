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