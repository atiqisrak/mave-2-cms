import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// HTTP Link
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:7845/graphql',
});

// Auth Link
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  // Only access localStorage on the client side to prevent hydration mismatch
  let token = null;
  if (typeof window !== 'undefined') {
    try {
      token = localStorage.getItem('mave_cms_token');
    } catch (error) {
      // localStorage might not be available in some environments
      console.warn('localStorage not available:', error);
    }
  }
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle 401 errors (unauthorized)
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mave_cms_token');
        localStorage.removeItem('mave_cms_refresh_token');
        window.location.href = '/auth/login';
      }
    }
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Define cache policies for specific queries
          users: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          organizations: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
