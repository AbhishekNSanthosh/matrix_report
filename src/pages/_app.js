import '@/styles/globals.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { defaultTheme } from '@/utils/theme';
import { ThemeProvider } from '@mui/material';
import Layout from '@/layout/Layout';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import ACLGuard from '@/auth/ACLGuard';
import { Toaster } from 'react-hot-toast';
import Guard from '@/auth/Gaurd';
import { projectConfigs } from '@/utils/projectConfigs';
import { AuthProvider } from '@/context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import Head from 'next/head';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component?.getLayout ?? ((page) => <Layout>{page}</Layout>);
  const authGuard = Component?.authGuard ?? true;
  const guestGuard = Component?.guestGuard ?? false;
  const aclAbilities = Component?.aclAbilities ?? {
    action: 'manage',
    subject: 'dashboard'
  };

  return (
    <AuthProvider>
      <Head>
        <title>Zatca</title>
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider theme={defaultTheme}>
          <NextNProgress color={projectConfigs.primaryColor} />
          <Guard authGuard={authGuard} guestGuard={guestGuard}>
            <ACLGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
              {getLayout(<Component {...pageProps} />)}
            </ACLGuard>
          </Guard>
          <Toaster position="top-right" containerClassName="toast-custom" />
        </ThemeProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
