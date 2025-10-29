const variants = {
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-2xl font-semibold",
  h3: "text-xl font-semibold",
  h4: "text-lg font-medium",
  h5: "text-base font-medium",
  h6: "text-sm font-semibold uppercase",
  p: "text-sm leading-relaxed",
  small: "text-xs",
  code: "font-mono text-sm bg-[var(--bg-surface)] px-1 py-0.5 rounded"
};

const colors = {
  default: "text-[var(--text)]",
  muted: "text-[var(--text-muted,#6b7280)]",
  primary: "text-[var(--primary)]",
  danger: "text-[var(--danger)]",
  success: "text-[var(--success)]",
  warning: "text-[var(--warning)]"
};

const Typography = ({
  as,
  variant = "p",
  color = "default",
  className = "",
  children,
  ...props
}) => {
  const Component = as || variant;
  const variantClasses = variants[variant] || variants.p;
  const colorClasses = colors[color] || colors.default;

  return (
    <Component
      className={`${variantClasses} ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
