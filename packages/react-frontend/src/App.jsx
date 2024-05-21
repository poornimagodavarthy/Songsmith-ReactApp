
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home.jsx"
import Songs from "./pages/Songs.jsx"
import Playlists from "./pages/Playlists.jsx"
import Sidebar from './components/SideBar';
import React from 'react';
import Header from './Header.jsx'; 
import AddSong from './pages/AddSong';


function App() {
  return (
    <div className="App">
       <BrowserRouter>    
          <Sidebar />
            <Header />       
                  <Routes>
                      <Route exact path="/" element={<Home />}>
                      </Route>
                      <Route exact path="/playlists" element={<Playlists/>}>
                      </Route>
                      <Route exact path="/songs" element={<Songs />}>
                      </Route>
                      <Route exact path="/addSong" element={<AddSong />}>
                      </Route>
                  </Routes>
        </BrowserRouter>
         
    </div>
    
  )

}

export default App;

