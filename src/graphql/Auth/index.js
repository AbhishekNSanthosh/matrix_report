import { gql } from '@apollo/client';

export const LOGIN_ADMIN = gql`
  mutation loginAdminUser($email: String!, $password: String!) {
    loginAdminUser(email: $email, password: $password) {
      id
      name
      access_token
      email
      admin_roles
    }
  }
`;

export const GET_ADMIN = gql`
  query getAdmin {
    adminUser {
      id
      name
      access_token
      email
      admin_roles
    }
  }
`;
