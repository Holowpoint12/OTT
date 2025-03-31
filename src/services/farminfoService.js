import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('GraphQL Errors:', graphQLErrors);
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP link
const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production' 
    ? '/graphql'
    : process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4001/graphql',
  credentials: 'include'
});

// Create Apollo client instance for service functions
const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

// GraphQL query for farminfo
const GET_FARMINFO = gql`
  query GetFarminfos {
    farminfos {
      id
      name
      address
      city
      state
      zip
      coordinates {
        lat
        lng
      }
      category
      isPublic
      description
    }
  }
`;

/**
 * Fetch farminfo from server using GraphQL with REST fallback
 * @returns {Promise<Array>} Array of farminfo objects
 */
export async function fetchFarminfo() {
  try {
    console.log('Attempting to fetch farminfo data via GraphQL...');
    
    try {
      // First try GraphQL
      const { data } = await apolloClient.query({
        query: GET_FARMINFO,
        fetchPolicy: 'network-only',
      });
      
      console.log('Farminfo data received via GraphQL:', data);
      return data.farminfos;
    } catch (graphqlError) {
      console.error('GraphQL fetch failed, falling back to REST API:', graphqlError);
      
      // If GraphQL fails, try REST API
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL 
            ? `${process.env.REACT_APP_API_URL}/api/farminfo` 
            : 'http://localhost:4001/api/farminfo', 
          {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Farminfo data received via REST API:', data);
        return data;
      } catch (restError) {
        console.error('REST API fetch failed:', restError);
        throw restError;
      }
    }
  } catch (error) {
    console.error('All attempts to fetch farminfo failed:', error);
    
    // Return empty array instead of throwing to avoid breaking the UI
    console.warn('Returning empty array as fallback');
    return [];
  }
}