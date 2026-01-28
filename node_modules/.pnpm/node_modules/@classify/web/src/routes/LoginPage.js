import { signInWithIdPassword } from "../services/authService";
import { supabase } from "../config/supabaseClient";
import { API_BASE_URL } from "../config/env";

async function fetchMe(accessToken) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export function LoginPage({ onLoggedIn }) {
  const root = document.createElement("div");
  root.className = "auth-page";

  root.innerHTML = `
    <div class="auth-bg">
      <div class="bg-gradient"></div>
      <div class="bg-grid"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
    </div>

    <main class="auth-shell">
      <section class="auth-card" aria-label="Login">
        <header class="auth-head">
          <div class="brand">
            <img class="brand-logo" src="/classify-logo.png" alt="Classify logo" />
            <div class="brand-name">Classify</div>
          </div>

          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">
            Your all-in-one solution for class cancellation, grades, quizzes, and schedules.
          </p>
        </header>

        <div class="auth-tabs" role="tablist" aria-label="Login mode">
          <button class="tab is-active" type="button" data-mode="id" role="tab">ID</button>
          <button class="tab" type="button" data-mode="email" role="tab">Email</button>
        </div>

        <form class="auth-form" autocomplete="on">
          <div class="field">
            <label class="label" for="login_id">ID / Email</label>
            <div class="control">
              <input id="login_id" class="input" placeholder="Enter your ID or email"
                autocomplete="username" />
            </div>
          </div>

          <div class="field">
            <label class="label" for="login_pw">Password</label>
            <div class="control control-inline">
              <input id="login_pw" class="input" type="password" placeholder="Enter your password"
                autocomplete="current-password" />
              <button class="ghost" id="togglePw" type="button">Show</button>
            </div>
          </div>

          <div class="row">
            <label class="check">
              <input id="remember" type="checkbox" checked />
              <span>Remember me</span>
            </label>

            <button class="link" id="themeToggle" type="button">Light/Dark</button>
          </div>

          <button class="btn" id="loginBtn" type="submit">
            <span class="btn-text">Login</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>

          <div class="msg" id="msg" aria-live="polite"></div>

          <footer class="auth-foot">
            <span class="muted">Secure session</span>
            <span class="dot"></span>
            <span class="muted">Powered by Supabase</span>
          </footer>
        </form>
      </section>
    </main>
  `;

  const idEl = root.querySelector("#login_id");
  const pwEl = root.querySelector("#login_pw");
  const msgEl = root.querySelector("#msg");
  const btnEl = root.querySelector("#loginBtn");
  const togglePw = root.querySelector("#togglePw");
  const themeToggle = root.querySelector("#themeToggle");
  const tabs = Array.from(root.querySelectorAll(".tab"));

  let mode = "id";
  let loading = false;

  const setMsg = (t, kind = "info") => {
    msgEl.className = `msg ${kind}`;
    msgEl.textContent = t || "";
  };

  const setLoading = (v) => {
    loading = v;
    btnEl.classList.toggle("is-loading", v);
    btnEl.disabled = v;
    idEl.disabled = v;
    pwEl.disabled = v;
  };

  const shake = () => {
    const card = root.querySelector(".auth-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
  };

  // Theme
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("classify_theme", t);
  };
  applyTheme(localStorage.getItem("classify_theme") || "dark");

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // Tabs
  tabs.forEach((b) => {
    b.addEventListener("click", () => {
      tabs.forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      mode = b.dataset.mode;
      setMsg("");
      idEl.focus();
    });
  });

  // Show/hide pw
  togglePw.addEventListener("click", () => {
    const isHidden = pwEl.type === "password";
    pwEl.type = isHidden ? "text" : "password";
    togglePw.textContent = isHidden ? "Hide" : "Show";
  });

  // Submit
  root.querySelector(".auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (loading) return;

    const idOrEmail = idEl.value.trim();
    const password = pwEl.value;

    if (!idOrEmail || !password) {
      setMsg("Please enter your ID/email and password.", "error");
      shake();
      return;
    }

    try {
      setLoading(true);
      setMsg("Signing in…", "info");

      // In "id" mode, authService converts ID -> id@classify.local
      await signInWithIdPassword(mode === "email" ? idOrEmail : idOrEmail, password);

      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) throw new Error("No session token");

      const me = await fetchMe(token);
      setMsg("Welcome back!", "success");

      setTimeout(() => onLoggedIn(me.profile), 250);

    } catch (err) {
      console.error("LOGIN_ERROR:", err);
      const message =
        err?.message ||
        err?.error_description ||
        (typeof err === "string" ? err : JSON.stringify(err));
      setMsg(`Login failed: ${message}`, "error");
      shake();

    } finally {
      setLoading(false);
    }
  });

  setTimeout(() => idEl.focus(), 180);
  return root;
}
