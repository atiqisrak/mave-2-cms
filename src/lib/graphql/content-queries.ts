import { gql } from '@apollo/client';

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
