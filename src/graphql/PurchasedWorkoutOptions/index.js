import { gql } from '@apollo/client';
export const LIST_ALL_PURCHASED_WORKOUT_OPTIONS = gql`
  query purchasedWorkoutOptions(
    $purchased_workout_option_details: Purchased_Workout_Option_
    $size: Int
    $page: Int
    $search: String
  ) {
    purchasedWorkoutOptions(
      purchased_workout_option_details: $purchased_workout_option_details
      size: $size
      page: $page
      search: $search
    ) {
      totalPages
      data {
        id
        user_id
        order_id

        type
        price
        level
        name
        category
        currency {
          code
        }

        image
      }
    }
  }
`;
