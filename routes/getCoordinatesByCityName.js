import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import countrys from "../external/ISO3166-ru.js";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWtoemZmdWhpYmF3aXlmbGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MTgwNDQsImV4cCI6MTk2Nzk5NDA0NH0.nLF6NVY5sHAARwuyxmEtdpPqS72S0kIk-W59ilbsWac";
const SUPABASE_URL = "https://tkekhzffuhibawiyflae.supabase.co";

// console.log(countrys)
router.post("/", async (req, res) => {
  const city = req.body.city;
  const NOTIFICATION_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=44de16256702fe649b4180c6c16aea39`;
  const response = await fetch(NOTIFICATION_URL, {
    method: "GET",
  });
  const data = await response.json();

  if (data.length !== 0) {
    // console.log(data.length)

    const { lat, lon, country } = data[0];
    const { code, name } = countrys.filter((el) => el.code === country)[0];
    const updateCoordinates = {
      location: { country: name, code, city, coordinates: { lat, lon } },
    };

    res.json(updateCoordinates);
    res.end();
  } else {
    res.json([]);
    res.end();
  }
});
router.put("/", async (req, res) => {
  const city = req.body.city;
  const NOTIFICATION_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=44de16256702fe649b4180c6c16aea39`;
  const response = await fetch(NOTIFICATION_URL, {
    method: "GET",
  });
  const data = await response.json();

  if (data.length !== 0) {
    // console.log(data.length)
    let allResults = [];

    for (let i = 0; i < data.length; i++) {
      // console.log(data[i])
      const { lat, lon, country } = data[i];
      const { code, name } = countrys.filter((el) => el.code === country)[0];
      const updateCoordinates = {
        location: { country: name, code, city, coordinates: { lat, lon } },
      };
      allResults.push(updateCoordinates);
    }

    // try{
    //     const supabase = createClient(SUPABASE_URL,SERVICE_KEY);
    //     let { data: users, error } = await supabase
    //     .from('users')
    //     .update(updateCoordinates)
    //     .eq('id', id)

    //     if (users !== null) {
    //         res.json(users)
    //     } else {
    //         res.json({Error: 'Some error'})
    //         console.log(users)
    //         res.end()
    //     }

    // }catch(err){
    //     res.json({message:err})
    //     res.end()
    // }
    res.json(allResults);
    res.end();
  } else {
    res.json([]);
    res.end();
  }
});

export default router;
