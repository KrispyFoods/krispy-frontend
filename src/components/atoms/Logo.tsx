import Link from 'next/link';

export function Logo({ name }: { name: string }) {
  return (
    <Link href="/" className="font-display text-3xl font-semibold tracking-wide">
      {name}
      <span className="text-primary">.</span>
    </Link>
  );
}
