import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from './pages/home';
import Navbar from './components/navbar';


function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
  
          <Route index element={<Home />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
