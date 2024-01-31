import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import UserIcon from './UserIcon';
import themeConfig from '@/config/themeConfig';
import { Circle } from 'mdi-material-ui';
import { useTheme } from '@emotion/react';

function DrawerList({ list, drawerOpen = false, onSelect }) {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [drawerOpen]);

  const onClick = () => {
    if (list?.children) {
      setOpen((prev) => !prev);
      return;
    }
    router.push(list?.path);
    onSelect(list?.path);
  };

  const IconTag = parent && !list.icon ? themeConfig.navSubItemIcon : list.icon;

  const isActive = list?.path === router?.pathname || router.pathname.includes(list.path);

  if (list?.sectionTitle) {
    return (
      <ListItem key={list?.id} disablePadding sx={{ display: 'block', mb: 1, px: 1.5, pt: 2 }}>
        <Divider
          textAlign={'left'}
          sx={{
            '&:after': { display: 'none' },
            '&:before': {
              top: 7,
              transform: 'none',
              width: theme.spacing(4),
              borderColor: '#fafafa'
            }
          }}>
          <Typography
            color={'text.light'}
            variant="caption"
            fontSize={14}
            textTransform={'uppercase'}>
            {list?.sectionTitle}
          </Typography>
        </Divider>
      </ListItem>
    );
  }

  return (
    <ListItem key={list?.id} disablePadding sx={{ display: 'block', mb: 1, px: 1.5 }}>
      <ListItemButton
        onClick={onClick}
        selected={isActive}
        sx={{
          minHeight: 48,
          borderRadius: 2.5,
          justifyContent: drawerOpen ? 'initial' : 'center',
          px: 2.5,
          '&.Mui-selected': {
            backgroundColor: '#FFF',
            '&:hover': {
              backgroundColor: '#FFFFFF30'
            }
          },
          '&:hover': {
            backgroundColor: '#FFFFFF30'
          }
        }}>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: drawerOpen ? 1.5 : 'auto',
            justifyContent: 'center',
            color: isActive ? 'primary.main' : '#FFF'
          }}>
          <UserIcon icon={IconTag} iconProps={{ size: '24px' }} componentType="vertical-menu" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              color={isActive ? 'text.main' : 'text.light'}
              fontWeight={600}
              fontSize={16}>
              {list?.title}
            </Typography>
          }
          sx={{ opacity: drawerOpen ? 1 : 0 }}
        />
        {list?.children?.length > 0 && (
          <ListItemIcon
            sx={{
              display: drawerOpen ? 'auto' : 'none',
              minWidth: 0
            }}>
            {open ? (
              <KeyboardArrowUpOutlinedIcon sx={{ color: '#FFF' }} />
            ) : (
              <KeyboardArrowDownOutlinedIcon sx={{ color: '#FFF' }} />
            )}
          </ListItemIcon>
        )}
      </ListItemButton>
      {list?.children?.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {list?.children?.map((subList) => (
            <Link
              onClick={onSelect}
              key={subList?.id}
              href={subList?.path}
              style={{ textDecoration: 'none' }}>
              <List key={subList?.id} component="div" disablePadding>
                <ListItemButton
                  selected={subList?.path === router?.pathname}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: '#FFF',
                      borderRadius: 2.5,
                      '&:hover': {
                        backgroundColor: '#FFFFFF30'
                      }
                    },
                    '&:hover': {
                      backgroundColor: '#FFFFFF30'
                    },
                    ml: 5
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1
                    }}>
                    <Circle
                      sx={{
                        color: subList?.path === router?.pathname ? 'primary.main' : '#FFF',
                        fontSize: '6px'
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        color={subList?.path === router?.pathname ? 'text.main' : 'text.light'}
                        fontWeight={600}
                        fontSize={16}>
                        {subList?.title}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </List>
            </Link>
          ))}
        </Collapse>
      )}
    </ListItem>
  );
}

export default memo(DrawerList);
