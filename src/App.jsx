import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import Navbar from "./components/Navbar";
import MainWeather from "./components/MainWeather";
import TodaysHighlights from "./components/TodaysHighlights";
import FiveDaysForcast from "./components/FiveDaysForcast";
import WeatherMap from "./components/WeatherMap";
import HourlyForecast from "./components/HourlyForecast";
import Footer from "./components/Footer";
import ErrorPage from "./components/ui/ErrorPage";
import Loader from "./components/ui/Loader";



function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("New Delhi"); 
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDaysForcast, setFiveDaysForcast] = useState(null);   
  const [error, setError] = useState(false); 
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY; 

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    
    
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((response) => {
        setAirQualityData(response.data.list[0]); 
        //console.log(response)
      })
      .catch((error) =>
        console.error("Error fetching the air quality data:", error)
      );
  };

  // Function to fetch weather data using the OpenWeatherMap API
  const fetchWeatherData = (cityOrLat, lon = null) => {
    let url = "";

    if (lon !== null) {
      // Use latitude and longitude if both are provided
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityOrLat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else {
      // Otherwise, use the city name
      url = `https://api.openweathermap.org/data/2.5/weather?q=${cityOrLat}&units=metric&appid=${API_KEY}`;
    }

    setLoading(true); // show loader when the request starts
    // Fetch data from the API
    fetch(url)
      .then((response) => {
        // Convert the response to JSON format
        return response.json(); 
      })
      .then((data) => {
        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon);
        setError(false); // Reset error state
        
        // Fetch 5-days weather forecast using axios
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setFiveDaysForcast(response.data);
            setLoading(false);  // Hide loader once data is fetched
            //console.log(response);
            
          })
          .catch((error) =>{
            console.error("Error fetching the 5-day forecast data:", error);
            setLoading(false);  // Hide loader in case of error
          });

      })
      .catch((error) =>{
        console.error("Error fetching the weather data:", error);
        setError(true); // Set error state if fetch fails
        setLoading(false); // Hide loader in case of error
      });
  };

  const handelSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  return (
    <div className="bg-[#100E17]">
      <Navbar onSearch={handelSearch} fetchWeatherData={fetchWeatherData} />

      {/* Display loader when loading state is true and ErrorPage if there's an error */}
      {loading ? (<Loader height="h-screen" /> ) : error ? (<ErrorPage />) : (
        weatherData && airQualityData && (
          <div className="font-nunitoSans flex flex-col px-3 md:flex-row md:justify-around lg:px-8 gap-5">
            <div>
              <MainWeather weatherData={weatherData} />
              <p className="text-xl font-bold mt-5 ml-1 text-white">5 Days Forecast</p>
              {fiveDaysForcast && <FiveDaysForcast forecastData={fiveDaysForcast} />}
              <WeatherMap />
            </div>

            <div className="flex flex-col gap-5">
              <TodaysHighlights weatherData={weatherData} airQualityData={airQualityData} />
              <p className="text-xl font-bold ml-1 text-white">Today at</p>
              <HourlyForecast forecastData={fiveDaysForcast} />
            </div>
          </div>
        )
      )}

      <Footer/>
    </div>
  );
}

export default App;
