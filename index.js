import express from "express";
const app = express();

import createUser from "./routes/createUser.js";
import user from "./routes/user.js";
import dailyDialog from "./routes/dailyDialog.js";
import bodyParser from "body-parser";
import getCoordinatesByCityName from "./routes/getCoordinatesByCityName.js";
import weatherForecast from "./routes/weatherForecast.js";
import getUsersId from "./routes/getUsersId.js";

app.use(bodyParser.json());

app.use("/create-user", createUser);
app.use("/user", user);
app.use("/users-id", getUsersId);
app.use("/daily-dialog", dailyDialog);
app.use("/city", getCoordinatesByCityName);
app.use("/weather", weatherForecast);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});

export default app;
