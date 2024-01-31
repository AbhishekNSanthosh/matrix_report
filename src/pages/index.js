// ** React Imports
import { useEffect } from 'react';
// ** Next Imports
import { useRouter } from 'next/router';
// ** Spinner Import
import Spinner from 'src/@core/components/spinner';
// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth';

const Home = () => {
  // ** Hooks
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (auth.user && auth.user?.admin_roles?.length) {
      // Redirect user to Home URL
      router.replace('/home');
    }
  }, []);

  return <Spinner />;
};

export default Home;
