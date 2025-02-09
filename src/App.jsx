import { useState, useEffect } from "react";
import LoginPage from "./layout/AuthLayout";
import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";

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

  return (
    <div>
      {/* <h1>Subdomain: {subdomain || "No Subdomain Detected"}</h1> */}
    {/* //   <LoginPage /> */}
      
      <RouterProvider router={router} />
    </div>

  );
}

export default App
