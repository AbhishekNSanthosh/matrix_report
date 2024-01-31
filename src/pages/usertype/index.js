import { useEffect, useMemo, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { USER_TYPE } from '@/graphql/usertype';

const UserType = () => {
  const router = useRouter();

  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUserType = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: USER_TYPE
      });
      if (data?.userTypes) {
        setUserTypes(data?.userTypes);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserType();
  }, []);

  const filteredUserTypes = useMemo(() => {
    return userTypes.filter((usertype) =>
      usertype.name?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [userTypes, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/usertype/add')}
            placeholder="Search User Type"
            buttonLabel="Add User Type"
            title="User Type"
          />
          <DataGrid
            autoHeight
            rows={filteredUserTypes}
            loading={loading}
            pagination={false}
            onCellClick={(item) => router.push(`/usertype/${item.id}`)}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            disableColumnFilter
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
                headerName: 'User Type',
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
                field: 'created_at',
                headerName: 'Created On',
                renderCell: ({ row }) => {
                  return (
                    <Typography noWrap variant="body2">
                      {row?.created_at ? new Date(+row?.created_at).toDateString() : 'No date'}
                    </Typography>
                  );
                }
              }
            ]}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

UserType.acl = {
  action: 'manage',
  subject: 'user-types'
};

export default UserType;
