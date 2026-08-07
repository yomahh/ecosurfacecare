export default function Select({
  id,
  label,
  children,
  error,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block font-semibold text-[#17352f]">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        className={[
          "min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-slate-900",
          "outline-none transition",
          "focus:border-[#228B22] focus:ring-4 focus:ring-emerald-100",
          error ? "border-red-500" : "border-slate-300",
        ].join(" ")}
        {...props}
      >
        {children}
      </select>

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
