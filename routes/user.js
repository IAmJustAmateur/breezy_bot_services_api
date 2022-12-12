import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";

const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWtoemZmdWhpYmF3aXlmbGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MTgwNDQsImV4cCI6MTk2Nzk5NDA0NH0.nLF6NVY5sHAARwuyxmEtdpPqS72S0kIk-W59ilbsWac";
const SUPABASE_URL = "https://tkekhzffuhibawiyflae.supabase.co";

router.put("/", async (req, res) => {
  const id = req.body.id;
  const updateInfo = req.body.update;

  const date = new Date();
  // console.log(date)

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    let { data: user, errorId } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
    if (user.length > 0) {
      let { data: users, error } = await supabase
        .from("users")
        .update({ time_update: date, ...updateInfo })
        .eq("id", id);

      if (users !== null) {
        res.json(users);
      } else {
        // console.log(error)
        res.json({ Error: `${error.message}` });
        // console.log(users)
        res.end();
      }
    } else {
      // console.log(user)
      res.json({ Error: `User with this id does not exist` });

      res.end();
    }
  } catch (err) {
    res.json({ message: err.message });
    res.end();
  }
});

router.put("/:code", async (req, res) => {
  const id = req.body.id;
  const updateInfo = req.body.update;
  const db = `users_${req.params.code}`;
  const date = new Date();
  // console.log(date)

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    let { data: user, errorId } = await supabase
      .from(db)
      .select("*")
      .eq("id", id);
    if (user.length > 0) {
      let { data: users, error } = await supabase
        .from(db)
        .update({ time_update: date, ...updateInfo })
        .eq("id", id);

      if (users !== null) {
        res.json(users);
      } else {
        // console.log(error)
        res.json({ Error: `${error.message}` });
        // console.log(users)
      }
      res.end();
    } else {
      // console.log(user)
      res.json({ Error: `User with this id does not exist` });

      res.end();
    }
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

router.post("/", async (req, res) => {
  const id = req.body.id;
  // console.log(id)
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);

    if (users.length > 0) {
      res.json(users);
    } else {
      res.json({ Error: "User with this id does not exist" });
      console.log(users);
      res.end();
    }
  } catch (err) {
    res.json({ message: err.message });
    res.end();
  }
});

router.post("/:code", async (req, res) => {
  const id = req.body.id;
  const db = `users_${req.params.code}`;
  // console.log(id)
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase
      .from(db)
      .select("*")
      .eq("id", id);

    if (users.length > 0) {
      res.json(users);
    } else {
      res.json({ Error: "User with this id does not exist" });
      console.log(users);
    }
    res.end();
  } catch (err) {
    res.json({ Error: err.message });
    res.end();
  }
});

export default router;
