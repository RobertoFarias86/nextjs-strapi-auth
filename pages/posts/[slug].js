
import Head from 'next/head';
import Image from 'next/image';
import { strapiGraphQL, absoluteStrapiUrl } from '../../lib/strapiClient';
import { LIST_SLUGS, POST_BY_SLUG } from '../../lib/queries';

export async function getStaticPaths() {
  
  const data = await strapiGraphQL(LIST_SLUGS);
  const slugs = (data.posts || []).map(p => p.slug).filter(Boolean);

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: 'blocking', 
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const data = await strapiGraphQL(POST_BY_SLUG, { slug });
  const posts = data?.posts || [];
  const post = posts[0] || null;

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    
  };
}

export default function PostPage({ post }) {
  const coverUrl = absoluteStrapiUrl(post.cover?.url);

  return (
    <>
      <Head>
        <title>{post.title} • Next.js + Strapi</title>
        <meta name="description" content={post.excerpt || `Post: ${post.title}`} />
        <meta property="og:title" content={post.title} />
        {coverUrl && <meta property="og:image" content={coverUrl} />}
      </Head>

      <main style={{ maxWidth: 760, margin: '40px auto', padding: 16 }}>
        <h1 style={{ marginBottom: 16 }}>{post.title}</h1>

        {coverUrl && (
          <div style={{ position: 'relative', width: '100%', height: 360, marginBottom: 16 }}>
            <Image
              src={coverUrl}
              alt={post.cover?.alternativeText || post.title}
              fill
              sizes="(max-width: 760px) 100vw, 760px"
              style={{ objectFit: 'cover', borderRadius: 12 }}
            />
          </div>
        )}

        {post.excerpt && <p style={{ fontSize: 18, color: '#4b5563' }}>{post.excerpt}</p>}

        {post.content && (
          <article
            style={{ marginTop: 16, lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        <small style={{ color: '#6b7280', display: 'block', marginTop: 24 }}>
          Atualizado em {new Date(post.updatedAt).toLocaleString('pt-BR')}
        </small>
      </main>
    </>
  );
}