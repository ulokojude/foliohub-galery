document.addEventListener("DOMContentLoaded", () => {
  const templateUrls = {
    "aurora": "https://folio-temp.vercel.app/aurora.html",
    "brutalist": "https://folio-temp.vercel.app/brutalist.html",
    "cyber-glow": "https://folio-temp.vercel.app/cyber-glow.html",
    "editorial": "https://folio-temp.vercel.app/editorial.html",
    "noir": "https://folio-temp.vercel.app/noir.html",
    "retro-desktop": "https://folio-temp.vercel.app/retro-desktop.html",
    "schematic": "https://folio-temp.vercel.app/schematic.html",
    "SysOps_Dark": "https://folio-temp.vercel.app/SysOps_Dark.html",
    "vapowave": "https://folio-temp.vercel.app/vapowave.html",
    "bento": "https://folio-temp.vercel.app/bento.html",
  };

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
  // Listen for the live templates to say "I am successfully alive!"
  window.addEventListener("message", (event) => {
    if (event.data === "foliohub-template-success") {
      // The template is alive! Clear the countdown timer and hide the loader
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

    const targetWebsiteUrl = templateUrls[key];

    if (targetWebsiteUrl) {
      loader.classList.add("show");
      urlSlug.textContent = key + ".foliohub.dev";

      // Instantly start loading the target template
      iframe.src = targetWebsiteUrl;

      // START THE COUNTDOWN: If the template doesn't ping us in 3.5 seconds,
      // it means Vercel's native 404 error page has hijacked the iframe window.
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