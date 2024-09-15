import React, { useState, useEffect } from 'react';
import { matchDogs, getDogByIds } from '../services/dogService';
import { useNavigate, useLocation } from 'react-router-dom';
import { IDog } from '../types';

const DogMatchPage: React.FC = () => {
  const [match, setMatch] = useState<IDog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  const favoriteDogIds: string[] = location.state?.favorites || [];

  useEffect(() => {
    if (favoriteDogIds.length === 0) {
      // Redirect to search if no favorites
      navigate('/search');
      return;
    }

    const fetchMatch = async () => {
      try {
        const response = await matchDogs(favoriteDogIds);
        const matchedDogId = response.data.match;
        const dogResponse = await getDogByIds([matchedDogId]);
        setMatch(dogResponse.data[0]);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [favoriteDogIds, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!match) {
    return <div className="flex items-center justify-center h-screen">No match found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Match</h1>
      <div className="border p-4 rounded-lg max-w-sm mx-auto">
        <img src={match.img} alt={match.name} className="w-full h-48 object-cover mb-4" />
        <h2 className="text-lg font-bold">{match.name}</h2>
        <p>Breed: {match.breed}</p>
        <p>Age: {match.age}</p>
        <p>Location: {match.zip_code}</p>
        <button
          onClick={() => navigate('/search')}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
};

export default DogMatchPage;
