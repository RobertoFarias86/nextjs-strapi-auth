import Link from 'next/link';

export default function Header() {
  return (
    <>
      <Link className="logo" href="/">Next + Strapi</Link>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Cadastro</Link>
        <Link href="/messages">Mensagens</Link>
      </nav>
    </>
  );
}