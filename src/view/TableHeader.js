// ** MUI Imports
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const TableHeader = ({
  handleFilter,
  toggle,
  value,
  placeholder = '',
  buttonLabel = '',
  title = '',
  subTitle = '',
  children
}) => {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
      <Box sx={{ flex: 1 }}>
        {children}
        {title && (
          <Typography sx={{ fontWeight: 600 }} variant="h6">
            {title}
          </Typography>
        )}
        {subTitle ? <Typography variant="body2">{subTitle}</Typography> : null}
      </Box>

      {!!placeholder && (
        <TextField
          size="small"
          type="search"
          value={value}
          placeholder={placeholder + '...'}
          onChange={(e) => handleFilter(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-input': {
              paddingTop: 1.3,
              paddingBottom: 1.3,
              fontSize: 14
            }
          }}
        />
      )}
      {buttonLabel && (
        <Button sx={{ ml: 2, px: 2 }} onClick={toggle} variant="contained" size="small">
          {buttonLabel}
        </Button>
      )}
    </Box>
  );
};

export default TableHeader;
