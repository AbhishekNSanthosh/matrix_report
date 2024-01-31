import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Card,
  Grid,
  Chip,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Pagination,
  Typography
} from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { DotsVertical, EyeOutline, PencilOutline } from 'mdi-material-ui';
import Link from 'next/link';
import styled from '@emotion/styled';
import { GET_ALL_LIBRARY, approve_or_reject } from '@/graphql/exercise-library';
import { validateGraphQlError } from '@/utils/ValidateError';
import { useDebounce } from 'use-debounce';

const MenuItemContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  padding: theme.spacing(1, 3),
  color: theme.palette.text.primary
}));

const RowOptions = ({ id, admin_approved_status }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const rowOptionsOpen = Boolean(anchorEl);
  const [isApproved, setIsApproved] = useState(admin_approved_status ? true : false);
  const [isRejected, setIsRejected] = useState(admin_approved_status ? false : true);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleApprove = async (arg) => {
    let status = {};
    if (arg === 'approved') {
      status = true;
    }
    if (arg === 'rejected') {
      status = false;
    }

    try {
      let { data } = await generalApoloClient.mutate({
        mutation: approve_or_reject,
        variables: {
          id: id,
          status: status
        }
      });

      if (data?.approveLibrary?.id) {
        toast.success(arg + ' successfully');
        if (arg == 'approved') {
          setIsApproved(true);
          setIsRejected(false);
        }
        if (arg == 'rejected') {
          setIsRejected(true);
          setIsApproved(false);
        }
      }
    } catch (error) {
      toast.error(error + '');
    }
  };

  useEffect(() => {
    if (admin_approved_status === true) {
      setIsRejected(false);
      setIsApproved(true);
    }

    if (admin_approved_status === false) {
      setIsApproved(false);
      setIsRejected(true);
    }
  }, []);

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
          <Link href={`/exercise-library/${id}`} passHref style={{ textDecorationLine: 'none' }}>
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
            href={`/exercise-library/add?id=${id}`}
            passHref
            style={{ textDecorationLine: 'none' }}>
            <MenuItemContent>
              <PencilOutline fontSize="small" sx={{ mr: 2 }} />
              Edit
            </MenuItemContent>
          </Link>
        </MenuItem>
      </Menu>
      {!isApproved && (
        <Button
          variant="contained"
          color="success"
          size="small"
          sx={{
            borderRadius: 2,
            fontSize: 12,
            ml: 2,
            px: 2,
            py: 0.4,
            width: '70px'
          }}
          // style={{ backgroundColor: '#039487', color: '#ffffff' }}
          onClick={() => handleApprove('approved', admin_approved_status)}>
          Approve
        </Button>
      )}
      &nbsp;
      {!isRejected && (
        <Button
          variant="contained"
          // color="warning"
          size="small"
          sx={{
            borderRadius: 2,
            fontSize: 12,
            width: '70px',
            ml: 2,
            px: 2,
            py: 0.4
          }}
          style={{ backgroundColor: 'red', color: '#ffffff' }}
          onClick={() => handleApprove('rejected', admin_approved_status)}>
          Reject
        </Button>
      )}
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
    flex: 0.1,
    minWidth: 100,
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
    headerName: 'Title',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row?.title}
        </Typography>
      );
    }
  },

  {
    flex: 0.03,
    minWidth: 100,
    field: 'is_free',
    headerName: 'Free Library',
    renderCell: ({ row }) => {
      return (
        <Chip
          skin="light"
          size="small"
          label={row?.is_free === true ? 'Yes' : 'No'}
          color={row?.is_free === true ? 'success' : 'error'}
          sx={{
            textTransform: 'capitalize',
            '& .MuiChip-label': { lineHeight: '18px' }
          }}
        />
      );
    }
  },

  {
    flex: 0.2,
    minWidth: 180,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => (
      <RowOptions id={row.id} admin_approved_status={row.admin_approved_status} />
    )
  }
];

const Library = () => {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [libraryType, setLibraryType] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [searchText] = useDebounce(search, 500);

  const router = useRouter();

  const fetchLibraries = async () => {
    setLoading(true);
    let payload = {};

    if (libraryType === 'nadena') {
      payload.is_nadeena_data = true;
    }
    if (libraryType === 'coach') {
      payload.is_nadeena_data = false;
    }

    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_LIBRARY,
        variables: {
          exerciseLibraryDetails: payload,
          size: 10,
          page: +router.query?.page || 1,
          search: searchText
        }
      });

      if (data?.exerciseLibraries?.data) {
        setLibraries(data?.exerciseLibraries?.data);

        setTotalPages(data?.exerciseLibraries?.totalPages);
      }

      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, [libraryType, searchText, router?.query]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/exercise-library/add')}
            placeholder="Search Library "
            buttonLabel="Add Library">
            <Box sx={{ display: 'flex', gap: '8px' }}>
              {console.log(libraryType)}
              <CustomChipButton
                variant={libraryType === '' ? 'outlined' : 'filled'}
                label="All"
                onClick={() => setLibraryType('')}
              />
              <CustomChipButton
                variant={libraryType === 'nadena' ? 'outlined' : 'filled'}
                label="Nadena"
                onClick={() => setLibraryType('nadena')}
              />
              <CustomChipButton
                variant={libraryType === 'coach' ? 'outlined' : 'filled'}
                label="Coach"
                onClick={() => setLibraryType('coach')}
              />
            </Box>
          </TableHeader>

          <DataGrid
            autoHeight
            rows={libraries}
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

export default Library;
const CustomChipButton = styled(Chip)(() => ({
  transition: 'box-shadow .25s ease',
  textTransform: 'uppercase',
  fontWeight: 'bold'
}));
