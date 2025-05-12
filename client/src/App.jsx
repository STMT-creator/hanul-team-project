import React from 'react';
import { Routes, Route } from 'react-router';
import Home from './routes/Home.jsx';
import Tab from './routes/Tab.jsx'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/tab" element={<Tab />}></Route>
      </Routes>
    </>
  );
};

export default App;
