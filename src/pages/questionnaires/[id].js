import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import { Delete } from 'mdi-material-ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { LoadingButton } from '@mui/lab';
import { generalApoloClient } from '@/config/apolloClient';
import CircularLoader from '@/view/CircularLoader';
import NoDataFound from '@/view/NoDataFound';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';
import {
  DELETE_QUESTIONNAIRES,
  GET_ONE_QUESTIONNAIRES,
  UPDATE_QUESTIONNAIRES
} from '@/graphql/Questionnaires';

const schema = yup.object().shape({
  question: yup.string().required('Please enter question'),
  type: yup.string().required('Please enter a type'),
  status: yup.boolean().required('Please select status')
});

const UpdateQuestionnaire = ({ languages = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,

    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { question: '', type: '', options: '', order: '', status: '', translations: {} },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const fetchQuestionnaire = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ONE_QUESTIONNAIRES,
        variables: { questionnaire: { id: router.query?.id }, language: 'en' }
      });

      if (data?.questionnaire) {
        setValue('question', data?.questionnaire?.question);
        setValue('type', data?.questionnaire?.type);
        setValue('options', data?.questionnaire?.options);
        setValue('order', data?.questionnaire?.order);
        setValue('status', data?.questionnaire?.status);

        languages.map((lang) => {
          let foundOne = data?.questionnaire?.translations?.find(
            (trans) => trans?.language_id === lang?.id
          );

          if (foundOne) {
            setValue(`translations[${lang?.id}]`, foundOne?.name);
          }
        });
      } else {
        setNoData(true);
      }

      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaire();
  }, []);

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
        mutation: UPDATE_QUESTIONNAIRES,
        variables: {
          questionnaire: {
            id: router.query?.id,
            question: params?.question,
            type: params?.type,
            options: params?.options,
            order: +params?.order,
            status: params?.status
          },
          translations: translations || []
        }
      });

      if (data?.updateQuestionnaire) {
        toast.success('Questionnaries Updated!');
        router.push('/questionnaires');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      } else if (errorData?.deleted) {
        setError('status', { message: errorData.deleted });
      }
    }
  };
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
        mutation: DELETE_QUESTIONNAIRES,
        variables: {
          id: router.query?.id,
          translations: translations || [],
          deleted: true
        }
      });

      if (data?.deleteQuestionnaire) {
        toast.success('Questionnaire Deleted!');
        router.push('/questionnaires');
      }
    } catch (error) {
      let errorData = validateGraphQlError(error);
      if (errorData?.name) {
        setError('name', { message: errorData.name });
      } else if (errorData?.deleted) {
        setError('status', { message: errorData.deleted });
      }
    }
  };

  if (loading) {
    return <CircularLoader />;
  }

  if (noData) {
    return <NoDataFound />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Update Questionnaires"
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
                          placeholder="question Order here..."
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
                          labelId="status"
                          InputLabelProps={{
                            shrink: true
                          }}>
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Disable</MenuItem>
                        </Select>
                      )}
                    />
                    {errors?.status && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.status?.message}
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

export default UpdateQuestionnaire;
