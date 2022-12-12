import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";

const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWtoemZmdWhpYmF3aXlmbGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MTgwNDQsImV4cCI6MTk2Nzk5NDA0NH0.nLF6NVY5sHAARwuyxmEtdpPqS72S0kIk-W59ilbsWac";
const SUPABASE_URL = "https://tkekhzffuhibawiyflae.supabase.co";

router.get("/", async (req, res) => {
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase.from("users").select("*");

    if (users.length > 0) {
      let usersId = users.map((user) => user.id);
      console.log(usersId);
      res.json(usersId);
    } else {
      res.json({ Error: "User with this id does not exist" });
      console.log(users);
      res.end();
    }
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

router.get("/:code", async (req, res) => {
  try {
    const db = `users_${req.params.code}`;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase.from(db).select("*");

    if (users.length > 0) {
      let usersId = users.map((user) => user.id);
      console.log(usersId);
      res.json(usersId);
    } else {
      res.json({ Error: "User with this id does not exist" });
      console.log(users);
      res.end();
    }
    res.end();
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

router.post("/", async (req, res) => {
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase.from("users").select("*");

    if (users.length > 0) {
      let usersId = users.map((user) => user.id);
      console.log(usersId);
      res.json(usersId);
    } else {
      res.json({ Error: "User with this id does not exist" });
      console.log(users);
      res.end();
    }
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

export default router;
