import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Typography,
  Box,
  TextField,
  IconButton,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone';
import { Close, Delete, TrayArrowUp } from 'mdi-material-ui';
import { generalApoloClient } from '@/config/apolloClient';
import { uploadSingleFile } from '@/utils/uploadSingleFile';
import { useEffect, useState } from 'react';
import CircularLoader from '@/view/CircularLoader';
import { GET_ALL_CURRENCIES } from '@/graphql/currency';
import {
  ADD_WORKOUT_PLAN,
  DELETE_WORKOUT_PLAN,
  GET_ONE_WORKOUT_PLAN,
  UPDATE_WORKOUT_PLAN
} from '@/graphql/workout-plan';

const defaultValues = {
  name: '',
  description: '',
  currency: '',
  image: '',
  price: '',
  discount: '',
  type: '',
  level: '',
  video: ''
};

const schema = yup.object().shape({
  name: yup.string().required('please enter a title'),
  description: yup.string().required('please enter a description'),
  price: yup.number().required('please enter price'),
  level: yup.string().required('please select level'),
  type: yup.string().required('please select type'),
  discount: yup.number().required('please select discount'),
  image: yup.mixed().nullable(),
  video: yup.mixed().nullable()
});

const AddPlans = ({ Currencies = [] }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchPlanes = async () => {
    setLoading(true);
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_PLAN,
        variables: { workout_plan_option_details: { id: router?.query?.id } }
      });

      if (data.workoutPlanOption) {
        setValue('name', data?.workoutPlanOption?.name);
        setValue('description', data?.workoutPlanOption?.description);
        setValue('price', data?.workoutPlanOption?.price);
        setValue('type', data?.workoutPlanOption?.type);
        setValue('category', data?.workoutPlanOption?.category);
        setValue('level', data?.workoutPlanOption?.level);
        setValue('discount', data?.workoutPlanOption?.discount);
        setValue('currency', data?.workoutPlanOption?.currency_id);
        setValue('image', { uploaded_url: data?.workoutPlanOption?.image, uploaded: true });
        setValue('video', { uploaded_url: data?.workoutPlanOption?.video, uploaded: true });
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      fetchPlanes();
    }
  }, [router?.query?.id]);

  const onSubmit = async (params) => {
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
    let workout_plan_option_details = {
      type: params?.type,
      name: params?.name,
      description: params?.description,
      currency_id: params?.currency,
      price: params?.price,
      discount: params?.discount,
      category: params?.category,
      level: params?.level,
      // image: params?.image?.path,
      // video: params?.video?.path
      image: uploadedFilePath?.path,
      video: uploadedVideoPath?.path
    };

    if (router?.query?.id) {
      workout_plan_option_details.id = router?.query?.id;
    }

    try {
      let { data } = await generalApoloClient.mutate({
        mutation: router?.query?.id ? UPDATE_WORKOUT_PLAN : ADD_WORKOUT_PLAN,
        variables: {
          workoutPlanOptionDetails: workout_plan_option_details
        }
      });
      if (data?.updateWorkoutPlanOption) {
        toast.success('Plan Updated!');
        router.replace(`/workout-plan/${data?.updateWorkoutPlanOption?.id}`);
      }

      if (data?.createWorkoutPlanOption) {
        toast.success('New Plan Created!');
        router.replace(`/workout-plan/${data?.createWorkoutPlanOption?.id}`);
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

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 50000000, // maximum size (50MB)
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': ['.mp4', '.avi', '.mov']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0];
        if (file.type.startsWith('video/')) {
          if (file.size > 50000000) {
            toast.error('Please add a video file size less than 50 MB', {
              duration: 2000
            });
            return;
          }
          setValue('video', file);
        } else {
          if (file.size > 5000000) {
            toast.error('Please add an image file size less than 5 MB', {
              duration: 2000
            });
            return;
          }
          setValue('image', file);
        }
      }
    },
    onDropRejected: () => {
      toast.error('Please add files in the allowed formats', {
        duration: 2000
      });
    }
  });

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_WORKOUT_PLAN,
        variables: { id: router.query?.id }
      });

      if (data?.deleteWorkoutPlanOption) {
        toast.success('Plan Deleted!');
        router.push('/workout-plan');
      }
    } catch (error) {
      validateGraphQlError(error);
    }
  };

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={router?.query?.id ? getValues('name') : 'Create Plan'}
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
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
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
                    {errors.title && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.title.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="currency_id1">Currency</InputLabel>
                    <Controller
                      name="currency"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Currency"
                          error={Boolean(errors?.category)}
                          labelId="currency_id1">
                          {Currencies?.map((currency) => (
                            <MenuItem key={currency?.id} value={currency?.id}>
                              {currency?.code}
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
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="price"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Price"
                          onChange={onChange}
                          placeholder="Price"
                          error={Boolean(errors.price)}
                        />
                      )}
                    />
                    {errors.price && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.price.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="discount"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Discount"
                          onChange={onChange}
                          placeholder="Discount"
                          error={Boolean(errors.discount)}
                        />
                      )}
                    />
                    {errors.discount && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.discount.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="type_id">Type</InputLabel>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Type"
                          error={Boolean(errors?.category)}
                          labelId="type_id">
                          <MenuItem value={'package'}>Package</MenuItem>
                          <MenuItem value={'plan'}>Plan</MenuItem>
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
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="category_id">Category</InputLabel>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="category"
                          error={Boolean(errors?.category)}
                          labelId="category_id">
                          <MenuItem value={'gym'}>Gym</MenuItem>
                          <MenuItem value={'plan'}>Home</MenuItem>
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
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="level_id">Level</InputLabel>
                    <Controller
                      name="level"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="level"
                          error={Boolean(errors?.level)}
                          labelId="level_id">
                          <MenuItem value={'beginner'}>Beginner</MenuItem>
                          <MenuItem value={'intermediate'}>Intermediate</MenuItem>
                          <MenuItem value={'expert'}>Expert</MenuItem>
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
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Description"
                          onChange={onChange}
                          placeholder="Description"
                          error={Boolean(errors.description)}
                          multiline
                        />
                      )}
                    />
                    {errors.description && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.description.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  {watch('image') ? (
                    <Box
                      sx={{
                        position: 'relative',
                        width: 100 * (5 / 2),
                        height: 100,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                      <img
                        width={'100%'}
                        height={'100%'}
                        style={{ borderRadius: 2 }}
                        alt={'image'}
                        src={
                          watch('image')?.path
                            ? URL.createObjectURL(watch('image'))
                            : watch('image')?.uploaded_url
                        }
                      />
                      <Box
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={() => setValue('image', '')}>
                        <Close />
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <DropzoneWrapper
                        {...getRootProps({ className: 'dropzone', style: { minHeight: 50 } })}>
                        <input {...getInputProps()} />
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                          <TrayArrowUp sx={{ fontSize: 50, color: 'primary.main' }} />
                          <Typography mt={1} variant="body2" color="gray">
                            Select Image
                          </Typography>
                        </Box>
                      </DropzoneWrapper>

                      {errors?.image && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors?.image?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {watch('video') ? (
                    <Box
                      sx={{
                        position: 'relative',
                        width: 100 * (5 / 2),
                        height: 100,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                      <video width="100%" controls>
                        {watch('video')?.uploaded_url ? (
                          <source src={watch('video')?.uploaded_url} type="video/mp4" />
                        ) : (
                          <source src={URL.createObjectURL(watch('video'))} type="video/mp4" />
                        )}
                      </video>
                      <Box
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={() => setValue('video', '')}>
                        <Close />
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <DropzoneWrapper
                        {...getRootProps({ className: 'dropzone', style: { minHeight: 50 } })}>
                        <input {...getInputProps()} />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column'
                          }}>
                          <TrayArrowUp sx={{ fontSize: 50, color: 'primary.main' }} />
                          <Typography mt={1} variant="body2" color="gray">
                            Select Video
                          </Typography>
                        </Box>
                      </DropzoneWrapper>

                      {errors?.video && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors?.video?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
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
  let [CurrencyRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_CURRENCIES
    })
  ]);

  return {
    props: {
      Currencies: CurrencyRes?.data?.currencies || []
    }
  };
}
export default AddPlans;
