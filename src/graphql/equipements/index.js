import { gql } from '@apollo/client';

export const GET_ALL_EQUIPEMENTS = gql`
  query GetEquipments($search: String, $size: Int, $page: Int, $equipement_details: Equipement_) {
    equipements(
      search: $search
      size: $size
      page: $page
      equipement_details: $equipement_details
    ) {
      currentPage
      totalPages
      totalData
      data {
        id
        name
        description
        image
        created_at
        updated_at
      }
    }
  }
`;

export const ADD_EQUIPEMENT = gql`
  mutation CreateEquipement(
    $equipementDetails: Equipement_Create
    $translations: [Translation_Input_Type_Create_Equipement]
  ) {
    createEquipement(equipement_details: $equipementDetails, translations: $translations) {
      id
      name
      description
      image
      deleted
      translations {
        id
        name
      }
      created_at
      updated_at
    }
  }
`;

export const GET_ONE_EQUIPEMENT = gql`
  query GetEquipment($equipement_details: Equipement_single) {
    equipement(equipement_details: $equipement_details) {
      id
      name
      description
      image
      translations {
        language_id
        id
        name
      }
      deleted
      created_at
      updated_at
    }
  }
`;
export const UPDATE_EQUIPEMENT = gql`
  mutation UpdateEquipement(
    $equipementDetails: Equipement_Update
    $translations: [Translation_Input_Type_Update_Equipement]
  ) {
    updateEquipement(equipement_details: $equipementDetails, translations: $translations) {
      id
      name
      description
      image
      deleted
      translations {
        id
        name
      }
      created_at
      updated_at
    }
  }
`;

export const DELETE_EQUIPEMENT = gql`
  mutation deleteEquipement($id: String!) {
    deleteEquipement(id: $id) {
      id
    }
  }
`;
