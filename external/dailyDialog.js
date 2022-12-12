import fetch from "node-fetch";
import { sendNotification } from "./sendNotification.js";
export async function dailyDialog(
  pushTime,
  supabase,
  db,
  notification_url,
  notification_message,
  remind_message
) {
  try {
    let { data: users, error } = await supabase
      .from(db)
      .select("*")
      .eq("time_resume_dialog", pushTime);

    if (users !== null) {
      console.log(users);
      let SleepUsers = users.filter(
        (user) => user.dialog_state.state.toLowerCase() === "sleep"
      );
      let ActiveUsers = users.filter(
        (user) => user.dialog_state.state.toLowerCase() !== "sleep"
      );
      let SleepMessagesLog = [];
      let ActiveMessagesLog = [];
      if (SleepUsers.length > 0) {
        try {
          for (let i = 0; i < SleepUsers.length; i++) {
            const updateInfo = { dialog_state: { state: "active" } };
            let { data: users, error } = await supabase
              .from(db)
              .update(updateInfo)
              .eq("id", SleepUsers[i].id);
            const data = await sendNotification(
              SleepUsers[i].id,
              notification_url,
              notification_message
            );
            SleepMessagesLog.push(data);
          }
        } catch (e) {
          console.log({ Error: e.message });
        }
      }

      if (ActiveUsers.length > 0) {
        try {
          for (let i = 0; i < ActiveUsers.length; i++) {
            const updateInfo = { dialog_state: { state: "active" } };
            // const supabase = createClient(SUPABASE_URL,SERVICE_KEY);
            let { data: users, error } = await supabase
              .from(db)
              .update(updateInfo)
              .eq("id", ActiveUsers[i].id);
            const data = await sendNotification(
              ActiveUsers[i].id,
              notification_url,
              remind_message
            );
            ActiveMessagesLog.push(data);
          }
        } catch (e) {
          console.log({ Error: e.message });
        }
      }

      const json = {
        chat_id: 639477230,
        text: JSON.stringify({
          Time: pushTime,
          ActiveUsers,
          SleepUsers,
          Messages: { ActiveMessagesLog, SleepMessagesLog },
        }),
      };
      const response = await fetch(notification_url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await response.json();

      return {
        Time: pushTime,
        ActiveUsers,
        SleepUsers,
        Messages: { ActiveMessagesLog, SleepMessagesLog },
      };
    }
  } catch (e) {
    return { Error: e.message };
  }
}
