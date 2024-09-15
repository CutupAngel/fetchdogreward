import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const UserProfileHeader: React.FC = () => {
  const { isAuthenticated, userName, logoutUser } = useAuth(); // Fetch auth state and actions from context
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call logout function from the context to clear session
      navigate('/'); // Redirect to login or homepage after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // If not authenticated, don't show the header
  }

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 text-white">
      {/* Logo or site name */}
      <div className="text-2xl font-bold">
        FetchDogReward
      </div>

      {/* Display the user's name and sign out button */}
      <div className="flex items-center space-x-4">
        <div className="text-lg">
          Hello, {userName}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
