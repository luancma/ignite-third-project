import Image from 'next/image';
import Link from 'next/link';

export default function Header(): JSX.Element {
  return (
    <Link href="/">
      <Image src="/Logo.png" width={500} height={500} alt="logo" />
    </Link>
  );
}
