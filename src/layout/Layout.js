import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { DRAWER_NAVIGATION_LIST } from '@/utils/projectConfigs';
import { useRouter } from 'next/router';
import { Button, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import DrawerList from '@/components/DrawerList';
import { Can } from '@/config/ability';
import userStore from '@/store/userStore';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { ChevronDoubleLeft, ChevronDoubleRight } from 'mdi-material-ui';
import { useAuth } from '@/hooks/useAuth';

const drawerWidth = 220;

const DrawerContent = ({ handleDrawerOpenClose, open, onSelect }) => (
  <>
    <DrawerHeader sx={{ my: 1 }}>
      <Box
        sx={{
          height: 50,
          width: 50,
          backgroundColor: '#FFF',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3.5
        }}>
        <Image
          onClick={handleDrawerOpenClose}
          src={'/logo.svg'}
          alt={'Zatca'}
          height={50}
          width={50}
          objectFit="contain"
        />
        {/* <DrawerLogo sx={{ width: 40, height: 40, display: open ? 'auto' : 'none' }} /> */}
      </Box>

      <IconButton color="primary" onClick={handleDrawerOpenClose}>
        {!open ? (
          <ChevronDoubleRight sx={{ color: '#FFF' }} />
        ) : (
          <ChevronDoubleLeft sx={{ color: '#FFF' }} />
        )}
      </IconButton>
    </DrawerHeader>
    {/* <Divider /> */}
    <List>
      {DRAWER_NAVIGATION_LIST.map((list) => (
        <Can key={list?.id} I="manage" a={list?.acl}>
          <DrawerList key={list?.id} list={list} drawerOpen={open} onSelect={onSelect} />
        </Can>
      ))}
    </List>
  </>
);

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = React.useState(isMobile ? false : true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user, logout } = useAuth();

  const handleClose = (type = '') => {
    setAnchorEl(null);
    if (type === 'logout') {
      userStore.logout();
    }
  };
  const router = useRouter();

  const handleDrawerOpenClose = () => {
    setOpen((prev) => !prev);
  };

  const openMenu = Boolean(anchorEl);

  const headerLabel = React.useMemo(() => {
    return (
      DRAWER_NAVIGATION_LIST?.find(
        (list) =>
          (list?.path !== '/' && router.pathname.includes(list.path)) ||
          list.path === router.pathname
      )?.title || ''
    );
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          display: { xs: 'none', sm: 'block' }
        }}
        variant="permanent"
        open={open}>
        <DrawerContent
          handleDrawerOpenClose={handleDrawerOpenClose}
          open={open}
          onSelect={() => {}}
        />
      </Drawer>
      <MuiDrawer
        onClose={handleDrawerOpenClose}
        sx={{
          display: { xs: 'block', sm: 'none' }
        }}
        variant="temporary"
        open={open}>
        <DrawerContent
          handleDrawerOpenClose={handleDrawerOpenClose}
          open={open}
          onSelect={handleDrawerOpenClose}
        />
      </MuiDrawer>
      <Box component="main" sx={{ flexGrow: 1, overflowX: 'auto' }}>
        <DashboardHeader>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpenClose}
            sx={{ mr: 1, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ flexGrow: 1 }} variant="h5" fontWeight={600}>
            {headerLabel}
          </Typography>
          {/* <IconButton sx={{ mx: 0.7, display: { xs: 'none', sm: 'block' } }}>
            <Branch sx={{ height: 25, width: 25, fill: projectConfigs.primaryColor }} />
          </IconButton>
          <IconButton sx={{ mx: 0.7, display: { xs: 'none', sm: 'block' } }}>
            <Account sx={{ height: 25, width: 25, fill: projectConfigs.primaryColor }} />
          </IconButton> */}
          <Button
            sx={{ mx: 1, color: 'text.main' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="text"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            endIcon={<KeyboardArrowDownOutlinedIcon sx={{ ml: 0.5 }} />}>
            {user?.name}
          </Button>
        </DashboardHeader>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openMenu}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 3px 4px rgba(0,0,0,0.2))',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    // easing: theme.transitions.easing.sharp,
    easing: 'ease-in-out',
    // duration: theme.transitions.duration.enteringScreen
    duration: '.25s'
  }),
  overflowX: 'hidden',
  // backgroundImage: 'linear-gradient(60deg, #FA0065 0%, #FFB100 100%)',
  borderWidth: 0,
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  borderRadius: '10, 10'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    // easing: theme.transitions.easing.sharp,
    easing: 'ease-in-out',
    // duration: theme.transitions.duration.leavingScreen
    duration: '.25s'
  }),
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  // backgroundImage: 'linear-gradient(60deg, #FA0065 0%, #FFB100 100%)',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(10)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1.5),
  paddingLeft: theme.spacing(1.5),
  justifyContent: 'space-between',
  // backgroundImage: 'linear-gradient(45deg, #FA0065 0%, #FFB100 100%)', // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const DashboardHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  paddingLeft: theme.spacing(2),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    // backgroundColor: 'linear-gradient(45deg, #FA0065 0%, #FFB100 100%)',
    backgroundImage: 'linear-gradient(60deg, #0B2942 0%, #3D82BC 100%)',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        backgroundImage: 'linear-gradient(60deg, #0B2942 0%, #3D82BC 100%)',
        ...openedMixin(theme)
      }
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        backgroundImage: 'linear-gradient(60deg, #0B2942 0%, #3D82BC 100%)',
        ...closedMixin(theme)
      }
    }),
    transition: 'all .25s ease-in-out'
  })
);
