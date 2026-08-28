import { t } from "./i18n.js";
import { getSession } from "./store.js";

const routes = new Map();
const DEFAULT_ROUTE = "/login";

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "/") return DEFAULT_ROUTE;
  return hash.startsWith("/") ? hash : `/${hash}`;
}

function register(path, options) {
  routes.set(path, options);
}

function updateTitle(path) {
  const route = routes.get(path);
  if (route) document.title = `${t(route.titleKey)} · Instagram`;
}

function show(path) {
  const route = routes.get(path);

  document.querySelectorAll("[data-view]").forEach((section) => {
    section.hidden = section.getAttribute("data-view") !== route.view;
  });

  updateTitle(path);

  const section = document.querySelector(`[data-view="${route.view}"]`);
  if (section) {
    const heading = section.querySelector("[data-view-heading]");
    if (heading) heading.focus({ preventScroll: false });
  }
  window.scrollTo(0, 0);
  document.dispatchEvent(new CustomEvent("routechange", { detail: { path } }));
}

function handle() {
  const path = currentPath();
  const route = routes.get(path);

  if (!route) {
    window.location.replace(`#${DEFAULT_ROUTE}`);
    return;
  }

  if (route.guard && !route.guard()) {
    window.location.replace(`#${route.redirectTo || DEFAULT_ROUTE}`);
    return;
  }

  show(path);
}

function navigate(path) {
  window.location.hash = `#${path}`;
}

function initRouter() {
  window.addEventListener("hashchange", handle);
  document.addEventListener("langchange", () => updateTitle(currentPath()));
  handle();
}

export { initRouter, register, navigate };
