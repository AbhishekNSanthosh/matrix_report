import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/useAuth';
import { hasCookie } from 'cookies-next';
import authConfig from '@/config/auth';

const AuthGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (auth.user === null && !hasCookie(authConfig.storageUserData)) {
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        });
      } else {
        router.replace('/login');
      }
    }
  }, [router.route, auth]);
  if (auth.loading || auth.user === null) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthGuard;
