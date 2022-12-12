import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWtoemZmdWhpYmF3aXlmbGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MTgwNDQsImV4cCI6MTk2Nzk5NDA0NH0.nLF6NVY5sHAARwuyxmEtdpPqS72S0kIk-W59ilbsWac";
const SUPABASE_URL = "https://tkekhzffuhibawiyflae.supabase.co";

router.post("/", async (req, res) => {
  const id = req.body.id;

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);

    if (users !== null) {
      const { lat, lon } = users[0].location.coordinates;
      const AqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=44de16256702fe649b4180c6c16aea39`;
      const AqiResponse = await fetch(AqiUrl, {
        method: "GET",
      });
      const data = await AqiResponse.json();
      const AQI = data.list[0].main.aqi;

      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=44de16256702fe649b4180c6c16aea39`;
      const response = await fetch(weatherURL, {
        method: "GET",
      });
      const weatherData = await response.json();

      let weather = weatherData.weather[0];
      let weatherMain = weatherData.main;
      let weatherWind = weatherData.wind;
      res.json({ AQI: AQI, weather, main: weatherMain, wind: weatherWind });
      res.end();
    } else {
      res.json({ Error: "User with this id is not exist" });
      res.end();
    }
  } catch (err) {
    res.json({ message: err });
    res.end();
  }
});

export default router;
