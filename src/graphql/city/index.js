import { gql } from 'graphql-tag';

export const GET_ALL_CITIES = gql`
  query cities($city_type: City_, $size: Int, $page: Int, $search: String, $language: String) {
    cities(city_type: $city_type, size: $size, page: $page, search: $search, language: $language) {
      totalPages
      data {
        id
        country {
          name
        }
        name
        code
        updated_at
      }
    }
  }
`;

export const ADD_CITY = gql`
  mutation createCity(
    $country_id: String!
    $name: String!
    $code: String!
    $location: [Float]
    $translations: [Translation_Input_Type_City_Create!]
  ) {
    createCity(
      country_id: $country_id
      name: $name
      code: $code
      location: $location
      translations: $translations
    ) {
      id
    }
  }
`;

export const GET_CITY = gql`
  query GetCity($id: ID) {
    city(id: $id) {
      id
      country_id
      country {
        id
        name
      }
      name
      code
      location {
        coordinates
      }
      deleted
      created_at
      updated_at
      translations {
        id
        language_id
        name
      }
    }
  }
`;

export const DELETE_CITY = gql`
  mutation deleteCity($id: String!) {
    deleteCity(id: $id) {
      id
    }
  }
`;

export const UPDATE_CITY = gql`
  mutation updateCity(
    $id: String!
    $name: String!
    $code: String!
    $country_id: String!
    $location: [Float]
    $translations: [Translation_Input_Type_City_Update!]
  ) {
    updateCity(
      id: $id
      country_id: $country_id
      name: $name
      code: $code
      location: $location
      translations: $translations
    ) {
      id
    }
  }
`;
