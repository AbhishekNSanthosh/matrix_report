import { gql } from '@apollo/client';

export const GET_ALL_WORKOUT_PROGRAMS = gql`
  query workoutPrograms($workout_program_details: WorkoutProgram_) {
    workoutPrograms(workout_program_details: $workout_program_details) {
      id
      title
      description
      image
      is_nadeena_data
      user_id
      updated_at
    }
  }
`;

export const GET_ONE_WORKOUT_PROGRAMS = gql`
  query workoutProgram($workout_program_details: WorkoutProgram_Single) {
    workoutProgram(workout_program_details: $workout_program_details) {
      id
      title
      description
      image
      video
      workout_program_days {
        id
        day_no
        # program_workouts {
        #   id
        #   group
        #   exercise {
        #     title
        #     level
        #     image
        #   }
        # }
      }
    }
  }
`;

export const ADD_WORKOUT_PROGRAMS = gql`
  mutation createWorkoutProgram($workout_program_details: WorkoutProgram_Create) {
    createWorkoutProgram(workout_program_details: $workout_program_details) {
      id
    }
  }
`;

export const UPDATE_WORKOUT_PROGRAMS = gql`
  mutation updateWorkoutProgram($workout_program_details: WorkoutProgram_Update) {
    updateWorkoutProgram(workout_program_details: $workout_program_details) {
      id
    }
  }
`;

export const DELETE_WORKOUT_PROGRAMS = gql`
  mutation deleteWorkoutProgram($id: String!) {
    deleteWorkoutProgram(id: $id) {
      id
    }
  }
`;
