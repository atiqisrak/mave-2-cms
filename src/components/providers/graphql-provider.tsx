"use client";

import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { ClientOnly } from './client-only';

interface GraphQLProviderProps {
  children: React.ReactNode;
}

export function GraphQLProvider({ children }: GraphQLProviderProps) {
  return (
    <ClientOnly>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </ClientOnly>
  );
}
