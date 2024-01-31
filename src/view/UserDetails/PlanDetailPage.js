import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Card, Chip, Grid, Pagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';

import styled from '@emotion/styled';

import { validateGraphQlError } from '@/utils/ValidateError';
import { LIST_ALL_PURCHASED_WORKOUT_OPTIONS } from '@/graphql/PurchasedWorkoutOptions';

const columns = [
  {
    flex: 0.04,
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
    flex: 0.25,
    minWidth: 150,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.name}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'type',
    headerName: 'Type',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2" textTransform={'capitalize'}>
        {row?.type}
      </Typography>
    )
  },
  {
    flex: 0.18,
    minWidth: 180,
    field: 'level',
    headerName: 'Level',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2" textTransform={'capitalize'}>
        {row?.level}
      </Typography>
    )
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'price',
    headerName: 'Price',
    renderCell: ({ row }) => (
      <Typography noWrap variant="body2">
        {row?.currency?.code} {row.price}
      </Typography>
    )
  }
];

const PlanDetailPage = () => {
  const [workOutPlans, setWorkOutPlans] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchWorkOutPlans = async () => {
    setLoading(true);
    let payload = { user_id: router.query.id };
    if (router.query.type) {
      payload.type = router.query.type;
    }
    try {
      let { data } = await generalApoloClient.query({
        query: LIST_ALL_PURCHASED_WORKOUT_OPTIONS,
        variables: {
          purchased_workout_option_details: payload,
          page: +router?.query?.page || 1,
          size: 10
        }
      });

      if (data?.purchasedWorkoutOptions?.data) {
        setWorkOutPlans(data?.purchasedWorkoutOptions?.data);
        setTotalPages(data?.purchasedWorkoutOptions?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOutPlans();
  }, [router?.query]);

  const onClickType = (type) => {
    router.query.type = type;
    const url = {
      pathname: router.pathname,
      query: router.query
    };
    router.replace(url, undefined, { shallow: true, scroll: true });
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader>
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <Typography variant="h6" sx={{ textAlign: 'left', flex: '1' }}>
                Plans/Packages
              </Typography>
              <CustomChipButton
                variant={router?.query?.type === '' ? 'outlined' : 'filled'}
                label="All"
                onClick={() => onClickType('')}
              />
              <CustomChipButton
                variant={router?.query?.type === 'plan' ? 'outlined' : 'filled'}
                label="Plan"
                onClick={() => onClickType('plan')}
              />
              <CustomChipButton
                variant={router?.query?.type === 'package' ? 'outlined' : 'filled'}
                label="Package"
                onClick={() => onClickType('package')}
              />
            </Box>
          </TableHeader>
          <DataGrid
            autoHeight
            rows={workOutPlans}
            loading={loading}
            pagination={false}
            columns={columns}
            disableSelectionOnClick
            onCellClick={(params) => {
              const orderId = params?.row?.order_id;
              if (orderId) {
                router.push(`/orders/${orderId}`);
              }
            }}
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

export default PlanDetailPage;

const CustomChipButton = styled(Chip)(() => ({
  transition: 'box-shadow .25s ease',
  textTransform: 'uppercase',
  fontWeight: 'bold'
}));
