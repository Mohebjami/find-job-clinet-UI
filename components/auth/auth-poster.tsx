import Image from "next/image";

export default function AuthPoster() {
  return (
    <div className="order-last overflow-hidden rounded-2xl bg-brand-ink md:order-first">
      <Image
        className="h-auto w-full object-cover"
        src="/mb-web-client-poster.png"
        alt="Find your next job: create a profile, browse jobs, and apply easily."
        width={1086}
        height={1448}
        sizes="(min-width: 1152px) 504px, (min-width: 768px) 45vw, 100vw"
        loading="eager"
      />
    </div>
  );
}
