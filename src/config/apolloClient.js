import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat } from '@apollo/client';
import authConfig from './auth';
import { getCookie } from 'cookies-next';

const generalServerLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_GRAPHQL_GENERAL_URI}/graphql`
});

const authMiddleware = new ApolloLink(async (operation, forward) => {
  let token = getCookie(authConfig.storageAccessToken) || '';

  if (token) {
    token = `Bearer ${token}`;
  }
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token
    }
  }));

  return forward(operation);
});
export const generalApoloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, generalServerLink),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network'
    }
  }
});
