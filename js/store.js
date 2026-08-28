const USERS_KEY = "ig:users";
const SESSION_KEY = "ig:session";

function stateKey(username) {
  return `ig:state:${username}`;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable */
  }
}

async function hashPassword(password, salt) {
  const payload = `${salt}:${password}`;
  if (window.crypto && crypto.subtle && "digest" in crypto.subtle) {
    const bytes = new TextEncoder().encode(payload);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback determinístico (demonstração) para contextos sem crypto.subtle.
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return `${(h1 >>> 0).toString(16)}${(h2 >>> 0).toString(16)}`;
}

function newSalt() {
  if (window.crypto && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(16).slice(2, 18);
}

function getUsers() {
  return readJSON(USERS_KEY, []);
}

function saveUsers(users) {
  writeJSON(USERS_KEY, users);
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function normalizeContact(contact) {
  const raw = String(contact || "").trim();
  if (raw.includes("@")) return raw.toLowerCase();
  return raw.replace(/\D/g, "");
}

function findByUsername(username) {
  const target = normalizeUsername(username);
  return getUsers().find((u) => u.username === target) || null;
}

function findByContact(contact) {
  const target = normalizeContact(contact);
  if (!target) return null;
  return getUsers().find((u) => u.contact === target) || null;
}

function findByIdentifier(identifier) {
  return findByUsername(identifier) || findByContact(identifier);
}

async function createUser({ name, username, contact, password }) {
  const uname = normalizeUsername(username);
  const ucontact = normalizeContact(contact);

  // Enforced here as well (defense in depth), not only in the signup view.
  if (findByUsername(uname)) {
    throw new Error("username-taken");
  }
  if (findByContact(ucontact)) {
    throw new Error("contact-taken");
  }

  const salt = newSalt();
  const user = {
    name: String(name || "").trim(),
    username: uname,
    contact: ucontact,
    salt,
    passHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return publicUser(user);
}

function publicUser(user) {
  return { name: user.name, username: user.username, contact: user.contact };
}

async function verifyLogin(identifier, password) {
  const user = findByIdentifier(identifier);
  if (!user) return null;
  const hash = await hashPassword(password, user.salt);
  return hash === user.passHash ? publicUser(user) : null;
}

function saveSession(user) {
  writeJSON(SESSION_KEY, { ...user, since: new Date().toISOString() });
}

function getSession() {
  return readJSON(SESSION_KEY, null);
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    /* storage unavailable */
  }
}

function getUserState(username) {
  return readJSON(stateKey(username), { likes: {}, saves: {} });
}

function saveUserState(username, state) {
  writeJSON(stateKey(username), state);
}

function toggleLike(username, postId) {
  const state = getUserState(username);
  state.likes[postId] = !state.likes[postId];
  saveUserState(username, state);
  return state.likes[postId];
}

function toggleSave(username, postId) {
  const state = getUserState(username);
  state.saves[postId] = !state.saves[postId];
  saveUserState(username, state);
  return state.saves[postId];
}

async function seedDemo() {
  if (getUsers().length > 0) return;
  await createUser({
    name: "Demo",
    username: "demo",
    contact: "demo@instagram.com",
    password: "demo123",
  });
}

export {
  createUser,
  verifyLogin,
  findByUsername,
  findByContact,
  findByIdentifier,
  saveSession,
  getSession,
  clearSession,
  getUserState,
  toggleLike,
  toggleSave,
  seedDemo,
};
