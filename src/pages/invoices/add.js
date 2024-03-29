// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Third Party Components
//import axios from 'axios';

// ** Demo Components Imports
import AddCard from 'src/view/invoice/add/AddCard';
import AddActions from 'src/view/invoice/add/AddActions';
import AddNewCustomers from 'src/view/invoice/add/AddNewCustomer';

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css';

const InvoiceAdd = ({ apiClientData, invoiceNumber }) => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState(apiClientData);
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen);

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            clients={clients}
            invoiceNumber={invoiceNumber}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            toggleAddCustomerDrawer={toggleAddCustomerDrawer}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions />
        </Grid>
      </Grid>
      <AddNewCustomers
        clients={clients}
        open={addCustomerOpen}
        setClients={setClients}
        toggle={toggleAddCustomerDrawer}
        setSelectedClient={setSelectedClient}
      />
    </>
  );
};

export default InvoiceAdd;
