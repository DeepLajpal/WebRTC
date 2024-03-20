import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import ArticleIcon from '@mui/icons-material/Article';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { useGlobalState } from '../../ContextAPI/GlobalStateContext';

export default function IconTabs() {
  const {globalState, updateGlobalState} = useGlobalState();

  const handleChange = (event, newValue) => {
    updateGlobalState({tabValue: newValue})
  };

  return (
    <Tabs value={globalState.tabValue} onChange={handleChange} aria-label="icon tabs example">
      <Tab icon={<ArticleIcon />} aria-label="phone" />
      <Tab icon={<PersonPinIcon />} aria-label="person" />
    </Tabs>
  );
}