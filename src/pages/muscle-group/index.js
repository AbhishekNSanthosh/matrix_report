import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Pagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { useDebounce } from 'use-debounce';
import { GET_ALL_MUSCLEGROUP } from '@/graphql/musclegroup';
import { validateGraphQlError } from '@/utils/ValidateError';

const columns = [
  {
    flex: 0.12,
    minWidth: 50,
    field: 'id',
    headerName: 'No',
    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
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
    flex: 0.22,
    minWidth: 180,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.name}
      </Typography>
    )
  },
  {
    flex: 0.22,
    minWidth: 180,
    field: 'description',
    headerName: 'Description',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.description}
      </Typography>
    )
  },
  {
    flex: 0.22,
    minWidth: 180,
    field: 'updated_at',
    headerName: 'Updated On',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row.updated_at ? new Date(+row.updated_at).toDateString() : 'No date'}
      </Typography>
    )
  }
];

const Musclegroups = () => {
  const [musclegroups, setMusclegroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchText] = useDebounce(search, 500);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();

  const fetchMusclegroups = async () => {
    setLoading(true);

    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_MUSCLEGROUP,
        variables: {
          size: 10,
          page: +router.query?.page,
          search: searchText
        }
      });

      if (data?.muscleGroups?.data) {
        setMusclegroups(data?.muscleGroups?.data);
        setTotalPages(data?.muscleGroups?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusclegroups();
  }, [router?.query, searchText]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/muscle-group/add')}
            placeholder="Search "
            buttonLabel="Add Muscle Group"
            title="Muscle groups"
          />
          <DataGrid
            autoHeight
            rows={musclegroups}
            loading={loading}
            pagination={false}
            columns={columns}
            onCellClick={(item) => {
              router.push(`/muscle-group/${item?.id}`);
            }}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-row': { cursor: 'pointer' }
            }}
            disableColumnFilter
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

export default Musclegroups;
