import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { ADD_LANGUAGE } from '@/graphql/languages';
import { generalApoloClient } from '@/config/apolloClient';

const schema = yup.object().shape({
  code: yup.string().required('Please enter a language code'),
  name: yup.string().required('Please enter a language name')
});

const AddLanguage = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { code: '', name: '' },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_LANGUAGE,
        variables: {
          code: params?.code,
          name: params?.name
        }
      });
      if (data?.createLanguage) {
        toast.success('New Language Created!');
        router.push('/language');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.code) {
        setError('code', { message: errorData.code });
      }
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Add Language" titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Language Name"
                          onChange={onChange}
                          placeholder="Language Name"
                          error={Boolean(errors?.name)}
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
                      name="code"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Language Code"
                          onChange={onChange}
                          placeholder="Language Code"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.code && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.code?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <LoadingButton
                    loading={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large">
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

export default AddLanguage;
