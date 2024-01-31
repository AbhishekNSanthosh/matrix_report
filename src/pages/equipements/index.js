import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid, Typography, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { generalApoloClient } from '@/config/apolloClient';
import TableHeader from '@/view/TableHeader';
import { GET_ALL_EQUIPEMENTS } from '@/graphql/equipements';
import { useDebounce } from 'use-debounce';
import { validateGraphQlError } from '@/utils/ValidateError';

const Equipements = () => {
  const router = useRouter();

  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchText] = useDebounce(search, 500);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPages = async () => {
    try {
      let { data } = await generalApoloClient.query({
        query: GET_ALL_EQUIPEMENTS,
        variables: {
          size: 10,
          page: +router.query?.page,
          search: searchText
        }
      });

      if (data?.equipements?.data) {
        setEquipements(data?.equipements?.data);
        setTotalPages(data?.equipements?.totalPages);
      }
      setLoading(false);
    } catch (error) {
      validateGraphQlError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [router.query, searchText]);

  // const filteredEquipements = useMemo(() => {
  //   return equipements.filter((equipement) =>
  //     equipement.name?.toLowerCase().includes(search?.toLowerCase())
  //   );
  // }, [equipements, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={search}
            handleFilter={setSearch}
            toggle={() => router.push('/equipements/add')}
            placeholder="Search "
            buttonLabel="Add Equipement"
            title="Equipements"
          />
          <DataGrid
            autoHeight
            rows={equipements}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/equipements/${item?.id}`);
            }}
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
                flex: 0.3,
                minWidth: 250,
                field: 'description',
                headerName: 'Description',
                renderCell: ({ row }) => {
                  return (
                    <Typography noWrap variant="body2">
                      {row?.description}
                    </Typography>
                  );
                }
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
                flex: 0.3,
                minWidth: 250,
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
            ]}
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

Equipements.acl = {
  action: 'manage',
  subject: 'cms-banners'
};

export default Equipements;
