// JustRunMy.App Auto Reset v2.0 - Background Service Worker

const APP_URL = "https://justrunmy.app/panel/application/5438";
const ALARM_NAME = "justrunmy-reset";
const RETRY_ALARM = "justrunmy-retry";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5 * 60 * 1000; // 5 minutes

// ─── Default Settings ──────────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  scheduleDays: [2, 4, 6],   // Tue, Thu, Sat
  hourIST: 23,
  minuteIST: 0,
  cfWaitSeconds: 12,
  appUrl: APP_URL
};

async function getSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get("settings", (d) => {
      resolve({ ...DEFAULT_SETTINGS, ...(d.settings || {}) });
    });
  });
}

// ─── Badge Helpers ─────────────────────────────────────────────────────────

function setBadge(text, color) {
  chrome.action.setBadgeText({ text });
  if (color) chrome.action.setBadgeBackgroundColor({ color });
}

function badgeOk()      { setBadge("✓", "#16a34a"); }
function badgeError()   { setBadge("✗", "#dc2626"); }
function badgeRunning() { setBadge("...", "#7c3aed"); }
function badgeClear()   { setBadge(""); }

// ─── History ───────────────────────────────────────────────────────────────

async function addHistory(entry) {
  return new Promise(resolve => {
    chrome.storage.local.get("history", (d) => {
      const history = d.history || [];
      history.unshift({ ...entry, time: Date.now() });
      if (history.length > 10) history.length = 10;
      chrome.storage.local.set({ history }, resolve);
    });
  });
}

// ─── Scheduling ────────────────────────────────────────────────────────────

async function getNextScheduledTime(settings) {
  const s = settings || await getSettings();
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffsetMs);

  for (let i = 0; i <= 7; i++) {
    const candidate = new Date(nowIST);
    candidate.setDate(nowIST.getDate() + i);
    candidate.setHours(s.hourIST, s.minuteIST, 0, 0);
    if (s.scheduleDays.includes(candidate.getDay())) {
      const candidateUTC = candidate.getTime() - istOffsetMs;
      if (candidateUTC > now.getTime()) return candidateUTC;
    }
  }
  return null;
}

async function scheduleNextAlarm() {
  const nextTime = await getNextScheduledTime();
  if (!nextTime) return;
  chrome.alarms.create(ALARM_NAME, { when: nextTime });
  const istDate = new Date(nextTime + 5.5 * 60 * 60 * 1000);
  chrome.storage.local.set({ nextReset: nextTime, nextResetIST: istDate.toISOString() });
  notify("statusUpdate", { status: "scheduled", nextReset: nextTime });
}

// ─── Init ──────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  // Set default settings if not set
  const s = await getSettings();
  chrome.storage.local.set({ settings: s });
  scheduleNextAlarm();
  badgeClear();
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.get(ALARM_NAME, (a) => { if (!a) scheduleNextAlarm(); });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    doReset("scheduled", 0);
    scheduleNextAlarm();
  }
  if (alarm.name === RETRY_ALARM) {
    chrome.storage.local.get("retryCount", (d) => {
      const count = d.retryCount || 0;
      if (count < MAX_RETRIES) doReset("retry", count);
    });
  }
});

// ─── Utilities ─────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function waitForTabLoad(tabId, timeout = 15000) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      resolve();
    }, timeout);
    function listener(id, info) {
      if (id === tabId && info.status === "complete") {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(listener);
  });
}

function notify(action, data) {
  chrome.runtime.sendMessage({ action, ...data }).catch(() => {});
}

// ─── Page-injected: Countdown overlay ─────────────────────────────────────

function injectCountdownOverlay(seconds) {
  const existing = document.getElementById("__jrma_overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "__jrma_overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    font-family: 'Segoe UI', sans-serif;
    pointer-events: none;
  `;

  overlay.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #1a0a3e, #2d1065);
      border: 2px solid #7c3aed;
      border-radius: 16px;
      padding: 20px 24px;
      text-align: center;
      box-shadow: 0 8px 40px rgba(124,58,237,0.6);
      width: 200px;
    ">
      <div style="font-size:26px; margin-bottom:6px;">🔄</div>
      <div style="color:#e9d5ff; font-size:12px; font-weight:700; margin-bottom:3px;">
        Auto Reset in Progress
      </div>
      <div style="color:#a78bfa; font-size:10px; margin-bottom:14px;">
        Waiting for Cloudflare...
      </div>
      <div id="__jrma_countdown" style="
        font-size: 52px;
        font-weight: 900;
        color: #ffffff;
        line-height: 1;
        margin-bottom: 10px;
        font-variant-numeric: tabular-nums;
        text-shadow: 0 0 20px rgba(167,139,250,0.9);
      ">${seconds}</div>
      <div style="
        width: 100%;
        height: 5px;
        background: rgba(255,255,255,0.1);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 10px;
      ">
        <div id="__jrma_bar" style="
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #7c3aed, #a855f7);
          border-radius: 3px;
          transition: width 1s linear;
        "></div>
      </div>
      <div style="color:#6b7280; font-size:9px;">Do not close this tab</div>
    </div>
  `;

  document.body.appendChild(overlay);

  let remaining = seconds;
  const bar = document.getElementById("__jrma_bar");
  const countEl = document.getElementById("__jrma_countdown");

  const tick = setInterval(() => {
    remaining--;
    if (countEl) countEl.textContent = remaining;
    if (bar) bar.style.width = ((remaining / seconds) * 100) + "%";
    if (remaining <= 0) clearInterval(tick);
  }, 1000);
}

// ─── Page-injected: Click Just Reset ──────────────────────────────────────

function clickJustReset() {
  const overlay = document.getElementById("__jrma_overlay");
  if (overlay) overlay.remove();

  const buttons = Array.from(document.querySelectorAll("button"));
  const btn = buttons.find(b => b.textContent.trim().toLowerCase().includes("just reset"));
  if (btn) { btn.click(); return { success: true }; }

  const resetBtn = buttons.find(b => b.textContent.trim().toLowerCase().includes("reset timer"));
  if (resetBtn) { resetBtn.click(); return { success: false, retry: true }; }

  return { success: false, error: "No button found" };
}

// ─── Core Reset Flow ───────────────────────────────────────────────────────

async function doReset(source = "manual", retryCount = 0) {
  let tab = null;
  const settings = await getSettings();

  try {
    chrome.storage.local.set({ lastStatus: "running", retryCount });
    badgeRunning();
    notify("statusUpdate", { status: "opening", retryCount });

    tab = await chrome.tabs.create({ url: settings.appUrl, active: true });
    await waitForTabLoad(tab.id, 15000);
    await sleep(3000);

    notify("statusUpdate", { status: "clicking_reset" });

    // Retry finding the Reset Timer button up to 5 times
    let clicked = false;
    for (let i = 0; i < 5; i++) {
      const res = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const btn = Array.from(document.querySelectorAll("button"))
            .find(b => b.textContent.trim().toLowerCase().includes("reset timer"));
          if (btn) { btn.click(); return { ok: true }; }
          const fallback = Array.from(document.querySelectorAll("button, [role='button']"))
            .find(b => b.textContent.toLowerCase().includes("reset"));
          if (fallback) { fallback.click(); return { ok: true, fallback: true }; }
          return { ok: false };
        }
      });
      if (res?.[0]?.result?.ok) { clicked = true; break; }
      await sleep(1500);
    }

    if (!clicked) throw new Error("'Reset Timer' button not found after 5 attempts");

    await sleep(800);

    notify("statusUpdate", { status: "waiting_cf", seconds: settings.cfWaitSeconds });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectCountdownOverlay,
      args: [settings.cfWaitSeconds]
    });

    await sleep(settings.cfWaitSeconds * 1000);

    notify("statusUpdate", { status: "clicking_just_reset" });

    const step3 = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: clickJustReset
    });

    const result = step3?.[0]?.result;
    if (!result?.success) throw new Error(result?.error || "Could not click 'Just Reset'");

    await sleep(1500);
    await chrome.tabs.remove(tab.id);
    tab = null;

    // ✅ Success
    badgeOk();
    chrome.storage.local.set({ lastSuccess: Date.now(), lastSource: source, lastStatus: "success", lastError: null, retryCount: 0 });
    await addHistory({ status: "success", source, retryCount });
    notify("statusUpdate", { status: "success" });

    // Only show notification inside extension, not as system popup
    // (handled by popup badge + history)

  } catch (err) {
    console.error("[AutoReset] Error:", err.message);
    badgeError();
    chrome.storage.local.set({ lastError: err.message, lastStatus: "error" });
    await addHistory({ status: "error", source, error: err.message, retryCount });
    notify("statusUpdate", { status: "error", msg: err.message });

    if (tab) { try { await chrome.tabs.remove(tab.id); } catch(e) {} }

    // Auto-retry if not exceeded max retries
    if (retryCount < MAX_RETRIES) {
      const nextRetry = retryCount + 1;
      chrome.storage.local.set({ retryCount: nextRetry });
      chrome.alarms.create(RETRY_ALARM, { when: Date.now() + RETRY_DELAY_MS });
      notify("statusUpdate", { status: "retry_scheduled", retryCount: nextRetry, retryIn: RETRY_DELAY_MS });
    } else {
      // All retries exhausted — send system notification
      chrome.notifications.create({
        type: "basic", iconUrl: "icon.png",
        title: "❌ Reset Failed After 3 Retries",
        message: err.message + " — Please reset manually."
      });
    }
  }
}

// ─── Message Listener ──────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "manualReset") {
    chrome.alarms.clear(RETRY_ALARM);
    chrome.storage.local.set({ retryCount: 0 });
    doReset("manual", 0);
    sendResponse({ status: "started" });
  }
  if (msg.action === "getStatus") {
    chrome.storage.local.get(
      ["nextReset", "lastSuccess", "lastError", "lastSource", "lastStatus", "retryCount", "history"],
      (data) => sendResponse(data)
    );
    return true;
  }
  if (msg.action === "settingsUpdated") {
    chrome.alarms.clear(ALARM_NAME, () => scheduleNextAlarm());
    sendResponse({ ok: true });
  }
});
