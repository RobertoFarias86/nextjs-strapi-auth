import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (!form.email.includes('@')) return setErr('E-mail inválido');
    if (form.password.length < 6) return setErr('Senha mínima de 6 caracteres');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json.error || 'Erro ao registrar');
        return;
      }
      window.location.href = '/messages';
    } catch (e) {
      console.error(e);
      setErr('Falha de rede/servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Registrar</title></Head>
      <main style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
        <h1>Registrar</h1>
        <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <input placeholder="Nome (opcional)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="E-mail" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input type="password" placeholder="Senha (mín. 6)" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          {err && <p style={{ color: 'crimson' }}>{err}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Enviando…' : 'Criar conta'}</button>
        </form>
        <p style={{ marginTop: 12 }}>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </main>
    </>
  );
}