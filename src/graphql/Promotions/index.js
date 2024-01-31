import { gql } from '@apollo/client';

export const GET_ALL_PROMOTIONS = gql`
  query promotions($promotion_details: Promotion_) {
    promotions(promotion_details: $promotion_details) {
      data {
        id
        name
        start_date
        end_date
        type
        updated_at
      }
    }
  }
`;

export const GET_ONE_PROMOTION = gql`
  query promotion($promotion_details: Promotion_Single) {
    promotion(promotion_details: $promotion_details) {
      id
      name
      description
      banner_image
      url
      start_date
      end_date
      type
      updated_at
      translations {
        id
        name
      }
    }
  }
`;

export const ADD_PROMOTION = gql`
  mutation createPromotion(
    $promotion_details: Promotion_Create
    $translations: [Translation_Input_Type_Create_Promotion]
  ) {
    createPromotion(promotion_details: $promotion_details, translations: $translations) {
      id
      name
      description
      banner_image
      url
      start_date
      end_date
      type
      updated_at
      translations {
        id
        name
      }
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation updatePromotion(
    $promotion_details: Promotion_Update
    $translations: [Translation_Input_Type_Update_Promotion]
  ) {
    updatePromotion(promotion_details: $promotion_details, translations: $translations) {
      id
      name
      description
      banner_image
      url
      start_date
      end_date
      type
      updated_at
      translations {
        id
        name
      }
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation deletePromotion($id: String!) {
    deletePromotion(id: $id) {
      id
    }
  }
`;
