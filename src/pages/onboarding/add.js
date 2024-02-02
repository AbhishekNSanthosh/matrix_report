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

import { useRouter } from 'next/router';

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

    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { question: '', type: '', options: '', order: '', status: '', translations: {} },
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async () => {
    toast.success('New Onboarding Created!');
    router.push('/onboarding');

    return true;
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Create Onboarding" titleTypographyProps={{ variant: 'h6' }} />
          <Divider sx={{ m: 0 }} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Onboarding
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="Name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Unique Name"
                          onChange={onChange}
                          placeholder="Unique Name"
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
                      name="company_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Company Name"
                          onChange={onChange}
                          placeholder="Company Name"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.company_name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.company_name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="tax_number"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Tax Number"
                          onChange={onChange}
                          placeholder="Tax Number"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.company_name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.company_name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="branch_name"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Branch Name"
                          onChange={onChange}
                          placeholder="Branch Number"
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.branch_name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.branch_name?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <FormControl fullWidth>
                    <Controller
                      name="Address"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="Address"
                          onChange={onChange}
                          placeholder="Address"
                          error={Boolean(errors?.code)}
                          multiline
                        />
                      )}
                    />
                    {errors?.Address && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.question?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="category">Business Category</InputLabel>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          onChange={onChange}
                          value={value}
                          label="Business Category"
                          placeholder="Business Category"
                          error={Boolean(errors.status)}
                          labelId="category">
                          {/* <MenuItem value={'checkbox'}>Yes/No</MenuItem> */}
                          <MenuItem value="Category1">Category 1</MenuItem>
                          <MenuItem value="Category2">Category 2</MenuItem>
                          <MenuItem value="Category3">Category 3</MenuItem>
                          <MenuItem value="Category4">Category 4</MenuItem>
                        </Select>
                      )}
                    />

                    {errors.category && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.category.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Controller
                      name="otp"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value}
                          label="OTP"
                          onChange={onChange}
                          placeholder="OTP here..."
                          error={Boolean(errors?.code)}
                        />
                      )}
                    />
                    {errors?.otp && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors?.otp?.message}
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

export default AddQuestionnaires;
