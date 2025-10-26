import { gql } from '@apollo/client';

// Organization Queries
export const ORGANIZATIONS_QUERY = gql`
  query Organizations($where: OrganizationWhereInput, $orderBy: [OrganizationOrderByInput!], $skip: Int, $take: Int) {
    organizations(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      name
      slug
      description
      isActive
      createdAt
      updatedAt
      _count {
        users
        contentTypes
      }
    }
  }
`;

export const ORGANIZATION_QUERY = gql`
  query Organization($id: ID!) {
    organization(id: $id) {
      id
      name
      slug
      description
      isActive
      createdAt
      updatedAt
      users {
        id
        email
        firstName
        lastName
        roles {
          id
          roleId
          role {
            id
            name
            slug
          }
          scope
          isActive
        }
      }
    }
  }
`;

export const ALL_ORGANIZATIONS_QUERY = gql`
  query AllOrganizations($skip: Int, $take: Int) {
    organizations(skip: $skip, take: $take) {
      id
      name
      slug
      domain
      plan
      isActive
      createdAt
      updatedAt
      _count {
        users
      }
    }
  }
`;

export const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      slug
      domain
      plan
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation UpdateOrganization($id: String!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      slug
      domain
      plan
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ORGANIZATION_MUTATION = gql`
  mutation DeleteOrganization($id: String!) {
    deleteOrganization(id: $id) {
      id
      name
    }
  }
`;
