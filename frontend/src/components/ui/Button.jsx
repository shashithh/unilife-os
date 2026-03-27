export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  fullWidth = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow focus:ring-indigo-500",
    gradient: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-md hover:shadow-lg focus:ring-purple-500 border-0",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-200 shadow-sm",
    outline: "border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 focus:ring-indigo-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm focus:ring-rose-500"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const widthClass = fullWidth ? "w-full" : "";
  return <button
    className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    {...props}
  >{children}</button>;
}
