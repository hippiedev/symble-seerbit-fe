/* eslint-disable @typescript-eslint/naming-convention */
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getDateInUTCWithoutHours(date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
  );
}

export function convertDateToUTC(date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

export function getDateInUTC(date) {
  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
  return new Date(now_utc);
}
export function getUTCTimeToString(date) {
  const now_utc = `${`0${date.getUTCHours()}`.slice(
    -2,
  )}:${`0${date.getUTCMinutes()}`.slice(-2)}`;
  return now_utc;
}

export function convertDateToString(date) {
  date = `${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(
    -2,
  )}-${date.getFullYear()}`;
  return date;
}

export function convertDateTimeToString(date) {
  date = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
    -2,
  )}-${`0${date.getDate()}`.slice(-2)} ${`0${date.getHours()}`.slice(
    -2,
  )}:${`0${date.getMinutes()}`.slice(-2)}`;
  return date;
}

export function getFormattedDate(date) {
  date = `${monthNames[date.getMonth()]} ${`0${date.getDate()}`.slice(
    -2,
  )}, ${date.getFullYear()}`;
  return date;
}

export function getMinutesFromMiliseconds(date) {
  const millisecondVal = date;
  let minuteVal = millisecondVal / 60000;
  minuteVal = Math.round(minuteVal);
  return minuteVal;
}

export function getDayMonthString(date) {
  const d = new Date(date);
  const dayName = d.toString().split(' ')[0];
  date = `${dayName} ${`0${date.getDate()}`.slice(-2)} ${
    monthNames[date.getMonth()]
  },${date.getFullYear()}`;
  return date;
}

export function getMonthDayTime(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date(date);
  const dayName = days[d.getDay()];
  date =
    `${dayName} ${monthNames[date.getMonth()]} ` +
    `0${date.getDate()}` +
    `, ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
  return date;
}
