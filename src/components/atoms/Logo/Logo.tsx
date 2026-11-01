import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/Krispi Logo.png"
        alt="Krispi Logo"
        width={1628}
        height={621}
        priority
        className="inline-block h-12 w-auto"
      />
    </Link>
  );
}
