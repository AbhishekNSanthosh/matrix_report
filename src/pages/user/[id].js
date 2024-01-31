import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { generalApoloClient } from 'src/config/apolloClient';
import { validateGraphQlError } from 'src/utils/ValidateError';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { getInitials } from 'src/@core/utils/get-initials';
import { GET_SINGLE_USER } from '@/graphql/users';
import CircularLoader from '@/view/CircularLoader';
import PlanDetailPage from '@/view/UserDetails/PlanDetailPage';

const CustomerDetails = () => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_SINGLE_USER,
        variables: {
          user: { id: router.query?.id }
        }
      });
      if (data?.user) {
        setDetails(data?.user);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent
                sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: 4 }}>
                <CustomAvatar
                  src={details?.profile_image}
                  skin="light"
                  sx={{ width: 120, height: 120, fontSize: '2rem' }}>
                  {getInitials(details?.first_name ? details?.first_name : 'Not Found')}
                </CustomAvatar>

                <Typography variant="h6" sx={{ mt: 3 }}>
                  {details?.first_name} {details?.last_name}
                </Typography>
                <Typography variant="body2">{details?.email}</Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {!!details?.mobile && (
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                          Mobile
                        </Typography>
                        <Typography variant="body2">{details?.mobile}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {!!details?.email && (
                    <Grid item xs={12} md={6}>
                      <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>Email</Typography>
                      <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
                        {details?.email}
                      </Typography>
                    </Grid>
                  )}
                  {!!details?.dob && (
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>DOB</Typography>
                        <Typography variant="body2">{details?.dob}</Typography>
                      </Box>
                    </Grid>
                  )}

                  {!!details?.gender && (
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                          Gender
                        </Typography>
                        <Typography variant="body2">{details?.gender}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {!!details?.specialization && (
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                          Specialization
                        </Typography>
                        <Typography variant="body2">{details?.specialization}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {!!details?.weight && (
                    <Grid item xs={12}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                          Weight
                        </Typography>
                        <Typography variant="body2">{details?.weight}</Typography>
                      </Box>
                    </Grid>
                  )}
                  {!!details?.height && (
                    <Grid item xs={12}>
                      <Box>
                        <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                          Height
                        </Typography>
                        <Typography variant="body2">{details?.height}</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <PlanDetailPage />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomerDetails;
