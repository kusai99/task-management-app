// src/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api", // Use your server's API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
