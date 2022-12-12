export function getCurrentTime() {
  const date = new Date();

  let hours = date.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = date.getMinutes();

  let pushTime = "";
  if (minutes >= 0 && minutes <= 10) {
    pushTime = `${hours}:00:00`;
  } else if (minutes >= 13 && minutes <= 25) {
    pushTime = `${hours}:15:00`;
  } else if (minutes > 25 && minutes <= 40) {
    pushTime = `${hours}:30:00`;
  } else if (minutes >= 43 && minutes <= 55) {
    pushTime = `${hours}:45:00`;
  } else if (minutes >= 58 && minutes <= 59) {
    if (hours != 23) hours = +hours + 1;
    else hours = "00";

    pushTime = `${hours}:00:00`;
  } else {
    pushTime = "Error time range";
  }

  return pushTime;
}
