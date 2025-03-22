import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true, // Required for cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404 && error.response.data.error == "Tenant not found.") {
      window.location.href = "/notfound"; // Redirect to 404 page
    }
    return Promise.reject(error);
  }
);

export default api;
