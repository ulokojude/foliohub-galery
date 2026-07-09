document.addEventListener("DOMContentLoaded", () => {
  // 1. Splash Screen Controller
  const curtain = document.getElementById("welcome-curtain");
  const enterBtn = document.getElementById("enter-gallery-btn");

  if (curtain && enterBtn) {
    enterBtn.addEventListener("click", () => {
      curtain.classList.add("dismissed");
    });
  }

  // 2. Template Viewer Controller
  const buttons = document.querySelectorAll(".template-btn");
  const iframe = document.getElementById("live-viewport");
  const urlSlug = document.getElementById("url-slug");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // Clear out previous active classes and highlight current selection
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Extract template folder name (e.g., "minimalist", "terminal")
      const templateName = button.getAttribute("data-template");

      // Update the simulated address browser bar text layout
      urlSlug.textContent = templateName;

      // STEP INSIDE THE SUBFOLDER AND LAUNCH ITS INTERNAL INDEX.HTML
      iframe.src = `templates/${templateName}/index.html`;
    });
  });
});