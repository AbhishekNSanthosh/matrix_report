import { gql } from '@apollo/client';

export const GET_ALL_ORDERS = gql`
  query orders($size: Int, $page: Int, $order_details: Order_, $search: String) {
    orders(size: $size, page: $page, order_details: $order_details, search: $search) {
      data {
        id
        order_no
        order_type
        plan_type
        price
        discount
        vat
        amount
        currency_id
        currency {
          code
        }
        user_id
        user {
          first_name
          last_name
        }
        coach_id
        coach {
          first_name
          last_name
        }
        status
        created_at
      }
    }
  }
`;

export const GET_SINGLE_ORDERS = gql`
  query order($order_details: Order_Single) {
    order(order_details: $order_details) {
      id
      order_no
      order_type
      plan_type
      price
      discount
      vat
      amount
      payments {
        payment_type {
          name
        }
        payment_status
      }
      currency_id
      currency {
        code
      }
      user_id
      user {
        id
        email
        first_name
        last_name
        profile_image
        mobile
        profile_image
        specialization
      }
      coach_id
      coach {
        first_name
      }
      status
      created_at
      updated_at
      workout_plan_option_id
      purchased_workout_option {
        id
        order_id
        name
        description
        level
        video
        currency {
          code
        }
        price
        purchased_wpo_weeks {
          id
          week_no
          purchased_workout_option_id
          purchased_wpo_week_days {
            id
            day_no
            day
            purchased_wpo_exercises {
              exercise {
                title
                level
                image
              }
              purchased_wpo_exercise_sets {
                id
                set_no
                reps
                weight
                rest_time
                tempo
                purchased_wpo_exercise_set_extras {
                  id
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;
