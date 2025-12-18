import { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { requireAuthPage } from '../lib/auth';

export const getServerSideProps = requireAuthPage; 

export default function MessagesPage({ user }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function loadMessages() {
    try {
      setLoading(true);
      setError('');
      const resp = await fetch('/api/messages');
      if (resp.status === 401) {
        Router.replace('/login');
        return;
      }
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || 'Falha ao carregar mensagens');
      }
      const data = await resp.json();
      
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const content = (text || '').trim();
    if (!content) return;

    try {
      setSending(true);
      setError('');
      const resp = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({ content }),
      });

      if (resp.status === 401) {
        Router.replace('/login');
        return;
      }
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || 'Falha ao enviar');
      }

      setText('');
      await loadMessages();
    } catch (e) {
      console.error(e);
      alert('Falha ao enviar'); 
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    loadMessages();
    
  }, []);

  return (
    <>
      <Head>
        <title>Mensagens</title>
        <meta name="description" content="Mensagens do usuário" />
      </Head>

      <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
        <h1>Mensagens</h1>
        <p>Bem-vindo, {user?.name || user?.email || 'usuário'}.</p>

        <section style={{ margin: '24px 0' }}>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Digite sua mensagem..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 12 }}
            />
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button type="submit" disabled={sending || !text.trim()}>
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
              <button type="button" onClick={loadMessages} disabled={loading}>
                Recarregar
              </button>
              <a href="/logout" onClick={(e) => { e.preventDefault(); fetch('/api/auth/logout', { method: 'POST' }).then(() => Router.replace('/')); }}>
                Sair
              </a>
            </div>
          </form>
        </section>

        <section>
          <h2>Suas mensagens</h2>
          {loading && <p>Carregando...</p>}
          {error && <p style={{ color: 'crimson' }}>{error}</p>}
          {!loading && !messages.length && <p>Nenhuma mensagem ainda.</p>}

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {messages.map((m) => (
              <li key={m.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: '#666' }}>
                  #{m.id} • {new Date(m.createdAt).toLocaleString()}
                </div>
                <div style={{ marginTop: 6 }}>{m.content}</div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#888' }}>
                  de: {m.fromUserId} • para: {m.toUserId}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}