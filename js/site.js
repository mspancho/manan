/* v2 site behaviors — populated by Tasks 3 & 4 */
(() => {
  "use strict";
  // initMenu, initReveals, initAccordions attached here in later tasks
  function initMenu() {
    const overlay = document.getElementById("menu-overlay");
    const openBtn = document.querySelector(".menu-btn");
    const closeBtn = overlay && overlay.querySelector(".close-btn");
    if (!overlay || !openBtn) return;
    const setOpen = (open) => {
      overlay.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      openBtn.setAttribute("aria-expanded", String(open));
      (open ? closeBtn : openBtn).focus();
    };
    openBtn.addEventListener("click", () => setOpen(true));
    closeBtn.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) setOpen(false);
    });
  }
  document.addEventListener("DOMContentLoaded", () => { initMenu(); });
})();
