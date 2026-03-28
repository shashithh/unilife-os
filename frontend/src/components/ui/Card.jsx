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