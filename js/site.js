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
  /* Scroll-in reveals. Group children are observed one by one rather than
     the group as a whole: a 17-card grid on a phone is ~7000px tall, so no
     15% of it is ever on screen at once and the group never revealed at all.
     Children that enter together are staggered; a lone card scrolling in
     later gets no delay. */
  function initReveals() {
    const io = new IntersectionObserver((entries) => {
      let k = 0;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (e.target.matches(".reveal-group > *")) {
          e.target.style.transitionDelay = Math.min(k++ * 80, 480) + "ms";
        }
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal, .reveal-group > *").forEach((el) => io.observe(el));
  }
  function initAccordions() {
    document.querySelectorAll(".acc__head").forEach((head) => {
      head.setAttribute("aria-expanded", "false");
      head.addEventListener("click", () => {
        const item = head.closest(".acc");
        const open = item.classList.toggle("open");
        head.setAttribute("aria-expanded", String(open));
        /* One accordion per page, everywhere: opening an item closes every
           other open item (experience, FAQ, about, project cards alike). */
        if (open) {
          document.querySelectorAll(".acc.open").forEach((other) => {
            if (other === item) return;
            other.classList.remove("open");
            const otherHead = other.querySelector(".acc__head");
            if (otherHead) otherHead.setAttribute("aria-expanded", "false");
          });
        }
      });
    });
  }
  /* Home: pronunciation clip. The speaker button is only interactive when
     the clip actually loads; without a file the panel is plain text. */
  /* Name pronunciation. Like Google's dictionary button: the first click plays
     the clip at normal speed; clicking again within 5s plays the slow version,
     and clicks keep alternating while they stay inside that window. Every
     .name-panel__say button (pronunciation, Gujarati) shares this state. */
  function initNameAudio() {
    const btns = [...document.querySelectorAll(".name-panel__say")];
    const normal = document.getElementById("name-audio");
    const slow = document.getElementById("name-audio-slow");
    if (!btns.length || !normal) return;
    const REPEAT_WINDOW = 5000;
    const disable = () => btns.forEach((b) => { b.classList.add("no-audio"); b.disabled = true; });
    const unavailable = (a) => !a || a.error || a.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
    /* preload="metadata" means a load may already have failed before this runs. */
    normal.addEventListener("error", disable);
    if (unavailable(normal)) disable();
    const stopped = () => btns.forEach((b) => b.classList.remove("playing"));
    [normal, slow].forEach((a) => {
      if (!a) return;
      a.addEventListener("ended", stopped);
      a.addEventListener("pause", stopped);
    });
    let lastClick = 0;
    let lastClip = null;
    btns.forEach((btn) => btn.addEventListener("click", () => {
      const now = Date.now();
      const repeat = now - lastClick < REPEAT_WINDOW && lastClip === normal;
      const clip = repeat && !unavailable(slow) ? slow : normal;
      lastClick = now;
      lastClip = clip;
      const other = clip === normal ? slow : normal;
      if (other && !other.paused) other.pause();
      clip.currentTime = 0;
      clip.play().then(() => { stopped(); btn.classList.add("playing"); }).catch(() => {
        if (clip === normal) disable();
      });
    }));
  }
  /* Page-to-page transitions. Browsers with cross-document view transitions
     do this in CSS (@view-transition). Elsewhere, fade the page out before
     following an internal link; the CSS fades the arriving page in. */
  function initPageTransitions() {
    if ("CSSViewTransitionRule" in window) return;
    document.documentElement.classList.add("vt-fallback");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* A back/forward-cache restore would otherwise show the faded-out page. */
    window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));
    document.addEventListener("click", (e) => {
      if (reduced || e.defaultPrevented || e.button !== 0 ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return; /* in-page anchor */
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { location.href = url.href; }, 300);
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
    for (const init of [initMenu, initHeaderScroll, initReveals, initAccordions, initNameAudio, initPageTransitions]) {
      try { init(); } catch (err) { console.error(init.name, err); }
    }
  });
})();
