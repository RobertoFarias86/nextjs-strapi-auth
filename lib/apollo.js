import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function makeApollo() {
  const uri = process.env.STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql';
  return new ApolloClient({
    link: new HttpLink({ uri, headers: process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {} }),
    cache: new InMemoryCache(),
  });
}