import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/JWTContext";
import { useNavigate } from "react-router-dom";
import loginImages from '../../assets/images/login.png';
import googleLogo from '../../assets/images/google-logo.svg';
import microsoftLogo from '../../assets/images/microsoft-logo.svg';
import USMLogo from '../../assets/images/USM-logo.png';
import axios from "axios";
import api from '../../api/axios'

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const subdomain = window.location.hostname.split('.')[0];
  const [errorMessage, setErrorMessage] = useState("");
  const [loginImage, setLogin] = useState(null);
  const [bannerImage, setBanner] = useState(null);


  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const fetchTenantExist = async (subdomain) => {
      try {
        const response = await api.get(`/api/tenant/exist/`, {
          headers: { "x-tenant": subdomain },
        });
        console.log(response.data)
        const config = response.data
        if (response.status === 200 && response.data) {
          console.log(`Subdomain ${subdomain} exists!`);
          setLogin(config.img?.loginLogoUrl || null);
          setBanner(config.img?.bannerUrl || null);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`Subdomain ${subdomain} did not exist!`);
          navigate("/notfound", { replace: true }); // Redirect on 404
        } else {
          console.error("Error fetching tenant:", error);
        }
      }
    };
    fetchTenantExist(subdomain);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const error = urlParams.get("error"); // Get error message from URL

    if (error) {
      setErrorMessage(error);
      setTimeout(() => setErrorMessage(""), 5000); // Clear error message after 5 seconds

      // Remove error query param from URL
      urlParams.delete("error");
      window.history.replaceState({}, document.title, window.location.pathname + "?" + urlParams.toString());
    }

    localStorage.setItem('subdomain', subdomain);

    if (accessToken) {
      login(accessToken);
      window.history.replaceState({}, document.title, "/");
      navigate("/dashboard");
    } else {
      setTimeout(() => setIsLoading(false), 1000); // Add a delay to enhance UX
    }
  }, [login, navigate]);

  const loginProcess = (provider) => {
    const subdomain = window.location.hostname.split('.')[0];  
    const baseURL = `${import.meta.env.VITE_API_URL}/api/auth/${provider}?subdomain=${subdomain}`;
    console.log("Redirecting to:", baseURL);
    window.location.href = baseURL;
  };
  
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          {/* Animated Spinner */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (


    <div className="flex items-center justify-center h-screen bg-gray-100">
      {errorMessage && (
        <div className="absolute top-4 font-semibold items-center bg-red-200 text-red-600 p-3 rounded shadow-md">
          {errorMessage}
        </div>
      )}
      <div className="flex w-full h-screen bg-white shadow-lg">
        <div className="w-7/12 h-full">
          <img src={loginImage ? loginImage : loginImages} alt="Login visual" className="w-full h-full object-cover" />
        </div>

        <div className="w-5/12 flex items-center justify-center p-8">
          <div className="text-center w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-8/12 h-12 flex items-center justify-center">
                <img src={bannerImage ? bannerImage : USMLogo} alt="University Logo" className="w-full h-full object-scale-down" />
              </div>
              <div className="w-4/2">
                <span className="text-black">Edu</span>
                <span className="text-blue-600">Buddy</span>
              </div>
            </h2>

            <div className="space-y-3">
              <button
                className="flex items-center justify-center w-full border bg-slate-100 border-slate-200 text-black font-medium py-2 px-4 rounded hover:border-blue-200 transition duration-300"
                onClick={() => loginProcess("google")}
              >
                <img src={googleLogo} alt="Google Logo" className="w-6 h-6 mr-5" />
                Sign In With Google
              </button>
              <button
                className="flex items-center justify-center w-full border bg-slate-100 border-slate-200 text-black font-medium py-2 px-4 rounded hover:border-blue-200 transition duration-300"
                onClick={() => loginProcess("microsoft")}
              >
                <img src={microsoftLogo} alt="Microsoft Logo" className="w-6 h-6 mr-5" />
                Sign In With Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
