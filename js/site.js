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
  function initReveals() {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal, .reveal-group").forEach((el) => io.observe(el));
  }
  function initAccordions() {
    document.querySelectorAll(".acc__head").forEach((head) => {
      head.setAttribute("aria-expanded", "false");
      head.addEventListener("click", () => {
        const item = head.closest(".acc");
        const open = item.classList.toggle("open");
        head.setAttribute("aria-expanded", String(open));
      });
    });
  }
  document.addEventListener("DOMContentLoaded", () => { initMenu(); initReveals(); initAccordions(); });
})();
