import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton
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
import { useState } from 'react';
import { useEffect } from 'react';
import { generalApoloClient } from '@/config/apolloClient';

import CircularLoader from '@/view/CircularLoader';
import {
  DELETE_WORKOUT_CATEGORY,
  GET_ONE_WORKOUT_CATEGORY,
  UPDATE_WORKOUT_CATEGORY
} from '@/graphql/Workout/Category';
import { uploadSingleFile } from '@/utils/uploadSingleFile';

const schema = yup.object().shape({
  name: yup.string().required('please enter a name'),
  description: yup.string().required('please enter a description'),
  image: yup.mixed().nullable()
});

const WorkoutCategoryUpdate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    getValues,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      page_id: '',
      image: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchWorkoutCategory = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_CATEGORY,
        variables: { workout_category_details: { id: router.query?.id } }
      });

      if (data.workoutCategory) {
        setValue('name', data?.workoutCategory?.name);
        setValue('description', data?.workoutCategory?.description);
        setValue('image', data?.workoutCategory?.image);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutCategory();
  }, []);

  const onSubmit = async (params) => {
    let uploadedFilePath = null;
    if (params?.image) {
      uploadedFilePath = await uploadSingleFile(params?.image);
    }
    if (!uploadedFilePath?.uploaded) {
      toast.error('Failed to upload file. Please try again');
      return false;
    }
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: UPDATE_WORKOUT_CATEGORY,
        variables: {
          workout_category_details: {
            id: router.query?.id,
            name: params?.name,
            description: params?.description,
            image: uploadedFilePath?.path
          }
        }
      });

      if (data?.updateWorkoutCategory) {
        toast.success('Workout Category Updated!');
        router.replace('/workout/categories');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length) {
        setValue('image', acceptedFiles?.[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please add a file below 5 MB', {
        duration: 2000
      });
    }
  });

  const onDelete = async () => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_WORKOUT_CATEGORY,
        variables: { id: router.query?.id }
      });
      if (data?.deleteWorkoutCategory) {
        toast.success('Workout Category Deleted!');
        router.push('/workout/categories');
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
            title={getValues('name')}
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton
                size="small"
                aria-label="collapse"
                sx={{ color: 'red' }}
                onClick={onDelete}>
                <Delete fontSize="small" />
              </IconButton>
            }
          />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1. Workout Category Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Category Name"
                          onChange={onChange}
                          placeholder="Category Name"
                          error={Boolean(errors.title)}
                        />
                      )}
                    />
                    {errors.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.name.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
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

                <Grid item xs={12}>
                  {watch('image') ? (
                    <Box sx={{ position: 'relative', width: 100 * (5 / 2), height: 100 }}>
                      <img
                        width={'100%'}
                        height={'100%'}
                        style={{ borderRadius: 5 }}
                        alt={'image'}
                        src={
                          watch('image')?.path
                            ? URL.createObjectURL(watch('image'))
                            : watch('image')
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
                            Select Images
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

export default WorkoutCategoryUpdate;
