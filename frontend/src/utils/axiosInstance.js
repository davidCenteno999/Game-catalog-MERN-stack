import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5555", // URL base del backend
  withCredentials: true, // Incluye cookies en las solicitudes
  
});

export default axiosInstance;