import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography, Pagination } from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';

import { useDebounce } from 'use-debounce';
import { GET_ALL_WORKOUT_CATEGORIES } from '@/graphql/Workout/Category';

const WorkoutCategories = () => {
  const router = useRouter();

  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchText] = useDebounce(search, 500);
  const [totalPages, setTotalPages] = useState(0);

  const fetchWorkoutCategories = async () => {
    let payload = {};

    if (searchText) {
      payload.search = searchText;
    }
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_WORKOUT_CATEGORIES,
        variables: payload
      });

      if (data?.workoutCategories?.data) {
        setWorkoutCategories(data?.workoutCategories?.data);
        setTotalPages(data?.workoutCategories?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutCategories();
  }, [router.query, searchText]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/workout/categories/add')}
            placeholder="Search "
            buttonLabel="Add category"
            title="Workout Categories"
          />
          <DataGrid
            autoHeight
            rows={workoutCategories}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/workout/categories/${item?.id}`);
            }}
            columns={[
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
                headerName: 'Name',
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
                field: 'description',
                headerName: 'Description',
                renderCell: ({ row }) => {
                  return (
                    <Typography noWrap variant="body2">
                      {row?.description}
                    </Typography>
                  );
                }
              },
              {
                flex: 0.16,
                minWidth: 150,
                field: 'image',
                headerName: 'Image',
                renderCell: ({ row }) => (
                  <img
                    src={row?.image}
                    alt={`${row?.name}-image`}
                    style={{ width: 60, height: 40, borderRadius: '5px' }}
                  />
                )
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
            ]}
            components={{
              Pagination: () => (
                <Pagination
                  color="primary"
                  count={totalPages}
                  page={+router.query?.page || 1}
                  onChange={(e, page) => {
                    router.query.page = page;
                    const url = {
                      pathname: router.pathname,
                      query: router.query
                    };
                    router.replace(url, undefined, { shallow: true, scroll: true });
                  }}
                />
              )
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default WorkoutCategories;
