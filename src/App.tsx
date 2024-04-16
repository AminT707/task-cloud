/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './screens/login/LoginPage';
import DashboardPage from './screens/dashboard/DashboardPage';
import SignUpPage from './screens/login/SignUpPage';
import SignUpForm from './screens/login/SignUpForm';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/dashboard" element={<DashboardPage />} />  
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-form" element={<SignUpForm />} />
      </Routes>
    </BrowserRouter>
);
}

export default App;
