const STORAGE_KEY = "ig:lang";

const translations = {
  "pt-BR": {
    metaDescription:
      "Entre no Instagram. Faça login para ver fotos e vídeos dos seus amigos.",
    brand: "Instagram",
    themeLabel: "Alternar tema",
    langLabel: "Idioma",
    copyright: "Meta © 2026",

    loginView: "Entrar no Instagram",
    usernameLabel: "Telefone, usuário ou e-mail",
    usernamePlaceholder: "Telefone, usuário ou e-mail",
    passwordLabel: "Senha",
    passwordPlaceholder: "Senha",
    togglePassword: "Mostrar senha",
    togglePasswordHide: "Ocultar senha",
    loginButton: "Entrar",
    orDivider: "OU",
    forgotPassword: "Esqueceu a senha?",
    noAccount: "Não tem uma conta?",
    signUp: "Cadastre-se",
    demoHint: "Conta de demonstração: demo / demo123",

    signupView: "Criar conta",
    suName: "Nome completo",
    suUsername: "Nome de usuário",
    suContact: "Telefone ou e-mail",
    suPassword: "Senha",
    suButton: "Cadastre-se",
    suHaveAccount: "Já tem uma conta?",
    suLogin: "Conecte-se",
    strengthLabel: "Força da senha:",
    strengthWeak: "Fraca",
    strengthMedium: "Média",
    strengthStrong: "Forte",
    capsLock: "Caps Lock ativado",

    feedView: "Feed",
    logoutLabel: "Sair",
    storiesLabel: "Stories",
    like: "Curtir",
    unlike: "Descurtir",
    comment: "Comentar",
    share: "Compartilhar",
    save: "Salvar",
    unsave: "Remover dos salvos",
    likesOne: "1 curtida",
    likesCount: "{n} curtidas",
    feedCaption1: "Primeiro post do feed demo 🌅",
    feedCaption2: "Café e código ☕",
    feedCaption3: "Explorando novos lugares ✈️",
    feedCaption4: "Praia ao entardecer 🌇",
    feedCaption5: "Companhia boa, dia bom ✨",

    getApp: "Baixe o aplicativo",
    appStore: "Disponível na App Store",
    googlePlay: "Disponível no Google Play",

    toastWelcome: "Bem-vindo, {name}!",
    toastLoggedOut: "Você saiu da sua conta.",
    toastAccountCreated: "Conta criada com sucesso!",
    toastInvalid: "Credenciais incorretas. Tente novamente.",
    toastDemoOnly: "Funcionalidade de demonstração.",
    close: "Fechar",

    errName: "Informe seu nome completo.",
    errUsername: "Use 3 a 30 caracteres: letras, números, ponto e underline.",
    errUsernameTaken: "Este nome de usuário já está em uso.",
    errContact: "Informe um e-mail ou telefone válido.",
    errContactTaken: "Este e-mail ou telefone já está em uso.",
    errPassword: "A senha deve ter pelo menos 6 caracteres.",
    errIdentifier: "Informe usuário, e-mail ou telefone.",
    errPasswordRequired: "Informe sua senha.",
  },

  en: {
    metaDescription:
      "Log in to see photos and videos from your friends on Instagram.",
    brand: "Instagram",
    themeLabel: "Toggle theme",
    langLabel: "Language",
    copyright: "Meta © 2026",

    loginView: "Log in to Instagram",
    usernameLabel: "Phone, username, or email",
    usernamePlaceholder: "Phone, username, or email",
    passwordLabel: "Password",
    passwordPlaceholder: "Password",
    togglePassword: "Show password",
    togglePasswordHide: "Hide password",
    loginButton: "Log in",
    orDivider: "OR",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    demoHint: "Demo account: demo / demo123",

    signupView: "Create account",
    suName: "Full name",
    suUsername: "Username",
    suContact: "Phone or email",
    suPassword: "Password",
    suButton: "Sign up",
    suHaveAccount: "Already have an account?",
    suLogin: "Log in",
    strengthLabel: "Password strength:",
    strengthWeak: "Weak",
    strengthMedium: "Medium",
    strengthStrong: "Strong",
    capsLock: "Caps Lock is on",

    feedView: "Feed",
    logoutLabel: "Log out",
    storiesLabel: "Stories",
    like: "Like",
    unlike: "Unlike",
    comment: "Comment",
    share: "Share",
    save: "Save",
    unsave: "Remove from saved",
    likesOne: "1 like",
    likesCount: "{n} likes",
    feedCaption1: "First post of the demo feed 🌅",
    feedCaption2: "Coffee and code ☕",
    feedCaption3: "Exploring new places ✈️",
    feedCaption4: "Beach at sunset 🌇",
    feedCaption5: "Good company, good day ✨",

    getApp: "Get the app",
    appStore: "Available on the App Store",
    googlePlay: "Get it on Google Play",

    toastWelcome: "Welcome, {name}!",
    toastLoggedOut: "You have been logged out.",
    toastAccountCreated: "Account created successfully!",
    toastInvalid: "Incorrect credentials. Please try again.",
    toastDemoOnly: "Demo feature.",
    close: "Close",

    errName: "Please enter your full name.",
    errUsername: "Use 3 to 30 characters: letters, numbers, periods and underscores.",
    errUsernameTaken: "This username is already taken.",
    errContact: "Please enter a valid email or phone number.",
    errContactTaken: "This email or phone number is already in use.",
    errPassword: "Password must be at least 6 characters.",
    errIdentifier: "Please enter your username, email, or phone.",
    errPasswordRequired: "Please enter your password.",
  },
};

function normalize(lang) {
  return translations[lang] ? lang : "pt-BR";
}

function t(key, vars) {
  const lang = normalize(
    document.documentElement.getAttribute("lang") || "pt-BR"
  );
  let str = translations[lang][key];
  if (str == null) str = translations["pt-BR"][key];
  if (str == null) return key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      str = str.replaceAll(`{${name}}`, String(value));
    }
  }
  return str;
}

function applyTranslations() {
  const lang = normalize(document.documentElement.getAttribute("lang"));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang][key];
    if (value != null) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key] != null && !el.getAttribute("placeholder")) {
      el.setAttribute("placeholder", " ");
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    const value = translations[lang][key];
    if (value != null) el.setAttribute("aria-label", value);
  });

  const meta = document.querySelector('meta[name="description"]');
  if (meta && translations[lang].metaDescription != null) {
    meta.setAttribute("content", translations[lang].metaDescription);
  }
}

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch (e) {
    /* storage unavailable */
  }
  const nav = navigator.language || "pt-BR";
  return nav.toLowerCase().startsWith("en") ? "en" : "pt-BR";
}

function setLang(lang) {
  lang = normalize(lang);
  document.documentElement.setAttribute("lang", lang);
  const select = document.getElementById("lang-select");
  if (select) select.value = lang;
  applyTranslations();
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    /* storage unavailable */
  }
}

function initI18n() {
  const select = document.getElementById("lang-select");
  if (select) {
    select.addEventListener("change", () => setLang(select.value));
  }
  setLang(getInitialLang());
}

export { t, setLang, initI18n, applyTranslations };
