import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

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
      // Try to get token from Redux store format first (mave_cms_tokens)
      const tokensData = localStorage.getItem('mave_cms_tokens');
      if (tokensData) {
        const tokens = JSON.parse(tokensData);
        token = tokens.accessToken;
      }
      
      // Fallback to old format (mave_cms_token) for backward compatibility
      if (!token) {
        token = localStorage.getItem('mave_cms_token');
      }
    } catch (error) {
      // localStorage might not be available in some environments
      console.warn('localStorage not available:', error);
    }
  }
  
  // Debug token availability
  if (typeof window !== 'undefined' && !token) {
    console.warn('[Apollo Client] No authentication token found in localStorage');
  } else if (token) {
    console.log('[Apollo Client] Token found, length:', token.length);
  }
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

let tokenRefreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  console.log('[Token Refresh] Starting token refresh...');
  
  try {
    const tokensData = localStorage.getItem('mave_cms_tokens');
    if (!tokensData) {
      console.log('[Token Refresh] No tokens found in localStorage');
      return null;
    }
    
    const tokens = JSON.parse(tokensData);
    if (!tokens?.refreshToken) {
      console.log('[Token Refresh] No refresh token found');
      return null;
    }

    console.log('[Token Refresh] Calling refresh mutation...');
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:7845/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation RefreshToken($input: RefreshTokenInput!) {
          refreshToken(input: $input) {
            accessToken
            refreshToken
          }
        }`,
        variables: { input: { refreshToken: tokens.refreshToken } }
      })
    });
    
    const data = await response.json();
    console.log('[Token Refresh] Response received:', data);
    
    if (data.data?.refreshToken) {
      const { accessToken, refreshToken: newRefreshToken } = data.data.refreshToken;
      localStorage.setItem('mave_cms_tokens', JSON.stringify({ accessToken, refreshToken: newRefreshToken }));
      console.log('[Token Refresh] Tokens updated successfully');
      return accessToken;
    }
    
    throw new Error('Token refresh failed');
  } catch (error) {
    console.error('[Token Refresh] Error:', error);
    localStorage.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return null;
  }
};

// Error Link with token refresh
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError && 'statusCode' in networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Handle 401 errors (unauthorized) with token refresh
    if (networkError.statusCode === 401) {
      if (typeof window === 'undefined') return;
      
      // Only attempt refresh if not already refreshing
      if (!tokenRefreshPromise) {
        tokenRefreshPromise = refreshAccessToken();
      }
      
      if (!tokenRefreshPromise) return;
      
      return new Promise((resolve) => {
        tokenRefreshPromise!.then((token) => {
          tokenRefreshPromise = null; // Reset for next refresh
          if (token) {
            // Retry the failed operation with the new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${token}`,
              },
            });
            // Retry the operation
            const subscriber = {
              next: (value: any) => resolve(value),
              error: (err: any) => resolve(err),
              complete: () => resolve({}),
            };
            forward(operation).subscribe(subscriber);
          } else {
            resolve(undefined);
          }
        }).catch(() => {
          tokenRefreshPromise = null; // Reset on error
          resolve(undefined);
        });
      }) as any;
    }
  }
});

// Retry Link for failed operations
const retryLink = new RetryLink({
  attempts: (count) => {
    return count < 3;
  },
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
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
