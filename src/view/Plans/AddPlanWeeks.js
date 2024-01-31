import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Close from 'mdi-material-ui/Close';
import { generalApoloClient } from 'src/config/apolloClient';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { Divider, InputLabel, MenuItem, Select } from '@mui/material';
import { useRouter } from 'next/router';
import { ADD_WEEK } from '@/graphql/workout-plan';

const schema = yup.object().shape({
  week_days: yup.array().required('please select days')
});

const defaultValues = {
  week_days: []
};

const DAYS = [
  { day_no: 1, day: 'Sunday' },
  { day_no: 2, day: 'Monday' },
  { day_no: 3, day: 'Tuesday' },
  { day_no: 4, day: 'Wednesday' },
  { day_no: 5, day: 'Thursday' },
  { day_no: 6, day: 'Friday' },
  { day_no: 7, day: 'Saturday' }
];

const AddWeek = (props) => {
  const { open, onClose, planId } = props;

  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = async (params) => {
    let week_days = params?.week_days?.map((day) => day);

    try {
      let { data } = await generalApoloClient.mutate({
        mutation: ADD_WEEK,
        variables: {
          workout_plan_option_id: planId,
          week_days: week_days
        }
      });

      if (data?.createWPOWeek) {
        toast.success('Week And Days Added!');
        handleClose();
        const url = {
          pathname: router.pathname,
          query: router.query
        };
        router.replace(url, undefined, { shallow: true, scroll: true });
        // router.push(`/workout-plan/${planId}`);
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

  const handleClose = () => {
    onClose(false);
    reset(defaultValues);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}>
      <Header>
        <Typography variant="h6">Add Week</Typography>
        <Close fontSize="small" onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Divider />
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <InputLabel id="week_days_label">Days</InputLabel>
            <Controller
              name="week_days"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  multiple
                  onChange={onChange}
                  value={value}
                  label="days"
                  placeholder="Days"
                  error={Boolean(errors?.days)}
                  labelId="week_days_label">
                  {DAYS?.map((day) => (
                    <MenuItem key={day?.day_no} value={day?.day_no}>
                      {day?.day}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.week_days && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors?.week_days?.message}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <LoadingButton
              loading={isSubmitting}
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 2 }}>
              Submit
            </LoadingButton>
            <LoadingButton size="large" variant="outlined" onClick={handleClose}>
              Cancel
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddWeek;

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));
