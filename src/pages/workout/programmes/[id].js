import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Box,
  MenuItem,
  Menu,
  IconButton,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import { GET_ONE_WORKOUT_PROGRAMS } from '@/graphql/Workout/Programmes';
import AddProgramDays from '@/view/Programmes/AddProgramDays';
import styled from '@emotion/styled';
import AddWorkProgExercise from '@/view/Programmes/AddWorkProgExercise';
import Image from 'next/image';
import { DotsHorizontal, PencilOutline } from 'mdi-material-ui';
import AddWorkProgExerciseSet from '@/view/Programmes/AddWorkProgExerciseSet';
import AddWorkProgExerciseSetExtra from '@/view/Programmes/AddWorkProgExerciseSetExtra';
import {
  ADD_WORKOUT_PROGRAMS_EXERCISE_SET_DUPLICATE,
  GET_WORKOUTS_BY_DAY_ID
} from '@/graphql/Workout/Programmes/program-exercise-set';
import { validateGraphQlError } from '@/utils/ValidateError';
import { groupBy } from '@/utils/groupBy';
import { setGroupName } from '@/utils/setGroupName';

const MenuItemContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  padding: theme.spacing(1, 3),
  color: theme.palette.text.primary
}));

// const groupBy = function (xs, key1, key2) {
//   return xs.reduce(function (rv, x) {
//     ((rv[x[key1]] = rv[x[key1]] || {})[x[key2]] = (rv[x[key1]] || {})[x[key2]] || []).push(x);
//     return rv;
//   }, {});
// };

const RowOptions = ({ exerciseId, set_id, menuType = 'set' }) => {
  const [showAddWorkProgExerSetDrawer, setShowAddWorkProgExerSetDrawer] = useState(false);
  const [showAddWorkProgExerSetExtraDrawer, setShowAddWorkProgExerSetExtraDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const router = useRouter();
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleAddSetClick = () => {
    setShowAddWorkProgExerSetDrawer(true);
    handleRowOptionsClose();
  };

  const handleAddSetExtraClick = () => {
    setShowAddWorkProgExerSetExtraDrawer(true);
    handleRowOptionsClose();
  };

  const duplicateSet = async () => {
    handleRowOptionsClose();
    toast.loading('Duplicating set');
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_WORKOUT_PROGRAMS_EXERCISE_SET_DUPLICATE,
        variables: {
          id: set_id
        }
      });

      if (data?.duplicateWorkoutProgramExerciseSet) {
        toast.success('Set Duplicated Successfully');
        const url = {
          pathname: router.pathname,
          query: router.query
        };
        router.replace(url, undefined, { shallow: true });
      }
      toast.dismiss();
    } catch (error) {
      validateGraphQlError(error);
      toast.dismiss();
    }
  };

  return (
    <Box>
      <IconButton size="small" onClick={handleRowOptionsClick} sx={{ p: 1.5 }}>
        <DotsHorizontal />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        paperProps={{ style: { minWidth: '8rem' } }}>
        {menuType === 'exercise' ? (
          <MenuItem sx={{ p: 0 }} onClick={() => handleAddSetClick(exerciseId)}>
            <MenuItemContent>Add Set</MenuItemContent>
          </MenuItem>
        ) : (
          <Box>
            <MenuItem sx={{ p: 0 }} onClick={handleAddSetExtraClick}>
              <MenuItemContent>Add Extra Set</MenuItemContent>
            </MenuItem>
            <MenuItem sx={{ p: 0 }} onClick={duplicateSet}>
              <MenuItemContent>Duplicate Set</MenuItemContent>
            </MenuItem>
          </Box>
        )}
      </Menu>
      <AddWorkProgExerciseSet
        open={showAddWorkProgExerSetDrawer}
        onClose={setShowAddWorkProgExerSetDrawer}
        exerciseId={exerciseId}
      />
      <AddWorkProgExerciseSetExtra
        open={showAddWorkProgExerSetExtraDrawer}
        onClose={setShowAddWorkProgExerSetExtraDrawer}
        exerciseId={exerciseId}
        set_id={set_id}
      />
    </Box>
  );
};

const ProgrammeUpdate = () => {
  const [loading, setLoading] = useState(true);
  const [programDetails, setProgramDetails] = useState(null);
  const [showAddDaysDrawer, setShowAddDaysDrawer] = useState(false);
  const [showAddWorkProgExerDrawer, setShowAddWorkProgExerDrawer] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [fetchingExercises, setFetchingExercises] = useState(false);

  const router = useRouter();

  const fetchProgrames = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_PROGRAMS,
        variables: { workout_program_details: { id: router.query?.id } }
      });

      if (data?.workoutProgram) {
        setProgramDetails(data?.workoutProgram);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrames();
  }, []);

  const fetchWorkoutsByDay = async () => {
    setFetchingExercises(true);
    try {
      let { data } = await generalApoloClient.query({
        query: GET_WORKOUTS_BY_DAY_ID,
        variables: { work_program_exercise_details: { day_id: router?.query?.day_id } }
      });

      if (data?.workoutProgramsExercises) {
        let groupSetNoGrouping = groupBy(data?.workoutProgramsExercises, 'group_set_no');
        let setNoGroups = Object.keys(groupSetNoGrouping);
        let formattedExercises = setNoGroups
          ?.map((setNoGroup) => {
            let groupGrouping = groupBy(groupSetNoGrouping[setNoGroup], 'group');
            let groupGroups = Object.keys(groupGrouping);
            let formattedGroupGroups = groupGroups?.map((groupGroup) => ({
              setNoGrp: setNoGroup,
              groupGrp: groupGroup,
              exercises: groupGrouping[groupGroup]
            }));
            return formattedGroupGroups;
          })
          ?.flatMap((arr) => arr);

        let sortedByGroupSortOrder = formattedExercises?.sort(
          (a, b) => a?.exercises?.[0]?.group_sort_order - b?.exercises?.[0]?.group_sort_order
        );
        let sortedExerciseBySortOrder = sortedByGroupSortOrder?.map((exerGrp) => {
          let sortedExer = exerGrp?.exercises?.sort((a, b) => a?.sort_order - b?.sort_order);
          return { ...exerGrp, exercises: sortedExer };
        });
        console.log(JSON.stringify(sortedExerciseBySortOrder));
        setExercises(sortedExerciseBySortOrder);
      }
      setFetchingExercises(false);
    } catch (error) {
      validateGraphQlError(error);
      setFetchingExercises(false);
    }
  };

  useEffect(() => {
    if (router?.query?.day_id) {
      fetchWorkoutsByDay();
    }
  }, [router?.query]);

  // const selectedDay = useMemo(() => {
  //   const foundOne = programDetails?.workout_program_days?.find(
  //     (day) => day?.id === router?.query?.day_id
  //   );
  //   if (foundOne) {
  //     return foundOne;
  //   }
  //   return {};
  // }, [programDetails?.workout_program_days, router?.query]);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography fontSize={20} fontWeight={600} variant="h6">
              {programDetails?.title}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sm={8}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%'
            }}>
            <LoadingButton
              sx={{ p: 0.2, px: 1 }}
              size="small"
              variant={'outlined'}
              onClick={() => router.push(`/workout/programmes/add?id=${programDetails?.id}`)}>
              <PencilOutline fontSize="small" sx={{ mr: 1, color: 'primary' }} />
              Edit
            </LoadingButton>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Image
              width={140 * (5 / 2)}
              height={200}
              style={{ borderRadius: 15, objectFit: 'cover' }}
              src={programDetails?.image || ''}
              alt={'Program image'}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant={'outlined'} sx={{ borderRadius: 3.5, p: 3 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>Description</Typography>
                  <Typography>{programDetails?.description}</Typography>
                </Card>
              </Grid>
              {!programDetails?.workout_program_days?.length && (
                <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={() => setShowAddDaysDrawer(true)}>
                    Add Days
                  </LoadingButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {programDetails?.workout_program_days?.length && (
        <Grid item xs={12}>
          <Card variant={'outlined'}>
            <CardHeader
              title="Workout Porgramme Days"
              titleTypographyProps={{ variant: 'h5', fontWeight: '700' }}
              action={
                <LoadingButton
                  sx={{ borderRadius: 5 }}
                  type="button"
                  variant="contained"
                  size="large"
                  onClick={() => setShowAddDaysDrawer(true)}>
                  Add Extra Days
                </LoadingButton>
              }
            />

            <Divider sx={{ m: 0 }} />

            <CardContent>
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
                  {programDetails?.workout_program_days?.map((day) => (
                    <Chip
                      key={day?.id}
                      variant={router?.query?.day_id === day?.id ? 'filled' : 'outlined'}
                      label={`Day ${day?.day_no}`}
                      onClick={() => {
                        router.query.day_id = day?.id;
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

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardHeader
                      title={'Workouts'}
                      titleTypographyProps={{ variant: 'h6' }}
                      action={
                        <LoadingButton
                          sx={{ borderRadius: 5 }}
                          type="button"
                          variant="contained"
                          size="large"
                          onClick={() => setShowAddWorkProgExerDrawer(true)}>
                          Add Exercise
                        </LoadingButton>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={2}>
                        {fetchingExercises && (
                          <Box sx={{ width: '100%', p: 1 }}>
                            <CircularLoader />
                          </Box>
                        )}

                        {exercises?.map((exerGroup) => (
                          <Grid key={exerGroup?.setNoGroup + exerGroup?.groupGrp} item xs={12}>
                            <Card variant="outlined" sx={{ pt: 0 }}>
                              <CardHeader
                                title={setGroupName(exerGroup?.groupGrp)}
                                titleTypographyProps={{ variant: 'h6' }}
                              />
                              <Divider />

                              <CardContent>
                                <Grid container spacing={2}>
                                  {exerGroup?.exercises?.map((workout) => (
                                    <Grid key={workout?.id} item xs={12} sm={4}>
                                      <Card key={workout?.id} variant="outlined" sx={{ p: 2 }}>
                                        <Box display={'flex'}>
                                          <Image
                                            width={80}
                                            height={50}
                                            src={workout?.exercise?.image || ''}
                                            alt={'Workout image'}
                                            style={{
                                              borderRadius: 10,
                                              objectFit: 'cover'
                                            }}
                                          />
                                          <Box ml={2} flexGrow={1}>
                                            <Typography fontSize={16} fontWeight={600}>
                                              {workout?.exercise?.title}
                                            </Typography>
                                            <Typography
                                              fontSize={12}
                                              fontWeight={500}
                                              color={'#08CA96'}>
                                              {workout?.exercise?.level}
                                            </Typography>
                                          </Box>

                                          <RowOptions
                                            exerciseId={workout?.id}
                                            menuType={'exercise'}
                                          />
                                        </Box>

                                        {workout?.workout_program_exercise_sets?.length > 0 && (
                                          <Table
                                            sx={{
                                              '& .MuiTableCell-root': {
                                                padding: '1px 4px'
                                              },
                                              mt: 1.5
                                            }}>
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Set</TableCell>
                                                <TableCell>Reps</TableCell>
                                                <TableCell>Rest</TableCell>
                                                <TableCell>Tempo</TableCell>
                                                <TableCell>Weight</TableCell>
                                                <TableCell>Extra Set</TableCell>
                                                <TableCell>Actions</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {workout?.workout_program_exercise_sets?.map(
                                                (set) => (
                                                  <TableRow
                                                    key={set?.id}
                                                    sx={{
                                                      '&:last-of-type  td, &:last-of-type  th': {
                                                        border: 0
                                                      }
                                                    }}>
                                                    <TableCell align="center">
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

                                                    <TableCell align="left">
                                                      {set?.workout_program_exercise_set_extras
                                                        ?.length
                                                        ? set?.workout_program_exercise_set_extras?.map(
                                                            (extra, index) => (
                                                              <Box key={index}>
                                                                <Typography
                                                                  style={{
                                                                    fontSize: 12
                                                                  }}>
                                                                  {extra?.name}: {extra?.value}
                                                                </Typography>
                                                              </Box>
                                                            )
                                                          )
                                                        : '--'}
                                                    </TableCell>

                                                    <TableCell align="center">
                                                      <RowOptions set_id={set?.id} />
                                                    </TableCell>
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
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}

                        {/* {exercises?.map((dayGroups) => {
                          let setGroups = Object.keys(dayGroups?.setGroup);
                          return (
                            <Grid key={dayGroups?.id} item xs={12}>
                              <Card variant="outlined">
                                <CardHeader
                                  title={`Workout Set ${dayGroups?.dayGroup}`}
                                  titleTypographyProps={{ variant: 'h6' }}
                                />
                                <Divider />
                                <CardContent
                                  sx={{ '&. MuiCardContent-root:last-child': { pb: 0 } }}>
                                  <Grid container spacing={2}>
                                    {setGroups?.map((setGroup) => {
                                      let workouts = dayGroups?.setGroup[setGroup];

                                      return (
                                        <Grid key={setGroup} item xs={12}>
                                          <Card key={setGroup} variant="outlined" sx={{ pt: 0 }}>
                                            <CardHeader
                                              title={setGroupName(setGroup)}
                                              titleTypographyProps={{ variant: 'h6' }}
                                            />
                                            <Divider />

                                            <CardContent>
                                              <Grid container spacing={2}>
                                                {workouts?.map((workout) => (
                                                  <Grid key={workout?.id} item xs={12} sm={4}>
                                                    <Card
                                                      key={workout?.id}
                                                      variant="outlined"
                                                      sx={{ p: 2 }}>
                                                      <Box display={'flex'}>
                                                        <Image
                                                          width={80}
                                                          height={50}
                                                          src={workout?.exercise?.image || ''}
                                                          alt={'Workout image'}
                                                          style={{
                                                            borderRadius: 10,
                                                            objectFit: 'cover'
                                                          }}
                                                        />
                                                        <Box ml={2} flexGrow={1}>
                                                          <Typography
                                                            fontSize={16}
                                                            fontWeight={600}>
                                                            {workout?.exercise?.title}
                                                          </Typography>
                                                          <Typography
                                                            fontSize={12}
                                                            fontWeight={500}
                                                            color={'#08CA96'}>
                                                            {workout?.exercise?.level}
                                                          </Typography>
                                                        </Box>

                                                        <RowOptions
                                                          exerciseId={workout?.id}
                                                          menuType={'exercise'}
                                                        />
                                                      </Box>

                                                      {workout?.workout_program_exercise_sets
                                                        ?.length > 0 && (
                                                        <Table
                                                          sx={{
                                                            '& .MuiTableCell-root': {
                                                              padding: '1px 4px'
                                                            },
                                                            mt: 1.5
                                                          }}>
                                                          <TableHead>
                                                            <TableRow>
                                                              <TableCell>Set</TableCell>
                                                              <TableCell>Reps</TableCell>
                                                              <TableCell>Rest</TableCell>
                                                              <TableCell>Tempo</TableCell>
                                                              <TableCell>Weight</TableCell>
                                                              <TableCell>Extra Set</TableCell>
                                                              <TableCell>Actions</TableCell>
                                                            </TableRow>
                                                          </TableHead>
                                                          <TableBody>
                                                            {workout?.workout_program_exercise_sets?.map(
                                                              (set) => (
                                                                <TableRow
                                                                  key={set?.id}
                                                                  sx={{
                                                                    '&:last-of-type  td, &:last-of-type  th':
                                                                      {
                                                                        border: 0
                                                                      }
                                                                  }}>
                                                                  <TableCell align="center">
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

                                                                  <TableCell align="left">
                                                                    {set
                                                                      ?.workout_program_exercise_set_extras
                                                                      ?.length
                                                                      ? set?.workout_program_exercise_set_extras?.map(
                                                                          (extra, index) => (
                                                                            <Box key={index}>
                                                                              <Typography
                                                                                style={{
                                                                                  fontSize: 12
                                                                                }}>
                                                                                {extra?.name}:{' '}
                                                                                {extra?.value}
                                                                              </Typography>
                                                                            </Box>
                                                                          )
                                                                        )
                                                                      : '--'}
                                                                  </TableCell>

                                                                  <TableCell align="center">
                                                                    <RowOptions set_id={set?.id} />
                                                                  </TableCell>
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
                                            </CardContent>
                                          </Card>
                                        </Grid>
                                      );
                                    })}
                                  </Grid>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })} */}

                        {/* ) : (
                          <Box sx={{ width: '100%', p: 1 }}>
                            <Typography textAlign={'center'}>Not added any exercise</Typography>
                          </Box>
                        )} */}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
      <AddProgramDays open={showAddDaysDrawer} onClose={setShowAddDaysDrawer} />
      <AddWorkProgExercise
        open={showAddWorkProgExerDrawer}
        onClose={setShowAddWorkProgExerDrawer}
      />
    </Grid>
  );
};

export default ProgrammeUpdate;
