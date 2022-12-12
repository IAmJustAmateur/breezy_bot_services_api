import fetch from "node-fetch";

export async function sendNotification(
  chat_id,
  NOTIFICATION_URL,
  NOTIFICATION_MESSAGE
) {
  try {
    const json = { chat_id: chat_id, text: NOTIFICATION_MESSAGE };
    const response = await fetch(NOTIFICATION_URL, {
      method: "POST",
      body: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    // console.log(data)
    return data;
  } catch (e) {
    return { Error: e.message };
  }
}
