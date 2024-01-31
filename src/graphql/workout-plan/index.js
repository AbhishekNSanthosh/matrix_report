import { gql } from '@apollo/client';

export const ADD_WORKOUT_PLAN = gql`
  mutation CreateWorkoutPlanOption($workoutPlanOptionDetails: Workout_Plan_Option_Create!) {
    createWorkoutPlanOption(workout_plan_option_details: $workoutPlanOptionDetails) {
      id
    }
  }
`;
export const LIST_ALL_WORKOUT_PLAN = gql`
  query workoutPlanOptions(
    $workout_plan_option_details: Workout_Plan_Option_
    $size: Int
    $page: Int
    $search: String
  ) {
    workoutPlanOptions(
      workout_plan_option_details: $workout_plan_option_details
      size: $size
      page: $page
      search: $search
    ) {
      totalPages
      data {
        id
        user_id
        user {
          id
          first_name
          last_name
          email
        }
        type
        price
        level
        name
        currency {
          code
        }
        category
        image
      }
    }
  }
`;
export const GET_ONE_WORKOUT_PLAN = gql`
  query ($workout_plan_option_details: Workout_Plan_Option_Single) {
    workoutPlanOption(workout_plan_option_details: $workout_plan_option_details) {
      id
      type
      price
      name
      level
      discount
      image
      video
      currency_id
      currency {
        code
      }
      description
      category
      week_no
      wourkout_plan_option_weeks {
        id
        week_no
        week_days {
          id
          day_no
          day
        }
      }
      user_id
    }
  }
`;
export const UPDATE_WORKOUT_PLAN = gql`
  mutation UpdateWorkoutPlanOption($workoutPlanOptionDetails: Workout_Plan_Option_Update!) {
    updateWorkoutPlanOption(workout_plan_option_details: $workoutPlanOptionDetails) {
      id
    }
  }
`;
export const DELETE_WORKOUT_PLAN = gql`
  mutation deleteWorkoutPlanOption($id: String!) {
    deleteWorkoutPlanOption(id: $id) {
      id
    }
  }
`;
// export const ADD_WEEK = gql`
//   mutation createWPOWeek(
//     $week_no: Int
//     $workout_plan_option_id: ID
//     $week_days: [WPO_Week_Day_Create]
//   ) {
//     createWPOWeek(
//       week_no: $week_no
//       workout_plan_option_id: $workout_plan_option_id
//       week_days: $week_days
//     ) {
//       id
//       week_no
//       week_days {
//         day
//         day_no
//       }
//     }
//   }
// `;
export const ADD_PLAN_PROGRAM = gql`
  mutation AddWPOPrograms($workout_plan_option_id: ID!, $program_id: ID!) {
    addWPOPrograms(workout_plan_option_id: $workout_plan_option_id, program_id: $program_id) {
      id
      workout_program {
        title
        image
      }
    }
  }
`;
export const ADD_WEEK = gql`
  mutation CreateWorkoutPlanOptionWeek(
    $week_no: Int
    $workout_plan_option_id: ID
    $week_days: [Int]
  ) {
    createWPOWeek(
      week_no: $week_no
      workout_plan_option_id: $workout_plan_option_id
      week_days: $week_days
    ) {
      id
      week_no
      week_days {
        id
        day
        day_no
      }
    }
  }
`;
export const GET_EXERCISE_DAY_PLAN = gql`
  query GetWPOExercises($exerciseDetails: WPO_Exercise_) {
    wpoExercises(WPO_exercise_details: $exerciseDetails) {
      id

      workout_program {
        title
        description
        image
      }
      workout_program_exercise_id
      workout_program_exercise {
        workout_program_exercise_sets {
          set_no
          reps
          rest_time
          tempo
          weight
          workout_program_exercise_set_extras {
            name
            value
          }
        }
        exercise {
          title
          instructions
          level
          image
        }
      }
    }
  }
`;
export const DUPLICATE_WEEK = gql`
  mutation DuplicateWPOWeek($id: ID!) {
    duplicateWPOWeek(id: $id) {
      id
      week_no
      week_days {
        id
        day_no
        day
      }
    }
  }
`;
