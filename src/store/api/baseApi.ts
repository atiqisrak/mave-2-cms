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
        const token = localStorage.getItem('mave_cms_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('mave_cms_token') : null;
  
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