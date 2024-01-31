import { gql } from '@apollo/client';

export const GET_ALL_LIBRARY = gql`
  query GetExerciseLibraries(
    $exerciseLibraryDetails: ExerciseLibrary_
    $search: String
    $size: Int
    $page: Int
  ) {
    exerciseLibraries(
      exercise_library_details: $exerciseLibraryDetails
      search: $search
      size: $size
      page: $page
    ) {
      currentPage
      totalPages
      totalData
      data {
        id
        title
        instructions
        level
        image
        video
        youtube_link
        is_free
        category_id
        workout_category {
          id
        }
        user_id

        exercise_equipements {
          id
        }
        exercise_muscle_groups {
          id
        }
        exercise_attachments {
          id
        }

        updated_at
        admin_approved_status
      }
    }
  }
`;

export const ADD_LIBRARY = gql`
  mutation CreateExerciseLibrary(
    $exerciseLibraryDetails: ExerciseLibrary_Create
    $exerciseAttachments: [ExerciseAttachment_Create]
    $exerciseMuscleGroups: [ExerciseMuscle_Create]
    $exerciseEquipmentGroup: ExerciseEquipement_Create
  ) {
    createExerciseLibrary(
      exercise_library_details: $exerciseLibraryDetails
      exercise_attachments: $exerciseAttachments
      exercise_muscle_group_list: $exerciseMuscleGroups
      exercise_equipement_group_list: $exerciseEquipmentGroup
    ) {
      title
      exercise_equipements {
        id
      }
      exercise_muscle_groups {
        id
      }
    }
  }
`;

export const DELETE_LIBRARY = gql`
  mutation DeleteExerciseLibrary($id: String!) {
    deleteExerciseLibrary(id: $id) {
      id
    }
  }
`;
export const GET_ONE_LIBRARY = gql`
  query exerciseLibrary($exerciseLibraryDetails: ExerciseLibrary_Single!) {
    exerciseLibrary(exercise_library_details: $exerciseLibraryDetails) {
      id
      title
      instructions
      level
      image
      video
      youtube_link
      is_free
      category_id
      workout_category {
        name
      }

      exercise_equipements {
        equipement_id
        equipements {
          id
          name
          image
          description
        }
      }
      exercise_muscle_groups {
        muscle_group_id
        type
      }
      exercise_attachments {
        id
      }

      created_at
      updated_at
    }
  }
`;
export const UPDATE_LIBRARY = gql`
  mutation UpdateExerciseLibrary(
    $exerciseLibraryDetails: ExerciseLibrary_Update!
    $exerciseMuscleGroups: [ExerciseMuscle_Update]!
    $exerciseEquipmentGroup: ExerciseEquipement_Update!
  ) {
    updateExerciseLibrary(
      exercise_library_details: $exerciseLibraryDetails
      exercise_muscle_group_list: $exerciseMuscleGroups
      exercise_equipement_group_list: $exerciseEquipmentGroup
    ) {
      id
      title
      instructions
      level
      image
      video
      youtube_link
      category_id
      workout_category {
        id
      }
      user_id
      exercise_equipements {
        id
      }
      exercise_muscle_groups {
        id
      }
      exercise_attachments {
        id
      }

      created_at
      updated_at
    }
  }
`;

export const approve_or_reject = gql`
  mutation ApproveLibrary($id: String!, $status: Boolean) {
    approveLibrary(id: $id, status: $status) {
      id
      admin_approved_status
    }
  }
`;
