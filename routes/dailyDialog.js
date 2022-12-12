import express from "express";
const router = express.Router();
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { getCurrentTime } from "../external/getCurrentTime.js";
import { dailyDialog } from "../external/dailyDialog.js";

const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWtoemZmdWhpYmF3aXlmbGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0MTgwNDQsImV4cCI6MTk2Nzk5NDA0NH0.nLF6NVY5sHAARwuyxmEtdpPqS72S0kIk-W59ilbsWac";
const SUPABASE_URL = "https://tkekhzffuhibawiyflae.supabase.co";

const NOTIFICATION_URL_RU =
  "https://api.telegram.org/bot5729179179:AAHEBCF8rflJu26yXMTeUTBugXZi5ewkqeY/sendMessage";
const NOTIFICATION_URL_PL =
  "https://api.telegram.org/bot5645522769:AAESLWcWfw5XxI1DcpuQn6kdCYyC13um5kQ/sendMessage";

const NOTIFICATION_MESSAGE_RU =
  "Расскажи, как вам сегодня спалось?\nДавай оценим по шкале от 1 до 10";
const NOTIFICATION_MESSAGE_PL = `Powiedz mi, jak dzisiaj spałeś/łaś?\nOceńmy w skali od 1 do 10 (<i>1 – bardzo źle, 10 – doskonale</i>)`;

const REMIND_MESSAGE_RU = "Ответьте, пожалуйста, на мой последний вопрос";
const REMIND_MESSAGE_PL =
  "Jestem tu i cierpliwie czekam ⏳\n Proszę odpowiedzieć na ostatnie pytanie";

router.post("/", async (req, res) => {
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const pushTime = getCurrentTime();
    // console.log(pushTime)
    const response_pl = await dailyDialog(
      pushTime,
      supabase,
      "users_pl",
      NOTIFICATION_URL_PL,
      NOTIFICATION_MESSAGE_PL,
      REMIND_MESSAGE_PL
    );
    const response_ru = await dailyDialog(
      pushTime,
      supabase,
      "users",
      NOTIFICATION_URL_RU,
      NOTIFICATION_MESSAGE_RU,
      REMIND_MESSAGE_RU
    );

    res.json({ RU: response_ru, PL: response_pl });
    res.end();
  } catch (e) {
    res.json({ Error: e.message });
    res.end();
  }
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
    //     console.log(supabase)
    if (users !== null) {
      // let filtredUsers = users.filter(user=> user.dialog_state.state === 'sleep')

      let filtredUsers = users;

      if (filtredUsers.length > 0) {
        try {
          for (let i = 0; i < filtredUsers.length; i++) {
            const updateInfo = { dialog_state: { state: "active" } };
            const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

            let { data: users, error } = await supabase
              .from("users")
              .update(updateInfo)
              .eq("id", filtredUsers[i].id);

            const json = {
              chat_id: filtredUsers[i].id,
              text: NOTIFICATION_MESSAGE_RU,
            };
            const response = await fetch(NOTIFICATION_URL_RU, {
              method: "POST",
              body: JSON.stringify(json),
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });
            // console.log(json)
            const data = await response.json();
            // console.log(data)
          }
        } catch (e) {
          res.json({ message: err });
          res.end();
        }

        res.json(filtredUsers);
        res.end();
      }
    } else {
      res.json({ Error: "Some error" });
      console.log(users);
      res.end();
    }
  } catch (err) {
    res.json({ message: err });
    res.end();
  }
});

export default router;
