document.addEventListener("DOMContentLoaded", () => {
  const templateUrls = {
    "minimalist": "https://your-live-minimalist-url.vercel.app",
    "terminal": "https://your-live-terminal-url.vercel.app",
    "neo-brutalism": "https://your-live-brutalism-url.vercel.app"
  };

  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");
  const loader = document.getElementById("preview-loader"); // Grab the loader container
  
  let loadTimeout;

  function loadTemplate(key, isDefaultLoad = false) {
    clearTimeout(loadTimeout);

    if (isDefaultLoad) {
      iframe.src = "intro.html";
      urlSlug.textContent = "welcome.foliohub.dev";
      return;
    }

    const targetWebsiteUrl = templateUrls[key];

    if (targetWebsiteUrl) {
      // 1. TRIGGER THE LOADING SCREEN INSTANTLY BEFORE THE NETWORK HIT
      loader.classList.add("show");
      
      urlSlug.textContent = key + ".foliohub.dev";
      let hasLoaded = false;

      iframe.onload = () => {
        hasLoaded = true;
        // 2. DISMISS THE LOADER SCREEN THE INSTANT THE SITE IS READY
        loader.classList.remove("show");
      };

      iframe.src = targetWebsiteUrl;

      // Timeout safety tracker
      loadTimeout = setTimeout(() => {
        if (!hasLoaded) {
          loader.classList.remove("show"); // Hide loader so error can show
          iframe.src = "error.html";
          urlSlug.textContent = "error.network-timeout";
        }
      }, 5000);
    }
  }

  // Initial Startup Run
  loadTemplate(null, true);

  // Button Event Listeners
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const clickedKey = button.getAttribute("data-template");
      loadTemplate(clickedKey, false);
    });
  });
});


// --- SPLASH ENGINE LAUNCH CONTROLLER ---
const curtain = document.getElementById("welcome-curtain");
const enterBtn = document.getElementById("enter-gallery-btn");

if (curtain && enterBtn) {
  enterBtn.addEventListener("click", () => {
    // Gracefully fade and pop the system curtain node out of layout memory
    curtain.classList.add("dismissed");
  });
}