import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Pagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_ALL_CITIES } from '@/graphql/city';
import TableHeader from '@/view/TableHeader';
import { useDebounce } from 'use-debounce';
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
    flex: 0.22,
    minWidth: 180,
    field: 'name',
    headerName: 'City Name',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.name}
      </Typography>
    )
  },
  {
    flex: 0.22,
    minWidth: 180,
    field: 'code',
    headerName: 'Code',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.code}
      </Typography>
    )
  },
  {
    flex: 0.22,
    minWidth: 180,
    field: 'country.name',
    headerName: 'Country',
    valueGetter: ({ row }) => row?.country?.name,
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.country?.name}
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

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchText] = useDebounce(search, 500);
  const [totalPages, setTotalPages] = useState(0);

  const router = useRouter();

  const fetchCities = async () => {
    setLoading(true);

    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_CITIES,
        variables: {
          size: 10,
          page: +router.query?.page,
          search: searchText
        }
      });

      if (data?.cities?.data) {
        setCities(data?.cities?.data);
        setTotalPages(data?.cities?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [router?.query, searchText]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/city/add')}
            placeholder="Search City"
            buttonLabel="Add City"
            title="Cities"
          />
          <DataGrid
            autoHeight
            rows={cities}
            loading={loading}
            pagination={false}
            columns={columns}
            onCellClick={(item) => {
              router.push(`/city/${item?.id}`);
            }}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-row': { cursor: 'pointer' }
            }}
            disableColumnFilter
            slots={{
              pagination: () => (
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

Cities.acl = {
  action: 'manage',
  subject: 'cities'
};

export default Cities;
