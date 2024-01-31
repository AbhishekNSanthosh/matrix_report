import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Box,
  Chip,
  TableHead,
  TableCell,
  TableBody,
  Table,
  TableRow
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Fragment, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import { useTheme } from '@emotion/react';
import Image from 'next/image';
import {
  DUPLICATE_WEEK,
  GET_EXERCISE_DAY_PLAN,
  GET_ONE_WORKOUT_PLAN
} from '@/graphql/workout-plan';
import { CalendarOutline, PencilOutline, Plus } from 'mdi-material-ui';
import AddWeek from '@/view/Plans/AddPlanWeeks';
import AddPrograme from '@/view/Plans/AddPrograme';
import { validateGraphQlError } from '@/utils/ValidateError';

const PlanUpdate = () => {
  const [dayLoading, setDayLoading] = useState(false);
  const [duplicateWeekLoading, setDuplicateWeekLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [planDetails, setPlanDetails] = useState(null);
  const [showAddDaysDrawer, setShowAddDaysDrawer] = useState(false);
  const [showAddWorkProgExerDrawer, setShowAddWorkProgExerDrawer] = useState(false);
  const [dayPlanDetails, setDayPlanDetails] = useState(null);

  const router = useRouter();
  const theme = useTheme();

  const fetchPlanes = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_PLAN,
        variables: { workout_plan_option_details: { id: router.query?.id } }
      });

      if (data?.workoutPlanOption) {
        setPlanDetails(data?.workoutPlanOption);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, [router?.query]);

  const fetchDayWorkouts = async () => {
    setDayLoading(true);
    try {
      const { data } = await generalApoloClient.query({
        query: GET_EXERCISE_DAY_PLAN,
        variables: {
          exerciseDetails: {
            workout_plan_option_id: router.query?.id,
            day_id: router?.query?.day_id
          }
        }
      });
      if (data?.wpoExercises) {
        setDayPlanDetails(data?.wpoExercises);
      }

      setDayLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setDayLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.day_id) {
      fetchDayWorkouts();
    }
  }, [router?.query?.day_id, router?.query?.week_id]);

  const handleDayClick = async (dayId) => {
    router.query.day_id = dayId;

    const url = {
      pathname: router.pathname,
      query: router.query
    };
    router.replace(url, undefined, { shallow: true });
  };

  const weekDuplication = async () => {
    setDuplicateWeekLoading(true);
    try {
      const { data } = await generalApoloClient.mutate({
        mutation: DUPLICATE_WEEK,
        variables: {
          id: router?.query?.week_id
        }
      });

      if (data?.duplicateWPOWeek) {
        toast.success('Week Duplicated');

        setPlanDetails((prevPlanDetails) => {
          const updatedWeeks = [
            ...prevPlanDetails.wourkout_plan_option_weeks,
            data?.duplicateWPOWeek
          ];
          return {
            ...prevPlanDetails,
            wourkout_plan_option_weeks: updatedWeeks
          };
        });
      }
      setDuplicateWeekLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setDuplicateWeekLoading(false);
    }
  };

  const selectedWeek = useMemo(() => {
    const foundOne = planDetails?.wourkout_plan_option_weeks?.find(
      (week) => week?.id === router?.query?.week_id
    );

    if (foundOne) {
      return foundOne;
    }
    if (planDetails?.wourkout_plan_option_weeks?.length) {
      router.query.week_id = planDetails?.wourkout_plan_option_weeks?.[0]?.id;
      return planDetails?.wourkout_plan_option_weeks?.[0];
    }
    return {};
  }, [planDetails?.wourkout_plan_option_weeks, router?.query]);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Image
              width={140 * (5 / 2)}
              height={200}
              style={{ borderRadius: 15 }}
              src={planDetails?.image || ''}
              alt={'program-image'}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    paddingRight: 1
                  }}>
                  <LoadingButton
                    sx={{ p: 0.2, px: 1 }}
                    size="small"
                    variant={'outlined'}
                    onClick={() => router.push(`/workout-plan/add?id=${planDetails?.id}`)}>
                    <PencilOutline fontSize="small" sx={{ mr: 1, color: 'primary' }} />
                    Edit
                  </LoadingButton>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Card variant={'outlined'} sx={{ borderRadius: 3.5, p: 3 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>Description</Typography>
                  <Typography variant={'body1'}>{planDetails?.description}</Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box display={'flex'}>
              <Typography fontSize={20} fontWeight={500} variant="h6">
                {planDetails?.name}
              </Typography>
              {planDetails?.week_no >= 0 && (
                <Chip
                  sx={{ ml: 2 }}
                  icon={<CalendarOutline />}
                  variant="filled"
                  label={`${planDetails?.week_no} ${planDetails?.week_no > 1 ? 'Weeks' : 'Week'}`}
                />
              )}
            </Box>
            <Typography variant="body1" textTransform={'capitalize'}>
              {planDetails?.type}
            </Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography fontSize={18} fontWeight={600} variant="h6">
                {planDetails?.currency?.code} {planDetails?.price}
              </Typography>
              <Box
                sx={{
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 3,
                  px: 1,
                  ml: 1.5
                }}>
                <Typography>{planDetails?.discount} % off</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      {/* Purchased Workout Programme Start */}
      <Grid item xs={12} md={12} order={{ xs: 3, md: 2 }}>
        <Card variant={'outlined'}>
          <CardHeader
            titleTypographyProps={{ variant: 'h5', fontWeight: '700' }}
            title="Workout Plan"
            action={
              planDetails?.wourkout_plan_option_weeks?.length ? (
                <LoadingButton
                  sx={{ borderRadius: 5 }}
                  type="button"
                  variant="contained"
                  size="large"
                  onClick={() => setShowAddWorkProgExerDrawer(true)}>
                  Add Program
                </LoadingButton>
              ) : (
                <LoadingButton
                  sx={{ borderRadius: 5 }}
                  type="button"
                  variant="contained"
                  size="large"
                  onClick={() => setShowAddDaysDrawer(true)}>
                  Add Week
                </LoadingButton>
              )
            }
          />
          <Divider />

          {planDetails?.wourkout_plan_option_weeks.length > 0 ? (
            <CardContent>
              <Card variant={'outlined'}>
                <CardHeader
                  title="Workout Plan Week's"
                  titleTypographyProps={{ variant: 'h6' }}
                  action={
                    <LoadingButton
                      sx={{ borderRadius: 5, minWidth: 0, p: 1 }}
                      type="button"
                      variant={'outlined'}
                      size="large"
                      onClick={() => setShowAddDaysDrawer(true)}>
                      <Plus sx={{}} />
                    </LoadingButton>
                  }
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
                      {planDetails?.wourkout_plan_option_weeks?.map((week) => (
                        <Chip
                          key={week?.id}
                          variant={router?.query?.week_id === week?.id ? 'filled' : 'outlined'}
                          label={`Week ${week?.week_no}`}
                          onClick={() => {
                            router.query.week_id = week?.id;
                            if (router?.query?.day_id) {
                              delete router.query.day_id;
                            }
                            const url = {
                              pathname: router.pathname,
                              query: router.query
                            };
                            router.replace(url, undefined, { shallow: true });
                          }}
                          sx={{ mr: 1, mb: 1 }}
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
                              : 'Select a Week to list plan'
                          }
                          titleTypographyProps={{ variant: 'h6' }}
                          action={
                            <Fragment>
                              <LoadingButton
                                loading={duplicateWeekLoading}
                                sx={{ borderRadius: 5 }}
                                type="button"
                                variant="contained"
                                size="large"
                                // onClick={() => setShowAddDaysDrawer(true)}>

                                onClick={weekDuplication}>
                                Duplicate
                              </LoadingButton>
                            </Fragment>
                          }
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
                              {selectedWeek?.week_days?.map((day) => (
                                <Chip
                                  key={day?.id}
                                  variant={
                                    router?.query?.day_id === day?.id ? 'filled' : 'outlined'
                                  }
                                  label={day?.day.toUpperCase()}
                                  onClick={() => handleDayClick(day?.id)}
                                  sx={{ mr: 1 }}
                                />
                              ))}
                            </Grid>
                            {/* days chip end */}

                            {/* Per Day Card Start */}

                            {/* {router.query.day_id && ( */}
                            <Grid item xs={12}>
                              <Grid container spacing={2}>
                                {!router?.query?.day_id && (
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{
                                      fontSize: 15,
                                      // marginRight: 6,
                                      marginLeft: 6,
                                      marginRight: 6,
                                      marginTop: 3
                                    }}>
                                    Please select a day
                                  </Typography>
                                )}

                                {dayLoading && <CircularLoader />}

                                {dayPlanDetails?.map((exercise) => (
                                  <Grid key={exercise?.id} item xs={12} sm={4}>
                                    <Card variant="outlined" sx={{ p: 2 }}>
                                      <Box display={'flex'}>
                                        {/* <Backdrop
                                          sx={{
                                            color: '#fff',
                                            zIndex: (theme) => theme.zIndex.drawer + 1
                                          }}
                                          open={dayLoading}>
                                          <CircularProgress color="inherit" />
                                        </Backdrop> */}
                                        <Image
                                          width={80}
                                          height={50}
                                          style={{ borderRadius: 10, objectFit: 'cover' }}
                                          src={exercise?.workout_program_exercise?.exercise?.image}
                                          alt={'exercise-image'}
                                        />
                                        <Box ml={2}>
                                          <Typography fontSize={16} fontWeight={600}>
                                            {exercise.workout_program_exercise?.exercise?.title}
                                          </Typography>
                                          <Typography
                                            fontSize={12}
                                            fontWeight={500}
                                            color={'#08CA96'}
                                            style={{ textTransform: 'capitalize' }}>
                                            {exercise?.workout_program_exercise?.exercise?.level}
                                          </Typography>
                                        </Box>
                                      </Box>

                                      {exercise?.workout_program_exercise
                                        ?.workout_program_exercise_sets.length > 0 && (
                                        <Table
                                          sx={{
                                            '& .MuiTableCell-root': {
                                              padding: '8px 4px'
                                            }
                                          }}>
                                          <TableHead>
                                            <TableRow>
                                              <TableCell>Set</TableCell>
                                              <TableCell>Weight</TableCell>
                                              <TableCell>Reps</TableCell>
                                              <TableCell>RPE</TableCell>
                                              <TableCell>Tempo</TableCell>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {exercise?.workout_program_exercise?.workout_program_exercise_sets?.map(
                                              (set) => (
                                                <TableRow
                                                  key={set?.set_no}
                                                  sx={{
                                                    '& .MuiTableCell-root': {
                                                      borderBottom: 0
                                                    }
                                                  }}>
                                                  <TableCell>{set?.set_no}</TableCell>
                                                  <TableCell>{set?.weight}</TableCell>
                                                  <TableCell>{set?.reps}</TableCell>
                                                  <TableCell>{set?.rest_time}</TableCell>
                                                  <TableCell>{set?.tempo}</TableCell>
                                                </TableRow>
                                              )
                                            )}
                                          </TableBody>
                                        </Table>
                                      )}
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                            {/* )} */}
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
              <Box sx={{ py: 4 }}>No Weeks Found, Please add a week</Box>
            </CardContent>
          )}
        </Card>
      </Grid>
      <AddWeek open={showAddDaysDrawer} onClose={setShowAddDaysDrawer} planId={planDetails?.id} />
      <AddPrograme
        open={showAddWorkProgExerDrawer}
        onClose={setShowAddWorkProgExerDrawer}
        planId={planDetails?.id}
      />
    </Grid>
  );
};

export default PlanUpdate;
