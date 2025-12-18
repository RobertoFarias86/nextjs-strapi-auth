import Link from 'next/link';
export default function PostCard({ slug, title, excerpt }){
  return (
    <article className="card">
      <h3><Link href={`/posts/${slug}`}>{title}</Link></h3>
      {excerpt && <p className="muted">{excerpt}</p>}
      <Link className="btn" href={`/posts/${slug}`}>Ler mais</Link>
    </article>
  );
}