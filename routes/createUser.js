import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";

const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWtoemZmdWhpYmF3aXlmbGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MTgwNDQsImV4cCI6MTk2Nzk5NDA0NH0.nLF6NVY5sHAARwuyxmEtdpPqS72S0kIk-W59ilbsWac";
const SUPABASE_URL = "https://tkekhzffuhibawiyflae.supabase.co";

router.post("/", async (req, res) => {
  const userInfo = req.body;
  console.log(req.body);
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase.from("users").insert(userInfo);
    if (users !== null) {
      res.json(users);
    } else res.json({ Error: "User with this id was already registered" });
    console.log(users);
    res.end();
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

router.post("/:code", async (req, res) => {
  const userInfo = req.body;
  // console.log(req.body)
  const db = `users_${req.params.code}`;
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase.from(db).insert(userInfo);

    console.log(users);
    if (users !== null) {
      res.json(users);
    } else {
      res.json({
        Error:
          "User with this id was already registered or database does not exist",
      });
      console.log(users);
    }
    res.end();
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

export default router;
