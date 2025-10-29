import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className = "",
  ...rest
}) => {
  const baseStyles = `
    inline-flex items-center justify-center cursor-pointer text-white
    font-medium rounded-lg
    transition-all duration-200 ease-in-out
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-105 active:scale-95
  `;
  const variants = {
    primary: `  bg-[var(--primary)]`,
    secondary: `  bg-[var(--secondary)]`,
    success: `  bg-[var(--success)]`,
    danger: `  bg-[var(--danger)]`,
    info: `  bg-[var(--info)]`,
    outline: `
      bg-transparent 
      text-[var(--text)]
      border border-gray-300 dark:border-gray-600
    `
  };

  const sizes = {
    xs: `
      px-2 py-1
      text-xs
      gap-1
    `,
    sm: `
      px-3 py-1.5
      text-sm
      gap-1.5
    `,
    md: `
      px-4 py-2
      text-sm
      gap-2
    `,
    lg: `
      px-6 py-3
      text-base
      gap-2
    `
  };
  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonStyles}
      {...rest}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button;
