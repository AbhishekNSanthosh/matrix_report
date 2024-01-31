import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ListItemIcon, Typography, alpha, styled } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

const OPTIONS = [
  {
    title: 'View detail',
    id: 'detail',
    icon: <VisibilityOutlinedIcon fontSize="small" />
  },
  {
    title: 'Edit',
    id: 'edit',
    icon: <CreateOutlinedIcon fontSize="small" />
  },
  {
    title: 'Delete',
    id: 'delete',
    icon: <DeleteOutlineOutlinedIcon fontSize="small" />
  }
];

const MuiMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    minWidth: 120,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 19,
        color: theme.palette.text.secondary
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));

export default function ElipsisMenu({ onSelect }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-controls={open ? 'menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <MuiMenu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {OPTIONS?.map((option) => (
          <MenuItem key={option.id} onClick={() => handleClose()}>
            <ListItemIcon>{option?.icon}</ListItemIcon>
            <Typography variant="body2" fontWeight={500}>
              {option?.title}
            </Typography>
          </MenuItem>
        ))}
      </MuiMenu>
    </div>
  );
}
