// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const TableHeader = (props) => {
  // ** Props
  const { value, selectedRows, handleFilter } = props;

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end', // Updated this line to 'flex-end'
        justifyContent: 'space-between'
      }}>
      <TextField
        size="small"
        value={value}
        placeholder="Search Invoice"
        sx={{ mr: 4, mb: 2, maxWidth: '180px' }}
        onChange={(e) => handleFilter(e.target.value)}
      />

      <Link href="/invoices/add" passHref>
        <Button sx={{ mb: 2 }} variant="contained">
          Create Invoice
        </Button>
      </Link>
    </Box>
  );
};

export default TableHeader;
