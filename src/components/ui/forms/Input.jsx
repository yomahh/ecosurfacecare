export default function Input({
  id,
  label,
  error,
  hint,
  required = false,
  className = "",
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block font-semibold text-[#17352f]">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId || hintId}
        className={[
          "min-h-12 w-full rounded-2xl border bg-white px-4 py-3 text-slate-900",
          "outline-none transition placeholder:text-slate-400",
          "focus:border-[#228B22] focus:ring-4 focus:ring-emerald-100",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300",
        ].join(" ")}
        {...props}
      />

      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={hintId} className="mt-2 text-sm text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
