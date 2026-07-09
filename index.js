document.addEventListener("DOMContentLoaded", () => {
  const templateUrls = {
    "minimalist": "https://google.com",
    "name": "url"
  };

  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");
  
  let loadTimeout; // Holds our active background timer

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Clear out any previous countdown timers instantly
      clearTimeout(loadTimeout);

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const clickedKey = button.getAttribute("data-template");
      const targetWebsiteUrl = templateUrls[clickedKey];

      if (targetWebsiteUrl) {
        urlSlug.textContent = clickedKey + ".foliohub.dev";
        
        let hasLoaded = false;

        // 1. Listen for the absolute second the iframe successfully connects
        iframe.onload = () => {
          hasLoaded = true;
        };

        // 2. Fire up the live remote connection attempt
        iframe.src = targetWebsiteUrl;

        // 3. START THE COUNTDOWN: Wait 5 seconds (5000 milliseconds)
        loadTimeout = setTimeout(() => {
          if (!hasLoaded) {
            // Force the iframe to render our clean fallback file instead
            iframe.src = "error.html";
            urlSlug.textContent = "error.network-timeout";
          }
        }, 5000);
      }
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