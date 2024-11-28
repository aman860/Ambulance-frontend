export const fetchAddress = async (latitude: Number, longitude: Number) => {

    const apiKey = process.env.REACT_APP_GEOCODING_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted

      } else {
        return "No results found";
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };