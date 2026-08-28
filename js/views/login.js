import { verifyLogin, saveSession } from "../store.js";
import { t } from "../i18n.js";
import {
  showToast,
  setFieldError,
  clearFieldErrors,
  setLoading,
  delay,
  setupPasswordToggle,
} from "../ui.js";
import { navigate } from "../router.js";

function initLogin() {
  const view = document.querySelector('[data-view="login"]');
  if (!view) return;

  const form = view.querySelector("#login-form");
  const identifier = view.querySelector("#username");
  const password = view.querySelector("#password");
  const submitButton = form.querySelector('button[type="submit"]');
  const toggleButton = view.querySelector("#toggle-password");
  const forgotLink = view.querySelector(".forgot-link");

  setupPasswordToggle(toggleButton, password);

  identifier.addEventListener("input", () => {
    if (identifier.closest(".field").classList.contains("field--invalid")) {
      validateFields();
    }
  });

  password.addEventListener("input", () => {
    if (password.closest(".field").classList.contains("field--invalid")) {
      validateFields();
    }
  });

  function validateFields() {
    let valid = true;
    if (!identifier.value.trim()) {
      setFieldError(identifier, t("errIdentifier"));
      valid = false;
    } else {
      setFieldError(identifier, "");
    }
    if (!password.value.trim()) {
      setFieldError(password, t("errPasswordRequired"));
      valid = false;
    } else {
      setFieldError(password, "");
    }
    return valid;
  }

  forgotLink.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(t("toastDemoOnly"), "info");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return; // double-submit guard
    clearFieldErrors(form);
    if (!validateFields()) return;

    setLoading(submitButton, true);
    const [user] = await Promise.all([
      verifyLogin(identifier.value.trim(), password.value),
      delay(700),
    ]);
    setLoading(submitButton, false);

    if (!user) {
      showToast(t("toastInvalid"), "error");
      password.value = "";
      password.focus();
      return;
    }

    saveSession(user);
    showToast(t("toastWelcome", { name: user.name }), "success");
    navigate("/feed");
  });
}

export { initLogin };
