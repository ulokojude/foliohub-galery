document.addEventListener("DOMContentLoaded", () => {
  // 1. Splash Screen Controller
  const curtain = document.getElementById("welcome-curtain");
  const enterBtn = document.getElementById("enter-gallery-btn");

  if (curtain && enterBtn) {
    enterBtn.addEventListener("click", () => {
      curtain.classList.add("dismissed");
    });
  }

  // 2. Production Links Registry
  const templateUrls = {
    "minimalist": "https://your-live-minimalist-url.vercel.app",
    "terminal": "https://your-live-terminal-url.vercel.app",
    "neo-brutalism": "https://your-live-brutalism-url.vercel.app"
  };

  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");
  
  let loadTimeout;

  // 3. MASTER ROUTER FUNCTION
  function loadTemplate(key, isDefaultLoad = false) {
    clearTimeout(loadTimeout);

    // If it's the home load, just render the local intro page without hitting timeouts
    if (isDefaultLoad) {
      iframe.src = "intro.html";
      urlSlug.textContent = "welcome.foliohub.dev";
      return;
    }

    const targetWebsiteUrl = templateUrls[key];

    if (targetWebsiteUrl) {
      urlSlug.textContent = key + ".foliohub.dev";
      let hasLoaded = false;

      iframe.onload = () => {
        hasLoaded = true;
      };

      iframe.src = targetWebsiteUrl;

      // Timeout safety check for live buttons
      loadTimeout = setTimeout(() => {
        if (!hasLoaded) {
          iframe.src = "error.html";
          urlSlug.textContent = "error.network-timeout";
        }
      }, 5000);
    }
  }

  // 4. ACTION A: Load your beautiful responsive intro instantly on startup
  loadTemplate(null, true);

  // 5. ACTION B: Run whenever a user clicks a sidebar choice tag button
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