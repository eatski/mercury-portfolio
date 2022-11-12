import { createClient } from 'urql';

export const client = createClient({
  url: '/graphql',
  suspense: true,
});