import type { ComponentProps } from "react";

export type FormFieldProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export default function FormField({
  id,
  label,
  required = false,
  className = "",
  error,
  hint,
  "aria-describedby": describedBy,
  ...props
}: FormFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium text-brand-white">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-brand-mint">
            *
          </span>
        )}
      </span>
      <input
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={[describedBy, error ? `${id}-error` : hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined}
        className={`mt-2 block w-full rounded-xl border bg-brand-ink px-4 py-3.5 text-brand-white caret-brand-mint placeholder:text-brand-white/45 transition-colors focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/20 disabled:opacity-60 ${error ? "border-brand-blue" : "border-brand-white/20 hover:border-brand-mint/60"} ${className}`.trim()}
      />
      {error ? (
        <span id={`${id}-error`} className="mt-2 block text-xs leading-5 text-brand-blue">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="mt-2 block text-xs leading-5 text-brand-white/60">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
