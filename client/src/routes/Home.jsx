import React, { useState, useEffect } from 'react';
import '../App.css';
import SearchPlace from '../components/SearchPlace.jsx'

function Home() {
  
  return (
    <div className="text-center py-3">
      <SearchPlace />
    </div>
  );
}

export default Home;
