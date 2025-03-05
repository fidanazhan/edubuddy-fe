import { useState, useEffect } from "react";
import LoginPage from "./layout/AuthLayout";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import axios from "axios";
import i18n from "./i18n";
import { useAuth } from "./context/JWTContext"; // FIX: Call inside component

function App() {

  const [subdomain, setSubdomain] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    const currentSubdomain = hostname.split('.')[0];

    // Check if it's the user's first time and store the subdomain in localStorage
    if (!localStorage.getItem('subdomain')) {
      localStorage.setItem('subdomain', currentSubdomain);
      setSubdomain(currentSubdomain);
      console.log('First time access:', currentSubdomain);
    } else {
      const storedSubdomain = localStorage.getItem('subdomain');
      setSubdomain(storedSubdomain);
      console.log('Subdomain from localStorage:', storedSubdomain);
    }
  }, []);

  const { user } = useAuth(); // Hooks must be inside a component
  const subdomain2 = window.location.hostname.split(".")[0];
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchLanguage = async () => {
      if (!user) return; // Wait until user is available
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${user.id}`, {
          headers: {
            "x-tenant": subdomain2,
            "Authorization": `Bearer ${token}`,
          },
        });
        const userLanguage = response.data.language || "en"; // Default to English
        i18n.changeLanguage(userLanguage); // Set language dynamically
      } catch (error) {
        console.error("Error fetching user language:", error);
      }
    };

    fetchLanguage();
  }, [user]); // Re-run when user data changes

  return (
    <div>
      {/* <h1>Subdomain: {subdomain || "No Subdomain Detected"}</h1> */}
      {/* //   <LoginPage /> */}

      <RouterProvider router={router} />
    </div>

  );
}

export default App
