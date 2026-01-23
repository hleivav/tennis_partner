// Test-rad för att verifiera deployment-version
window.TEST_DEPLOY = "20260123";
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import CreateMatch from './pages/CreateMatch';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Admin from './pages/Admin';
import ResetPassword from './pages/ResetPassword';
import SearchPlayers from './pages/SearchPlayers';
import Invitations from './pages/Invitations';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateMatch />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<SearchPlayers />} />
        <Route path="/invitations" element={<Invitations />} />
      </Routes>
    </BrowserRouter>
  );
}

