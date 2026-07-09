document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // 1. Clear out previous active link color frames
      buttons.forEach(btn => btn.classList.remove("active"));
      
      // 2. Set current selected link active
      button.classList.add("active");

      // 3. Extract target name token parameter
      const templateName = button.getAttribute("data-template");

      // 4. Update the simulated address layout bar
      urlSlug.textContent = templateName;

      // 5. Instantly slide the target template page into view
      iframe.src = `templates/${templateName}.html`;
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