// React & Next
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDebounce } from 'use-debounce';

// utils , graphql and others
import toast from 'react-hot-toast';
import { generalApoloClient } from '@/config/apolloClient';
import { GET_ALL_ORDERS } from '@/graphql/orders';

// material ui and emotion
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Pagination, Typography } from '@mui/material';
import TableHeader from '@/view/TableHeader';
import Chip from '@/@core/components/mui/chip';

const columns = [
  {
    flex: 0.01,
    minWidth: 100,
    field: 'id',
    headerName: 'No',
    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
  },

  {
    flex: 0.03,
    minWidth: 200,
    field: 'order_no',
    headerName: 'Invoice No',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.order_no}
        </Typography>
      );
    }
  },
  {
    flex: 0.03,
    minWidth: 200,
    field: 'description',
    headerName: 'Description',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.description == 'Null'}
        </Typography>
      );
    }
  },
  {
    flex: 0.02,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <Chip
          skin="light"
          size="small"
          label={row?.status === 1 ? 'Success' : 'Failed'}
          color={row?.status === 1 ? 'success' : 'error'}
          sx={{
            textTransform: 'capitalize',
            '& .MuiChip-label': { lineHeight: '18px' }
          }}
        />
      );
    }
  },
  {
    flex: 0.03,
    minWidth: 200,
    field: 'Time',
    headerName: 'Time',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.created_at ? new Date(+row.created_at).toLocaleTimeString() : 'No time'}
        </Typography>
      );
    }
  },

  {
    flex: 0.03,
    minWidth: 200,
    field: 'created_at',
    headerName: 'Date',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.created_at ? new Date(+row.created_at).toDateString() : 'No date'}
        </Typography>
      );
    }
  }
];
const Order = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [searchText] = useDebounce(search, 500);

  const fetchOrders = async () => {
    setLoading(true);
    let payload = {};
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_ORDERS,
        variables: {
          order_details: payload,
          page: +router?.query?.page || 1,
          size: 10,
          search: searchText
        }
      });
      if (data?.orders?.data) {
        setOrders(data?.orders?.data);
        setTotalPages(data?.orders?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [router?.query, searchText]);

  // const handleChipClick = (value) => {
  //   if (value) {
  //     router.query.type = value;
  //   } else {
  //     delete router.query.type;
  //   }

  //   const url = {
  //     pathname: router.pathname,
  //     query: router.query
  //   };
  //   router.replace(url, undefined, { shallow: true });
  // };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            placeholder="Search"
            title="Zatca Logs">
            {/* <Box sx={{ display: 'flex', gap: '8px' }}>
              <CustomChipButton
                color={!router?.query?.type ? undefined : 'primary'}
                label="All"
                sx={{
                  color: !router?.query?.type ? 'orange' : 'white'
                }}
                onClick={() => handleChipClick('')}
              />
              <CustomChipButton
                label="Cancelled"
                color={router?.query?.type === '1' ? undefined : 'primary'}
                sx={{
                  color: router?.query?.type === '1' ? 'orange' : 'white'
                }}
                onClick={() => handleChipClick('1')}
              />
              <CustomChipButton
                label="On Trial"
                color={router?.query?.type === '2' ? undefined : 'primary'}
                sx={{
                  color: router?.query?.type === '2' ? 'orange' : 'white'
                }}
                onClick={() => handleChipClick('2')}
              />
            </Box> */}
          </TableHeader>
          <DataGrid
            autoHeight
            rows={orders}
            loading={loading}
            pagination={false}
            columns={columns}
            disableSelectionOnClick
            // onCellClick={(item) => {
            //   router.push(`/za/${item?.id}`);
            // }}
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

// Coaches.acl = {
//   action: 'manage',
//   subject: 'categories'
// };

export default Order;

// const CustomChipButton = styled(Chip)(({ theme }) => ({
//   display: 'flex',
//   borderRadius: theme.spacing(8),
//   cursor: 'pointer',
//   alignItems: 'center',
//   justifyContent: 'center',
//   margin: theme.spacing(0),
//   transition: 'box-shadow .25s ease',
//   px: theme.spacing(6),
//   py: theme.spacing(10),
//   textTransform: 'uppercase',
//   border: '1px solid #EE7623',
//   letterSpacing: '1px',
//   fontWeight: 'bold',
//   padding: '0.5625rem'
// }));
