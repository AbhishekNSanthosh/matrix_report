import { gql } from '@apollo/client';

export const GET_ALL_CURRENCIES = gql`
  query currencies {
    currencies {
      id
      code
      prefix
      updated_at
      translations {
        id
        name
      }
    }
  }
`;

export const ADD_CURRENCY = gql`
  mutation createCurrency(
    $currency: Currency_Create
    $translations: [Translation_Input_Type_Create_Currency]
  ) {
    createCurrency(currency: $currency, translations: $translations) {
      id
      code
      prefix
      created_at
    }
  }
`;
export const GET_ONE_CURRENCY = gql`
  query GetCurrency($currency: Currency_Single, $language: String) {
    currency(currency: $currency, language: $language) {
      id
      prefix
      code
      suffix
      conversion_rate
      is_base_currency
      status
      deleted
      created_at
      updated_at
      translations {
        id
      }
    }
  }
`;

export const DELETE_CURRENCY = gql`
  mutation DeleteCurrency($id: String!) {
    deleteCurrency(id: $id) {
      id
      prefix
      code
      suffix
      conversion_rate
      is_base_currency
      status
      deleted
      created_at
      updated_at
      translations {
        id
      }
    }
  }
`;

export const UPDATE_CURRENCY = gql`
  mutation UpdateCurrency(
    $currency: Currency_Update
    $translations: [Translation_Input_Type_Update_Currency]
  ) {
    updateCurrency(currency: $currency, translations: $translations) {
      id
      prefix
      code
      suffix
      conversion_rate
      is_base_currency
      status
      deleted
      created_at
      updated_at
      translations {
        id
      }
    }
  }
`;
