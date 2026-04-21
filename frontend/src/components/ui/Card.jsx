import React from 'react';
export function Card({
  children,
  className = '',
  glass = true,
  hover = false,
  ...props
}) {
  const baseStyle =
  'rounded-2xl border border-white/20 shadow-lg overflow-hidden';
  const glassStyle = glass ? 'bg-white/80 backdrop-blur-md' : 'bg-white';
  const hoverStyle = hover ?
  'transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl' :
  '';
  return (
    <div
      className={`${baseStyle} ${glassStyle} ${hoverStyle} ${className}`}
      {...props}>
      
      {children}
    </div>);

}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}