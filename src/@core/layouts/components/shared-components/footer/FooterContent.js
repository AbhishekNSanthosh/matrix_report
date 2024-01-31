// ** MUI Imports
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const FooterContent = () => {
  // ** Var

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component="span" sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <Link target="_blank" href="https://www.adoxsolutions.com/">
          Adoxsolutions
        </Link>
      </Typography>
    </Box>
  );
};

export default FooterContent;
