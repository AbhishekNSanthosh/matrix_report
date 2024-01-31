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
import { generalApoloClient } from '@/config/apolloClient';
import {
  ADD_WORKOUT_PROGRAMS,
  DELETE_WORKOUT_PROGRAMS,
  GET_ONE_WORKOUT_PROGRAMS,
  UPDATE_WORKOUT_PROGRAMS
} from '@/graphql/Workout/Programmes';
import { uploadSingleFile } from '@/utils/uploadSingleFile';
import { useEffect, useState } from 'react';
import CircularLoader from '@/view/CircularLoader';

const defaultValues = {
  title: '',
  description: '',
  image: '',
  video: ''
};

const schema = yup.object().shape({
  title: yup.string().required('Please enter a title'),
  description: yup.string().required('Please enter a description'),
  image: yup.mixed().nullable(),
  video: yup.mixed().nullable()
});

const AddPrograms = () => {
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

  const fetchProgrames = async () => {
    setLoading(true);
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_WORKOUT_PROGRAMS,
        variables: { workout_program_details: { id: router?.query?.id } }
      });

      if (data.workoutProgram) {
        setValue('title', data?.workoutProgram?.title);
        setValue('description', data?.workoutProgram?.description);
        setValue('image', { uploaded_url: data?.workoutProgram?.image, uploaded: true });
        setValue('video', { uploaded_url: data?.workoutProgram?.video, uploaded: true });
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      fetchProgrames();
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

    let workout_program_details = {
      title: params?.title,
      description: params?.description,
      image: uploadedFilePath?.path,
      video: uploadedVideoPath?.path
    };

    if (router?.query?.id) {
      workout_program_details.id = router?.query?.id;
    }
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: router?.query?.id ? UPDATE_WORKOUT_PROGRAMS : ADD_WORKOUT_PROGRAMS,
        variables: {
          workout_program_details: workout_program_details
        }
      });
      if (data?.updateWorkoutProgram) {
        toast.success('Programme Updated!');
        router.replace(`/workout/programmes/${data?.updateWorkoutProgram?.id}`);
      }
      if (data?.createWorkoutProgram) {
        toast.success('New Programme Created!');
        router.replace(`/workout/programmes/${data?.createWorkoutProgram?.id}`);
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
        mutation: DELETE_WORKOUT_PROGRAMS,
        variables: { id: router.query?.id }
      });
      if (data?.deleteWorkoutProgram) {
        toast.success('Programme Deleted!');
        router.push('/workout/programmes');
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
            title={router?.query?.id ? getValues('title') : 'Create New Workout Programme'}
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
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1. Workout Programmes Details
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
                          error={Boolean(errors.title)}
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

                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                        {watch('video') ? (
                          watch('video') instanceof Blob ? (
                            <source src={URL.createObjectURL(watch('video'))} type="video/mp4" />
                          ) : (
                            <p>Invalid video format</p>
                          )
                        ) : (
                          <p>No video selected</p>
                        )}
                        Your browser does not support the video tag.
                      </video>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: 1
                        }}>
                        <IconButton
                          onClick={() => setValue('video', '')}
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                          size="small">
                          <Close />
                        </IconButton>
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

export default AddPrograms;
