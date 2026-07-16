document.addEventListener("DOMContentLoaded", () => {
  // --- SINGLE TEMPLATE STRING CONFIG ---
  // This replaces the entire hardcoded dictionary!
  const getTemplateUrl = (key) => `https://folio-temp.vercel.app/${key}.html`;

  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");
  const loader = document.getElementById("preview-loader");
  
  let loadTimeout;

  function triggerError(codeString, slugString) {
    clearTimeout(loadTimeout);
    loader.classList.remove("show");
    iframe.src = `error.html?code=${codeString}`;
    urlSlug.textContent = `error.${slugString}`;
  }

  // --- THE CORS SAFETY BRIDGE ---
  window.addEventListener("message", (event) => {
    if (event.data === "foliohub-template-success") {
      clearTimeout(loadTimeout);
      loader.classList.remove("show");
    }
  });

  async function loadTemplate(key, isDefaultLoad = false) {
    clearTimeout(loadTimeout);

    if (isDefaultLoad) {
      iframe.src = "intro.html";
      urlSlug.textContent = "welcome.foliohub.dev";
      return;
    }

    // Dynamically build the target URL using our template string function
    const targetWebsiteUrl = getTemplateUrl(key);

    if (key) {
      loader.classList.add("show");
      urlSlug.textContent = `${key}.foliohub.dev`;

      // Instantly start loading the target template
      iframe.src = targetWebsiteUrl;

      // START THE COUNTDOWN
      loadTimeout = setTimeout(() => {
        triggerError("404", "deployment-not-found");
      }, 6000);
    }
  }

  // Startup Init
  loadTemplate(null, true);

  // Click Listeners
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Grabs "aurora" from your data-template="aurora" attribute
      const clickedKey = button.getAttribute("data-template");
      loadTemplate(clickedKey, false);
    });
  });

  // Splash Window Screen Controller
  const curtain = document.getElementById("welcome-curtain");
  const enterBtn = document.getElementById("enter-gallery-btn");
  if (curtain && enterBtn) {
    enterBtn.addEventListener("click", () => {
      curtain.classList.add("dismissed");
    });
  }
});