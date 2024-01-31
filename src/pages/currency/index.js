import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_CURRENCIES } from '@/graphql/currency';

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
    field: 'code',
    headerName: 'Currency Code',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.code}
        </Typography>
      );
    }
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'prefix',
    headerName: 'Currency Symbol',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.prefix}
        </Typography>
      );
    }
  },
  {
    flex: 0.3,
    minWidth: 250,
    field: 'updated_at',
    headerName: 'Created On',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.updated_at ? new Date(+row?.updated_at).toDateString() : 'No date'}
        </Typography>
      );
    }
  }
];

const Currency = () => {
  const router = useRouter();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCurrencies = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_CURRENCIES
      });
      if (data?.currencies) {
        setCurrencies(data?.currencies);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((currency) =>
      currency?.code?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [currencies, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/currency/add')}
            placeholder="Search Currency"
            buttonLabel="Add Currency"
            title="Currency"
          />
          <DataGrid
            autoHeight
            rows={filteredCurrencies}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/currency/${item?.id}`);
            }}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            columns={columns}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Currency;
