import React from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Button } from '@headlessui/react';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();
  const naviHome = () => {
    navigate('/');
  };
  return (
    <>
      <div>
        <TabGroup>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Content 1</TabPanel>
            <TabPanel>Content 2</TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
        <Button onClick={naviHome}>홈</Button>
      </div>
    </>
  );
};

export default Home;
