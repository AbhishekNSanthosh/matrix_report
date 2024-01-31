import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@mui/material';

import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';
import { ADD_PROMOTION } from '@/graphql/Promotions';
import { Close, TrayArrowUp } from 'mdi-material-ui';
//import DropzoneWrapper from '@/@core/styles/libs/react-dropzone';
import { useDropzone } from 'react-dropzone';

import DatePicker from '@/components/DatePicker';
import { LoadingButton } from '@mui/lab';

import DropzoneWrapper from '@/@core/styles/libs/react-dropzone';

const schema = yup.object().shape({
  name: yup.string().required('Please enter name'),
  description: yup.string().required('Please enter a description'),
  //banner_image: yup.string().required('Please select a image'),
  //banner_image: yup.mixed().nullable(),
  type: yup.string().required('Please enter a type'),
  start_date: yup.string().required('Please select a date'),
  end_date: yup.string().required('Please select a date'),
  url: yup.string().required('Please enter url')
});

const AddPromotion = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      banner_image: '',
      type: '',
      start_date: '',
      url: '',
      end_date: '',
      translations: {}
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
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
        mutation: ADD_PROMOTION,
        variables: {
          promotion_details: {
            name: params?.name,
            description: params?.description,
            banner_image: params?.banner_image,
            url: params?.url,
            start_date: params?.start_date,
            end_date: params?.end_date,
            type: params?.type
          },
          translations: translations || []
        }
      });
      if (data?.createPromotion) {
        toast.success('New Promotion Created!');
        router.push('/promotions');
      }
      return true;
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.code) {
        setError('code', { message: errorData.code });
      }
      return false;
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
        setValue('banner_image', acceptedFiles?.[0]);
      }
    },
    onDropRejected: () => {
      toast.error('Please add file size less than 5 MB', {
        duration: 2000
      });
    }
  });

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Create Promotion" titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Promotion
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                          placeholder="Name"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
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
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.description && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.description?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="type"
                          onChange={onChange}
                          placeholder="type"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />

                    {errors.type && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.type.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="url"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="URL"
                          onChange={onChange}
                          placeholder="URL"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.url && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.url?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="start_date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          showTimeSelect={false}
                          placeholderText={'Start Date'}
                          label={'Start Date'}
                          onChange={onChange}
                          value={value}
                          selected={value}
                          error={Boolean(errors?.start_date)}
                          //inputStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                        />
                      )}
                    />
                    {errors?.start_date && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.start_date?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="end_date"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          showTimeSelect={false}
                          placeholderText={'End Date'}
                          label={'End Date'}
                          onChange={onChange}
                          value={value}
                          selected={value}
                          error={Boolean(errors?.end_date)}
                          //inputStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                        />
                      )}
                    />
                    {errors?.end_date && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.end_date?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {watch('banner_image') ? (
                    <Box sx={{ position: 'relative', width: 100 * (5 / 2), height: 100 }}>
                      <img
                        width={'100%'}
                        height={'100%'}
                        style={{ borderRadius: 5 }}
                        alt={'banner_image'}
                        src={
                          watch('banner_image')?.path
                            ? URL.createObjectURL(watch('banner_image'))
                            : watch('banner_image')
                        }
                      />
                      <Box
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                        onClick={() => setValue('banner_image', '')}>
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
                            Select Banner Image
                          </Typography>
                        </Box>
                      </DropzoneWrapper>

                      {errors?.banner_image && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors?.banner_image?.message}
                        </FormHelperText>
                      )}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sx={{ mt: 5 }}>
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
  try {
    const [languageRes] = await Promise.all([
      generalApoloClient.query({
        query: GET_ALL_LANGUAGES
      })
    ]);

    return {
      props: {
        languages: languageRes?.data?.languages || []
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        languages: []
      }
    };
  }
}

export default AddPromotion;
