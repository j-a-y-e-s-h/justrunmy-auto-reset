const DEFAULT = {
  scheduleDays: [2, 4, 6],
  hourIST: 23,
  minuteIST: 0,
  cfWaitSeconds: 12
};

const cfSlider = document.getElementById("cfSlider");
const cfVal    = document.getElementById("cfVal");
const hourIn   = document.getElementById("hourInput");
const minIn    = document.getElementById("minuteInput");

cfSlider.addEventListener("input", () => { cfVal.textContent = cfSlider.value; });

// Load saved settings
chrome.storage.local.get("settings", (d) => {
  const s = { ...DEFAULT, ...(d.settings || {}) };

  // Tick day checkboxes
  s.scheduleDays.forEach(day => {
    const cb = document.getElementById("d" + day);
    if (cb) cb.checked = true;
  });

  hourIn.value   = s.hourIST;
  minIn.value    = String(s.minuteIST).padStart(2, "0");
  cfSlider.value = s.cfWaitSeconds;
  cfVal.textContent = s.cfWaitSeconds;
});

// Save
document.getElementById("saveBtn").addEventListener("click", () => {
  const days = [];
  for (let i = 0; i <= 6; i++) {
    const cb = document.getElementById("d" + i);
    if (cb && cb.checked) days.push(i);
  }

  if (days.length === 0) {
    alert("Please select at least one day!");
    return;
  }

  const hour = parseInt(hourIn.value);
  const min  = parseInt(minIn.value);

  if (isNaN(hour) || hour < 0 || hour > 23) { alert("Hour must be 0–23"); return; }
  if (isNaN(min)  || min  < 0 || min  > 59) { alert("Minute must be 0–59"); return; }

  const settings = {
    scheduleDays: days,
    hourIST: hour,
    minuteIST: min,
    cfWaitSeconds: parseInt(cfSlider.value)
  };

  chrome.storage.local.set({ settings }, () => {
    chrome.runtime.sendMessage({ action: "settingsUpdated" });
    const toast = document.getElementById("toast");
    toast.classList.add("on");
    setTimeout(() => toast.classList.remove("on"), 3000);
  });
});
