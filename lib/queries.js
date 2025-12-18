export const POSTS_CONNECTION = `
  query ($page: Int!, $pageSize: Int!) {
    posts_connection(pagination: { page: $page, pageSize: $pageSize }, sort: "updatedAt:desc") {
      nodes {
        documentId
        title
        slug
        excerpt
        updatedAt
        cover { url alternativeText width height }
      }
      pageInfo { page pageSize pageCount total }
    }
  }
`;


export const LIST_SLUGS = `
  query {
    posts(status: PUBLISHED) {
      slug
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