import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // Assuming you have a login service that returns token
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const {loginUser} = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(name, email); // Attempt to login the user
      navigate('/search'); // Redirect to the search page after successful login
    } catch (error) {
      setErrorMessage('Login failed. Please try again.'); // Handle login failure
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
