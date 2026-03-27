export function Card({
  children,
  className = "",
  hoverable = false,
  ...props
}) {
  return <div
    className={`glass-card rounded-2xl transition-all duration-300 ${hoverable ? "hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer" : ""} ${className}`}
    {...props}
  >{children}</div>;
}
export function CardHeader({
  children,
  className = ""
}) {
  return <div className={`px-6 py-5 border-b border-slate-100/50 ${className}`}>{children}</div>;
}
export function CardTitle({
  children,
  className = ""
}) {
  return <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>{children}</h3>;
}
export function CardContent({
  children,
  className = ""
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
