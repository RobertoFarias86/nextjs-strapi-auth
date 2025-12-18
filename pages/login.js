import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const next = typeof router.query.next === 'string' ? router.query.next : '/messages';

  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!form.email.includes('@')) return setErr('E-mail inválido');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.error || 'Erro ao autenticar');
        return;
      }
      window.location.href = next;
    } catch (e) {
      console.error(e);
      setErr('Falha de rede/servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Entrar</title></Head>
      <main style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
        <h1>Entrar</h1>
        <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <input placeholder="E-mail" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input type="password" placeholder="Senha" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          {err && <p style={{ color: 'crimson' }}>{err}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
        </form>
        <p style={{ marginTop: 12 }}>
          Não tem conta? <Link href="/register">Registrar</Link>
        </p>
      </main>
    </>
  );
}