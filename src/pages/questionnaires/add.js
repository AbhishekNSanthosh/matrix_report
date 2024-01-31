import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
import { GET_ALL_LANGUAGES } from '@/graphql/languages';
import { ADD_QUESTIONNAIRES } from '@/graphql/Questionnaires';

const schema = yup.object().shape({
  question: yup.string().required('Please enter question'),
  options: yup.string().when('is_draft', {
    is: (options) => options === 'radio',
    then: yup.string().required('Please enter options split with coma')
  }),
  type: yup.string().required('Please enter a type'),
  status: yup.boolean().required('Please select status')
});

const AddQuestionnaires = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { question: '', type: '', options: '', order: '', status: '', translations: {} },
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
        mutation: ADD_QUESTIONNAIRES,
        variables: {
          questionnaire: {
            question: params?.question,
            type: params?.type,
            options: params?.options,
            order: +params?.order,
            status: params?.status
          },
          translations: translations || []
        }
      });
      if (data?.createQuestionnaire) {
        toast.success('New Questionnaire Created!');
        router.push('/questionnaires');
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Create Questionnaires" titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Questionnaires
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <FormControl fullWidth>
                    <Controller
                      name="question"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Question"
                          onChange={onChange}
                          placeholder="Question"
                          error={Boolean(errors?.code)}
                          multiline
                        />
                      )}
                    />
                    {errors?.question && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.question?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="status">Type</InputLabel>
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Type"
                          placeholder="Type"
                          error={Boolean(errors.status)}
                          labelId="type">
                          {/* <MenuItem value={'checkbox'}>Yes/No</MenuItem> */}
                          <MenuItem value={'text'}>Text Field</MenuItem>
                          <MenuItem value={'radio'}>Radio</MenuItem>
                        </Select>
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
                      name="options"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Option"
                          onChange={onChange}
                          placeholder="Options here with split comma(,)"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.options && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.options?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="order"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Order"
                          onChange={onChange}
                          placeholder="question order here..."
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.order && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.order?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="status">Status</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Status"
                          placeholder="Status"
                          error={Boolean(errors.status)}
                          labelId="status">
                          <MenuItem value={1}>Active</MenuItem>
                          <MenuItem value={0}>Disable</MenuItem>
                        </Select>
                      )}
                    />

                    {errors.status && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.status.message}
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

export default AddQuestionnaires;
