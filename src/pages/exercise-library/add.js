import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Select,
  TextField,
  IconButton,
  InputLabel,
  MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { Delete } from 'mdi-material-ui';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_ALL_MUSCLEGROUP } from '@/graphql/musclegroup';
import { GET_ALL_EQUIPEMENTS } from '@/graphql/equipements';
import {
  ADD_LIBRARY,
  DELETE_LIBRARY,
  GET_ONE_LIBRARY,
  UPDATE_LIBRARY
} from '@/graphql/exercise-library';
import { GET_ALL_WORKOUT_CATEGORIES } from '@/graphql/Workout/Category';
import { useEffect, useMemo, useState } from 'react';
import CircularLoader from '@/view/CircularLoader';
import { uploadSingleFile } from '@/utils/uploadSingleFile';
import AttachmentUpload from '@/components/AttachmentUpload';

const schema = yup.object().shape({
  title: yup.string().required('Please enter a title'),
  instructions: yup.string().required('Please enter a instruction'),
  level: yup.string().required('Please select level'),
  equipement: yup.array().required('Please select equipements'),
  category: yup.string().required('Please select category'),
  is_free: yup.boolean().required('Please select free library'),
  primary_musclegroup: yup.array().required('Please select primary muscle groups'),
  secondary_musclegroup: yup.array().required('Please select secondary muscle groups'),
  youtube_link: yup.string().matches(
    // eslint-disable-next-line no-useless-escape
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    { message: 'Please enter a valid URL', excludeEmptyString: true }
  ),
  image: yup.mixed().nullable(),
  video: yup.mixed().nullable()
});

const defaultValues = {
  title: '',
  image: '',
  video: '',
  instructions: '',
  musclegroup: [],
  equipement: [],
  category_id: '',
  level: [],
  primary_musclegroup: [],
  secondary_musclegroup: [],
  youtube_link: '',
  is_free: false
};

const AddPrograms = ({ muscleGroups = [], equipements = [], categories = [] }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchLibraryDetails = async () => {
    setLoading(true);
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_LIBRARY,
        variables: { exerciseLibraryDetails: { id: router?.query?.id } }
      });

      if (data.exerciseLibrary) {
        setValue('title', data?.exerciseLibrary?.title);
        setValue('level', data?.exerciseLibrary?.level);
        setValue('instructions', data?.exerciseLibrary?.instructions);
        setValue('youtube_link', data?.exerciseLibrary?.youtube_link);
        setValue('category', data?.exerciseLibrary?.category_id);
        setValue('image', { uploaded_url: data?.exerciseLibrary?.image, uploaded: true });
        setValue('video', { uploaded_url: data?.exerciseLibrary?.video, uploaded: true });
        setValue('is_free', data?.exerciseLibrary?.is_free);

        const primaryMuscleGroups = data?.exerciseLibrary?.exercise_muscle_groups
          .filter((group) => group.type === 'primary')
          .map((group) => group.muscle_group_id);
        setValue('primary_musclegroup', primaryMuscleGroups || []);

        const secondaryMuscleGroups = data?.exerciseLibrary?.exercise_muscle_groups
          .filter((group) => group.type === 'secondary')
          .map((group) => group.muscle_group_id);
        setValue('secondary_musclegroup', secondaryMuscleGroups || []);

        const selectedEquipments =
          data?.exerciseLibrary?.exercise_equipements?.map(
            (equipment) => equipment.equipement_id
          ) || [];
        setValue('equipement', selectedEquipments);
      }

      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      fetchLibraryDetails();
    }
  }, [router?.query?.id]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
    try {
      let uploadedFilePath = null;
      if (params?.image) {
        uploadedFilePath = await uploadSingleFile(params?.image);
      }

      if (!uploadedFilePath?.uploaded) {
        toast.error('Failed to upload file. Please try again');
        return false;
      }
      let uploadedVideoPath = null;
      if (params?.video) {
        uploadedVideoPath = await uploadSingleFile(params?.video);
      }
      if (!uploadedVideoPath?.uploaded) {
        toast.error('Failed to upload video. Please try again');
        return false;
      }

      let equipmentGroupList = {
        equipement_ids: params?.equipement || []
      };

      let muscleGroups = [];
      if (params?.secondary_musclegroup || params?.primary_musclegroup) {
        muscleGroups = [
          { type: 'primary', muscle_group_ids: params.primary_musclegroup },
          { type: 'secondary', muscle_group_ids: params.secondary_musclegroup }
        ];
      }

      let exerciseLibraryDetails = {
        title: params?.title,
        instructions: params?.instructions,
        category_id: params?.category,
        level: params?.level,
        youtube_link: params?.youtube_link,
        image: uploadedFilePath?.path,
        video: uploadedVideoPath?.path,
        is_free: params?.is_free
      };

      if (router?.query?.id) {
        exerciseLibraryDetails.id = router?.query?.id;
      }

      let { data } = await generalApoloClient.mutate({
        mutation: router?.query?.id ? UPDATE_LIBRARY : ADD_LIBRARY,
        variables: {
          exerciseLibraryDetails: exerciseLibraryDetails,
          exerciseMuscleGroups: muscleGroups,
          exerciseEquipmentGroup: equipmentGroupList
        }
      });

      if (data?.updateExerciseLibrary) {
        toast.success('Library Updated!');

        router.replace(`/exercise-library/${data?.updateExerciseLibrary?.id}`);
      }

      if (data?.createExerciseLibrary) {
        toast.success('Exercise Library Created!');
        router.push('/exercise-library');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      Object.keys(defaultValues).map((key) => {
        if (errorData?.[key]) {
          setError(key, { message: errorData[key] });
        }
      });
    }
  };

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_LIBRARY,
        variables: { id: router?.query?.id }
      });
      if (data?.deleteExerciseLibrary) {
        toast.success('Exercise Library Deleted!');
        router.push('/exercise-library');
      }
    } catch (error) {
      validateGraphQlError(error);
    }
  };

  const secondaryMuscleGroups = useMemo(() => {
    let tempMuscleGroups = muscleGroups?.slice();
    return tempMuscleGroups?.filter((group) => !watch('primary_musclegroup')?.includes(group?.id));
  }, [muscleGroups, watch('primary_musclegroup')]);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title="Create New Library" titleTypographyProps={{ variant: 'h6' }} /> */}
          <CardHeader
            title={router?.query?.id ? getValues('title') : 'Create New Library'}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              router?.query?.id && (
                <IconButton
                  size="small"
                  aria-label="collapse"
                  sx={{ color: 'red' }}
                  onClick={onDelete}>
                  <Delete fontSize="small" />
                </IconButton>
              )
            }
          />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Title"
                          onChange={onChange}
                          placeholder="Title"
                          error={Boolean(errors.name)}
                        />
                      )}
                    />
                    {errors?.title && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.title?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="category_id1">Category</InputLabel>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Category"
                          error={Boolean(errors?.category)}
                          labelId="category_id1">
                          {categories?.map((category) => (
                            <MenuItem key={category?.id} value={category?.id}>
                              {category?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors?.category && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.category?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="level_id">Level</InputLabel>
                    <Controller
                      name="level"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value || []}
                          label="Level"
                          placeholder="Level"
                          labelId="level_id"
                          error={Boolean(errors?.name)}>
                          <MenuItem value="beginner">Beginner</MenuItem>
                          <MenuItem value="intermediate">Intermediate</MenuItem>
                          <MenuItem value="beginner">Expert</MenuItem>
                        </Select>
                      )}
                    />
                    {errors?.level && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.level?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="equipement_id">Equipement</InputLabel>
                    <Controller
                      name="equipement"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          multiple
                          onChange={onChange}
                          value={value || []}
                          label="Equipement"
                          error={Boolean(errors?.muclegroup)}
                          labelId="equipement_id">
                          {equipements?.map((equipement) => (
                            <MenuItem key={equipement?.id} value={equipement?.id}>
                              {equipement?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors?.equipement && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.equipement?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="muclegroup_id">Primary Muscle Group</InputLabel>
                    <Controller
                      name="primary_musclegroup"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          multiple
                          onChange={onChange}
                          value={value || []}
                          label="Primary Muscle Group"
                          error={Boolean(errors?.muclegroup)}
                          labelId="muclegroup_id">
                          {muscleGroups?.map((musclegroup) => (
                            <MenuItem key={musclegroup?.id} value={musclegroup?.id}>
                              {musclegroup?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors?.primary_musclegroup && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.primary_musclegroup?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="muclegroup_id">Secondary Muscle Group</InputLabel>
                    <Controller
                      name="secondary_musclegroup"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          multiple
                          onChange={onChange}
                          value={value || []}
                          label="Secondary Muscle Group"
                          error={Boolean(errors?.muclegroup)}
                          labelId="muclegroup_id">
                          {secondaryMuscleGroups?.map((musclegroup) => (
                            <MenuItem key={musclegroup?.id} value={musclegroup?.id}>
                              {musclegroup?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors?.secondary_musclegroup && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.secondary_musclegroup?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="instructions"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Instructions"
                          onChange={onChange}
                          placeholder="Instructions"
                          multiline
                          error={Boolean(errors.name)}
                        />
                      )}
                    />
                    {errors.instructions && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.instructions.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <AttachmentUpload
                    image={watch('image')}
                    video={watch('video')}
                    updateImage={(img) => setValue('image', img)}
                    updateVideo={(video) => setValue('video', video)}
                    error={errors?.image?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="youtube_link"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Youtube Link"
                          onChange={onChange}
                          placeholder="Youtube Link"
                          error={Boolean(errors.name)}
                        />
                      )}
                    />
                    {errors.youtube_link && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.youtube_link.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="is_free_id">Free Libray</InputLabel>
                    <Controller
                      name="is_free"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Free Libray"
                          placeholder="Free Libray"
                          labelId="is_free_id"
                          error={Boolean(errors?.name)}>
                          <MenuItem value={true}>Yes</MenuItem>
                          <MenuItem value={false}>No</MenuItem>
                        </Select>
                      )}
                    />
                    {errors?.is_free && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.is_free?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mr: 3 }}>
                    Submit
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export async function getServerSideProps() {
  let [musclegroupRes, EquipementRes, CategoryRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_MUSCLEGROUP
    }),
    generalApoloClient.query({
      query: GET_ALL_EQUIPEMENTS
    }),
    generalApoloClient.query({
      query: GET_ALL_WORKOUT_CATEGORIES
    })
  ]);

  return {
    props: {
      muscleGroups: musclegroupRes?.data?.muscleGroups?.data || [],
      equipements: EquipementRes?.data?.equipements?.data || [],
      categories: CategoryRes?.data?.workoutCategories?.data || []
    }
  };
}
export default AddPrograms;
