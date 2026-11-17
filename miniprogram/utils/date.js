function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function todayStr(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function mealLabel(type) {
  const map = { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", snack: "加餐", 早餐: "早餐", 午餐: "午餐", 晚餐: "晚餐", 加餐: "加餐" };
  return map[type] || type || "餐次";
}

module.exports = { todayStr, formatTime, mealLabel, pad };
