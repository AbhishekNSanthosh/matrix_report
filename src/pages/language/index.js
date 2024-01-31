import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_LANGUAGES } from '@/graphql/languages';

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
    headerName: 'Language Name',
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

const Languages = () => {
  const router = useRouter();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLanguages = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_LANGUAGES
      });
      if (data?.languages) {
        setLanguages(data?.languages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const filteredLanguages = useMemo(() => {
    return languages.filter((language) =>
      language?.code?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [languages, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/language/add')}
            placeholder="Search Language"
            buttonLabel="Add Language"
            title="Language"
          />
          <DataGrid
            autoHeight
            rows={filteredLanguages}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/language/${item?.id}`);
            }}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            columns={columns}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

Languages.acl = {
  action: 'manage',
  subject: 'currency'
};

export default Languages;
