import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-[#0b6f63] text-white border-[#0b6f63] hover:bg-[#08584e] hover:border-[#08584e]",
  secondary:
    "bg-white text-[#0b6f63] border-[#0b6f63] hover:bg-emerald-50",
  ghost:
    "bg-transparent text-[#0b6f63] border-transparent hover:bg-emerald-50",
  dark:
    "bg-[#17352f] text-white border-[#17352f] hover:bg-[#0e2723]",
  danger:
    "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700",
};

const sizes = {
  small: "min-h-10 px-4 py-2 text-sm",
  medium: "min-h-12 px-6 py-3",
  large: "min-h-14 px-7 py-3.5 text-lg",
};

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-full border font-bold",
    "transition duration-200 ease-out",
    "hover:-translate-y-0.5",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.medium,
    className,
  ].join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {content}
    </button>
  );
}
