type FormMessageProps = {
  message: string;
};

export default function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="rounded-xl border border-brand-blue/30 bg-brand-blue/10 px-4 py-3 text-sm leading-6 text-brand-blue"
    >
      {message}
    </p>
  );
}
