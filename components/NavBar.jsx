import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    fetch('/api/profile')
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  }

  return (
    <header style={{
      borderBottom: '1px solid #e5e7eb',
      padding: '12px 16px',
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link href="/">Home</Link>
        <Link href="/messages">Mensagens (protegida)</Link>
      </nav>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>Olá, {user.name || user.email}</span>
            <button onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: 12 }}>Entrar</Link>
            <Link href="/register">Registrar</Link>
          </>
        )}
      </div>
    </header>
  );
}