import {
  Card,
  CardContent,
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
import InfoBox from "./components/dashboard/InfoBox";
import Map from "./components/dashboard/Map";
import Table from "./components/dashboard/Table";
import { sortData } from "./util";

function App() {
  //STATE
  //pick one country from array input
  const [country, setInputCountry] = useState("worldwide");
  //
  const [countryInfo, setCountryInfo] = useState({});
  // {name:VietNam,value:VN}
  const [countries, setCountries] = useState([]);
  console.log("🚀 ~ file: App.js ~ line 26 ~ App ~ countryInfo", countries);
  //save data for tatble
  const [tableData, setTableData] = useState([]);
  console.log("🚀 ~ file: App.js ~ line 31 ~ App ~ tableData", tableData);

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
          const sortedData = sortData(res.data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  //EVENTS

  //HANDLE
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    //set link to get data
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await axios.get(url).then((res) => {
      console.log(res.data);
      setCountryInfo(res.data);
    });
    setInputCountry(countryCode);
  };

  //RENDER
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className="app">
        <div className="app__left">
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
          {/* Stats (or Cards) */}
          <div className="app__stats">
            {/* <Dashboard /> */}
            <InfoBox
              title="Coronavirus Cases"
              cases={countryInfo.todayCases}
              total={countryInfo.cases}
            ></InfoBox>
            <InfoBox
              title="Recovered"
              cases={countryInfo.todayRecovered}
              total={countryInfo.recovered}
            ></InfoBox>
            <InfoBox
              title="Deaths"
              cases={countryInfo.todayDeaths}
              total={countryInfo.deaths}
            ></InfoBox>
          </div>
          <Map />
        </div>
        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            {/* Table */}
            <Table countries={tableData} />
            <h3>Worldwide new cases</h3>
            {/* Graph */}
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default App;
