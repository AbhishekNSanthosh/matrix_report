import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
//import CustomChip from 'src/@core/components/mui/chip';
import { GET_ALL_PROMOTIONS } from '@/graphql/Promotions';

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
    flex: 0.2,
    minWidth: 180,
    field: 'start_date',
    headerName: 'Start Date',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.start_date ? new Date(+row?.start_date).toDateString() : 'No date'}
        </Typography>
      );
    }
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: 'end_date',
    headerName: 'End Date',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.end_date ? new Date(+row?.end_date).toDateString() : 'No date'}
        </Typography>
      );
    }
  },

  {
    flex: 0.2,
    minWidth: 180,
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

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const router = useRouter();

  const fetchPromotions = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_PROMOTIONS
      });
      if (data?.promotions?.data) {
        setPromotions(data?.promotions?.data);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const filteredPromotion = useMemo(() => {
    const searchLowerCase = search?.toLowerCase();
    return promotions.filter((promotion) => {
      const nameLowerCase = promotion?.name?.toLowerCase();
      const startDate = promotion?.start_date
        ? new Date(+promotion?.start_date).toDateString()
        : '';
      const endDate = promotion?.end_date ? new Date(+promotion?.end_date).toDateString() : '';

      return (
        nameLowerCase.includes(searchLowerCase) ||
        startDate.includes(searchLowerCase) ||
        endDate.includes(searchLowerCase)
      );
    });
  }, [promotions, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/promotions/add')}
            placeholder="Search Promotion"
            buttonLabel="Add Promotion"
            title="Promotions"
          />
          <DataGrid
            autoHeight
            rows={filteredPromotion}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/promotions/${item?.id}`);
            }}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            columns={columns}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Promotions;
