import { gql } from '@apollo/client';

export const GET_ALL_COUNTRY = gql`
  query GetCountries(
    $country_type: Country_
    $size: Int
    $page: Int
    $search: String
    $language: String
  ) {
    countries(
      country_type: $country_type
      size: $size
      page: $page
      search: $search
      language: $language
    ) {
      currentPage
      totalPages
      data {
        id
        name
        code
        updated_at
      }
    }
  }
`;

export const CREATE_COUNTRY = gql`
  mutation createCountry(
    $name: String!
    $code: String!
    $translations: [Translation_Input_Type_Create_Country!]
  ) {
    createCountry(name: $name, code: $code, translations: $translations) {
      id
      name
      created_at
      updated_at
      code
    }
  }
`;

export const GET_ONE_COUNTRY = gql`
  query GetCountryById($id: String!) {
    country(id: $id) {
      id
      name
      code
      phone_code
      cities {
        id
        name
      }
      deleted
      created_at
      updated_at
      translations {
        language_id
        name
        id
      }
    }
  }
`;

export const UPDATE_COUNTRY = gql`
  mutation UpdateCountry(
    $id: String!
    $name: String
    $code: String
    $translations: [Translation_Input_Type_Update_Country]
  ) {
    updateCountry(
      id: $id
      name: $name
      code: $code

      translations: $translations
    ) {
      id
      name
      code
      phone_code
      cities {
        id
        name
      }
      deleted
      created_at
      updated_at
      translations {
        language_id
        name
        id
      }
    }
  }
`;

export const DELETE_COUNTRY = gql`
  mutation deleteCountry($id: String!) {
    deleteCountry(id: $id) {
      id
      name
      code
      phone_code
      deleted
    }
  }
`;
