export default function Checkbox({
  id,
  label,
  description,
  className = "",
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-slate-300 accent-[#0b6f63]"
        {...props}
      />

      <span>
        <span className="block font-semibold text-[#17352f]">{label}</span>

        {description && (
          <span className="mt-1 block text-sm leading-6 text-slate-500">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
