import React from 'react';
import { IDog } from '../../types';

interface DogCardProps {
  dog: IDog;
  onFavorite: (dogId: string) => void;
  fFav: boolean;
}

const DogCard: React.FC<DogCardProps> = ({ dog, onFavorite, fFav }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md flex flex-col items-center">
      {/* Fixed-size image for best sight */}
      <img 
        src={dog.img} 
        alt={dog.name} 
        className="w-64 h-64 object-cover mb-4 rounded-lg"
      />
      <h2 className="text-lg font-bold">{dog.name}</h2>
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      <p>Location: {dog.zip_code}</p>
      <button
        onClick={() => onFavorite(dog.id)}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg"
      >
        {fFav ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
};

export default DogCard;
