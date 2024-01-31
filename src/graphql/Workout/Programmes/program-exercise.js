import { gql } from '@apollo/client';

export const GET_ALL_EXERCISE = gql`
  query exerciseLibraries {
    exerciseLibraries {
      data {
        id
        title
      }
    }
  }
`;

export const ADD_WORKOUT_PROGRAMS_EXERCISE = gql`
  mutation createWorkoutProgramExercise($program_id: ID, $day_id: ID, $exercise_ids: [ID]) {
    createWorkoutProgramExercise(
      program_id: $program_id
      day_id: $day_id
      exercise_ids: $exercise_ids
    ) {
      id
    }
  }
`;
