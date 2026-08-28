import { t } from "./i18n.js";

function showToast(message, type = "info") {
  const container = document.getElementById("toasts");
  if (!container) return;

  // Keep a sane ceiling on stacked toasts.
  while (container.children.length >= 3) {
    container.firstElementChild.remove();
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  const text = document.createElement("span");
  text.className = "toast__text";
  text.textContent = message;

  const close = document.createElement("button");
  close.className = "toast__close";
  close.type = "button";
  close.setAttribute("aria-label", t("close"));
  close.textContent = "×";

  toast.append(text, close);
  container.append(toast);

  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  let timer = null;
  const dismiss = () => {
    if (timer) clearTimeout(timer);
    toast.classList.remove("toast--visible");
    toast.addEventListener(
      "transitionend",
      () => toast.remove(),
      { once: true }
    );
    setTimeout(() => toast.remove(), 500);
  };

  close.addEventListener("click", dismiss);
  timer = setTimeout(dismiss, 3500);
}

function setFieldError(input, message) {
  const field = input.closest(".field");
  if (!field) return;
  const errorEl = field.querySelector(".field__error");
  if (message) {
    field.classList.add("field--invalid");
    if (errorEl) errorEl.textContent = message;
    input.setAttribute("aria-invalid", "true");
  } else {
    field.classList.remove("field--invalid");
    if (errorEl) errorEl.textContent = "";
    input.removeAttribute("aria-invalid");
  }
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field__input").forEach((input) => {
    setFieldError(input, "");
  });
}

function setLoading(button, isLoading) {
  if (isLoading) {
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.textContent = button.dataset.label;
    button.classList.add("is-loading");
    button.disabled = true;
  } else {
    button.classList.remove("is-loading");
    button.disabled = false;
    if (button.dataset.label) button.textContent = button.dataset.label;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function attachCapsLockHint(input, hintEl) {
  const update = (event) => {
    const on = event.getModifierState && event.getModifierState("CapsLock");
    hintEl.classList.toggle("caps-hint--visible", Boolean(on));
  };
  input.addEventListener("keydown", update);
  input.addEventListener("keyup", update);
  input.addEventListener("blur", () =>
    hintEl.classList.remove("caps-hint--visible")
  );
}

function setupPasswordToggle(toggleButton, passwordInput) {
  const updateLabel = () => {
    const show = passwordInput.type === "text";
    toggleButton.setAttribute("aria-pressed", String(show));
    toggleButton.textContent = show ? t("togglePasswordHide") : t("togglePassword");
  };

  toggleButton.addEventListener("click", () => {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
    updateLabel();
  });

  document.addEventListener("langchange", updateLabel);
  updateLabel();
}

export {
  showToast,
  setFieldError,
  clearFieldErrors,
  setLoading,
  delay,
  attachCapsLockHint,
  setupPasswordToggle,
};
