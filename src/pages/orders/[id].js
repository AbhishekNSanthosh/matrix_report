// React & Next
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// utils & config & graphql
import { getInitials } from 'src/@core/utils/get-initials';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_SINGLE_ORDERS } from '@/graphql/orders';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { format } from 'date-fns';

// Material Ui & emotion
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography
} from '@mui/material';
import CustomAvatar from 'src/@core/components/mui/avatar';
import Chip from '@mui/material/Chip';
import CircularLoader from '@/view/CircularLoader';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

// This is a custom button for showing weeks and days in mapping
const CustomChipButtons = ({ router, theme, id, label, queryParam }) => {
  return (
    <CustomChipButton
      variant={router?.query[queryParam] === id ? 'outlined' : 'contained'}
      onClick={() => {
        router.query[queryParam] = id;
        const url = {
          pathname: router.pathname,
          query: router.query
        };
        router.replace(url, undefined, { shallow: true });
      }}
      sx={{}}>
      <Typography
        fontWeight={500}
        fontSize={14}
        color={router?.query[queryParam] === id ? theme.palette.primary.main : '#fff'}>
        {label}
      </Typography>
    </CustomChipButton>
  );
};

const OrderDetails = () => {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_SINGLE_ORDERS,
        variables: {
          order_details: {
            id: router?.query?.id
          }
        }
      });
      if (data?.order) {
        setOrderDetails(data?.order);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  const selectedWeek = useMemo(() => {
    const foundOne = orderDetails?.purchased_workout_option?.purchased_wpo_weeks?.find(
      (week) => week?.id === router?.query?.week_id
    );
    if (foundOne) {
      return foundOne;
    }
    return {};
  }, [orderDetails?.purchased_workout_option?.purchased_wpo_weeks, router?.query]);

  const selectedDay = useMemo(() => {
    const foundOne = selectedWeek.purchased_wpo_week_days?.find(
      (day) => day?.id === router?.query?.day_id
    );
    if (foundOne) {
      return foundOne;
    }
    return {};
  }, [selectedWeek.purchased_wpo_week_days, router?.query]);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" color={'primary'}>
          Order No: <b>{orderDetails?.order_no || 'NA'}</b>
        </Typography>
      </Grid>
      {/* Customer Details Card Start  */}
      <Grid item xs={12} md={4}>
        <Card sx={{ minHeight: '100' }}>
          <CardHeader title={<Typography variant="h6">Customer Details</Typography>} />
          <Divider sx={{ m: 0 }} />
          <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CustomAvatar
              src={orderDetails?.user?.profile_image}
              skin="light"
              sx={{ width: 120, height: 120, fontSize: '2rem' }}>
              {getInitials(
                orderDetails?.user?.first_name ? orderDetails.user?.first_name : 'Not Found'
              )}
            </CustomAvatar>
            <Typography variant="h6" sx={{ mt: 3 }} fontWeight={900}>
              {orderDetails?.user?.first_name} {orderDetails?.user?.last_name}
            </Typography>

            <Grid container spacing={2} mt={1}>
              {!!orderDetails?.user?.email && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>Email</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {orderDetails?.user?.email}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {!!orderDetails?.user?.mobile && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>Mobile</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {orderDetails?.user?.mobile}
                    </Typography>
                  </Box>
                </Grid>
              )}
              {/* {!!orderDetails?.user?.country && ( */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>Country</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {orderDetails?.user?.country ?? 'Test Country'}
                  </Typography>
                </Box>
              </Grid>
              {/* )} */}
              {/* {!!orderDetails?.user?.specialization && ( */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>Status</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {orderDetails?.user?.specialization ?? 'Test Training'}
                  </Typography>
                </Box>
              </Grid>
              {/* )} */}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* Customer Details Card End  */}

      {/* Order Detail Card Start */}
      <Grid item xs={12} md={4} order={{ xs: 3, md: 2 }}>
        <Card sx={{ minHeight: '100%' }}>
          <CardHeader title={<Typography variant="h6">Order Details</Typography>} />

          <Divider sx={{ m: 0 }} />
          <CardContent>
            <Grid container spacing={3}>
              {!!orderDetails?.created_at && (
                <>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                        Order Date
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} textAlign={'end'}>
                        {orderDetails?.created_at
                          ? format(+orderDetails?.created_at, 'dd MMM yyyy')
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}

              {!!orderDetails?.order_type && (
                <>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                        Order Type
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} textAlign={'end'}>
                        {orderDetails?.order_type.toUpperCase()}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}

              {!!orderDetails?.plan_type && (
                <>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                        Plan Type
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} lg={6} textAlign={'end'}>
                    <Box>
                      <Typography variant="body2" fontWeight={700} textAlign={'end'}>
                        {orderDetails?.plan_type?.toUpperCase()}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}

              {!!orderDetails?.payments?.payment_type?.name && (
                <>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                        Payment Type
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} lg={6} textAlign={'end'}>
                    <Chip
                      skin="light"
                      size="small"
                      label={orderDetails?.payments?.payment_type?.name}
                      sx={{
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { lineHeight: '18px' }
                      }}
                    />
                  </Grid>
                </>
              )}
              {!!orderDetails?.payments?.payment_status && (
                <>
                  <Grid item xs={6} lg={6}>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: '.835rem' }}>
                        Order status
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} lg={6} textAlign={'end'}>
                    <Chip
                      skin="light"
                      size="small"
                      label={orderDetails?.status === 1 ? 'Success' : 'Failed'}
                      color={orderDetails?.status ? 'success' : 'error'}
                      sx={{
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { lineHeight: '18px' }
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* Order Detail Card End */}

      {/* Price Information Card Start */}
      <Grid item xs={12} md={4} order={{ xs: 3, md: 2 }}>
        <Card sx={{ minHeight: '100%' }}>
          <CardHeader title={<Typography variant="h6">Price Information</Typography>} />

          <Divider sx={{ m: 0 }} />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="body2">Payment Type </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: 500, fontSize: '.875rem', textAlign: 'right' }}>
                  {orderDetails?.payments?.payment_type?.name
                    ? orderDetails?.payments?.payment_type?.name
                    : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2">Payment Status </Typography>
              </Grid>
              <Grid item xs={6} textAlign={'end'}>
                <Chip
                  skin="light"
                  size="small"
                  label={'Success'} //Todo
                  color={'success'} //Todo
                  sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                />
              </Grid>

              {orderDetails?.discount > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">Discount </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontWeight: 500, fontSize: '.875rem', textAlign: 'right' }}>
                      {Number(orderDetails?.discount)?.toLocaleString()}
                    </Typography>
                  </Grid>
                </>
              )}

              {orderDetails?.vat > 0 ? (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2">vat</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontWeight: 500, fontSize: '.875rem', textAlign: 'right' }}>
                      {orderDetails?.currency?.code} {Number(orderDetails?.vat)?.toLocaleString()}
                    </Typography>
                  </Grid>
                </>
              ) : null}

              <Grid item xs={6}>
                <Typography fontWeight={'600'} variant="body1">
                  Total Amount Paid
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {orderDetails?.currency?.code} {Number(orderDetails?.amount)?.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography fontWeight={'600'} variant="body1">
                  Commission
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {orderDetails?.currency?.code} {Number(100)?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* Price Information Card End */}

      {/* Purchased Workout Programme Start */}
      <Grid item xs={12} md={12} order={{ xs: 3, md: 2 }}>
        <Card>
          <CardHeader
            titleTypographyProps={{ variant: 'h5', fontWeight: '700' }}
            title="Purchased Workout Programme"
          />
          {orderDetails?.purchased_workout_option?.purchased_wpo_weeks.length > 0 ? (
            <CardContent sx={{ pt: 0 }}>
              <Card variant={'outlined'}>
                <CardHeader
                  title="Workout Program Week's"
                  titleTypographyProps={{ variant: 'h6' }}
                />

                <Divider sx={{ m: 0 }} />
                <CardContent>
                  {/* week displaying chip start */}
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                      {orderDetails?.purchased_workout_option?.purchased_wpo_weeks?.map((week) => (
                        <CustomChipButtons
                          key={week?.id}
                          router={router}
                          theme={theme}
                          id={week?.id}
                          label={`Week ${week?.week_no}`}
                          queryParam="week_id"
                        />
                      ))}
                    </Grid>
                    {/* week displaying chip start */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardHeader
                          title={
                            selectedWeek?.week_no
                              ? `Week ${selectedWeek?.week_no} - Workout Days`
                              : 'Select a Week to list purchased workouts'
                          }
                          titleTypographyProps={{ variant: 'h6' }}
                        />
                        <Divider />

                        <CardContent>
                          <Grid container spacing={2}>
                            {/* days chip start */}
                            <Grid
                              item
                              xs={12}
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                              }}>
                              {selectedWeek?.purchased_wpo_week_days?.map((day, index) => (
                                <CustomChipButtons
                                  key={index}
                                  index={index}
                                  router={router}
                                  theme={theme}
                                  id={day?.id}
                                  label={day?.day.toUpperCase()}
                                  queryParam="day_id"
                                />
                              ))}
                            </Grid>
                            {/* days chip end */}

                            {/* Per Day Card Start */}
                            {router.query.day_id && (
                              <Grid item xs={12}>
                                <Grid container spacing={2}>
                                  {selectedDay?.purchased_wpo_exercises?.map((exercise) => (
                                    <Grid key={exercise?.id} item xs={12} sm={4}>
                                      <Card variant="outlined">
                                        <Box display={'flex'}>
                                          <Image
                                            width={120}
                                            height={110}
                                            style={{ borderRadius: 10, objectFit: 'cover' }}
                                            src={exercise?.exercise?.image}
                                            alt={'program-image'}
                                          />
                                          <Box ml={2}>
                                            <Typography variant="h6">
                                              {exercise?.exercise?.title}
                                            </Typography>
                                            <Typography variant="body1">
                                              {exercise?.exercise?.level}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        {/* purchased exercise set table started */}
                                        {exercise?.purchased_wpo_exercise_sets?.length > 0 && (
                                          <TableContainer
                                            component={Paper}
                                            sx={{
                                              '&::-webkit-scrollbar': {
                                                width: '30px',
                                                height: '8px'
                                              },
                                              '&::-webkit-scrollbar-thumb': {
                                                background: 'lightgray',
                                                borderRadius: '4px'
                                              }
                                            }}>
                                            <Table size="small" aria-label="a dense table">
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell>Set</TableCell>
                                                  <TableCell align="center">Reps</TableCell>
                                                  <TableCell align="center">Rest</TableCell>
                                                  <TableCell align="center">Tempo</TableCell>
                                                  <TableCell align="center">Weight</TableCell>
                                                  <TableCell align="center">Extra Set</TableCell>

                                                  {/* <TableCell align="center">Actions</TableCell> */}
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {exercise?.purchased_wpo_exercise_sets?.map(
                                                  (set) => (
                                                    <TableRow
                                                      key={set?.id}
                                                      sx={{
                                                        '&:last-of-type  td, &:last-of-type  th': {
                                                          border: 0
                                                        }
                                                      }}>
                                                      <TableCell component="th" scope="row">
                                                        {set?.set_no}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                        {set?.reps}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                        {set?.rest_time}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                        {set?.tempo}
                                                      </TableCell>
                                                      <TableCell align="center">
                                                        {set?.weight}
                                                      </TableCell>

                                                      <TableCell align="center">
                                                        {set?.purchased_wpo_exercise_set_extras
                                                          ?.length &&
                                                          set?.purchased_wpo_exercise_set_extras?.map(
                                                            (extra, index) => (
                                                              <Grid key={index}>
                                                                <Typography
                                                                  style={{ fontSize: 12 }}>
                                                                  {extra?.name}:{extra?.value}
                                                                </Typography>
                                                              </Grid>
                                                            )
                                                          )}
                                                      </TableCell>

                                                      {/* <TableCell align="center">
                                                        <RowOptions set_id={set?.id} />
                                                      </TableCell> */}
                                                    </TableRow>
                                                  )
                                                )}
                                              </TableBody>
                                            </Table>
                                          </TableContainer>
                                        )}
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Grid>
                            )}
                            {/* Per Day Card end */}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </CardContent>
          ) : (
            <CardContent>
              <Box sx={{ p: 4 }}>No Items Found</Box>
            </CardContent>
          )}
        </Card>
      </Grid>

      {/* Purchased Workout Programme End */}
    </Grid>
  );
};

OrderDetails.acl = {
  action: 'manage',
  subject: 'orders'
};

export default OrderDetails;

const CustomChipButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  borderRadius: theme.spacing(8),
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  // margin: theme.spacing(1),
  transition: 'box-shadow .25s ease',
  marginRight: theme.spacing(1),
  padding: '6px 30px'
}));
