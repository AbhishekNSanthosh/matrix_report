import { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, Grid } from '@mui/material';

import { useRouter } from 'next/router';

import TableHeader from '@/view/TableHeader';

const staticOnboarding = [
  {
    id: 1,
    Unique_Name: 'Name 1',
    Company_Name: 'Company A',
    Tax_Number: '123456',
    TIN: 'TIN123',
    Address: '123 Main St',
    Business_Category: 'Category A',
    updated_at: Date.now() ? new Date(+Date.now()).toDateString() : 'No date'
  }
];
const columns = [
  { field: 'id', headerName: 'No', flex: 0.25 },
  { field: 'Unique_Name', headerName: 'Unique Name', flex: 1 },
  { field: 'Company_Name', headerName: 'Company Name', flex: 1 },
  { field: 'Tax_Number', headerName: 'Tax Number', flex: 1 },
  { field: 'TIN', headerName: 'TIN/Branch Name', flex: 1 },
  { field: 'Address', headerName: 'Address', flex: 1 },
  { field: 'Business_Category', headerName: 'Business Category', flex: 1 },
  { field: 'updated_at', headerName: 'Date', flex: 1 }

  // ... add more columns as needed
];

const onboarding = () => {
  const router = useRouter();
  const [onboarding, setOnboarding] = useState(staticOnboarding); // Use static data initially
  const [loading, setLoading] = useState(false); // No need to start with loading true for static data
  const [search, setSearch] = useState('');

  const filteredOnboarding = useMemo(() => {
    return onboarding.filter(
      (item) =>
        item?.Unique_Name?.toLowerCase().includes(search?.toLowerCase()) ||
        item?.Company_Name?.toLowerCase().includes(search?.toLowerCase()) ||
        item?.Tax_Number?.toLowerCase().includes(search?.toLowerCase())
    );
  }, [onboarding, search]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            toggle={() => router.push('/onboarding/add')}
            buttonLabel="Add Onboarding"
            title="Onboarding"
          />
          <DataGrid
            autoHeight
            rows={filteredOnboarding}
            loading={loading}
            pagination={false}
            disableColumnFilter
            onCellClick={(item) => {
              router.push(`/onboarding/${item?.id}`);
            }}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            columns={columns}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default onboarding;
