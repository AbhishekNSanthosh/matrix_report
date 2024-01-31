// ** React Imports
import { createContext, useEffect, useState } from 'react';

// ** Next Import
import { useRouter } from 'next/router';

// ** Config
import authConfig from '@/config/auth';
import { GET_ADMIN } from 'src/graphql/Auth';
import { generalApoloClient } from 'src/config/apolloClient';
import { setCookie, deleteCookie } from 'cookies-next';

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [isInitialized, setIsInitialized] = useState(defaultProvider.isInitialized);
  const [loading, setLoading] = useState(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();
  useEffect(() => {
    const initAuth = async () => {
      setIsInitialized(true);
      try {
        let { data } = await generalApoloClient.query({
          query: GET_ADMIN
        });

        if (data?.adminUser) {
          setUser({ ...data?.adminUser });
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async (userData, errorCallback) => {
    try {
      const returnUrl = router.query.returnUrl;
      setUser({ ...userData });
      await setCookie(authConfig.storageUserData, JSON.stringify(userData));
      await setCookie(authConfig.storageAccessToken, userData.access_token);
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';
      router.replace(redirectURL);
    } catch (error) {
      if (errorCallback) errorCallback(error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    deleteCookie(authConfig.storageUserData);
    deleteCookie(authConfig.storageAccessToken);
    deleteCookie(authConfig.storageTokenKeyName);
    // eslint-disable-next-line no-undef
    // OneSignal.push(function () {
    //   // eslint-disable-next-line no-undef
    //   OneSignal.removeExternalUserId();
    // });
    router.push('/login');
  };

  const values = {
    user,
    loading,
    setUser,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
