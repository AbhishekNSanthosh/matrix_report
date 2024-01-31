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
  IconButton,
  InputAdornment
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
import { DELETE_EQUIPEMENT, GET_ONE_EQUIPEMENT, UPDATE_EQUIPEMENT } from '@/graphql/equipements';
import CircularLoader from '@/view/CircularLoader';
import { uploadSingleFile } from '@/utils/uploadSingleFile';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

const schema = yup.object().shape({
  name: yup.string().required('please enter a name'),
  description: yup.string().required('please enter a description'),
  image: yup.mixed().nullable()
});

const EquipmentDetails = ({ languages = [] }) => {
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
      image: '',
      translations: {}
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchPage = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_EQUIPEMENT,
        variables: { equipement_details: { id: router.query?.id } }
      });

      if (data.equipement) {
        setValue('name', data?.equipement?.name);
        setValue('description', data?.equipement?.description);
        setValue('image', { uploaded_url: data?.equipement?.image, uploaded: true });
        languages.map((lang) => {
          let foundOne = data?.equipement?.translations?.find(
            (trans) => trans?.language_id === lang?.id
          );
          if (foundOne) {
            setValue(`translations[${lang?.id}]`, foundOne?.name);
          }
        });
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
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
    let translations = [];

    if (params?.translations) {
      Object.keys(params?.translations).map((key) => {
        if (params?.translations[key]) {
          translations.push({ id: key, value: params?.translations[key] });
        }
      });
    }
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: UPDATE_EQUIPEMENT,
        variables: {
          equipementDetails: {
            id: router.query?.id,
            name: params?.name,
            description: params?.description,
            image: uploadedFilePath?.path
          },
          translations: translations || []
        }
      });

      if (data) {
        toast.success('Equipement Updated!');
        router.replace('/equipements');
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

  const onDelete = async (params) => {
    let translations = [];

    if (params?.translations) {
      Object.keys(params?.translations).map((key) => {
        if (params?.translations[key]) {
          translations.push({ id: key, value: params?.translations[key] });
        }
      });
    }
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: DELETE_EQUIPEMENT,
        variables: { id: router.query?.id }
      });
      if (data?.deleteEquipement) {
        toast.success('Equipement Deleted!');
        router.push('/equipements');
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
                    1. Equipement Details
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
                          label="Equipement Name"
                          onChange={onChange}
                          placeholder="Equipement Name"
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
                          placeholder="Write a short description about the equipment"
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
                <Grid item xs={12}>
                  <Divider sx={{ mt: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    2. Equipement Translations
                  </Typography>
                </Grid>
                {languages?.map((language) => (
                  <Grid key={language?.id} item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`translations[${language?.id}]`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label={language?.name}
                            InputLabelProps={{ style: { textTransform: 'capitalize' } }}
                            id="outlined-start-adornment"
                            onChange={onChange}
                            placeholder="Equipement Name"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment
                                  style={{ textTransform: 'uppercase' }}
                                  position="start">
                                  {language?.code}
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                ))}

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

export async function getServerSideProps() {
  let [languageRes] = await Promise.all([
    generalApoloClient.query({
      query: GET_ALL_LANGUAGES
    })
  ]);

  return {
    props: {
      languages: languageRes?.data?.languages || []
    }
  };
}

EquipmentDetails.acl = {
  action: 'manage',
  subject: 'banners-update'
};

export default EquipmentDetails;
