document.addEventListener("DOMContentLoaded", () => {
  // 1. LIVE PRODUCTION TEMPLATE REGISTRY
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

  // 2. REUSABLE ERROR ROUTER HELPER
  function triggerError(codeString, slugString) {
    clearTimeout(loadTimeout);
    loader.classList.remove("show");
    iframe.src = `error.html?code=${codeString}`;
    urlSlug.textContent = `error.${slugString}`;
  }

  // 3. MASTER ROUTER WITH INTEGRATED DELETED-DEPLOYMENT CHECKS
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

      // --- LAYER 1: BACKGROUND FETCH CHECK (Status & Network check) ---
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
        if (!navigator.onLine) {
          triggerError("offline", "network-unreachable");
          return;
        }
      }

      // --- LAYER 2: IFRAME LOAD INTERCEPTION ---
      iframe.onload = () => {
        hasLoaded = true;
        
        try {
          if (iframe.contentDocument && iframe.contentDocument.title.includes("Not Found")) {
            triggerError("404", "deleted-deployment");
            return;
          }
          loader.classList.remove("show");
        } catch (crossOriginError) {
          loader.classList.remove("show");
        }
      };

      iframe.src = targetWebsiteUrl;

      // --- LAYER 3: TIMEOUT SAFETY SHIELD ---
      loadTimeout = setTimeout(() => {
        if (!hasLoaded) {
          triggerError("404", "deployment-not-found");
        }
      }, 5000);
    }
  }

  // 4. RUN SYSTEM INITIALIZATION ON STARTUP (Keeps all nav buttons neutral!)
  loadTemplate(null, true);

  // 5. NAVIGATION SWITCHER INTERACTION LOOPS
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Clear out the active state from all buttons completely first
      buttons.forEach(btn => btn.classList.remove("active"));
      
      // ONLY add the active class to the button that was explicitly clicked!
      button.classList.add("active");

      const clickedKey = button.getAttribute("data-template");
      loadTemplate(clickedKey, false);
    });
  });

  // 6. SPLASH ENGINE LAUNCH CONTROLLER
  const curtain = document.getElementById("welcome-curtain");
  const enterBtn = document.getElementById("enter-gallery-btn");

  if (curtain && enterBtn) {
    enterBtn.addEventListener("click", () => {
      curtain.classList.add("dismissed");
    });
  }
});