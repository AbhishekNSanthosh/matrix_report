// ** MUI Imports
import Box from '@mui/material/Box';

// ** Config Import
import themeConfig from 'src/config/themeConfig';

// ** Utils
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
// ** Menu Components
import HorizontalNavItems from './HorizontalNavItems';

const Navigation = (props) => {
  return (
    <Box
      className="menu-content"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '& > *': {
          '&:not(:last-child)': { mr: 2 },
          ...(themeConfig.menuTextTruncate && { maxWidth: 220 })
        }
      }}>
      <HorizontalNavItems {...props} />
    </Box>
  );
};

export default Navigation;
