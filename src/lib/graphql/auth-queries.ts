import { gql } from '@apollo/client';

// Authentication Queries
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
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
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
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
        organization {
          id
          name
          slug
        }
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
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
      organization {
        id
        name
        slug
      }
    }
  }
`;
