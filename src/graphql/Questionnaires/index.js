import { gql } from '@apollo/client';

export const GET_ALL_QUESTIONNAIRES = gql`
  query questionnaires {
    questionnaires {
      data {
        id
        question
        type
        options
        order
        status
        translations {
          id
          name
        }
        updated_at
      }
    }
  }
`;

export const ADD_QUESTIONNAIRES = gql`
  mutation createQuestionnaire(
    $questionnaire: Questionnaire_Create
    $translations: [Translation_Input_Type_Create_Questionnaire]
  ) {
    createQuestionnaire(questionnaire: $questionnaire, translations: $translations) {
      id
      question
      type
      options
      order
      status
      updated_at
    }
  }
`;
export const UPDATE_QUESTIONNAIRES = gql`
  mutation updateQuestionnaire(
    $questionnaire: Questionnaire_Update
    $translations: [Translation_Input_Type_Update_Questionnaire]
  ) {
    updateQuestionnaire(questionnaire: $questionnaire, translations: $translations) {
      id
      question
      type
      options
      order
      status
      updated_at
      translations {
        id
      }
    }
  }
`;
export const DELETE_QUESTIONNAIRES = gql`
  mutation deleteQuestionnaire($id: String!) {
    deleteQuestionnaire(id: $id) {
      id
    }
  }
`;
export const GET_ONE_QUESTIONNAIRES = gql`
  query questionnaire($questionnaire: Questionnaire_Single, $language: String) {
    questionnaire(questionnaire: $questionnaire, language: $language) {
      id
      question
      type
      options
      order
      status
      updated_at
      translations {
        id
        language_id
        name
      }
    }
  }
`;
