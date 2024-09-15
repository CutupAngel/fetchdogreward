import axios from 'axios';
import { ILocation } from '../types';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const getBreeds = async () => {
    return axios.get(`${API_URL}/dogs/breeds`, { withCredentials: true });
};

export const searchDogs = async (params: any) => {
    return axios.get(`${API_URL}/dogs/search`, { params, withCredentials: true });
};

export const getDogByIds = async (dogIds: string[]) => {
    return axios.post(`${API_URL}/dogs`, dogIds, { withCredentials: true });
};

export const matchDogs = async (dogIds: string[]) => {
    return axios.post(`${API_URL}/dogs/match`, dogIds, { withCredentials: true });
};

export const searchLocations = async (city: string, states: string[], boundingBox?: any) => {
    const body = {
      city: city || undefined,
      states: states.length ? states : undefined,
      geoBoundingBox: boundingBox || undefined,
    };
  
    return axios.post(`${API_URL}/locations/search`, body, { withCredentials: true });
};

export const getLocationByZipCodes = async (zipCodes: string[]) => {
    return axios.post(`${API_URL}/locations`, zipCodes, { withCredentials: true });
};
