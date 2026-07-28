/* v2 site behaviors — populated by Tasks 3 & 4 */
(() => {
  "use strict";
  // initMenu, initReveals, initAccordions attached here in later tasks
  function initMenu() {
    const overlay = document.getElementById("menu-overlay");
    const openBtn = document.querySelector(".menu-btn");
    const closeBtn = overlay && overlay.querySelector(".close-btn");
    if (!overlay || !openBtn || !closeBtn) return;
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
  /* Only the homepage hero sits under a transparent header. */
  function initHeaderScroll() {
    const hero = document.querySelector(".hero");
    if (!hero) return;
    const sync = () => document.body.classList.toggle("at-top", window.scrollY < 40);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }
  /* Reveals are fail-closed (content starts at opacity 0), so a throw in any
     one init must not prevent the others from running. */
  document.addEventListener("DOMContentLoaded", () => {
    for (const init of [initMenu, initHeaderScroll, initReveals, initAccordions]) {
      try { init(); } catch (err) { console.error(init.name, err); }
    }
  });
})();
