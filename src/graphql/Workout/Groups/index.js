import { gql } from '@apollo/client';

export const GET_ALL_WORKOUT_GROUPS = gql`
  query workoutGroups($work_group_details: WorkoutGroupt_) {
    workoutGroups(work_group_details: $work_group_details) {
      id
      name
      translations {
        id
        name
        language_id
      }
      updated_at
    }
  }
`;

export const GET_ONE_WORKOUT_GROUPS = gql`
  query workoutGroup($work_group_details: WorkoutGroupt_Single) {
    workoutGroup(work_group_details: $work_group_details) {
      id
      name
      translations {
        id
        name
        language_id
      }
      updated_at
    }
  }
`;
export const ADD_WORKOUT_GROUPS = gql`
  mutation createWorkoutGroup(
    $work_group_details: WorkoutGroupt_Create
    $translations: [Translation_Input_Type_Create_WorkoutGroup]
  ) {
    createWorkoutGroup(work_group_details: $work_group_details, translations: $translations) {
      id
      name
      updated_at
    }
  }
`;

export const UPDATE_WORKOUT_GROUPS = gql`
  mutation updateWorkoutGroup(
    $work_group_details: WorkoutGroupt_Update
    $translations: [Translation_Input_Type_Update_WorkoutGroup]
  ) {
    updateWorkoutGroup(work_group_details: $work_group_details, translations: $translations) {
      id
      name
      updated_at
    }
  }
`;

export const DELETE_WORKOUT_GROUPS = gql`
  mutation deleteWorkoutGroup($id: String!) {
    deleteWorkoutGroup(id: $id) {
      id
    }
  }
`;
