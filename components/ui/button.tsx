import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button"> & {
  loading?: boolean;
};

export default function Button({
  type = "button",
  className = "",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-lime px-4 py-3.5 text-base font-semibold text-brand-ink transition-colors enabled:hover:bg-brand-mint focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink disabled:cursor-not-allowed disabled:opacity-60 ${className}`.trim()}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-brand-ink/25 border-t-brand-ink"
        />
      )}
      {children}
    </button>
  );
}
