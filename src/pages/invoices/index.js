// ** React Imports
import { Fragment, useState, forwardRef } from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';

// ** Icons Imports

import Download from 'mdi-material-ui/Download';

import EyeOutline from 'mdi-material-ui/EyeOutline';

import ContentCopy from 'mdi-material-ui/ContentCopy';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import PencilOutline from 'mdi-material-ui/PencilOutline';
import DeleteOutline from 'mdi-material-ui/DeleteOutline';
// import InformationOutline from 'mdi-material-ui/InformationOutline';
// import ContentSaveOutline from 'mdi-material-ui/ContentSaveOutline';

// ** Third Party Imports
import format from 'date-fns/format';
import DatePicker from 'react-datepicker';

// ** Store & Actions Imports
//import { useDispatch, useSelector } from 'react-redux';
import { deleteInvoice } from 'src/store/invoice';

// ** Utils Import
// import { getInitials } from 'src/@core/utils/get-initials';

// // ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip';
// import CustomAvatar from 'src/@core/components/mui/avatar';
import TableHeader from 'src/view/invoice/list/TableHeader';

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css';

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { Chip } from '@mui/material';

// ** Styled component for the link in the dataTable
// const StyledLink = styled('a')(({ theme }) => ({
//   textDecoration: 'none',
//   color: theme.palette.primary.main
// }));

const RowOptions = ({ id }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
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
        }}>
        <MenuItem>
          <Download fontSize="small" sx={{ mr: 2 }} />
          Download
        </MenuItem>
        <Link href={`/apps/invoice/edit/${id}`} passHref>
          <MenuItem>
            <PencilOutline fontSize="small" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        </Link>
        <MenuItem>
          <ContentCopy fontSize="small" sx={{ mr: 2 }} />
          Duplicate
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

// ** Vars
// const invoiceStatusObj = {
//   Sent: { color: 'secondary', icon: <Send sx={{ fontSize: '1.25rem' }} /> },
//   Paid: { color: 'success', icon: <Check sx={{ fontSize: '1.25rem' }} /> },
//   Draft: { color: 'primary', icon: <ContentSaveOutline sx={{ fontSize: '1.25rem' }} /> },
//   'Partial Payment': { color: 'warning', icon: <ChartPie sx={{ fontSize: '1.25rem' }} /> },
//   'Past Due': { color: 'error', icon: <InformationOutline sx={{ fontSize: '1.25rem' }} /> },
//   Downloaded: { color: 'info', icon: <ArrowDown sx={{ fontSize: '1.25rem' }} /> }
// };

// ** renders client column

const defaultColumns = [
  {
    flex: 0.1,
    minWidth: 80,
    field: 'id',
    headerName: 'No',
    renderCell: ({ row }) => <Typography variant="body2">{`${row.id}`}</Typography>
  },
  // {
  //   flex: 0.1,
  //   minWidth: 80,
  //   field: 'invoiceStatus',
  //   renderHeader: () => <TrendingUp fontSize="small" sx={{ color: 'action.active' }} />,
  //   renderCell: ({ row }) => {
  //     const { dueDate, balance, invoiceStatus } = row;
  //     const color = invoiceStatusObj[invoiceStatus]
  //       ? invoiceStatusObj[invoiceStatus].color
  //       : 'primary';
  //     const Icon = invoiceStatusObj[invoiceStatus] ? invoiceStatusObj[invoiceStatus].icon : null;
  //   }
  // },
  {
    flex: 0.1,
    minWidth: 200,
    field: 'invoice_no',
    headerName: 'Invoice No',
    renderCell: ({ row }) => <Typography variant="body2">{`${row.invoice_no || 0}`}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 200,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }) => <Typography variant="body2">{`$${row.amount || 0}`}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'date',
    headerName: 'Date',
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {row.created_at ? new Date(+row.date).toLocaleTimeString() : 'No time'}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 125,
    field: 'time',
    headerName: 'Time',
    renderCell: ({ row }) => (
      <Typography variant="body2">
        {row.time ? new Date(+row.time).toDateString() : 'No date'}
      </Typography>
    )
  },
  {
    flex: 0.02,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <Chip
          skin="light"
          size="small"
          label={row?.status === 1 ? 'Success' : 'Failed'}
          color={row?.status === 1 ? 'success' : 'error'}
          sx={{
            textTransform: 'capitalize',
            '& .MuiChip-label': { lineHeight: '18px' }
          }}
        />
      );
    }
  }
];
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : '';
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null;
  const value = `${startDate}${endDate !== null ? endDate : ''}`;
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null;
  const updatedProps = { ...props };
  delete updatedProps.setDates;
  return (
    <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
  );
});

const staticData = [
  {
    id: 1,
    invoice_no: 'IN0001',
    amount: '8459',
    zatca_status: 'Failed',
    date: Date.now() ? new Date(+Date.now()).toDateString() : 'No date',
    Time: Date.now() ? new Date(+Date.now()).toLocaleTimeString() : 'No time'
  },
  {
    id: 2,
    invoice_no: 'IN0002',
    amount: '58947',
    zatca_status: 'Success',
    date: Date.now() ? new Date(+Date.now()).toDateString() : 'No date',
    Time: Date.now() ? new Date(+Date.now()).toLocaleTimeString() : 'No time'
  },
  {
    id: 3,
    invoice_no: 'IN0003',
    amount: '9855',
    zatca_status: 'Failed',
    date: Date.now() ? new Date(+Date.now()).toDateString() : 'No date',
    Time: Date.now() ? new Date(+Date.now()).toLocaleTimeString() : 'No time'
  },
  {
    id: 4,
    invoice_no: 'IN0004',
    amount: '76543',
    zatca_status: 'Success',
    date: Date.now() ? new Date(+Date.now()).toDateString() : 'No date',
    Time: Date.now() ? new Date(+Date.now()).toLocaleTimeString() : 'No time'
  },
  {
    id: 5,
    invoice_no: 'IN0005',
    amount: '8774',
    zatca_status: 'Failed',
    date: Date.now() ? new Date(+Date.now()).toDateString() : 'No date',
    Time: Date.now() ? new Date(+Date.now()).toLocaleTimeString() : 'No time'
  }
  // Add more static data items as needed
];
const InvoiceList = () => {
  // ** State
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [statusValue, setStatusValue] = useState('');
  const [endDateRange, setEndDateRange] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDateRange, setStartDateRange] = useState(new Date());

  // ** Hooks

  // const store = useSelector((state) => state.invoice);

  // useEffect(() => {
  //   fetchData({
  //     dates,
  //     q: value,
  //     status: statusValue
  //   });
  // }, [statusValue, value, dates]);

  const handleFilter = (val) => {
    setValue(val);
  };

  const handleStatusValue = (e) => {
    setStatusValue(e.target.value);
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    if (start !== null && end !== null) {
      setDates(dates);
    }
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Delete Invoice">
            <IconButton size="small" sx={{ mr: 0.5 }} onClick={() => deleteInvoice(row.id)}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <Box>
              <Link href={`/apps/invoice/preview/${row.id}`} passHref>
                <IconButton size="small" component="a" sx={{ textDecoration: 'none', mr: 0.5 }}>
                  <EyeOutline />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>
          <RowOptions id={row.id} />
        </Box>
      )
    }
  ];

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Filters" />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="invoice-status-select">Invoice Status</InputLabel>

                  <Select
                    fullWidth
                    value={statusValue}
                    sx={{ mr: 4, mb: 2 }}
                    label="Invoice Status"
                    onChange={handleStatusValue}
                    labelId="invoice-status-select">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="downloaded">Success</MenuItem>
                    <MenuItem value="draft">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePickerWrapper>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label="Invoice Date"
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </DatePickerWrapper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          {/* Pass the static data to your table component */}
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            pagination
            rows={staticData}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            onSelectionModelChange={(rows) => setSelectedRows(rows)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default InvoiceList;
