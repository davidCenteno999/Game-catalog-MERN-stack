import axios from "axios";
import { data } from "react-router-dom";

const API = 'http://localhost:5555/auth';

export const registerRequest = async (userData) => {
    try {
        const response = await axios.post(`${API}/register`, userData, { withCredentials: true });
        
        return { success: true,  data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response.data.message };
        

    }
}

export const loginRequest = async (userData) => {
    try {
        const response = await axios.post(`${API}/login`, userData, { withCredentials: true });
        
        return { success: true, data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response.data.message };
    }
}

export const logoutRequest = async () => {
    try {
        const response = await axios.post(`${API}/logout`, {}, { withCredentials: true });
        return { success: true, data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error logging out" };
    }
}


export const verifyTokenRequest = async () => {
    try {
        const response = await axios.get(`${API}/verify`, { withCredentials: true });
        return { success: true, data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error verifying token" };
    }
};

export const updateUserRequest = async (userData,id) => {
    try {
        const response = await axios.put(`${API}/update/${id}`, userData, { withCredentials: true });
        return { success: true, data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error updating user" };
    }
}

export const deleteUserRequest = async (id) => {
    try {
        const response = await axios.delete(`${API}/delete/${id}`, { withCredentials: true });
        return { success: true, data: response.data.data };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error deleting user" };
    }
}
