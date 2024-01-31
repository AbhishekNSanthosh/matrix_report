import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import { CREATE_USER_TYPE } from '@/graphql/usertype';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

const schema = yup.object().shape({
  name: yup.string().required('Please enter a user type')
});

const AddUserType = ({ languages = [] }) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { name: '', translations: {} },
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
        mutation: CREATE_USER_TYPE,
        variables: {
          name: params?.name,
          translations: translations || []
        }
      });
      if (data?.createUserType) {
        toast.success('New User type Created!');
        router.push('/usertype');
      }
      return true;
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      }
      return false;
    }
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Create New User Type" titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    1. User Type Details
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="User Type"
                          onChange={onChange}
                          placeholder="User Type"
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
                <Grid item xs={12}>
                  <Divider sx={{ mt: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    2. User Type Translations
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
                            placeholder="User Type"
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

                <Grid item xs={12} sx={{ mt: 4 }}>
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

AddUserType.acl = {
  action: 'manage',
  subject: 'add-usertype'
};

export default AddUserType;
