import { gql } from '@apollo/client';

export const GET_ALL_WORKOUT_PROGRAMS_EXERCISE_SET = gql`
  query workoutProgramsExerciseSets(
    $workout_program_exercise_set_details: WorkoutProgramExerciseSet_
  ) {
    workoutProgramsExerciseSets(
      workout_program_exercise_set_details: $workout_program_exercise_set_details
    ) {
      id
      set_no
      reps
      rest_time
      tempo
      weight
      program_id
      program_exercise_id
      workout_program_exercise_set_extras {
        id
        name
        value
        set_id
      }
      updated_at
    }
  }
`;
export const GET_ONE_WORKOUT_PROGRAMS_EXERCISE_SET = gql`
  query workoutProgramsExerciseSet(
    $workout_program_exercise_set_details: WorkoutProgramExerciseSet_Single
  ) {
    workoutProgramsExerciseSet(
      workout_program_exercise_set_details: $workout_program_exercise_set_details
    ) {
      id
      set_no
      reps
      rest_time
      tempo
      weight
      program_id
      program_exercise_id
      updated_at
    }
  }
`;
export const ADD_WORKOUT_PROGRAMS_EXERCISE_SET = gql`
  mutation createWorkoutProgramExerciseSet(
    $workout_program_exercise_set_details: WorkoutProgramExerciseSet_Create
  ) {
    createWorkoutProgramExerciseSet(
      workout_program_exercise_set_details: $workout_program_exercise_set_details
    ) {
      id
      reps
      rest_time
      tempo
      weight
      program_id
      program_exercise_id
      workout_program_exercise_set_extras {
        id
        name
        value
        set_id
      }

      updated_at
    }
  }
`;
export const ADD_WORKOUT_PROGRAMS_EXERCISE_SET_EXTRA = gql`
  mutation createWorkoutProgramExerciseSetExtra(
    $workout_program_exercise_set_extra_details: WorkoutProgramExerciseSetExtra_Create
  ) {
    createWorkoutProgramExerciseSetExtra(
      workout_program_exercise_set_extra_details: $workout_program_exercise_set_extra_details
    ) {
      id
      name
      value
      set_id
      updated_at
    }
  }
`;
export const ADD_WORKOUT_PROGRAMS_EXERCISE_SET_DUPLICATE = gql`
  mutation duplicateWorkoutProgramExerciseSet($id: String!) {
    duplicateWorkoutProgramExerciseSet(id: $id) {
      id
      reps
      rest_time
      tempo
      weight
      program_id
      program_exercise_id
      workout_program_exercise_set_extras {
        id
        name
        value
        set_id
      }

      updated_at
    }
  }
`;

export const GET_WORKOUTS_BY_DAY_ID = gql`
  query workoutProgramsExercises($work_program_exercise_details: WorkoutProgramExercise_) {
    workoutProgramsExercises(work_program_exercise_details: $work_program_exercise_details) {
      id
      group
      sort_order
      group_sort_order
      group_set_no
      exercise {
        image
        title
        level
      }
      workout_program_exercise_sets {
        id
        set_no
        reps
        rest_time
        tempo
        weight
        workout_program_exercise_set_extras {
          id
          name
          value
          set_id
        }
      }
    }
  }
`;
