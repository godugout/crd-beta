
import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  ApolloLink,
  from, 
  split
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { toast } from 'sonner';

// Auth headers link
const authLink = new ApolloLink((operation, forward) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken');
  
  // Return the headers to the context so httpLink can read them
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }));

  return forward(operation);
});

// HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_URL || '/graphql',
});

// WebSocket link for subscriptions
let wsLink: GraphQLWsLink | null = null;

// Only create the WebSocket link on the client
if (typeof window !== 'undefined') {
  wsLink = new GraphQLWsLink(createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_URL || 
         import.meta.env.VITE_GRAPHQL_API_URL?.replace('http', 'ws') || 
         'ws://localhost:4000/graphql',
    connectionParams: () => {
      const token = localStorage.getItem('authToken');
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    }
  }));
}

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      toast.error(`GraphQL Error: ${message}`);
    });
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    toast.error(`Network Error: ${networkError.message}`);
  }
});

// Split based on operation type
const splitLink = wsLink ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink;

// Combine the links
const link = from([
  errorLink,
  authLink,
  splitLink
]);

// Create the Apollo Client
export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cards: {
            keyArgs: ['filter'],
            merge(existing = { items: [], total: 0, hasMore: true }, incoming) {
              if (!incoming) return existing;
              
              return {
                ...incoming,
                items: existing.items ? [...existing.items, ...incoming.items] : incoming.items,
              };
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
