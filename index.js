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
        // If the user is completely offline
        if (!navigator.onLine) {
          triggerError("offline", "network-unreachable");
          return;
        }
        // If CORS blocks the fetch because a domain has been deleted,
        // it slips straight past and gets caught by Layer 2 and Layer 3 below.
      }

      // --- LAYER 2: IFRAME LOAD INTERCEPTION ---
      iframe.onload = () => {
        hasLoaded = true;
        
        try {
          // If the page loads Vercel's internal "Not Found" error layout template
          if (iframe.contentDocument && iframe.contentDocument.title.includes("Not Found")) {
            triggerError("404", "deleted-deployment");
            return;
          }
          
          loader.classList.remove("show");
        } catch (crossOriginError) {
          // Cross-origin errors are completely normal for successfully loaded live external domains
          loader.classList.remove("show");
        }
      };

      // Change the source to kick off the browser connection request
      iframe.src = targetWebsiteUrl;

      // --- LAYER 3: TIMEOUT SAFETY SHIELD (Catches DEPLOYMENT_NOT_FOUND pages) ---
      loadTimeout = setTimeout(() => {
        if (!hasLoaded) {
          triggerError("404", "deployment-not-found");
        }
      }, 5000); // Strict 5-second cutoff window
    }
  }

  // 4. RUN SYSTEM INITIALIZATION ON STARTUP
  loadTemplate(null, true);

  // 5. NAVIGATION SWITCHER INTERACTION LOOPS
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
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