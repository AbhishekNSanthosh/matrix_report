import { gql } from '@apollo/client';

export const GET_ALL_LANGUAGES = gql`
  query languages {
    languages {
      id
      name
      created_at
      updated_at
      code
    }
  }
`;

export const ADD_LANGUAGE = gql`
  mutation createLanguage($name: String!, $code: String!) {
    createLanguage(name: $name, code: $code) {
      id
      name
      created_at
      updated_at
      code
    }
  }
`;
export const GET_ONE_LANGUAGE = gql`
  query language($id: ID, $name: String, $code: String) {
    language(id: $id, name: $name, code: $code) {
      id
      name
      code
      deleted
      created_at
      updated_at
    }
  }
`;
export const UPDATE_LANGUAGE = gql`
  mutation updateLanguage($id: String!, $name: String, $code: String, $deleted: Boolean) {
    updateLanguage(id: $id, name: $name, code: $code, deleted: $deleted) {
      id
      name
      code
      deleted
      created_at
      updated_at
    }
  }
`;
export const DELETE_LANGUAGE = gql`
  mutation deleteLanguage($id: String!) {
    deleteLanguage(id: $id) {
      id
      name
      code
      deleted
      created_at
      updated_at
    }
  }
`;
