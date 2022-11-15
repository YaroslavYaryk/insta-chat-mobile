export function formatMessageTimestamp(timestamp, forHeader = null) {
  if (!timestamp) return;
  const date = new Date(timestamp);
  const today = new Date();
  const dateFormat1 = date.toDateString();
  const dateFormat2 = today.toDateString();

  const lastSeenBeautifulDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  const isYesterday = today.setDate(today.getDate() - 1) == date;

  // return date.toLocaleTimeString().slice(0, 12);
  var time = date.toLocaleTimeString().slice(0, 7).split(":");
  var betterTime = `${time[0]}:${time[1]} `;

  if (forHeader) {
    return [
      betterTime,
      new Date(dateFormat1).getTime() == new Date(dateFormat2).getTime(),
      lastSeenBeautifulDate,
      isYesterday,
    ];
  } else {
    return betterTime;
  }
}
