import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LOGIN_ADMIN } from '@/graphql/Auth';
import { generalApoloClient } from '@/config/apolloClient';

export const authOptions = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        let deviceData = await fetch('https://www.cloudflare.com/cdn-cgi/trace')
          .then((response) => response.text())
          .then((traceData) => {
            // eslint-disable-next-line no-useless-escape
            let infoData = traceData.replace(/[\r\n]+/g, '","').replace(/\=+/g, '":"');
            infoData = '{"' + infoData.slice(0, infoData.lastIndexOf('","')) + '"}';
            return JSON.parse(infoData);
          });
        const ip = deviceData.ip;
        const location = deviceData.loc;
        const deviceInfo = deviceData.uag;
        try {
          let { data } = await generalApoloClient.mutate({
            mutation: LOGIN_ADMIN,
            variables: {
              email: credentials.email,
              password: credentials.password,
              deviceInfo,
              ip,
              location,
              captcha_token: credentials.captcha_token
            }
          });
          if (data?.loginAdminUser) {
            return data?.loginAdminUser;
          }
        } catch (error) {
          throw new Error(JSON.stringify(error));
        }
      }
    })
  ],
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true
      }
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/500',
    newUser: '/register'
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          ...user,
          accessToken: user.access_token
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;

      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;

      return session;
    }
  }
};
export default NextAuth(authOptions);
