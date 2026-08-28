import {
  createUser,
  findByUsername,
  findByContact,
  saveSession,
} from "../store.js";
import { t } from "../i18n.js";
import {
  showToast,
  setFieldError,
  clearFieldErrors,
  setLoading,
  delay,
  setupPasswordToggle,
  attachCapsLockHint,
} from "../ui.js";
import { navigate } from "../router.js";

const USERNAME_RE = /^[a-zA-Z0-9._]{3,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isContactValid(contact) {
  if (contact.includes("@")) return EMAIL_RE.test(contact);
  const digits = contact.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

function passwordScore(password) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-zA-Z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

function updateStrength(meter, label, password) {
  const score = passwordScore(password);
  const levels = ["", "weak", "weak", "medium", "strong"];
  const level = password ? levels[score] : "";
  meter.className = `strength__bar${level ? ` strength__bar--${level}` : ""}`;
  meter.style.width = password ? `${Math.max(score, 1) * 25}%` : "0";
  label.textContent = password
    ? t(
        level === "strong"
          ? "strengthStrong"
          : level === "medium"
            ? "strengthMedium"
            : "strengthWeak"
      )
    : "";
  return level;
}

function initSignup() {
  const view = document.querySelector('[data-view="signup"]');
  if (!view) return;

  const form = view.querySelector("#signup-form");
  const name = view.querySelector("#su-name");
  const username = view.querySelector("#su-username");
  const contact = view.querySelector("#su-contact");
  const password = view.querySelector("#su-password");
  const submitButton = form.querySelector('button[type="submit"]');
  const toggleButton = view.querySelector("#su-toggle-password");
  const capsHint = view.querySelector("#su-caps-hint");
  const meter = view.querySelector("#su-strength-bar");
  const strengthLabel = view.querySelector("#su-strength-label");

  setupPasswordToggle(toggleButton, password);
  attachCapsLockHint(password, capsHint);

  username.addEventListener("input", () => {
    username.value = username.value.replace(/\s/g, "");
  });

  password.addEventListener("input", () => {
    updateStrength(meter, strengthLabel, password.value);
  });

  [name, username, contact, password].forEach((input) => {
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("field--invalid")) {
        validateField(input);
      }
    });
  });

  function validateField(input) {
    const value = input.value.trim();
    let message = "";

    if (input === name && value.length < 2) message = t("errName");
    if (input === username) {
      if (!USERNAME_RE.test(value)) message = t("errUsername");
      else if (findByUsername(value)) message = t("errUsernameTaken");
    }
    if (input === contact) {
      if (!isContactValid(value)) message = t("errContact");
      else if (findByContact(value)) message = t("errContactTaken");
    }
    if (input === password && value.length < 6) message = t("errPassword");

    setFieldError(input, message);
    return !message;
  }

  function validateAll() {
    return [name, username, contact, password]
      .map((input) => validateField(input))
      .every(Boolean);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return; // double-submit guard
    clearFieldErrors(form);
    if (!validateAll()) return;

    setLoading(submitButton, true);
    let user;
    try {
      await delay(700);
      user = await createUser({
        name: name.value,
        username: username.value,
        contact: contact.value,
        password: password.value,
      });
    } catch (err) {
      // Store-level uniqueness enforcement (defense in depth).
      if (err.message === "username-taken") {
        setFieldError(username, t("errUsernameTaken"));
      } else if (err.message === "contact-taken") {
        setFieldError(contact, t("errContactTaken"));
      } else {
        showToast(t("toastInvalid"), "error");
      }
      setLoading(submitButton, false);
      return;
    }
    setLoading(submitButton, false);

    saveSession(user);
    showToast(t("toastWelcome", { name: user.name }), "success");
    form.reset();
    updateStrength(meter, strengthLabel, "");
    navigate("/feed");
  });

  // Re-translate the strength label when the language changes.
  document.addEventListener("langchange", () => {
    updateStrength(meter, strengthLabel, password.value);
  });
}

export { initSignup };
