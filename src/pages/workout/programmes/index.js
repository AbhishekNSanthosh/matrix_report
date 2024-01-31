import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_WORKOUT_PROGRAMS } from '@/graphql/Workout/Programmes';
import { DotsVertical, EyeOutline, PencilOutline } from 'mdi-material-ui';
import Link from 'next/link';
import styled from '@emotion/styled';

const MenuItemContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  padding: theme.spacing(1, 3),
  color: theme.palette.text.primary
}));

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
          <Link href={`/workout/programmes/${id}`} passHref style={{ textDecorationLine: 'none' }}>
            <MenuItemContent>
              <ListItemIcon>
                <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              </ListItemIcon>
              View
            </MenuItemContent>
          </Link>
        </MenuItem>
        <MenuItem sx={{ p: 0 }}>
          <Link
            href={`/workout/programmes/add?id=${id}`}
            passHref
            style={{ textDecorationLine: 'none' }}>
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
    flex: 0.2,
    minWidth: 200,
    field: 'title',
    headerName: 'Name',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.title}
        </Typography>
      );
    }
  },
  // {
  //   flex: 0.3,
  //   minWidth: 300,
  //   field: 'description',
  //   headerName: 'Description',
  //   renderCell: ({ row }) => {
  //     return (
  //       <Typography noWrap variant="body2">
  //         {row?.description}
  //       </Typography>
  //     );
  //   }
  // },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'updated_at',
    headerName: 'Updated On',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.updated_at ? new Date(+row.updated_at).toDateString() : 'No date'}
        </Typography>
      );
    }
  },
  {
    flex: 0.1,
    minWidth: 70,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
];

const WorkOutPrograms = () => {
  const router = useRouter();

  const [workOutPrograms, setWorkOutPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchWorkOutPrograms = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_WORKOUT_PROGRAMS
      });

      if (data?.workoutPrograms) {
        setWorkOutPrograms(data?.workoutPrograms);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error + '');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOutPrograms();
  }, []);

  const filteredWorkOutPrograms = useMemo(() => {
    return workOutPrograms.filter((programmes) =>
      programmes.title?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [workOutPrograms, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/workout/programmes/add')}
            placeholder="Search Programs"
            buttonLabel="Add Programs"
            title="Workout Programs"
          />
          <DataGrid
            autoHeight
            rows={filteredWorkOutPrograms}
            loading={loading}
            pagination={false}
            columns={columns}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': { borderRadius: 0 },
              '& .MuiDataGrid-row': { cursor: 'pointer' }
            }}
            disableColumnFilter
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default WorkOutPrograms;
