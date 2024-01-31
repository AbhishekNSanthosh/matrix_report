import { Fragment, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Card, Grid, Pagination, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_USERS_COACHES } from '@/graphql/users';
import { useDebounce } from 'use-debounce';
import { validateGraphQlError } from '@/utils/ValidateError';

const columns = [
  {
    flex: 0.05,
    minWidth: 50,
    field: 'id',
    headerName: 'No',
    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.15,
    minWidth: 180,
    field: 'first_name',
    headerName: 'Name',
    valueGetter: ({ row }) => row?.first_name + row?.last_name,
    renderCell: ({ row }) => {
      return (
        <Fragment>
          <Avatar
            sx={{ width: 30, height: 30, mr: 1 }}
            alt={row?.first_name + row?.last_name}
            src={row?.profile_image}
          />
          <Typography noWrap variant="body2">
            {row?.first_name} {row?.last_name}
          </Typography>
        </Fragment>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: 'phone',
    headerName: 'Mobile No',
    valueGetter: ({ row }) => row?.mobile,
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.mobile}
        </Typography>
      );
    }
  },
  {
    flex: 0.18,
    minWidth: 180,
    field: 'created_at',
    headerName: 'Created On',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.created_at ? new Date(+row.created_at).toDateString() : 'No date'}
        </Typography>
      );
    }
  }
];

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [searchText] = useDebounce(search);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_USERS_COACHES,
        variables: {
          user: { user_type_id: process.env.NEXT_PUBLIC_CUSTOMER_USER_TYPE },
          page: +router?.query?.page,
          size: 10,
          search: searchText
        }
      });

      if (data?.users?.data) {
        setUsers(data?.users?.data);
        setTotalPages(data?.users?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [router?.query, searchText]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            placeholder="Search User"
            title="Users"
          />
          <DataGrid
            autoHeight
            rows={users}
            loading={loading}
            pagination={false}
            columns={columns}
            onCellClick={(item) => {
              router.push(`/user/${item?.id}`);
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

// Coaches.acl = {
//   action: 'manage',
//   subject: 'categories'
// };

export default User;
