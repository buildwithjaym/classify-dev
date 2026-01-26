import { apiGet } from "../../services/apiClient";
import { getCountdownLabel } from "../../components/schedule/CountdownTimer";

function toManilaISO(dateObj, timeStr) {
    // timeStr like "08:00:00" or "08:00"
    const [hh, mm, ss] = timeStr.split(":").map(x => parseInt(x, 10));
    const d = new Date(dateObj);
    d.setHours(hh || 0, mm || 0, ss || 0, 0);
    return d.toISOString();
}

export function TodayPage({ studentUserId }) {
    const root = document.createElement("div");
    root.className = "page";

    root.innerHTML = `
    <div class="page-header">
      <h1>Today</h1>
      <p class="muted">Your schedule and live countdown</p>
    </div>
    <div id="todayList" class="card-list"></div>
  `;

    const listEl = root.querySelector("#todayList");

    async function load() {
        listEl.innerHTML = `<div class="muted">Loading…</div>`;
        const data = await apiGet(`/student/today?student_user_id=${encodeURIComponent(studentUserId)}`);
        const items = data.items || [];
        if (items.length === 0) {
            listEl.innerHTML = `<div class="muted">No classes scheduled for today.</div>`;
            return;
        }

        // Render cards
        listEl.innerHTML = items.map((it, idx) => `
      <div class="card" data-idx="${idx}">
        <div class="row">
          <div>
            <div class="title">${it.subject_code}</div>
            <div class="subtitle">${it.title}</div>
          </div>
          <span class="badge">${it.status}</span>
        </div>
        <div class="meta">
          <span>${it.start_time} – ${it.end_time}</span>
          ${it.room ? `<span>• ${it.room}</span>` : ""}
        </div>
        <div class="countdown" id="cd-${idx}">—</div>
      </div>
    `).join("");

        // One timer updates all countdowns
        const today = new Date();
        const intervals = items.map(it => {
            const startISO = toManilaISO(today, it.start_time);
            const endISO = toManilaISO(today, it.end_time);
            return { startISO, endISO };
        });

        function tick() {
            intervals.forEach((t, idx) => {
                const el = root.querySelector(`#cd-${idx}`);
                if (el) el.textContent = getCountdownLabel(t.startISO, t.endISO);
            });
        }
        tick();
        const timer = setInterval(tick, 1000);

        // Cleanup when page removed
        root._cleanup = () => clearInterval(timer);
    }

    load().catch(err => {
        listEl.innerHTML = `<div class="muted">Error: ${err.message}</div>`;
    });

    return root;
}
