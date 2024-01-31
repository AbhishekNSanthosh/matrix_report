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
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { Delete } from 'mdi-material-ui';
import { useState } from 'react';
import { useEffect } from 'react';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import { DELETE_MUSCLEGROUP, GET_ONE_MUSCLEGROUP, UPDATE_MUSCLEGROUP } from '@/graphql/musclegroup';
import { uploadSingleFile } from '@/utils/uploadSingleFile';
import AttachmentUpload from '@/components/AttachmentUpload';

const defaultValues = {
  name: '',
  page_id: '',
  image: ''
};
const schema = yup.object().shape({
  name: yup.string().required('please enter a name'),
  description: yup.string().required('please enter a description'),
  image: yup.mixed().nullable()
});

const BannersUpdate = () => {
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
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchDetails = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_MUSCLEGROUP,
        variables: { muscleGroupDetails: { id: router.query?.id } }
      });

      if (data.muscleGroup) {
        setValue('name', data?.muscleGroup?.name);
        setValue('description', data?.muscleGroup?.description);
        setValue('image', { uploaded_url: data?.muscleGroup?.image, uploaded: true });
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
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
        mutation: UPDATE_MUSCLEGROUP,
        variables: {
          muscleGroupDetails: {
            id: router.query?.id,
            name: params?.name,
            description: params?.description,
            image: uploadedFilePath?.path
          }
        }
      });

      if (data) {
        toast.success('Muscle Group Updated!');
        router.replace('/muscle-group');
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
        mutation: DELETE_MUSCLEGROUP,
        variables: { id: router.query?.id }
      });
      if (data?.deleteMuscleGroup) {
        toast.success('Muscle Group Deleted!');
        router.push('/muscle-group');
      }
    } catch (error) {
      validateGraphQlError(error);
    }
  };

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Grid container spacing={3}>
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
                    1. Muscle Group Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Name"
                          onChange={onChange}
                          placeholder="Enter muscle group name"
                          error={Boolean(errors?.name)}
                        />
                      )}
                    />
                    {errors.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.name?.message}
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
                          placeholder="Write a short description about muscle group"
                          error={Boolean(errors?.description)}
                          multiline
                        />
                      )}
                    />
                    {errors.description && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.description?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <AttachmentUpload
                    image={watch('image')}
                    updateImage={(img) => setValue('image', img)}
                    error={errors?.image?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mr: 3 }}>
                    Update
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

BannersUpdate.acl = {
  action: 'manage',
  subject: 'banners-update'
};

export default BannersUpdate;
