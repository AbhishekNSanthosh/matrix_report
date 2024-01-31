import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Pagination,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { DotsVertical, EyeOutline, PencilOutline } from 'mdi-material-ui';
import Link from 'next/link';
import styled from '@emotion/styled';
import { LIST_ALL_WORKOUT_PLAN } from '@/graphql/workout-plan';
import { useDebounce } from 'use-debounce';
import { validateGraphQlError } from '@/utils/ValidateError';

const RowOptions = ({ id }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        paperProps={{ style: { minWidth: '8rem' } }}>
        <MenuItem sx={{ p: 0 }}>
          <Link href={`/workout-plan/${id}`} passHref style={{ textDecorationLine: 'none' }}>
            <MenuItemContent>
              <ListItemIcon>
                <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              </ListItemIcon>
              View
            </MenuItemContent>
          </Link>
        </MenuItem>
        <MenuItem sx={{ p: 0 }}>
          <Link href={`/workout-plan/add?id=${id}`} passHref style={{ textDecorationLine: 'none' }}>
            <MenuItemContent>
              <PencilOutline fontSize="small" sx={{ mr: 2 }} />
              Edit
            </MenuItemContent>
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

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
    minWidth: 250,
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
  },

  {
    flex: 0.2,
    minWidth: 70,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
];

const WorkOutPlans = () => {
  const [workOutPlans, setWorkOutPlans] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchText] = useDebounce(search, 500);

  const router = useRouter();

  const fetchWorkOutPlans = async () => {
    setLoading(true);
    let payload = {};
    if (router.query.type) {
      payload.type = router.query.type;
    }
    try {
      let { data } = await generalApoloClient.query({
        query: LIST_ALL_WORKOUT_PLAN,
        variables: {
          workout_plan_option_details: payload,
          page: +router?.query?.page || 1,
          size: 10,
          search: searchText
        }
      });

      if (data?.workoutPlanOptions?.data) {
        setWorkOutPlans(data?.workoutPlanOptions?.data);
        setTotalPages(data?.workoutPlanOptions?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOutPlans();
  }, [router?.query, searchText]);

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
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/workout-plan/add')}
            placeholder="Search plan "
            buttonLabel="Add Plan/Package"
            // title="workout Plans"
          >
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <CustomChipButton
                variant={router?.query?.type === '' ? 'outlined' : 'filled'}
                // color={router?.query?.type === 'all' ? 'transparent' : 'primary'}
                label="All"
                // sx={{
                //   color: !router?.query?.type ? 'orange' : 'white'
                // }}
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

export default WorkOutPlans;

const MenuItemContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  padding: theme.spacing(1, 3),
  color: theme.palette.text.primary
}));

const CustomChipButton = styled(Chip)(() => ({
  transition: 'box-shadow .25s ease',
  textTransform: 'uppercase',
  fontWeight: 'bold'
}));
