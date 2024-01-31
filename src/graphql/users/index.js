import { gql } from '@apollo/client';

export const GET_ALL_USERS_COACHES = gql`
  query users($user: User_, $search: String, $size: Int, $page: Int) {
    users(user: $user, search: $search, size: $size, page: $page) {
      totalPages
      data {
        id
        first_name
        last_name
        mobile
        profile_image
        created_at
      }
    }
  }
`;
export const GET_SINGLE_USER = gql`
  query user($user: User_Single, $language: String) {
    user(user: $user, language: $language) {
      id
      first_name
      last_name
      email
      mobile
      profile_image
      dob
      gender
      specialization
      weight
      height
      created_at
    }
  }
`;
