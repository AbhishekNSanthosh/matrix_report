import { Card, CardContent, CardHeader, Divider, Grid, Typography, Box } from '@mui/material';

import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import Image from 'next/image';
import { GET_ONE_LIBRARY } from '@/graphql/exercise-library';
import { GET_ALL_MUSCLEGROUP } from '@/graphql/musclegroup';
import { LoadingButton } from '@mui/lab';
import { PencilOutline } from 'mdi-material-ui';

const LibraryDetails = ({ Musclegroup = [] }) => {
  const [loading, setLoading] = useState(true);
  const [libraryDetails, setLibraryDetails] = useState(null);

  const router = useRouter();

  const fetchProgrames = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_LIBRARY,
        variables: { exerciseLibraryDetails: { id: router.query?.id } }
      });

      if (data?.exerciseLibrary) {
        setLibraryDetails(data?.exerciseLibrary);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrames();
  }, []);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography fontSize={20} fontWeight={600} variant="h6">
              {libraryDetails?.title}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
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
                onClick={() => router.push(`/exercise-library/add?id=${libraryDetails?.id}`)}>
                <PencilOutline fontSize="small" sx={{ mr: 1, color: 'primary' }} />
                Edit
              </LoadingButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Image
              width={140 * (5 / 2)}
              height={200}
              style={{ borderRadius: 15 }}
              src={libraryDetails?.image}
              alt={'library-image'}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant={'outlined'} sx={{ borderRadius: 3.5, p: 3 }}>
                  <Typography variant={'body2'}>Level</Typography>
                  <Typography
                    sx={{ fontSize: 14, fontWeight: 700, mb: 0.8, textTransform: 'capitalize' }}>
                    {libraryDetails?.level}
                  </Typography>

                  <Typography variant={'body2'}>Category</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.8 }}>
                    {libraryDetails?.workout_category?.name}
                  </Typography>

                  <Typography variant={'body2'}>Youtube Link</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.8 }}>
                    {libraryDetails?.youtube_link}
                  </Typography>
                  {libraryDetails?.is_free == true ? (
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.8 }} color={'#08CA96'}>
                      Free
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 0.8 }} color={'red'}>
                      Not Free
                    </Typography>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ marginBottom: '2px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant={'outlined'} sx={{ borderRadius: 3.5, p: 3 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
                    Instructions
                  </Typography>

                  <Typography>{libraryDetails?.instructions}</Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {libraryDetails?.exercise_muscle_groups?.length && (
        <Grid item xs={12} md={12}>
          <Card variant={'outlined'} sx={{ marginTop: '0px' }}>
            <CardHeader
              title="Muscle Groups"
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ marginBottom: '0px' }}
            />
            <Divider sx={{ m: 0 }} />

            <CardContent>
              <Grid container spacing={1} direction="column">
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ marginBottom: '0px' }}>
                    <CardHeader
                      title="Primary "
                      titleTypographyProps={{ variant: 'h6' }}
                      sx={{ height: '40px', marginTop: '0px' }}
                    />
                    <Divider sx={{ m: 0 }} />
                    <CardContent>
                      <Grid container spacing={2}>
                        {libraryDetails?.exercise_muscle_groups
                          .filter((group) => group.type === 'primary')
                          .map((muscleGroup) => {
                            const foundMuscleGroup = Musclegroup.find(
                              (group) => group.id === muscleGroup.muscle_group_id
                            );
                            return (
                              <Grid key={foundMuscleGroup?.id} item xs={12} sm={4}>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                  <Box display={'flex'}>
                                    <Image
                                      width={80}
                                      height={50}
                                      style={{ borderRadius: 10 }}
                                      src={foundMuscleGroup?.image}
                                      alt={'musclgroup-image'}
                                    />
                                    <Box ml={2}>
                                      <Typography fontSize={16} fontWeight={600}>
                                        {foundMuscleGroup?.name}
                                      </Typography>
                                      <Typography fontSize={12} fontWeight={500} color={'#08CA96'}>
                                        {foundMuscleGroup?.description}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardHeader
                      title="Secondary "
                      titleTypographyProps={{ variant: 'h6' }}
                      sx={{ height: '40px', marginBottom: '0px' }}
                    />
                    <Divider sx={{ m: 0 }} />
                    <CardContent>
                      <Grid container spacing={2}>
                        {libraryDetails?.exercise_muscle_groups
                          .filter((group) => group.type === 'secondary')
                          .map((muscleGroup) => {
                            const foundMuscleGroup = Musclegroup.find(
                              (group) => group.id === muscleGroup.muscle_group_id
                            );
                            return (
                              <Grid key={foundMuscleGroup?.id} item xs={12} sm={4}>
                                <Card variant="outlined" sx={{ p: 2 }}>
                                  <Box display={'flex'}>
                                    <Image
                                      width={80}
                                      height={50}
                                      style={{ borderRadius: 10 }}
                                      src={foundMuscleGroup?.image}
                                      alt={'secondary_musclgroup-image'}
                                    />
                                    <Box ml={2}>
                                      <Typography fontSize={16} fontWeight={600}>
                                        {foundMuscleGroup?.name}
                                      </Typography>
                                      <Typography fontSize={12} fontWeight={500} color={'#08CA96'}>
                                        {foundMuscleGroup?.description}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Card>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {libraryDetails?.exercise_equipements?.length && (
        <Grid item xs={12}>
          <Card variant={'outlined'}>
            <CardHeader
              title="Equipements"
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ marginBottom: '0px' }}
            />
            <Divider sx={{ m: 0 }} />

            <CardContent>
              <Grid container spacing={2}>
                {libraryDetails?.exercise_equipements?.map((equipements) => {
                  // const foundEquipement = Equipement.find(
                  //   (equip) => equip.id === equipements.equipement_id
                  // );

                  return (
                    <Grid key={equipements?.equipements?.id} item xs={12} sm={4}>
                      <Card variant="outlined" sx={{ p: 2, marginBottom: 2 }}>
                        <Box display={'flex'}>
                          <Image
                            width={80}
                            height={50}
                            style={{ borderRadius: 10 }}
                            src={equipements?.equipements?.image}
                            alt={'equipement-image'}
                          />
                          <Box ml={2}>
                            <Typography fontSize={16} fontWeight={600}>
                              {equipements?.equipements?.name}
                            </Typography>
                            <Typography fontSize={12} fontWeight={500} color={'#08CA96'}>
                              {equipements?.equipements?.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};
export async function getServerSideProps() {
  let [musclegroupRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_MUSCLEGROUP
    })
  ]);

  return {
    props: {
      Musclegroup: musclegroupRes?.data?.muscleGroups?.data || []
    }
  };
}

export default LibraryDetails;
