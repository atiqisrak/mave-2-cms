import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GraphQLResponse } from '@/types/auth';
import { RootState } from '../index';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:7845/graphql';

// Custom GraphQL base query
const graphqlRequestBaseQuery = fetchBaseQuery({
  baseUrl: GRAPHQL_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.tokens?.accessToken;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Custom GraphQL query function
const graphqlQuery = async (query: string, variables: any = {}, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.tokens?.accessToken;
  
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result: GraphQLResponse = await response.json();
  
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return { data: result.data };
};

// Base API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery,
  tagTypes: ['User', 'Organization', 'Role', 'Permission', 'Invitation'],
  endpoints: () => ({}),
});

// Helper function to create GraphQL mutations/queries
export const createGraphQLQuery = (query: string) => 
  async (variables: any = {}, { getState }: any): Promise<{ data: any }> => {
    // Check if the query uses input pattern by looking for $input in the query
    const usesInputPattern = query.includes('$input:');
    const wrappedVariables = usesInputPattern ? { input: variables } : variables;
    return await graphqlQuery(query, wrappedVariables, getState);
  };

export const createGraphQLMutation = (mutation: string) => 
  async (variables: any = {}, { getState }: any): Promise<{ data: any }> => {
    return await graphqlQuery(mutation, { input: variables }, getState);
  };
