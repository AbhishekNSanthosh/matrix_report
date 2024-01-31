import { gql } from '@apollo/client';

export const GET_ALL_WORKOUT_CATEGORIES = gql`
  query workoutCategories(
    $search: String
    $size: Int
    $page: Int
    $workout_category_details: WorkoutCategory_
  ) {
    workoutCategories(
      search: $search
      size: $size
      page: $page
      workout_category_details: $workout_category_details
    ) {
      currentPage
      totalPages
      totalData
      data {
        id
        name
        description
        image
        translations {
          id
          name
        }
        updated_at
      }
    }
  }
`;

export const GET_ONE_WORKOUT_CATEGORY = gql`
  query workoutCategory($workout_category_details: WorkoutCategory_Single) {
    workoutCategory(workout_category_details: $workout_category_details) {
      id
      name
      description
      image
      translations {
        id
        name
        language_id
      }
      updated_at
    }
  }
`;

export const ADD_WORKOUT_CATEGORY = gql`
  mutation createWorkoutCategory(
    $workout_category_details: WorkoutCategory_Create
    $translations: [Translation_Input_Type_Create_WorkoutCategory]
  ) {
    createWorkoutCategory(
      workout_category_details: $workout_category_details
      translations: $translations
    ) {
      id
      name
      description
      image
      updated_at
    }
  }
`;

export const UPDATE_WORKOUT_CATEGORY = gql`
  mutation updateWorkoutCategory(
    $workout_category_details: WorkoutCategory_Update
    $translations: [Translation_Input_Type_Update_WorkoutCategory]
  ) {
    updateWorkoutCategory(
      workout_category_details: $workout_category_details
      translations: $translations
    ) {
      id
      name
      description
      image
      updated_at
    }
  }
`;

export const DELETE_WORKOUT_CATEGORY = gql`
  mutation deleteWorkoutCategory($id: String!) {
    deleteWorkoutCategory(id: $id) {
      id
    }
  }
`;
