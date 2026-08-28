import { initI18n } from "./i18n.js";
import { seedDemo, getSession } from "./store.js";
import { register, initRouter } from "./router.js";
import { initLogin } from "./views/login.js";
import { initSignup } from "./views/signup.js";
import { initFeed } from "./views/feed.js";

const THEME_KEY = "ig:theme";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch (e) {
    /* storage unavailable */
  }
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = toggle.querySelector(".theme-toggle__icon");

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    icon.textContent = isDark ? "☀️" : "🌙";
  };

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* storage unavailable */
    }
  });

  apply(getInitialTheme());
}

async function boot() {
  initTheme();
  initI18n();
  await seedDemo();

  const hasSession = () => Boolean(getSession());

  register("/login", {
    view: "login",
    titleKey: "loginView",
    guard: () => !hasSession(),
    redirectTo: "/feed",
  });
  register("/signup", {
    view: "signup",
    titleKey: "signupView",
    guard: () => !hasSession(),
    redirectTo: "/feed",
  });
  register("/feed", {
    view: "feed",
    titleKey: "feedView",
    guard: hasSession,
    redirectTo: "/login",
  });

  initLogin();
  initSignup();
  initFeed();
  initRouter();
}

boot();
