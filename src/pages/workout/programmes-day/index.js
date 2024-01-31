import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_WORKOUT_PROGRAMS_DAY } from '@/graphql/Workout/ProgrammesDay';

const columns = [
  {
    flex: 0.1,
    minWidth: 50,
    field: 'id',
    headerName: 'Sl No',

    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'workout_programs.title',
    headerName: 'Title',
    valueGetter: ({ row }) => row?.workout_programs?.title,
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.workout_programs?.title}
      </Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'day_no',
    headerName: 'Days',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.day_no}
        </Typography>
      );
    }
  },

  {
    flex: 0.3,
    minWidth: 250,
    field: 'updated_at',
    headerName: 'Updated On',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.updated_at ? new Date(+row?.updated_at).toDateString() : 'No date'}
        </Typography>
      );
    }
  }
];

const ProgrammesDay = () => {
  const router = useRouter();

  const [programmesDay, setProgrammesDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProgrammesDay = async () => {
    setLoading(true);
    let payload = {};

    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_WORKOUT_PROGRAMS_DAY,
        variables: payload
      });

      if (data?.workoutProgramsDays) {
        setProgrammesDay(data?.workoutProgramsDays);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammesDay();
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/workout/programmes-day/add')}
            placeholder="Search ProgrammesDay"
            buttonLabel="Add ProgrammesDay"
            title="ProgrammesDay"
          />
          <DataGrid
            autoHeight
            rows={programmesDay}
            loading={loading}
            pagination={false}
            columns={columns}
            onCellClick={(item) => {
              router.push(`/workout/programmes-day/${item?.id}`);
            }}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-row': { cursor: 'pointer' }
            }}
            disableColumnFilter
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProgrammesDay;
