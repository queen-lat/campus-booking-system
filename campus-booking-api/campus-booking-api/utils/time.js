function pad(n) {
  return String(n).padStart(2, "0");
}

function toTimeStr(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad(h)}:${pad(m)}:00`;
}

// default: 08:00 - 18:00, slots = 30 mins
function generateSlots(startMinutes = 8 * 60, endMinutes = 18 * 60, step = 30) {
  const slots = [];
  for (let t = startMinutes; t + step <= endMinutes; t += step) {
    slots.push({ start_time: toTimeStr(t), end_time: toTimeStr(t + step) });
  }
  return slots;
}

module.exports = { generateSlots };
