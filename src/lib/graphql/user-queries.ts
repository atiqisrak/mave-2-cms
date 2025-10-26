import { gql } from '@apollo/client';

// User Management Queries
export const USERS_QUERY = gql`
  query Users($where: UserWhereInput, $orderBy: [UserOrderByInput!], $skip: Int, $take: Int) {
    users(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
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
      isActive
      createdAt
      updatedAt
      organization {
        id
        name
      }
    }
  }
`;

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
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
      isActive
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const ALL_USERS_QUERY = gql`
  query Users($organizationId: String!, $skip: Int, $take: Int) {
    users(organizationId: $organizationId, skip: $skip, take: $take) {
      id
      email
      firstName
      lastName
      username
      phone
      status
      isSystem
      createdAt
      updatedAt
    }
  }
`;

export const USER_DETAILS_QUERY = gql`
  query UserDetails($id: String!) {
    userDetails(id: $id) {
      user {
        id
        email
        firstName
        lastName
        username
        phone
        status
        isSystem
        createdAt
        updatedAt
      }
      organization {
        id
        name
        slug
      }
      roles {
        id
        roleId
        role {
          id
          name
          slug
          color
          icon
        }
        scope
        isActive
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
      username
      phone
      status
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      username
      phone
      status
      createdAt
      updatedAt
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    removeUser(id: $id) {
      id
      email
    }
  }
`;
