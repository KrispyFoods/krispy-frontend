import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/Krispi Logo.png"
        alt="Krispi Logo"
        width={100}
        height={100}
        className="inline-block "
      />
    </Link>
  );
}
