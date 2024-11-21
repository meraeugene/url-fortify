import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGeoLocationService = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Function to get the IP address
  const getIpAddress = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://get.geojs.io/v1/ip");
      setIpAddress(response.data);
    } catch (error) {
      toast.error(`Error getting the IP address: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to get country based on IP address
  const getCountry = async (ip: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://get.geojs.io/v1/ip/country/${ip}.json`
      );
      setCountry(response.data.country);
      setCountryCode(response.data.country_3);
      setCountryName(response.data.name);
    } catch (error) {
      toast.error("Error fetching country data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIpAddress();
  }, []); // Only run once when the component mounts

  useEffect(() => {
    if (ipAddress) {
      getCountry(ipAddress); // Fetch country once the IP address is available
    }
  }, [ipAddress]); // Run when ipAddress changes

  return { ipAddress, country, countryCode, countryName, loading }; // Return loading state
};

export default useGeoLocationService;
