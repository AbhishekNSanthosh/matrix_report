import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/useAuth';
import { hasCookie } from 'cookies-next';
import authConfig from 'src/config/auth';

const GuestGuard = (props) => {
  const { children, fallback } = props;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (hasCookie(authConfig.storageUserData)) {
      router.replace('/');
    }
  }, [router.route]);

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback;
  }

  return <>{children}</>;
};

export default GuestGuard;
