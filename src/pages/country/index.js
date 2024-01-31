import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Pagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_ALL_COUNTRY } from '@/graphql/country';
import TableHeader from '@/view/TableHeader';
import { useDebounce } from 'use-debounce';
import { validateGraphQlError } from '@/utils/ValidateError';

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
    headerName: 'Country Name',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.name}
      </Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'code',
    headerName: 'Code',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.code}
      </Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'updated_at',
    headerName: 'Updated On',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row.updated_at ? new Date(+row.updated_at).toDateString() : 'No date'}
      </Typography>
    )
  }
];

const Countries = () => {
  const router = useRouter();

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchText] = useDebounce(search, 500);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCountries = async () => {
    setLoading(true);

    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_COUNTRY,
        variables: {
          size: 10,
          page: +router.query?.page,
          search: searchText
        }
      });

      if (data?.countries?.data) {
        setCountries(data?.countries?.data);
        setTotalPages(data?.countries?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [router?.query, searchText]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/country/add')}
            placeholder="Search Country"
            buttonLabel="Add Country"
            title="Countries"
          />
          <DataGrid
            autoHeight
            rows={countries}
            loading={loading}
            pagination={false}
            columns={columns}
            onCellClick={(item) => {
              router.push(`/country/${item?.id}`);
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
Countries.acl = {
  action: 'manage',
  subject: 'countries'
};

export default Countries;
