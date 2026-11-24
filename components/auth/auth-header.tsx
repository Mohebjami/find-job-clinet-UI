type AuthHeaderProps = {
  id: string;
  title: string;
  description: string;
};

export default function AuthHeader({
  id,
  title,
  description,
}: AuthHeaderProps) {
  return (
    <header>
      <p className="text-sm font-semibold tracking-wide text-brand-lime">
        Find your next job
      </p>
      <h1
        id={id}
        className="mt-3 break-words text-3xl font-semibold tracking-tight text-brand-white sm:text-4xl"
      >
        {title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-brand-white/70">{description}</p>
    </header>
  );
}
