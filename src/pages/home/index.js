import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SalesChart from '@/view/Dashboard/SalesChart';
import { CardContent } from '@mui/material';

const CountCard = ({
  onClick,
  label,
  count,
  loading,
  icon,
  totalHeading,
  SalesCount,
  salesHeading
}) => (
  <Grid item xs={12} md={4} sx={{ cursor: 'pointer' }}>
    <Card
      onClick={onClick}
      sx={{
        boxShadow: 'rgb(76 78 100 / 22%) 0px 2px 10px 0px',
        p: 2,
        position: 'relative'
      }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, textAlign: 'right', p: 3 }}>
        {SalesCount !== undefined && (
          <>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {SalesCount}
            </Typography>
            <Typography variant="body1" sx={{ color: '#4A4E5A' }}>
              {salesHeading}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: 'inline-flex', padding: 1, borderRadius: 2 }}>
        <Image objectFit="contain" height={30} width={30} src={icon} />
        <Typography variant="h5" mt={1} sx={{ color: '#4A4E5A', fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'right' }}>
        {loading ? null : (
          <>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {count}
            </Typography>
            <Typography variant="body1" sx={{ color: '#4A4E5A' }}>
              {totalHeading}
            </Typography>
          </>
        )}
      </Box>
    </Card>
  </Grid>
);
const LevelWiseCountCard = ({
  beginnericon,
  beginnerCount,
  begginnerHeading,
  intermediateIcon,
  interCount,
  interHeading,
  expertIcon,
  expertCount,
  expertHeading
}) => (
  <Card sx={{ boxShadow: 'rgb(76 78 100 / 22%) 0px 2px 10px 0px', p: 3, position: 'relative' }}>
    <Typography variant="h6" mb={1} sx={{ color: '#4A4E5A', fontWeight: 'bold' }}>
      Plan/Package Level Wise
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image objectFit="contain" height={30} width={30} src={beginnericon} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {beginnerCount}
          </Typography>
          <Typography variant="body1" sx={{ color: '#4A4E5A' }}>
            {begginnerHeading}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image objectFit="contain" height={30} width={30} src={intermediateIcon} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {interCount}
          </Typography>
          <Typography variant="body1" sx={{ color: '#4A4E5A' }}>
            {interHeading}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image objectFit="contain" height={30} width={30} src={expertIcon} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {expertCount}
          </Typography>
          <Typography variant="body1" sx={{ color: '#4A4E5A' }}>
            {expertHeading}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Card>
);

const Home = () => {
  const router = useRouter();

  return (
    <Grid container>
      <Grid
        container
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Grid>
          <Typography variant={'h5'} sx={{ fontWeight: '500' }}>
            Zatca
          </Typography>
          <Typography variant={'body1'} sx={{ fontWeight: '400' }}>
            Welcome Back Nadena Admin....
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <CountCard
          loading={false}
          onClick={() => router.push('/user')}
          label={'Customers'}
          count="30"
          icon={'/images/icons/users.jpg'}
          totalHeading={'Total Customers'}
        />

        <CountCard
          loading={false}
          onClick={() => router.push('/coach')}
          label="Coach's"
          count="30"
          icon={'/images/icons/users.jpg'}
          totalHeading={'Total Coaches'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="24"
          SalesCount={50}
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Muscle Groups'}
          salesHeading={'Total Sales'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="35"
          SalesCount={100}
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Libraries'}
          salesHeading={'Total Sales'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="15"
          SalesCount={150}
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Plans'}
          salesHeading={'Total Sales'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="25"
          SalesCount={65}
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Packages'}
          salesHeading={'Total Sales'}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <SalesChart />
      </Grid>
      <Grid item xs={12} md={4}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={12}>
              <LevelWiseCountCard
                loading={false}
                beginnericon={'/images/icons/promotions.png'}
                beginnerCount={140}
                begginnerHeading="Begginner"
                intermediateIcon={'/images/icons/promotions.png'}
                interCount={65}
                interHeading="Intermediate"
                expertIcon={'/images/icons/promotions.png'}
                expertCount={20}
                expertHeading="Expert"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default Home;
