import Head from 'next/head';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { makeApollo } from '../lib/apollo';
import { absoluteStrapiUrl } from '../lib/strapiClient';
import Image from 'next/image';

const Q = gql`
  query Explore {
    posts(sort: "updatedAt:desc") {
      documentId
      title
      slug
      excerpt
      updatedAt
      cover { url alternativeText }
    }
  }
`;

export default function ExplorePage() {
  const client = makeApollo();
  const { data, loading, error } = useQuery(Q, { client });

  return (
    <>
      <Head><title>Explorar (Apollo)</title></Head>
      <main style={{ maxWidth: 960, margin: '40px auto', padding: 16 }}>
        <h1>Explorar (Apollo useQuery)</h1>
        {loading && <p>Carregando…</p>}
        {error && <p style={{ color: 'crimson' }}>Erro: {error.message}</p>}
        <ul style={{ display: 'grid', gap: 16, listStyle: 'none', padding: 0 }}>
          {(data?.posts || []).map(p => {
            const coverUrl = absoluteStrapiUrl(p.cover?.url);
            return (
              <li key={p.documentId} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                {coverUrl && (
                  <div style={{ position: 'relative', width: '100%', height: 220 }}>
                    <Image src={coverUrl} alt={p.cover?.alternativeText || p.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <h3 style={{ marginTop: 12 }}>{p.title}</h3>
                <p style={{ color: '#4b5563' }}>{p.excerpt}</p>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}