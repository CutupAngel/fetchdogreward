import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const login = async (name: string, email: string) => {
    return axios.post(
        `${API_URL}/auth/login`,
        { name, email },
        { withCredentials: true }
    );
};

export const logout = async () => {
    return axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
};
