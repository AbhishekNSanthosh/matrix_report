import { gql } from '@apollo/client';

export const ADD_MUSCLEGROUP = gql`
  mutation CreateMuscleGroup($muscleGroupDetails: MuscleGroup_Create!) {
    createMuscleGroup(muscle_group_details: $muscleGroupDetails) {
      id
      name
      description
      image
      updated_at
    }
  }
`;

export const GET_ALL_MUSCLEGROUP = gql`
  query muscleGroups($muscleGroupDetails: MuscleGroup_, $search: String, $size: Int, $page: Int) {
    muscleGroups(
      muscle_group_details: $muscleGroupDetails
      search: $search
      size: $size
      page: $page
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

export const GET_ONE_MUSCLEGROUP = gql`
  query muscleGroup($muscleGroupDetails: MuscleGroup_Single) {
    muscleGroup(muscle_group_details: $muscleGroupDetails) {
      id
      name
      description
      image
      updated_at
    }
  }
`;

export const UPDATE_MUSCLEGROUP = gql`
  mutation updateMuscleGroup($muscleGroupDetails: MuscleGroup_Update!) {
    updateMuscleGroup(muscle_group_details: $muscleGroupDetails) {
      id
    }
  }
`;

export const DELETE_MUSCLEGROUP = gql`
  mutation deleteMuscleGroup($id: String!) {
    deleteMuscleGroup(id: $id) {
      id
      name
      description
      image
      deleted
      created_at
      updated_at
    }
  }
`;
