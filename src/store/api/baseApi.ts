"use client";

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GraphQLResponse } from '@/types/auth';

// Base API configuration
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7845';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/graphql`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      
      // Get token from localStorage for client-side requests
      if (typeof window !== 'undefined') {
        const tokens = localStorage.getItem('mave_cms_tokens');
        if (tokens) {
          try {
            const parsedTokens = JSON.parse(tokens);
            if (parsedTokens.accessToken) {
              headers.set('Authorization', `Bearer ${parsedTokens.accessToken}`);
            }
          } catch (error) {
            console.warn('Failed to parse tokens from localStorage:', error);
          }
        }
      }
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Organization', 'Role', 'Permission', 'Invitation'],
  endpoints: () => ({}),
});

// GraphQL query helper functions
export const graphqlQuery = async (query: string, variables: any = {}) => {
  let token = null;
  if (typeof window !== 'undefined') {
    const tokens = localStorage.getItem('mave_cms_tokens');
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        token = parsedTokens.accessToken;
      } catch (error) {
        console.warn('Failed to parse tokens from localStorage:', error);
      }
    }
  }
  
  const response = await fetch(`${baseUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  const result: GraphQLResponse = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data;
};

export const createGraphQLQuery = (query: string) => {
  return async (args: any) => {
    try {
      const data = await graphqlQuery(query, args);
      return { data };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };
};

export const createGraphQLMutation = (mutation: string) => {
  return async (args: any) => {
    try {
      const data = await graphqlQuery(mutation, args);
      return { data };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };
};