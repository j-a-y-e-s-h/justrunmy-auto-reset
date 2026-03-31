// Popup JS v2.0

const $ = id => document.getElementById(id);
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── Tab switching ─────────────────────────────────────────────────────────
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    $("tab-" + tab.dataset.tab).classList.add("active");
  });
});

// ─── Settings button ───────────────────────────────────────────────────────
$("settingsBtn").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

// ─── Status bar ───────────────────────────────────────────────────────────
function setStatus(type, text) {
  const bar = $("statusBar");
  bar.className = type;
  $("statusText").textContent = text;
  const running = type === "running";
  $("spinner").classList.toggle("on", running);
  $("dot").style.display = running ? "none" : "block";
}

// ─── Progress steps ────────────────────────────────────────────────────────
function setStep(active) {
  for (let i = 1; i <= 4; i++) {
    const el = $("s" + i);
    if (!el) continue;
    el.className = "step" + (i < active ? " done" : i === active ? " active" : "");
  }
  $("progressSteps").classList.toggle("on", active > 0 && active <= 4);
}

// ─── Countdown timer ──────────────────────────────────────────────────────
let countdownInterval = null;

function startCountdown(nextResetMs) {
  if (countdownInterval) clearInterval(countdownInterval);
  const cdEl   = $("countdown");
  const dateEl = $("nextResetDate");

  function update() {
    const diff = nextResetMs - Date.now();
    if (diff <= 0) {
      cdEl.textContent = "Now!";
      clearInterval(countdownInterval);
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    cdEl.textContent =
      String(h).padStart(2,"0") + ":" +
      String(m).padStart(2,"0") + ":" +
      String(s).padStart(2,"0");
  }

  // Format the date label
  const ist = new Date(nextResetMs + 5.5 * 60 * 60 * 1000);
  const day = DAYS_FULL[ist.getUTCDay()];
  const hh  = String(ist.getUTCHours()).padStart(2,"0");
  const mm  = String(ist.getUTCMinutes()).padStart(2,"0");
  const date = `${ist.getUTCDate()}/${ist.getUTCMonth()+1}`;
  dateEl.textContent = `${day}, ${date} at ${hh}:${mm} IST`;

  update();
  countdownInterval = setInterval(update, 1000);
}

// ─── Format time for history ──────────────────────────────────────────────
function formatTimeAgo(ms) {
  const diff = Date.now() - ms;
  if (diff < 60000)    return "just now";
  if (diff < 3600000)  return Math.floor(diff/60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff/3600000) + "h ago";
  return Math.floor(diff/86400000) + "d ago";
}

function formatTime(ms) {
  const ist = new Date(ms + 5.5 * 60 * 60 * 1000);
  const day = DAYS_SHORT[ist.getUTCDay()];
  const h = String(ist.getUTCHours()).padStart(2,"0");
  const m = String(ist.getUTCMinutes()).padStart(2,"0");
  const date = `${ist.getUTCDate()}/${ist.getUTCMonth()+1}`;
  return `${day} ${date} ${h}:${m} IST`;
}

// ─── Render history ────────────────────────────────────────────────────────
function renderHistory(history) {
  const list = $("historyList");
  if (!history || history.length === 0) {
    list.innerHTML = '<div class="history-empty">No resets yet</div>';
    return;
  }
  list.innerHTML = history.map(h => {
    const ok = h.status === "success";
    const icon = ok ? "✅" : "❌";
    const titleClass = ok ? "ok" : "err";
    const title = ok ? "Reset Successful" : "Reset Failed";
    const meta = ok
      ? `Source: ${h.source || "—"}` + (h.retryCount ? ` (retry #${h.retryCount})` : "")
      : (h.error || "Unknown error");
    return `
      <div class="history-item">
        <div class="h-icon">${icon}</div>
        <div class="h-info">
          <div class="h-title ${titleClass}">${title}</div>
          <div class="h-meta">${meta}</div>
        </div>
        <div class="h-time">${formatTimeAgo(h.time)}<br><span style="font-size:8px;color:#1f2937">${formatTime(h.time)}</span></div>
      </div>
    `;
  }).join("");
}

// ─── Load status from background ──────────────────────────────────────────
function loadStatus() {
  chrome.runtime.sendMessage({ action: "getStatus" }, (data) => {
    if (!data) return;

    if (data.nextReset) startCountdown(data.nextReset);

    if (data.lastStatus === "running") {
      setStatus("running", "Reset in progress...");
      $("resetBtn").disabled = true;
      setStep(1);
    } else if (data.lastStatus === "success" && data.lastSuccess) {
      setStatus("success", "✅ Last reset OK");
      $("lastReset").textContent = "✅ " + formatTime(data.lastSuccess) + (data.lastSource ? ` · ${data.lastSource}` : "");
      $("lastReset").className = "info-value ok";
      setStep(0);
    } else if (data.lastStatus === "error") {
      const retrying = (data.retryCount || 0) < 3;
      setStatus(retrying ? "retry" : "error",
        retrying ? `⚠️ Failed · Retry ${data.retryCount}/3 in 5m` : "❌ Failed after 3 retries");
      $("lastReset").textContent = "❌ " + (data.lastError || "Error");
      $("lastReset").className = "info-value err";
      setStep(0);
    }

    renderHistory(data.history);
  });
}

// ─── Live status updates from background ──────────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action !== "statusUpdate") return;

  switch (msg.status) {
    case "opening":
      setStatus("running", msg.retryCount > 0 ? `🔁 Retry ${msg.retryCount}/3 — Opening...` : "Opening page...");
      setStep(1); $("resetBtn").disabled = true;
      break;
    case "clicking_reset":
      setStatus("running", "Clicking Reset Timer...");
      setStep(2); break;
    case "waiting_cf":
      setStatus("running", `Waiting ${msg.seconds}s for Cloudflare...`);
      setStep(3); break;
    case "clicking_just_reset":
      setStatus("running", "Clicking Just Reset...");
      setStep(4); break;
    case "success":
      setStatus("success", "✅ Reset successful!");
      setStep(0); $("resetBtn").disabled = false;
      $("resetBtn").textContent = "🔁 Reset Timer Now";
      loadStatus(); break;
    case "error":
      setStatus("error", "❌ " + (msg.msg || "Failed"));
      setStep(0); $("resetBtn").disabled = false;
      $("resetBtn").textContent = "🔁 Reset Timer Now";
      loadStatus(); break;
    case "retry_scheduled":
      setStatus("retry", `⚠️ Failed · Retry ${msg.retryCount}/3 in 5m`);
      setStep(0); $("resetBtn").disabled = false;
      break;
    case "scheduled":
      if (msg.nextReset) startCountdown(msg.nextReset);
      break;
  }
});

// ─── Manual reset ──────────────────────────────────────────────────────────
$("resetBtn").addEventListener("click", () => {
  $("resetBtn").disabled = true;
  $("resetBtn").textContent = "⏳ Starting...";
  setStep(0);
  chrome.runtime.sendMessage({ action: "manualReset" });
});

// ─── Init ──────────────────────────────────────────────────────────────────
loadStatus();
