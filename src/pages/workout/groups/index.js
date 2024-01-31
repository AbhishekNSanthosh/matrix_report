import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_WORKOUT_GROUPS } from '@/graphql/Workout/Groups';

const columns = [
  {
    flex: 0.1,
    minWidth: 50,
    field: 'id',
    headerName: 'No',

    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'name',
    headerName: 'Group Name',

    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.name}
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
          {row.updated_at ? new Date(+row.updated_at).toDateString() : 'No date'}
        </Typography>
      );
    }
  }
];

const WorkOutGroups = () => {
  const router = useRouter();

  const [workOutGroups, setWorkOutGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchWorkoutGroup = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_WORKOUT_GROUPS
      });

      if (data?.workoutGroups) {
        setWorkOutGroups(data?.workoutGroups);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutGroup();
  }, []);

  const filteredWorkoutGroup = useMemo(() => {
    return workOutGroups.filter(
      (country) =>
        country.name?.toLowerCase().includes(search?.toLowerCase()) ||
        country.code?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [workOutGroups, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/workout/groups/add')}
            placeholder="Search group"
            buttonLabel="Add Groups"
            title="Workout Groups"
          />
          <DataGrid
            autoHeight
            rows={filteredWorkoutGroup}
            loading={loading}
            pagination={false}
            columns={columns}
            onCellClick={(item) => {
              router.push(`/workout/groups/${item?.id}`);
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

export default WorkOutGroups;
