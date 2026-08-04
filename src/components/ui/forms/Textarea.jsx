export default function Textarea({
  id,
  label,
  error,
  hint,
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

      <textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        className={[
          "min-h-36 w-full resize-y rounded-2xl border bg-white px-4 py-3",
          "text-slate-900 outline-none transition placeholder:text-slate-400",
          "focus:border-[#0b6f63] focus:ring-4 focus:ring-emerald-100",
          error ? "border-red-500" : "border-slate-300",
        ].join(" ")}
        {...props}
      />

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      {hint && !error && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}
