import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/JWTContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.classList.add(storedTheme);

  const [theme, setTheme] = useState(storedTheme);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTheme = async () => {
      if (!user?.id) {
        setIsThemeLoaded(true);
        return;
      }

      const token = localStorage.getItem("accessToken");
      const subdomain = window.location.hostname.split(".")[0];

      try {
        const response = await axios.get(`http://localhost:5000/api/user/${user.id}`, {
          headers: {
            "x-tenant": subdomain,
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.data.theme) {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(response.data.theme);
          localStorage.setItem("theme", response.data.theme);
          setTheme(response.data.theme);
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    fetchTheme();
  }, [user]);

  if (!isThemeLoaded) {
    return null; // Prevent UI from rendering until the theme is applied
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
