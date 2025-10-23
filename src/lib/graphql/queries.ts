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

// Content Management Queries
export const CONTENT_TYPES_QUERY = gql`
  query ContentTypes($where: ContentTypeWhereInput, $orderBy: [ContentTypeOrderByInput!], $skip: Int, $take: Int) {
    contentTypes(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      name
      slug
      description
      fields
      isActive
      createdAt
      updatedAt
      _count {
        entries
      }
    }
  }
`;

export const CONTENT_ENTRIES_QUERY = gql`
  query ContentEntries($where: ContentEntryWhereInput, $orderBy: [ContentEntryOrderByInput!], $skip: Int, $take: Int) {
    contentEntries(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      title
      slug
      status
      publishedAt
      createdAt
      updatedAt
      contentType {
        id
        name
        slug
      }
      author {
        id
        firstName
        lastName
      }
    }
  }
`;

// Media Queries
export const MEDIA_FILES_QUERY = gql`
  query MediaFiles($where: MediaFileWhereInput, $orderBy: [MediaFileOrderByInput!], $skip: Int, $take: Int) {
    mediaFiles(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      filename
      originalName
      mimeType
      size
      url
      thumbnailUrl
      createdAt
      updatedAt
      uploadedBy {
        id
        firstName
        lastName
      }
    }
  }
`;

// Role and Permission Queries
export const ROLES_QUERY = gql`
  query Roles($where: RoleWhereInput, $orderBy: [RoleOrderByInput!], $skip: Int, $take: Int) {
    roles(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      name
      description
      permissions {
        id
        name
        resource
        action
      }
      _count {
        users
      }
    }
  }
`;

export const PERMISSIONS_QUERY = gql`
  query Permissions($where: PermissionWhereInput, $orderBy: [PermissionOrderByInput!], $skip: Int, $take: Int) {
    permissions(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      id
      name
      resource
      action
      description
      _count {
        roles
      }
    }
  }
`;
