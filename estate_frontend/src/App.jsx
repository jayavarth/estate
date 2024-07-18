import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { SignBar } from '/src/SignBar.jsx';
import { ListBar } from '/src/Listings.jsx';
import { NavBar } from '/src/Navbar.jsx';
import {ClientBar} from '/src/Client.jsx'; 
import {AdminDashboard} from '/src/ADashboard.jsx'; 
import {ChooseBar} from '/src/Choosesale.jsx';
import {AddedBar} from '/src/Added.jsx'; 
import {RentBar} from '/src/Rent.jsx';   
import {Forgot} from '/src/Forgot.jsx';
import {WishList} from '/src/WishList.jsx'; 
import {HomePage} from "/src/HomePage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<NavBar />} />
        <Route path="/SignBar" element={<SignBar />} />
        <Route path="/Listings" element={<ListBar />} />
        <Route path="/Client" element={<ClientBar />} />
        <Route path="/Admindb" element={<AdminDashboard />} /> 
        <Route path="/Choosesale" element={<ChooseBar />} /> 
        <Route path="/Added" element={<AddedBar />} />
        <Route path="/Rent" element={<RentBar />} />
        <Route path="/forgot" element={<Forgot />} /> 
        <Route path="/Wishlist" element={<WishList />} /> 
      </Routes>
    </Router>
  );
}

export default App;