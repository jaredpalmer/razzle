import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import './App.css';

const App = () => (
  <Routes>
    <Route path="/" element={<Home/>} />
  </Routes>
);

export default App;
