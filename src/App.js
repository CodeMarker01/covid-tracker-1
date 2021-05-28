import { FormControl, MenuItem, MenuList, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

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
          console.log("🚀 ~ file: App.js ~ line 41 ~ .then ~ data", res.data);
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

  //RENDER
  return (
    <div classname="app">
      <h1>COVID-19 TRACKER</h1>
      <FormControl>
        <Select variant="outlined" value="test">
          {countries.map((c) => (
            <MenuItem value={c.value}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default App;
