import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DogSearchPage from './pages/DogSearchPage';
import DogMatchPage from './pages/DogMatchPage';
import UserProfileHeader from './components/auth/UserProfile';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider, useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <UserProfileHeader/>
          <Routes>
            <Route path="/" element={<LoginRedirect />} />
            <Route path="/search" element={<ProtectedRoute component={DogSearchPage} />} />
            <Route path="/match" element={<ProtectedRoute component={DogMatchPage} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

// Redirect to /search if already authenticated
const LoginRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/search" replace />;
  }

  return <LoginPage />;
};

export default App;
