import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography } from '@mui/material';
import { validateGraphQlError } from 'src/utils/ValidateError';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_QUESTIONNAIRES } from '@/graphql/Questionnaires';
import CustomChip from 'src/@core/components/mui/chip';

const columns = [
  {
    flex: 0.04,
    minWidth: 50,
    field: 'id',
    headerName: 'No',
    renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
  },
  {
    flex: 0.3,
    minWidth: 350,
    field: 'question',
    headerName: 'Question',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.question}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 180,
    field: 'type',
    headerName: 'Type',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.type === 'radio' ? 'Radio' : 'Text Field'}
        </Typography>
      );
    }
  },
  {
    flex: 0.15,
    minWidth: 180,
    field: 'order',
    headerName: 'Qts-Order',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.order}
        </Typography>
      );
    }
  },
  // {
  //   flex: 0.3,
  //   minWidth: 250,
  //   field: 'options',
  //   headerName: 'Options',
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap variant="body2">
  //         {row?.options}
  //       </Typography>
  //     );
  //   }
  // },
  {
    flex: 0.15,
    minWidth: 200,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          skin="light"
          size="small"
          label={row?.status === true ? 'Active' : 'Disable'}
          color={row?.status === true ? 'success' : 'error'}
          sx={{
            textTransform: 'capitalize',
            '& .MuiChip-label': { lineHeight: '18px' }
          }}
        />
      );
    }
  },
  {
    flex: 0.18,
    minWidth: 200,
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

const Questionnaires = () => {
  const router = useRouter();
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchQuestionnaires = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_QUESTIONNAIRES
      });
      if (data?.questionnaires?.data) {
        setQuestionnaires(data?.questionnaires?.data);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((questionnaires) =>
      questionnaires?.question?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [questionnaires, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/questionnaires/add')}
            placeholder="Search "
            buttonLabel="Add Logs"
            title="Logs"
          />
          <DataGrid
            autoHeight
            rows={filteredQuestionnaires}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/questionnaires/${item?.id}`);
            }}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            columns={columns}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Questionnaires;
