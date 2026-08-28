import {
  getSession,
  clearSession,
  getUserState,
  toggleLike,
  toggleSave,
} from "../store.js";
import { t } from "../i18n.js";
import { showToast } from "../ui.js";
import { navigate } from "../router.js";

const POSTS = [
  { id: "p1", user: "ana.souza", seed: "ig-aurora", caption: "feedCaption1", baseLikes: 214 },
  { id: "p2", user: "carlos.dev", seed: "ig-coffee", caption: "feedCaption2", baseLikes: 87 },
  { id: "p3", user: "bia.travels", seed: "ig-travel", caption: "feedCaption3", baseLikes: 452 },
  { id: "p4", user: "lucas.fit", seed: "ig-sunset", caption: "feedCaption4", baseLikes: 133 },
  { id: "p5", user: "mari.art", seed: "ig-colors", caption: "feedCaption5", baseLikes: 321 },
];

const STORIES = [
  "demo",
  "ana.souza",
  "carlos.dev",
  "bia.travels",
  "lucas.fit",
  "mari.art",
];

const ICONS = {
  heart: (filled) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z" ${
      filled ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="2"'
    }/></svg>`,
  comment:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg>',
  share:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="22" x2="9.218" y1="3" y2="10.083" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg>',
  bookmark: (filled) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" ${
      filled ? 'fill="currentColor" stroke="currentColor"' : 'fill="none" stroke="currentColor"'
    } stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>`,
  logout:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="17 8 21 12 17 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function avatarInitials(name) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function likesText(count) {
  return count === 1 ? t("likesOne") : t("likesCount", { n: count });
}

function renderStories(container, session) {
  const nav = container.querySelector(".stories");
  nav.setAttribute("aria-label", t("storiesLabel"));
  nav.innerHTML = "";

  STORIES.forEach((user) => {
    const isMe = user === session.username;
    const name = isMe ? session.name : user;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "story";
    button.innerHTML = `
      <span class="story__ring">
        <span class="avatar avatar--story">${esc(avatarInitials(name))}</span>
      </span>
      <span class="story__name">${esc(isMe ? t("storiesLabel") : user)}</span>`;
    button.addEventListener("click", () => showToast(t("toastDemoOnly"), "info"));
    nav.append(button);
  });
}

function renderPosts(container, session) {
  const list = container.querySelector(".posts");
  const state = getUserState(session.username);
  list.innerHTML = "";

  POSTS.forEach((post) => {
    const liked = Boolean(state.likes[post.id]);
    const saved = Boolean(state.saves[post.id]);
    const count = post.baseLikes + (liked ? 1 : 0);
    const caption = t(post.caption);

    const article = document.createElement("article");
    article.className = "post";
    article.dataset.post = post.id;
    article.innerHTML = `
      <header class="post__header">
        <span class="avatar avatar--post" aria-hidden="true">${esc(avatarInitials(post.user))}</span>
        <span class="post__user">${esc(post.user)}</span>
      </header>
      <figure class="post__media">
        <img
          src="https://picsum.photos/seed/${encodeURIComponent(post.seed)}/600/600"
          alt="${esc(caption)}"
          loading="lazy"
        />
      </figure>
      <div class="post__body">
        <div class="post__actions">
          <button type="button" class="post__action post__action--like${liked ? " is-liked" : ""}"
            aria-pressed="${liked}" aria-label="${esc(liked ? t("unlike") : t("like"))}">
            ${ICONS.heart(liked)}
          </button>
          <button type="button" class="post__action post__action--comment" aria-label="${esc(t("comment"))}">
            ${ICONS.comment}
          </button>
          <button type="button" class="post__action post__action--share" aria-label="${esc(t("share"))}">
            ${ICONS.share}
          </button>
          <button type="button" class="post__action post__action--save${saved ? " is-saved" : ""}"
            aria-pressed="${saved}" aria-label="${esc(saved ? t("unsave") : t("save"))}">
            ${ICONS.bookmark(saved)}
          </button>
        </div>
        <p class="post__likes">${esc(likesText(count))}</p>
        <p class="post__caption"><strong>${esc(post.user)}</strong> ${esc(caption)}</p>
      </div>`;

    const img = article.querySelector("img");
    const media = article.querySelector(".post__media");
    img.addEventListener("load", () => media.classList.add("is-loaded"));
    img.addEventListener("error", () => {
      media.classList.add("is-fallback", "is-loaded");
      img.remove();
    });

    const likeButton = article.querySelector(".post__action--like");
    likeButton.addEventListener("click", () => {
      const isLiked = toggleLike(session.username, post.id);
      likeButton.classList.toggle("is-liked", isLiked);
      likeButton.setAttribute("aria-pressed", String(isLiked));
      likeButton.setAttribute("aria-label", isLiked ? t("unlike") : t("like"));
      likeButton.querySelector("svg").outerHTML = ICONS.heart(isLiked);
      likeButton.classList.remove("is-pop");
      requestAnimationFrame(() => likeButton.classList.add("is-pop"));
      const likesEl = article.querySelector(".post__likes");
      likesEl.textContent = likesText(post.baseLikes + (isLiked ? 1 : 0));
    });

    const saveButton = article.querySelector(".post__action--save");
    saveButton.addEventListener("click", () => {
      const isSaved = toggleSave(session.username, post.id);
      saveButton.classList.toggle("is-saved", isSaved);
      saveButton.setAttribute("aria-pressed", String(isSaved));
      saveButton.setAttribute("aria-label", isSaved ? t("unsave") : t("save"));
      saveButton.querySelector("svg").outerHTML = ICONS.bookmark(isSaved);
    });

    article
      .querySelector(".post__action--comment")
      .addEventListener("click", () => showToast(t("toastDemoOnly"), "info"));
    article
      .querySelector(".post__action--share")
      .addEventListener("click", () => showToast(t("toastDemoOnly"), "info"));

    list.append(article);
  });
}

function renderFeed() {
  const view = document.querySelector('[data-view="feed"]');
  if (!view) return;
  const session = getSession();
  if (!session) return;

  const header = view.querySelector(".feed-header");
  const avatarSlot = header.querySelector(".avatar--header");
  avatarSlot.textContent = avatarInitials(session.name);
  header.setAttribute("aria-label", session.name);

  renderStories(view, session);
  renderPosts(view, session);
}

function initFeed() {
  const view = document.querySelector('[data-view="feed"]');
  if (!view) return;

  const logoutButton = view.querySelector("#logout-button");
  logoutButton.innerHTML = ICONS.logout;

  logoutButton.addEventListener("click", () => {
    clearSession();
    showToast(t("toastLoggedOut"), "info");
    navigate("/login");
  });

  document.addEventListener("langchange", renderFeed);
  document.addEventListener("routechange", (event) => {
    if (event.detail.path === "/feed") renderFeed();
  });
  renderFeed();
}

export { initFeed };
