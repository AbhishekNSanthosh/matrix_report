import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SalesChart from '@/view/Dashboard/SalesChart';
import { CardContent } from '@mui/material';
import Invoice from '@/view/Dashboard/Invoice';

const CountCard = ({
  onClick,

  count,
  loading,

  totalHeading,
  SalesCount,
  salesHeading
}) => (
  <Grid item xs={12} md={4} sx={{ cursor: 'pointer' }}>
    <Card
      onClick={onClick}
      sx={{
        boxShadow: 'rgb(76 78 100 / 8%) 0px 2px 10px 0px',
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

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'right' }}>
        {loading ? null : (
          <>
            <Typography variant="body1" sx={{ color: '#4A4E5A', fontWeight: 'bold' }}>
              {totalHeading}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {count}
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
  <Card sx={{ boxShadow: 'rgb(76 78 100 / 8%) 0px 2px 10px 0px', p: 2, position: 'relative' }}>
    <Typography variant="h6" sx={{ color: '#4A4E5A', fontWeight: 'bold' }}>
      Todays Status
    </Typography>
    <Typography variant="body1" sx={{ color: '#4A4E5A' }}>
      890,344 Sales
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
            ZATCA INTEGRATION DASHBOARD
          </Typography>
          <Typography variant={'body1'} sx={{ fontWeight: '400' }}>
            Welcome Back Zatca Admin....
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <CountCard
          loading={false}
          onClick={() => router.push('/')}
          count="30"
          icon={'/images/icons/users.jpg'}
          totalHeading={'Total Invoices'}
        />

        <CountCard
          loading={false}
          onClick={() => router.push('/')}
          count="30"
          icon={'/images/icons/users.jpg'}
          totalHeading={'Total Per Month'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="24"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Sucess'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="35"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Sucess per Month'}
        />

        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="25"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Invoice Failed'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="10"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Invoice Failed Today'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="54000"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Amount'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="25600"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Amount Per Month'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="65000"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Tax Amount'}
        />
        <CountCard
          loading={false}
          onClick={() => router.push('')}
          count="35600"
          icon={'/images/icons/promotions.png'}
          totalHeading={'Total Tax Amount Monthly'}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <SalesChart />
      </Grid>
      <Grid item xs={12} md={4}>
        <CardContent sx={{ paddingTop: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={12}>
              <LevelWiseCountCard
                loading={false}
                beginnericon={'/images/icons/promotions.png'}
                beginnerCount={140}
                begginnerHeading="Total Invoices"
                intermediateIcon={'/images/icons/promotions.png'}
                interCount={65}
                interHeading="Total Success"
                expertIcon={'/images/icons/promotions.png'}
                expertCount={20}
                expertHeading="Total Failures"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Grid>
      <Grid item xs={12} md={8}>
        <Invoice />
      </Grid>
    </Grid>
  );
};

export default Home;
