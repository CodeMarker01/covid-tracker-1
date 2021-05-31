import {
  FormControl,
  MenuItem,
  MenuList,
  Select,
  ThemeProvider,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import theme from "./theme";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import GlobalStyles from "./components/GlobalStyles";

function App() {
  //STATE
  //save array country
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);

  //USE EFFECT
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/countries")
        .then((res) => {
          const countries = res.data.map((country) => ({
            name: country.country, // United States, United King dom
            value: country.countryInfo.iso2, // UK, USA, RF
          }));
          // const countries = res.data;
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  //EVENTS

  //HANDLE
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setInputCountry(countryCode);
  };

  //RENDER
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div classname="app">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl>
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((c) => (
                <MenuItem value={c.value}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <Dashboard />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
