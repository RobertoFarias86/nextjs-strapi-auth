
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { strapiGraphQL, absoluteStrapiUrl } from '../lib/strapiClient';
import { POSTS_CONNECTION } from '../lib/queries';

export async function getStaticProps() {
  
  const data = await strapiGraphQL(POSTS_CONNECTION, { page: 1, pageSize: 20 });
  const conn = data.posts_connection;
  const posts = conn?.nodes ?? [];

  return {
    props: { posts },
    
  };
}

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Blog • Next.js + Strapi</title>
        <meta name="description" content="Lista de posts publicados via Strapi" />
        <meta property="og:title" content="Blog • Next.js + Strapi" />
      </Head>

      <main style={{ maxWidth: 960, margin: '40px auto', padding: 16 }}>
        <h1 style={{ marginBottom: 24 }}>Últimos posts</h1>

        {posts.length === 0 && <p>Nenhum post publicado.</p>}

        <ul style={{ display: 'grid', gap: 24, listStyle: 'none', padding: 0 }}>
          {posts.map((post) => {
            const coverUrl = absoluteStrapiUrl(post.cover?.url);
            return (
              <li
                key={post.documentId}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  display: 'grid',
                  gap: 12,
                }}
              >
                {coverUrl && (
                  <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden', borderRadius: 8 }}>
                    <Image
                      src={coverUrl}
                      alt={post.cover?.alternativeText || post.title}
                      fill
                      sizes="(max-width: 960px) 100vw, 960px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                <h2 style={{ margin: '8px 0' }}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h2>

                <p style={{ color: '#4b5563', margin: 0 }}>{post.excerpt}</p>

                <small style={{ color: '#6b7280' }}>
                  Atualizado em {new Date(post.updatedAt).toLocaleString('pt-BR')}
                </small>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}