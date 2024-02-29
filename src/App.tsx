/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Placeholder from './screens/placeholder/Placeholder';

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Placeholder />} /> 
            <Route path="/dashboard" element={<Placeholder />} /> 
            <Route path="/path_name/:dynamic" element={<Placeholder />} />
            <Route path="/path_name" element={<Placeholder />} />
            <Route path="/*" element={<Placeholder />} /> 
          </Routes>
    </BrowserRouter>
);
}

export default App;
