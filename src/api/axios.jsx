import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  // withCredentials: true, // Required for cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      window.location.href = "/404"; // Redirect to 404 page
    }
    return Promise.reject(error);
  }
);

export default api;
