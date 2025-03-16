import { useState, useEffect } from "react";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState({ city: "", state: "", country: "" });

  useEffect(() => {
    getLocation();
  }, []); // Ensure useEffect runs only once on mount

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          // If geolocation fails, fallback to IP-based location
          await fetchLocationByIP();
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      fetchLocationByIP(); // Fallback to IP
    }
  };

  const fetchLocationByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data.latitude && data.longitude) {
        setLocation({ latitude: data.latitude, longitude: data.longitude });
        setAddress({
          city: data.city,
          state: data.region,
          country: data.country_name,
        });
      } else {
        setError("Failed to get location by IP");
      }
    } catch (err) {
      setError("Failed to fetch IP-based location");
    }
  };

  return (
    <div>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
      {location && (
        <p>
          {address.city}, {address.state}, {address.country}
        </p>
      )}
    </div>
  );
};

export default Location;
