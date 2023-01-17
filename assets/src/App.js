import React from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import Login from './pages/login';
import Summary from './pages/summary';
import Charts from './pages/charts';
import Register from './pages/register';

function App(){
  return(
    <div className="App">
      <BrowserRouter>
      <Routes> 
        <Route path='/login' element={<Login />}> </Route>
        <Route path='/reg' element={<Register />}> </Route>
        <Route path='/summary' element={<Summary />}> </Route>
        <Route path='/charts' element={<Charts />}> </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
