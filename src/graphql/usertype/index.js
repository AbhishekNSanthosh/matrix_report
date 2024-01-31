import { gql } from '@apollo/client';

export const USER_TYPE = gql`
  query userTypes {
    userTypes {
      id
      name
      created_at
      updated_at
    }
  }
`;
export const CREATE_USER_TYPE = gql`
  mutation createUserType(
    $name: String!
    $translations: [Translation_Input_Type_User_Type_Create]
  ) {
    createUserType(name: $name, translations: $translations) {
      id
      name
      deleted
      created_at
      updated_at
      translations {
        id
        name
      }
    }
  }
`;

export const GET_USER_TYPE = gql`
  query userType($id: ID, $name: String, $created_at: String, $updated_at: String) {
    userType(id: $id, name: $name, created_at: $created_at, updated_at: $updated_at) {
      id
      name
      deleted
      created_at
      updated_at
      translations {
        language_id
        id
        name
      }
    }
  }
`;

export const UPDATE_USER_TYPE = gql`
  mutation UpdateUserType(
    $id: String!
    $name: String
    $deleted: Boolean
    $translations: [Translation_Input_Type_update_User_Type_Create]
  ) {
    updateUserType(id: $id, name: $name, deleted: $deleted, translations: $translations) {
      id
      name
      deleted
      created_at
      updated_at
      translations {
        language_id
        id
        name
      }
    }
  }
`;

export const DELETE_USER_TYPE = gql`
  mutation deleteUserType($id: String!) {
    deleteUserType(id: $id) {
      id
      name
      deleted
    }
  }
`;
