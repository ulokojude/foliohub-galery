document.addEventListener("DOMContentLoaded", () => {
  const templateUrls = {
    "minimalist": "https://your-live-minimalist-url.vercel.app",
    "terminal": "https://your-live-terminal-url.vercel.app",
    "neo-brutalism": "https://your-live-brutalism-url.vercel.app"
  };

  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");
  const loader = document.getElementById("preview-loader");
  
  let loadTimeout;

  // Reusable error router helper
  function triggerError(codeString, slugString) {
    loader.classList.remove("show");
    iframe.src = `error.html?code=${codeString}`;
    urlSlug.textContent = `error.${slugString}`;
  }

  async function loadTemplate(key, isDefaultLoad = false) {
    clearTimeout(loadTimeout);

    if (isDefaultLoad) {
      iframe.src = "intro.html";
      urlSlug.textContent = "welcome.foliohub.dev";
      return;
    }

    const targetWebsiteUrl = templateUrls[key];

    if (targetWebsiteUrl) {
      loader.classList.add("show");
      urlSlug.textContent = key + ".foliohub.dev";
      let hasLoaded = false;

      // --- CRITICAL CATCH BLOCK 1: HTTP STATUS CODES & OFFLINE STATES ---
      try {
        const response = await fetch(targetWebsiteUrl, { method: 'GET', cache: 'no-store' });

        if (response.status === 404) {
          triggerError("404", "not-found");
          return; 
        }

        if (response.status >= 500) {
          triggerError("500", "server-crash");
          return;
        }
      } catch (networkError) {
        // If the user's internet is out or DNS completely fails to resolve
        if (!navigator.onLine) {
          triggerError("offline", "network-unreachable");
          return;
        }
        // Otherwise, allow it to fall back to the frame connection checker below
      }

      // --- CRITICAL CATCH BLOCK 2: IFRAME RENDERING HANGS/TIMEOUTS ---
      iframe.onload = () => {
        hasLoaded = true;
        loader.classList.remove("show");
      };

      iframe.src = targetWebsiteUrl;

      // Start the backup global countdown timer
      loadTimeout = setTimeout(() => {
        if (!hasLoaded) {
          triggerError("timeout", "network-timeout");
        }
      }, 6000); // 6 seconds backup allowance
    }
  }

  // Initial Startup
  loadTemplate(null, true);

  // Click Router Loops
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