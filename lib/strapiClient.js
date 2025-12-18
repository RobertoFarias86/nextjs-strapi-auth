const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL || `${STRAPI_URL}/graphql`;
const TOKEN = process.env.STRAPI_API_TOKEN;


export function absoluteUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
}


export async function gql(query, variables = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = await res.json();
  if (json.errors) {
    console.error('Strapi GraphQL errors:', JSON.stringify(json.errors, null, 2));
    throw new Error('Erro ao consultar o Strapi GraphQL');
  }
  return json.data;
}


export const LIST_POSTS = `
  query {
    posts(sort: "updatedAt:desc") {
      documentId
      title
      slug
      excerpt
      updatedAt
      cover { url alternativeText width height }
    }
  }
`;

export const POST_BY_SLUG = `
  query ($slug: String!) {
    posts(filters: { slug: { eq: $slug } }, status: PUBLISHED) {
      documentId
      title
      slug
      excerpt
      content
      updatedAt
      cover { url alternativeText width height }
    }
  }
`;


export async function fetchPosts() {
  const data = await gql(LIST_POSTS);
  return data.posts ?? [];
}

export async function fetchPostSlugs() {
  const data = await gql(`query { posts { slug } }`);
  return (data.posts ?? []).map(p => p.slug);
}

export async function fetchPostBySlug(slug) {
  const data = await gql(POST_BY_SLUG, { slug });
  const arr = data.posts ?? [];
  return arr[0] || null;
}
export { gql as strapiGraphQL, absoluteUrl as absoluteStrapiUrl };