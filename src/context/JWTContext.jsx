import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

// Initial state for the context
const initialState = {
  isLoggedIn: false,
  user: null,
  accessToken: null,
};

// Create the context
const JWTContext = createContext(initialState);

// Helper function to set token in localStorage and state
const setToken = (accessToken, setAuthState) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    const decoded = jwtDecode(accessToken); // Decode to extract user info
    setAuthState({
      isLoggedIn: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        photo: decoded.photo,
        roles: decoded.role,
        permissions: decoded.permissions,
      },
      accessToken,
    });
  } else {
    localStorage.removeItem("accessToken");
    setAuthState(initialState);
  }
};

// Context Provider
export const JWTProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialState);
  const [loading, setLoading] = useState(true); // Added loading state

  // Initialize by checking if a token exists in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken, setAuthState);
    }
    setLoading(false); // Done loading after checking localStorage
  }, []);

  // Login function
  const login = (accessToken) => {
    setToken(accessToken, setAuthState);
  };

  // Logout function
  const logout = () => {
    setToken(null, setAuthState);
  };

  return (
    <JWTContext.Provider value={{ ...authState, login, logout, loading }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;

// Custom hook to use AuthContext
export const useAuth = () => useContext(JWTContext);
