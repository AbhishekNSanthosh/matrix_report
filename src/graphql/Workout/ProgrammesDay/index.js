import { gql } from '@apollo/client';

export const GET_ALL_WORKOUT_PROGRAMS_DAY = gql`
  query workoutProgramsDays($work_program_day_details: WorkoutProgramDay_) {
    workoutProgramsDays(work_program_day_details: $work_program_day_details) {
      id
      day_no
      workout_programs {
        title
      }
      updated_at
    }
  }
`;

export const GET_ONE_WORKOUT_PROGRAMS_DAY = gql`
  query workoutProgramsDay($work_program_day_details: WorkoutProgramDay_Single) {
    workoutProgramsDay(work_program_day_details: $work_program_day_details) {
      id
      program_id
      day_no
    }
  }
`;

export const ADD_WORKOUT_PROGRAMS_DAY = gql`
  mutation createWorkoutProgramDay($day_no: Int, $program_id: ID) {
    createWorkoutProgramDay(day_no: $day_no, program_id: $program_id) {
      id
    }
  }
`;

export const UPDATE_WORKOUT_PROGRAMS_DAY = gql`
  mutation updateWorkoutProgramDay($id: String!, $newDayNo: Int!) {
    updateWorkoutProgramDay(id: $id, newDayNo: $newDayNo) {
      id
    }
  }
`;

export const DELETE_WORKOUT_PROGRAMS_DAY = gql`
  mutation deleteWorkoutProgramDay($id: String!) {
    deleteWorkoutProgramDay(id: $id) {
      id
    }
  }
`;
