import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';
import styled from 'styled-components';
import Avatar from '@mui/joy/Avatar';


export default function ShowDrawer() {
  const { globalState } = useGlobalState();

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <DrawerHeading>Users: </DrawerHeading>
      <Divider />
      <List>
        {['Aman', 'Deep', 'Rohit', 'Ramesh', 'Suresh', 'Mukesh'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Avatar alt={text} size="sm" />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={!globalState.viewPeople} anchor={'left'}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

const DrawerHeading = styled.h3`

padding:2%


`
