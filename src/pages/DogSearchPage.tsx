import React, { useState, useEffect } from 'react';
import { getBreeds, searchDogs, searchLocations, getDogByIds, matchDogs } from '../services/dogService';
import DogCard from '../components/cards/DogCard';
import Pagination from '../components/common/Pagination';
import { IDog } from '../types';

const DogSearchPage: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<IDog[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [ageMin, setAgeMin] = useState<number | null>(null); // Minimum age filter
  const [ageMax, setAgeMax] = useState<number | null>(null); // Maximum age filter
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<'breed' | 'name' | 'age'>('breed'); // Sort field (breed, name, age)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sort order (asc or desc)
  const [location, setLocation] = useState<string>(''); // User input for state
  const [zipCodes, setZipCodes] = useState<string[]>([]); // ZIP codes to filter dogs
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]); // Favorite dogs list (store dog IDs)
  const [matchedDog, setMatchedDog] = useState<IDog | null>(null); // Store the matched dog
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Fetch the list of breeds
  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await getBreeds();
      setBreeds(response.data);
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (favoriteDogs.length === 0) {
      return;
    }
    const getMatchedDogs = async () => {
      try {
        const response = await matchDogs(favoriteDogs); // Call /dogs/match endpoint with favorite dog IDs
        const matchedDogId = response.data.match;

        // Fetch details of the matched dog
        const matchedDogResponse = await getDogByIds([matchedDogId]);
        setMatchedDog(matchedDogResponse.data[0]); // Store the matched dog details
      } catch (error) {
        setError('Failed to match dogs. Please try again.');
      }
    }

    getMatchedDogs();
  }, [favoriteDogs])

  // Fetch dogs based on selected breed, location, age range, and sort order
  useEffect(() => {
    const fetchDogDetails = async (dogIDs: string[]) => {
      if (dogIDs.length > 0) {
        const dogsResponse = await getDogByIds(dogIDs);
        setDogs(dogsResponse.data);
      } else {
        setDogs([]);
      }
    }

    const search = async () => {
      setLoading(true); // Start loading before the search
      try {
        const filters: any = {
          breeds: selectedBreed ? [selectedBreed] : [],
          size: 12,
          from: page * 12,
          zipCodes, // Filter by ZIP code if available
          ageMin: ageMin || undefined, // Filter by minimum age if set
          ageMax: ageMax || undefined, // Filter by maximum age if set
          sort: `${sortField}:${sortOrder}`, // Sort by the selected field and order
        };
  
        const result = await searchDogs(filters);
        setTotalPages(Math.ceil(result.data.total / 12)); // Set total pages for pagination
        await fetchDogDetails(result.data.resultIds); // Fetch details for each dog ID
  
      } catch (error) {
        console.error('Error fetching dogs:', error); // Handle error appropriately
      } finally {
        setLoading(false); // End loading after search is complete (success or error)
      }
    };
    
    search();
  }, [selectedBreed, page, zipCodes, sortField, sortOrder, ageMin, ageMax]);

  // Function to handle location search
  const handleLocationSearch = async () => {
    setLoading(true);
    setError('');
    const [city, state] = location.split(',').map((item) => item.trim());
    if (!city || !state) {
      setError('Please enter both city and state in the format "City, State".');
      setLoading(false);
      return;
    }
    try {
      const locationResponse = await searchLocations(city, [state]);
      const zipCodes = locationResponse.data.results.map((location: any) => location.zip_code);
      setZipCodes(zipCodes);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to search for locations or dogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle sorting between ascending and descending order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Function to toggle favorite status
  const toggleFavorite = (dogId: string) => {
    setFavoriteDogs((prevFavorites) => {
      if (prevFavorites.includes(dogId)) {
        // If already in favorites, remove it
        return prevFavorites.filter((id) => id !== dogId);
      } else {
        // Add the dog ID to the favorites list
        return [...prevFavorites, dogId];
      }
    });
  };

  return (
    <div className="flex">
      <div className="w-1/6 bg-gray-100 p-4 h-screen sticky top-0">
        <h3 className="text-xl font-bold mb-4">Matched Dog</h3>
        {matchedDog ? (
          <div>
            <p className="text-lg font-bold">{matchedDog.name}</p>
            <p>{matchedDog.breed}</p>
            <img src={matchedDog.img} alt={matchedDog.name} className="w-64 h-64 rounded-lg mt-4" />
          </div>
        ) : (
          <p>No match yet.</p>
        )}
      </div>
      <div className="w-5/6 p-6">
        <h1 className="text-2xl font-bold mb-4">Search Dogs</h1>

        {/* Location Filter */}
        <div className="mb-4 flex space-x-4 items-center">
        <input
            type="text"
            placeholder="Enter City, State (e.g., Los Angeles, CA)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 h-12"
          />
          <button onClick={handleLocationSearch} className="bg-blue-500 text-white px-4 py-2 rounded-lg h-12">
            Filter by Location
          </button>

          {/* Age filter */}
          <input
            type="number"
            placeholder="Min Age"
            value={ageMin || ''}
            onChange={(e) => setAgeMin(e.target.value ? Number(e.target.value) : null)}
            className="border p-2 h-12"
          />
          <input
            type="number"
            placeholder="Max Age"
            value={ageMax || ''}
            onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : null)}
            className="border p-2 h-12"
          />
        </div>

        <div className="flex space-x-4 mb-4">
          {/* Breed filter */}
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="border p-2 mb-4"
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>

          {/* Sort field selection */}
          <div className="mb-4">
            <select value={sortField} onChange={(e) => setSortField(e.target.value as 'breed' | 'name' | 'age')} className="border p-2">
              <option value="breed">Sort by Breed</option>
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
            </select>
          </div>

          {/* Sort toggle button */}
          <div className="mb-4">
            <button onClick={toggleSortOrder} className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Sort: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        </div>
        {/* Display error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display dogs */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Available Dogs</h2>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} onFavorite={toggleFavorite} fFav={favoriteDogs.includes(dog.id)} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        
      </div>
    </div>
  );
};

export default DogSearchPage;
