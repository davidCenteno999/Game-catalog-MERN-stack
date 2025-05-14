import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Renombra `App` a `GameCatalog`
import GameDetail from './pages/GameDetail'; // Nueva pantalla de detalles
import Navbar from './components/Navbar'
import { Box, Menu, Show } from "@chakra-ui/react"
import CreatePage from './pages/CreatePage'; // Nueva pantalla de detalles
import EditGame from "./pages/EditGame";
import LogInPage from './pages/LogInPage'; // Nueva pantalla de detalles
import RegisterPage from './pages/RegisterPage'; // Nueva pantalla de detalles
import ProfilePage from './pages/ProfilePage'; // Nueva pantalla de detalles
import CreateCompanyPage from './pages/CreateCompanyPage'; // Nueva pantalla de detalles
import CompanyDetail from "./pages/CompanyDetail";
import ProtectedRoute from './ProtectedRoute'; // Nueva pantalla de detalles
import { AuthProvider } from './context/AuthContext';
import ModifiedRoute from './ModifiedRoute'; // Nueva pantalla de detalles
import './global.css';

const App = () => {
  
  
 
  return (
    <AuthProvider>
      <Box min = {"100vh"}>
      
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<LogInPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            
            <Route path="/create-game/:id" element={<CreatePage />} />
           
            <Route path="/create-company" element={<CreateCompanyPage />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route element={<ModifiedRoute />}>
              <Route path="/edit/:id" element={<EditGame />} />
            </Route>
          </Route>
        </Routes>
      

      </Box>
    </AuthProvider>
   
  );
};

export default App;