# Portfolio Website v2 — MHI-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild mspancho/manan as a "v2" that mimics the Montreal Heart Institute Foundation's UX (editorial typography, full-screen overlay menu, scroll-triggered reveals, accordion progressive disclosure, clean mobile adaptation) while keeping ALL v1 content, the hero + typewriter, the five-page IA, and the existing blue/green/ice palette — deployable to Hostinger exactly as today, with instant rollback to v1.

**Architecture:** Pure static site (vanilla HTML/CSS/JS, zero build step) — the repo remains the deployable artifact. One new stylesheet (`css/style.css`) built on design tokens sampled from `images/background_with_headshot.jpg`; one shared behavior file (`js/site.js`) providing the overlay menu, scroll-reveal system, and accordion component via IntersectionObserver + CSS transitions (no animation libraries). Every page keeps its v1 filename/URL. v1 is frozen as tag `v1.0.0` + branch `v1`; v2 is developed on branch `v2` and released as `v2.0.0` on `main`.

**Tech Stack:** HTML5, CSS (custom properties, grid, `clamp()`, scroll-driven transitions), vanilla JS (IntersectionObserver), Google Fonts (Fraunces display serif + Mako body sans), Font Awesome **Pro 6.7.2** (same CDN links as v1), existing Google Apps Script form endpoint. No frameworks, no bundler, no npm.

## Global Constraints

- **No build step.** The site must deploy by copying repo files to Hostinger `public_html` (File Manager upload or hPanel Git deploy). Nothing may require compilation.
- **Keep page filenames/URLs verbatim:** `index.html`, `about.html`, `projects.html`, `exp.html`, `faq.html`.
- **Keep all v1 text content verbatim** (per user instruction): hero + typewriter phrases, About intro + tab titles (Toolbox / Interests / Education / Coursework / Awards / Certifications) + tab contents, all 11 project cards' text, all Experience entries, all FAQ Q&As. Changes are aesthetic/layout/UX only. Recoverable at any time via `git show v1.0.0:<file>`.
- **Nav items fixed:** Home, About, Projects, Experience, FAQ (same five, same order).
- **Palette:** only the tokens defined in Task 2 (sampled from `images/background_with_headshot.jpg` + v1 heritage accents). No new hues.
- **Contact form endpoint unchanged:** the Google Apps Script URL in `faq.html` must be carried over exactly.
- **Keep Font Awesome Pro.** v2 carries over v1's exact FA Pro 6.7.2 stylesheet links (all ten: `fontawesome`, `solid`, `regular`, `light`, `brands`, `sharp-solid`, `sharp-regular`, `sharp-light`, `duotone`). All v1 icon class names (`fa-light fa-bars`, `fa-solid fa-file-user`, `fa-head-side-brain`, `fa-comments-question`, `fa-users-medical`, `fa-user-music`, `fa-presentation-screen`, `fa-browser`, …) are used unchanged — no icon substitutions anywhere in v2.
- **All motion must respect `prefers-reduced-motion: reduce`.**
- **Fix the viewport meta everywhere:** v1 has `content="width-device-width, initial-scale=1.0"` (typo, invalid). v2 uses `content="width=device-width, initial-scale=1.0"`.
- **Fix wrong page titles:** `exp.html` and `faq.html` both currently say `<title>Projects</title>`.
- **Rollback guarantee:** `v1` branch + `v1.0.0` tag are never rebased/deleted; the Hostinger deploy source can be switched between v1 and v2 at any time (runbook in Task 12).

---

## Design Language Spec (consumed by every task)

Derived from the two Gemini teardowns of the MHI screen recordings + WebFetch of fondationicm.org, recolored to the user's palette.

| MHI pattern (observed) | v2 translation |
|---|---|
| Red `#D21034` brand color: full-screen overlay menu, CTAs, active states | Indigo `--brand` `#6a80d5` / navy `--brand-deep` `#5075bb` |
| White + light grey/pink section backgrounds | `--paper` near-white + `--ice` `#ddeefe` / `#d1f3f5` section bands |
| Bold modern **serif** headlines + geometric sans body | **Fraunces** (700–900) display + **Mako** body (v1 continuity) |
| Sticky minimal header: logo left, "Menu" button right | Same — logo left, `Menu ☰` button right, on ALL viewports |
| Full-screen brand-color overlay menu, large white links w/ arrows, tiered drill-down | Full-screen indigo-gradient overlay, 5 large links, staggered link reveal |
| Staggered scroll reveals: fade + ~24px rise, ease-out | `.reveal` system, 600ms, 80ms stagger |
| Accordions with thin dividers, "+" → "−", ~300ms ease | `.acc` component (Experience, FAQ, project card details, About-on-mobile) |
| Floating persistent CTA (Donate heart, bottom-right) | Floating "Résumé ↓" pill → `images/Pancholy_Manan_Resume.pdf` |
| Large pull-quote serif moments breaking up text | Big serif statement line on home ("mission statement" pattern) |
| Card grids w/ category tag, title, arrow "Find out more" | Projects grid: icon, tag chip, title, blurb, arrow link |
| Horizontal slider w/ "1/3" counter (mobile related-articles) | Not needed — Projects becomes a grid (better for 11 text cards) |
| Single-column mobile, large touch targets, generous line-height | 1-col stacking at `≤720px`, 44px min touch targets |

**Type scale (both fonts via one Google Fonts request):**
`h1/display: clamp(2.6rem, 7vw, 5rem)` Fraunces 800 · `h2: clamp(1.9rem, 4vw, 3rem)` Fraunces 700 · `h3: 1.35rem` Mako · body `1.06rem/1.65` Mako.

**Design tokens (exact, sampled):**

```css
:root {
  /* sampled from images/background_with_headshot.jpg */
  --brand:       #6a80d5;  /* indigo (top-left gradient) */
  --brand-deep:  #5075bb;  /* navy (shirt) */
  --periwinkle:  #88a3d8;
  --green:       #c7f2bc;  /* spring green */
  --green-soft:  #cbf5d1;
  --ice:         #d1f3f5;
  --ice-soft:    #ddeefe;
  /* v1 heritage accents (kept for continuity) */
  --accent-name: #1f6fb0;  /* "Manan" highlight + typewriter text */
  --accent-warm: #b54769;  /* About tab underline (maroon) */
  --accent-rust: #be431b;  /* "Tools:" spans in project cards */
  /* neutrals */
  --paper:   #fbfdff;
  --ink:     #101321;
  --ink-soft:#3f4658;
  --line:    #d9e2ef;      /* hairline dividers (accordion borders) */
}
```

---

### Task 1: Version safety net (v1 freeze)

**Files:**
- No file changes — git operations only, in `/Users/mananspancholy/Documents/GitHub/manan`.

**Interfaces:**
- Produces: tag `v1.0.0`, branch `v1` (frozen), branch `v2` (working branch for all subsequent tasks). Every later task commits to `v2`.

- [ ] **Step 1: Verify clean tree**

Run: `git status --short` — Expected: empty (if not, stop and surface to user).
Note: `docs/superpowers/plans/` (this plan) may show untracked — commit it first: `git add docs && git commit -m "docs: v2 redesign plan"`.

- [ ] **Step 2: Tag and freeze v1**

```bash
git tag -a v1.0.0 -m "v1: original portfolio site (pre-MHI redesign)"
git branch v1
git push origin main v1 v1.0.0
```

- [ ] **Step 3: Create working branch**

```bash
git checkout -b v2
git push -u origin v2
```

- [ ] **Step 4: Verify rollback works (drill)**

Run: `git show v1.0.0:index.html | head -5` — Expected: prints the v1 doctype/head. This is the recovery command cited throughout the plan.

---

### Task 2: v2 foundation — tokens, reset, typography, layout primitives

**Files:**
- Create: `css/style.css`
- Create: `js/site.js` (empty IIFE shell this task)

**Interfaces:**
- Produces: all design tokens above; classes `.container`, `.band`, `.band--ice`, `.eyebrow`, `.display`, `.arrow-link`, `.chip`, `.btn`; font loading pattern. Every page task consumes these exact names.

- [ ] **Step 1: Write `css/style.css` foundation**

```css
/* ============ v2 — MHI-inspired redesign ============ */
/* 1. Tokens */
:root {
  --brand: #6a80d5; --brand-deep: #5075bb; --periwinkle: #88a3d8;
  --green: #c7f2bc; --green-soft: #cbf5d1; --ice: #d1f3f5; --ice-soft: #ddeefe;
  --accent-name: #1f6fb0; --accent-warm: #b54769; --accent-rust: #be431b;
  --paper: #fbfdff; --ink: #101321; --ink-soft: #3f4658; --line: #d9e2ef;
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Mako", system-ui, sans-serif;
  --header-h: 72px;
}
/* 2. Reset */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); color: var(--ink); background: var(--paper);
       line-height: 1.65; font-size: 1.06rem; -webkit-font-smoothing: antialiased; }
img { max-width: 100%; display: block; }
a { color: inherit; }
/* 3. Typography */
h1, h2, .display { font-family: var(--font-display); font-weight: 800;
                   line-height: 1.05; letter-spacing: -0.02em; }
h1 { font-size: clamp(2.6rem, 7vw, 5rem); }
h2 { font-size: clamp(1.9rem, 4vw, 3rem); font-weight: 700; }
h3 { font-size: 1.35rem; font-weight: 500; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.8rem;
           color: var(--brand-deep); font-weight: 500; }
/* 4. Layout primitives */
.container { width: min(1120px, 92vw); margin-inline: auto; }
.band { padding-block: clamp(3.5rem, 9vw, 7rem); }
.band--ice { background: linear-gradient(180deg, var(--ice-soft), var(--ice)); }
/* 5. Shared atoms */
.arrow-link { display: inline-flex; align-items: center; gap: 0.5rem;
              font-weight: 500; text-decoration: none; color: var(--brand-deep); }
.arrow-link::after { content: "\2192"; transition: transform 0.3s ease; }
.arrow-link:hover::after { transform: translateX(6px); }
.chip { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 999px;
        background: var(--green); color: var(--ink); font-size: 0.78rem; }
.btn { display: inline-block; padding: 0.85rem 1.8rem; border-radius: 999px;
       background: var(--brand); color: #fff; text-decoration: none; border: 0;
       font-size: 1rem; cursor: pointer; transition: background 0.3s ease, transform 0.3s ease; }
.btn:hover { background: var(--brand-deep); transform: translateY(-2px); }
```

- [ ] **Step 2: Create `js/site.js` shell**

```js
/* v2 site behaviors — populated by Tasks 3 & 4 */
(() => {
  "use strict";
  // initMenu, initReveals, initAccordions attached here in later tasks
})();
```

- [ ] **Step 3: Document the shared `<head>` pattern (used verbatim by every page task)**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/x-icon" href="images/MSP logo.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=Mako&display=swap" rel="stylesheet">
<!-- Font Awesome Pro 6.7.2 — same links as v1, carried over verbatim -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/fontawesome.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/solid.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/regular.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/light.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/brands.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/sharp-solid.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/sharp-regular.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/sharp-light.css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rizmyabdulla/fontawesome-pro@main/releases/v6.7.2/css/duotone.css"/>
<link rel="stylesheet" href="css/style.css">
```

- [ ] **Step 4: Verify + commit**

Create a throwaway `test.html` using the head pattern plus `<h1 class="reveal">Type test</h1><a class="arrow-link" href="#">Find out more</a>`; run `python3 -m http.server 8000` in the repo and open `http://localhost:8000/test.html`. Expected: Fraunces renders for h1, arrow-link arrow slides on hover. Delete `test.html`.

```bash
git add css/style.css js/site.js
git commit -m "feat(v2): design tokens, typography, layout primitives"
```

---

### Task 3: Shared chrome — sticky header, overlay menu, footer, floating CTA

**Files:**
- Modify: `css/style.css` (append)
- Modify: `js/site.js`

**Interfaces:**
- Consumes: tokens from Task 2.
- Produces: HTML fragments `site-header`, `#menu-overlay`, `site-footer`, `.fab-resume` (copied verbatim into every page in Tasks 6–10); JS `initMenu()` self-initializing on DOMContentLoaded.

- [ ] **Step 1: Append chrome CSS to `css/style.css`**

```css
/* ============ Header / overlay menu / footer ============ */
.site-header { position: fixed; inset: 0 0 auto 0; height: var(--header-h); z-index: 40;
  display: flex; align-items: center;
  background: color-mix(in srgb, var(--paper) 82%, transparent);
  backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.site-header .container { display: flex; align-items: center; justify-content: space-between; }
.site-header .logo { width: 56px; height: 40px; }
.menu-btn { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 1rem;
  background: none; border: 0; cursor: pointer; color: var(--ink); font-family: var(--font-body); }
.menu-btn i { font-size: 1.3rem; }
#menu-overlay { position: fixed; inset: 0; z-index: 50;
  background: linear-gradient(135deg, var(--brand-deep), var(--brand) 55%, var(--periwinkle));
  display: flex; align-items: center;
  opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s ease; }
#menu-overlay.open { opacity: 1; visibility: visible; }
#menu-overlay .container { display: flex; flex-direction: column; gap: 0.5rem; }
#menu-overlay a { font-family: var(--font-display); font-weight: 700; color: #fff;
  text-decoration: none; font-size: clamp(2rem, 6vw, 3.6rem); line-height: 1.25;
  display: inline-flex; align-items: center; gap: 1rem;
  opacity: 0; transform: translateY(18px); transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: calc(var(--i) * 70ms); }
#menu-overlay.open a { opacity: 1; transform: none; }
#menu-overlay a::after { content: "\2192"; font-size: 0.6em; opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease; }
#menu-overlay a:hover::after { opacity: 1; transform: translateX(8px); }
#menu-overlay .close-btn { position: absolute; top: 1.4rem; right: max(4vw, 1.4rem);
  background: none; border: 0; color: #fff; font-size: 1.8rem; cursor: pointer; }
body.menu-open { overflow: hidden; }
/* Floating résumé CTA (MHI floating-donate pattern) */
.fab-resume { position: fixed; right: 1.4rem; bottom: 1.4rem; z-index: 30;
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--brand-deep); color: #fff; text-decoration: none;
  padding: 0.8rem 1.3rem; border-radius: 999px; font-size: 0.95rem;
  box-shadow: 0 8px 24px rgb(80 117 187 / 0.35); transition: transform 0.3s ease; }
.fab-resume:hover { transform: translateY(-3px); }
/* Footer */
.site-footer { background: var(--ink); color: #cfd8ea; padding-block: 3rem 2rem; margin-top: 0; }
.site-footer .container { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: space-between; align-items: center; }
.site-footer nav a { color: #cfd8ea; text-decoration: none; margin-right: 1.4rem; font-size: 0.95rem; }
.site-footer nav a:hover { color: #fff; }
.site-footer .social a { color: #cfd8ea; font-size: 1.4rem; margin-left: 1rem; }
.site-footer .social a:hover { color: var(--green); }
.site-footer .fineprint { width: 100%; font-size: 0.8rem; color: #8b96ad; }
```

- [ ] **Step 2: Define the chrome HTML fragments (verbatim blocks for every page)**

Header + overlay (directly after `<body>` on every page):

```html
<header class="site-header">
  <div class="container">
    <a href="index.html"><img src="images/MSP logo.png" class="logo" alt="MSP logo"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu-overlay">
      Menu <i class="fa-light fa-bars" aria-hidden="true"></i>
    </button>
  </div>
</header>
<nav id="menu-overlay" aria-label="Main menu">
  <button class="close-btn" aria-label="Close menu"><i class="fa-light fa-xmark"></i></button>
  <div class="container">
    <a style="--i:0" href="index.html">Home</a>
    <a style="--i:1" href="about.html">About</a>
    <a style="--i:2" href="projects.html">Projects</a>
    <a style="--i:3" href="exp.html">Experience</a>
    <a style="--i:4" href="faq.html">FAQ</a>
  </div>
</nav>
<a class="fab-resume" href="images/Pancholy_Manan_Resume.pdf" download="Manan S. Pancholy Resumé">
  <i class="fa-solid fa-file-user" aria-hidden="true"></i> Résumé
</a>
```

Footer (directly before the page scripts on every page):

```html
<footer class="site-footer">
  <div class="container">
    <nav aria-label="Footer">
      <a href="index.html">Home</a><a href="about.html">About</a>
      <a href="projects.html">Projects</a><a href="exp.html">Experience</a>
      <a href="faq.html">FAQ</a>
    </nav>
    <div class="social">
      <a href="mailto:manan_pancholy@brown.edu" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
      <a href="https://www.linkedin.com/in/mananpancholy3719" target="_blank" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
      <a href="https://github.com/mspancho" target="_blank" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
    </div>
    <p class="fineprint">© 2026 Manan S. Pancholy</p>
  </div>
</footer>
<script src="js/site.js"></script>
```

- [ ] **Step 3: Implement `initMenu()` in `js/site.js`** (inside the IIFE)

```js
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
```

- [ ] **Step 4: Verify + commit**

Temporary `test.html` with the fragments: menu opens full-screen indigo with staggered link fade-in, closes on ✕/Escape, body scroll locks, focus moves correctly. Delete `test.html`.

```bash
git add css/style.css js/site.js
git commit -m "feat(v2): sticky header, full-screen overlay menu, footer, floating resume CTA"
```

---

### Task 4: Motion system — scroll reveals + accordion component

**Files:**
- Modify: `css/style.css` (append)
- Modify: `js/site.js`

**Interfaces:**
- Consumes: Task 2 tokens.
- Produces: `.reveal` + `.reveal-group` classes; `.acc` / `.acc__head` / `.acc__body` / `.acc__inner` accordion markup contract; `initReveals()`, `initAccordions()` (both self-initializing). Tasks 6–10 use these exact class names.

- [ ] **Step 1: Append motion CSS**

```css
/* ============ Motion ============ */
.reveal { opacity: 0; transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.in { opacity: 1; transform: none; }
.reveal-group > * { opacity: 0; transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: calc(var(--i, 0) * 80ms); }
.reveal-group.in > * { opacity: 1; transform: none; }
/* ============ Accordion ============ */
.acc { border-bottom: 1px solid var(--line); }
.acc__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  width: 100%; background: none; border: 0; cursor: pointer; text-align: left;
  padding: 1.1rem 0; font-family: var(--font-body); color: var(--ink); }
.acc__head .acc__icon { flex: none; width: 1.6rem; height: 1.6rem; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--brand-deep); color: var(--brand-deep);
  transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease; }
.acc.open .acc__icon { transform: rotate(45deg); background: var(--brand-deep); color: #fff; }
.acc__body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease; }
.acc.open .acc__body { grid-template-rows: 1fr; }
.acc__inner { overflow: hidden; }
.acc__inner > :first-child { margin-top: 0.2rem; }
.acc__inner > :last-child { margin-bottom: 1.2rem; }
/* Reduced motion: everything instant */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal, .reveal-group > *, #menu-overlay, #menu-overlay a,
  .acc__body, .acc__icon { transition: none !important; }
  .reveal, .reveal-group > * { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Implement `initReveals()` and `initAccordions()` in `js/site.js`**

```js
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
```

Add both to the DOMContentLoaded call: `initMenu(); initReveals(); initAccordions();`

Accordion markup contract (used by Tasks 7–10):

```html
<div class="acc">
  <button class="acc__head">
    <span><!-- visible heading content --></span>
    <span class="acc__icon"><i class="fa-solid fa-plus" aria-hidden="true"></i></span>
  </button>
  <div class="acc__body"><div class="acc__inner">
    <!-- expandable content -->
  </div></div>
</div>
```

- [ ] **Step 3: Verify + commit**

Temporary `test.html` with three `.reveal` bands and two `.acc` items: bands rise+fade in on scroll (once each), accordions expand ~300ms with + rotating to ×, and with macOS "Reduce Motion" enabled everything is instant. Delete `test.html`.

```bash
git add css/style.css js/site.js
git commit -m "feat(v2): scroll-reveal system and accordion component with reduced-motion support"
```

---

### Task 5: Image optimization

**Files:**
- Modify: `images/` (add optimized derivatives; originals untouched)

**Interfaces:**
- Produces: optimized image files `images/opt/hero-bg.jpg`, `images/opt/manan_chaht.jpg`, consumed by Tasks 6 and 7.

**Icons:** no migration needed — v2 keeps Font Awesome Pro and reuses every v1 icon class verbatim (see Global Constraints). Page tasks copy v1's `<i>` tags unchanged.

- [ ] **Step 1: Generate optimized images (macOS `sips`, no new tooling)**

```bash
cd /Users/mananspancholy/Documents/GitHub/manan
mkdir -p images/opt
sips -s format jpeg -s formatOptions 70 --resampleWidth 2048 "images/background_with_headshot.jpg" --out "images/opt/hero-bg.jpg"
sips -s format jpeg -s formatOptions 70 --resampleWidth 1200 "images/manan_chaht.jpg" --out "images/opt/manan_chaht.jpg"
ls -lh images/opt/
```

Expected: `hero-bg.jpg` well under 400KB, `manan_chaht.jpg` under 300KB. Pages reference `images/opt/*`; originals stay for provenance.

- [ ] **Step 2: Commit**

```bash
git add images/opt
git commit -m "perf(v2): optimized hero and about images"
```

---

### Task 6: Home page (`index.html`) rebuild

**Files:**
- Modify: `index.html` (full rewrite; content preserved)

**Interfaces:**
- Consumes: head pattern (T2), chrome fragments (T3), `.reveal`/`.reveal-group` (T4), `images/opt/hero-bg.jpg` (T5).
- Produces: `#typewriter-text` element + the ported typewriter script (identical phrase list).

**Content to preserve verbatim (from current `index.html` before overwriting; recovery: `git show v1.0.0:index.html`):** the 25-phrase `phrases` array (lines 67–93), "Curious about" static text, "Hi, I'm Manan." heading, the four social links (mailto, LinkedIn, GitHub, résumé download).

- [ ] **Step 1: Rewrite `index.html`**

Structure (using the exact shared head + chrome from Tasks 2–3):

```html
<!DOCTYPE html><html lang="en"><head>
  <!-- shared head pattern (Task 2 Step 3) -->
  <title>Manan S. Pancholy</title>
</head><body>
  <!-- header + overlay + fab (Task 3 Step 2) -->
  <main>
    <section class="hero">
      <div class="container hero__inner reveal-group in-view-immediate">
        <p class="typewriter" style="--i:0"><span class="static-text">Curious about </span><span id="typewriter-text"></span><span class="cursor">|</span></p>
        <h1 style="--i:1">Hi, I'm <span class="hero__name">Manan</span>.</h1>
        <div class="social-icons" style="--i:2">
          <!-- the four v1 links (mailto, LinkedIn, GitHub, résumé download) with their
               v1 icon classes verbatim: fa-solid fa-envelope, fa-brands fa-linkedin,
               fa-brands fa-github, fa-solid fa-file-user -->
        </div>
        <a class="scroll-cue" style="--i:3" href="#intro" aria-label="Scroll down"><i class="fa-solid fa-arrow-down"></i></a>
      </div>
    </section>
    <section id="intro" class="band">
      <div class="container">
        <p class="display statement reveal">I seek to leverage data to its fullest potential
        to improve human health — whether that means helping patients, physicians,
        or healthcare systems.</p>
        <!-- ^ sentence reused from about.html intro — MHI "mission statement" pattern; not new copy -->
      </div>
    </section>
    <section class="band band--ice">
      <div class="container">
        <p class="eyebrow reveal">Explore</p>
        <div class="link-cards reveal-group">
          <a class="link-card" style="--i:0" href="about.html"><h2>About</h2><p>Toolbox, interests, education, coursework.</p><span class="arrow-link">Find out more</span></a>
          <a class="link-card" style="--i:1" href="projects.html"><h2>Projects</h2><p>ML research, health informatics, and web builds.</p><span class="arrow-link">Find out more</span></a>
          <a class="link-card" style="--i:2" href="exp.html"><h2>Experience</h2><p>Employment, service, and clinical work.</p><span class="arrow-link">Find out more</span></a>
          <a class="link-card" style="--i:3" href="faq.html"><h2>FAQ</h2><p>Questions, answers, and a way to reach me.</p><span class="arrow-link">Find out more</span></a>
        </div>
      </div>
    </section>
  </main>
  <!-- footer + site.js (Task 3 Step 2) -->
  <script><!-- v1 typewriter script ported VERBATIM (phrases, shuffle, typeWriter, DOMContentLoaded hook) --></script>
</body></html>
```

- [ ] **Step 2: Append home CSS to `css/style.css`**

```css
/* ============ Home ============ */
.hero { min-height: 100svh; display: flex; align-items: center;
  background: url("../images/opt/hero-bg.jpg") center / cover no-repeat; padding-top: var(--header-h); }
.hero__name { color: var(--accent-name); }
.typewriter { font-size: 1.3rem; min-height: 2rem; }
#typewriter-text, .cursor { color: var(--accent-name); }
.cursor { animation: blink 1s infinite; font-weight: 700; }
@keyframes blink { 0%,50% {opacity:1} 51%,100% {opacity:0} }
.social-icons { margin-top: 1.6rem; display: flex; gap: 1.1rem; }
.social-icons a { font-size: 1.7rem; color: var(--ink); transition: color 0.3s ease, transform 0.3s ease; }
.social-icons a:hover { color: var(--brand-deep); transform: translateY(-3px); }
.scroll-cue { display: inline-block; margin-top: 3rem; color: var(--brand-deep);
  font-size: 1.3rem; animation: cue 1.8s ease-in-out infinite; }
@keyframes cue { 0%,100% { transform: translateY(0) } 50% { transform: translateY(8px) } }
.statement { font-size: clamp(1.6rem, 3.4vw, 2.6rem); font-weight: 700;
  max-width: 28ch; color: var(--ink); }
.link-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.4rem; margin-top: 2rem; }
.link-card { background: #fff; border-radius: 18px; padding: 2rem 1.6rem; text-decoration: none;
  display: flex; flex-direction: column; gap: 0.7rem; border: 1px solid var(--line);
  transition: transform 0.3s ease, box-shadow 0.3s ease; }
.link-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgb(80 117 187 / 0.15); }
.link-card h2 { font-size: 1.6rem; }
.link-card p { color: var(--ink-soft); font-size: 0.95rem; flex: 1; }
@media (max-width: 720px) {
  .hero { background:
    linear-gradient(135deg, #6a80d5 0%, #88a3d8 22%, #c7f2bc 55%, #d1f3f5 80%, #ddeefe 100%); }
  .hero__inner { text-align: center; }
  .social-icons { justify-content: center; }
}
```

(Mobile swaps the photo composite for a pure CSS recreation of the same gradient — exact sampled stops — mirroring v1's own mobile background swap, so the headshot never sits behind text on small screens.)

Also add a "reveal immediately on load" rule since hero is above the fold:

```css
.in-view-immediate > * { opacity: 1 !important; transform: none !important; }
```

- [ ] **Step 3: Verify + commit**

Local server: hero fills viewport with composite image (desktop) / gradient (≤720px, via device toolbar), typewriter cycles shuffled phrases, all four social links work, statement + cards reveal on scroll, cards hover-lift.

```bash
git add index.html css/style.css
git commit -m "feat(v2): home page — editorial hero with typewriter, statement band, section link cards"
```

---

### Task 7: About page (`about.html`) rebuild

**Files:**
- Modify: `about.html` (full rewrite; content preserved)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: chrome (T3), `.reveal` (T4), `.acc` component (T4), `images/opt/manan_chaht.jpg` (T5).
- Produces: nothing consumed later.

**Content to preserve verbatim (recovery: `git show v1.0.0:about.html`):** intro paragraph (lines 51–53); all six tab titles; entire contents of `#skills`, `#interests`, `#education`, `#coursework`, `#awards`, `#certs` (lines 63–125).

- [ ] **Step 1: Rewrite `about.html`**

Layout: `band` with a 2-column grid — left column: photo (`images/opt/manan_chaht.jpg`, rounded 18px, `reveal`); right column: `h1` "About Me" (serif display) + intro paragraph + tab UI. Both columns in a `.reveal-group`.

Tab UI (desktop ≥ 721px): keep v1's tab pattern — `.tab-titles` row of six `.tab-links` (maroon `--accent-warm` underline slide, exactly v1's animation restyled), one `.tab-contents` visible at a time; port v1's `opentab()` script verbatim at the bottom of the page. Restyle only: `.tab-contents { max-height: 460px; overflow-y: auto; }` with a styled thin scrollbar instead of hidden.

Mobile (≤ 720px): the same six title+content pairs are *also* rendered as an `.acc` accordion stack (Task 4 contract, one `.acc` per tab, `<span>` in head = tab title). CSS shows tabs on desktop / accordions on mobile:

```css
.about-accs { display: none; }
@media (max-width: 720px) {
  .tab-titles, .tab-contents { display: none; }
  .about-accs { display: block; }
}
```

The list `<li><span>…</span>…</li>` content is IDENTICAL in both renderings (copy once, paste in both containers).

- [ ] **Step 2: Append About CSS** — 2-col grid (`grid-template-columns: 0.9fr 1.1fr; gap: 3rem;` collapsing to 1 column ≤720px), `.tab-links` restyle (v1's `::after` underline, `--accent-warm`, 0.4s ease), `li span { color: var(--accent-warm); font-size: 0.85rem; }` (v1 heritage).

- [ ] **Step 3: Verify + commit**

Desktop: six tabs switch correctly, underline animates, content scrolls in-place. Mobile (device toolbar): tabs hidden, six accordions expand/collapse smoothly. All list content present in both modes (spot-check "RDKit, Biopandas" in Toolbox and "CITI Program" in Certifications).

```bash
git add about.html css/style.css
git commit -m "feat(v2): about page — editorial split layout, tabs on desktop, accordions on mobile"
```

---

### Task 8: Projects page (`projects.html`) rebuild

**Files:**
- Modify: `projects.html` (full rewrite; content preserved)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: chrome (T3), `.reveal-group` (T4), `.acc` (T4), `.chip`, `.arrow-link` (T2). Card icons: v1 classes verbatim (FA Pro).

**Content to preserve verbatim (recovery: `git show v1.0.0:projects.html`):** the h1 "My Projects", the prospective-employer note (lines 48–49), and all 11 cards — titles, full descriptions, `Tools:` spans, and external links (arxiv, GitHub ×4, ResearchGate).

- [ ] **Step 1: Rewrite `projects.html`**

Replace the hidden-scrollbar horizontal strip with an MHI-blog-style responsive grid (`repeat(auto-fill, minmax(320px, 1fr))`; 3-col desktop → 2-col tablet → 1-col mobile). Each card:

```html
<article class="proj-card" style="--i:N">
  <i class="fa-solid fa-x-ray proj-card__icon" aria-hidden="true"></i>
  <span class="chip">Research</span>
  <h2>PaCX-MAE</h2>
  <p class="proj-card__lede"><!-- FIRST paragraph of the v1 description --></p>
  <div class="acc"><button class="acc__head"><span>More detail</span>
    <span class="acc__icon"><i class="fa-solid fa-plus" aria-hidden="true"></i></span></button>
    <div class="acc__body"><div class="acc__inner">
      <!-- REMAINING v1 paragraphs + Tools line, verbatim -->
    </div></div></div>
  <a class="arrow-link" href="https://arxiv.org/abs/2606.01537" target="_blank">Learn more</a>
</article>
```

First v1 paragraph = always-visible lede; the rest folds into the accordion (progressive disclosure — kills v1's scroll-inside-a-card wart). Cards with no link (ML Mental Health, cel-IS-ac, AFib, AI Notewriting, ACC Lecture) omit the arrow-link. Chip per card, one word, from this fixed set: PaCX-MAE/GraphiStasis/ML Mental Health/cel-IS-ac/IE Risk/AFib/AI Notewriting → `Research`; Barsite/Personal Website → `Web`; ACC Lecture → `Teaching`; ResearchGate → `Profile`. Grid wrapped in `.reveal-group` (`--i` = card index % 6 to cap stagger).

- [ ] **Step 2: Append CSS** — `.proj-grid` (grid as above, `gap: 1.5rem`), `.proj-card` (white bg, `border-radius: 18px`, `padding: 2rem`, `border: 1px solid var(--line)`, hover: `translateY(-6px)` + indigo-tinted shadow like `.link-card`), `.proj-card__icon { font-size: 2.1rem; color: var(--brand-deep); margin-bottom: 0.8rem; }`, `.proj-card p span { color: var(--accent-rust); font-weight: 500; }` (v1 heritage "Tools:" color).

- [ ] **Step 3: Verify + commit**

All 11 cards present (count them), ledes visible, accordions expand with the remaining v1 text intact (spot-check ICML mention in PaCX-MAE and "celISac = celiac + IS"), 6 external links work, grid reflows 3→2→1, staggered reveal fires.

```bash
git add projects.html css/style.css
git commit -m "feat(v2): projects — responsive card grid with progressive disclosure"
```

---

### Task 9: Experience page (`exp.html`) rebuild

**Files:**
- Modify: `exp.html` (full rewrite; content preserved)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: chrome (T3), `.acc` (T4). Entry icons: v1 classes verbatim (FA Pro).

**Content to preserve verbatim (recovery: `git show v1.0.0:exp.html`):** all entries under Employment (4 cards), Service (5 cards incl. multi-role bodies), Clinical (all cards to end of file) — headings, org lines, dates, every bullet, and the external links wrapped around cards (aapischolars, instagram, brownhealthjournal, facebook, expressurgentcare).

- [ ] **Step 1: Rewrite `exp.html`**

Fix `<title>` → `Experience`. Replace the 3-nested-scrollbars column layout with three sequential `band` sections — `Employment`, `Service`, `Clinical` — each: serif `h2` + an accordion list. One `.acc` per v1 card:

- Collapsed head shows: icon + role (`h3`) + org · dates line (small, `--ink-soft`).
- Expanded body: ALL v1 paragraphs/bullets for that card, verbatim. Multi-role cards (e.g., AAPI President + President-Elect; Barsaat's four roles) stay one accordion whose body stacks each role as `h4` + content — nothing dropped.
- v1 cards wrapped in `<a>` become: plain `.acc` + an `.arrow-link` to the same URL as the last element of the body (a whole-accordion link can't also be a button).

Alternate band tints: Employment `band`, Service `band band--ice`, Clinical `band` — MHI's section-banding rhythm.

- [ ] **Step 2: Append CSS** — `.exp-head-line { display: flex; align-items: center; gap: 1rem; }`, icon `font-size: 1.5rem; color: var(--brand-deep); width: 2rem;`, org/dates `font-size: 0.9rem; color: var(--ink-soft);`, body `ul { padding-left: 1.2rem; margin-block: 0.6rem; }`.

- [ ] **Step 3: Verify + commit**

No nested scrollbars anywhere. Every v1 entry present (spot-check: "~1% acceptance rate", the seven Barsaat arrangements, "300+ veterans"). Page scrolls as one document on mobile; accordions animate; links work.

```bash
git add exp.html css/style.css
git commit -m "feat(v2): experience — three banded sections with accordion entries, no nested scrolling"
```

---

### Task 10: FAQ page (`faq.html`) rebuild

**Files:**
- Modify: `faq.html` (full rewrite; content preserved)
- Modify: `css/style.css` (append)

**Interfaces:**
- Consumes: chrome (T3), `.acc` (T4), `.btn` (T2).

**Content to preserve verbatim (recovery: `git show v1.0.0:faq.html`):** the three Q&As (incl. *The Office* italics), the form fields/names (`Name`, `Email`, `Message` — names are load-bearing for the Sheet), the `#msg` span, and the entire Apps Script submit `<script>` with its exact `scriptURL`.

- [ ] **Step 1: Rewrite `faq.html`**

Fix `<title>` → `FAQ`. Two bands: (1) `h1` "Frequently Asked Questions" + three `.acc` items (question = head, answer = body — the literal MHI FAQ pattern); (2) `band band--ice` contact section: `h2` "Have more questions?" + "Send me a message!" + the form. Form restyle: light inputs on white card (replace v1's dark `#262626` inputs) — `background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 0.9rem 1rem;` with `:focus { border-color: var(--brand); outline: 2px solid var(--ice); }`; submit button = `.btn`. `#msg` success text `color: var(--brand-deep)`. Port the Apps Script submit script verbatim.

- [ ] **Step 2: Verify + commit**

Accordions work; **submit a real test message** and confirm "Message sent successfully" appears and the row lands in the Google Sheet.

```bash
git add faq.html css/style.css
git commit -m "feat(v2): faq — accordion Q&A and restyled contact form (same endpoint)"
```

---

### Task 11: Cross-device QA pass

**Files:**
- Modify: any file needing fixes found below.

- [ ] **Step 1: Breakpoint sweep** — In Chrome device toolbar test every page at 375px (iPhone SE), 390px (iPhone 15), 768px (iPad), 1280px, 1728px. Expected: no horizontal scroll anywhere; header/menu/fab usable at every width; touch targets ≥ 44px (menu links, accordion heads, fab).
- [ ] **Step 2: Keyboard + a11y** — Tab through each page: menu opens/closes with Enter/Escape and focus moves correctly; accordions toggle with Enter/Space (they're `<button>`s — free); every image has `alt`; run Lighthouse accessibility on all 5 pages, expected ≥ 95.
- [ ] **Step 3: Reduced motion** — macOS System Settings → Accessibility → Display → Reduce Motion ON: no reveals/slides anywhere, content immediately visible.
- [ ] **Step 4: Performance** — Lighthouse performance on `index.html` mobile, expected ≥ 90 (hero image is the optimized 2048px jpeg; no other heavy assets load).
- [ ] **Step 5: Content diff audit** — For each page, `git show v1.0.0:<page> | grep -o '<li>.*</li>' | wc -l` style spot counts vs the new page; verify project count = 11, About tabs = 6, FAQ = 3.
- [ ] **Step 6: Commit fixes**

```bash
git add -A && git commit -m "fix(v2): cross-device QA pass"
```

---

### Task 12: Release, deploy, rollback runbook

**Files:**
- Create: `docs/DEPLOY.md`

- [ ] **Step 1: Merge and tag**

```bash
git checkout main
git merge --no-ff v2 -m "release: v2.0.0 — MHI-inspired redesign"
git tag -a v2.0.0 -m "v2: MHI-inspired redesign"
git push origin main v2.0.0
```

Then create a GitHub Release from each tag (v1.0.0 and v2.0.0) via the repo's Releases page — makes versions browsable/downloadable.

- [ ] **Step 2: Deploy to Hostinger (two supported paths — write both into `docs/DEPLOY.md`)**

*Path A — manual upload (what you do today):* hPanel → File Manager → `public_html` → delete old site files (NOT any unrelated files) → upload: the 5 `.html` files, `css/`, `js/`, `images/`, `LICENSE`. Skip `docs/` and `.git`.

*Path B — Git auto-deploy (recommended upgrade):* hPanel → Websites → Manage → Advanced → **GIT** → attach `https://github.com/mspancho/manan`, branch `main`, directory `public_html` → Deploy. Future releases = push to `main` → click Deploy (or enable the webhook for auto-deploy on push).

- [ ] **Step 3: Rollback drill (verify BEFORE announcing v2)**

*Path A:* `git worktree add /tmp/manan-v1 v1.0.0` → upload `/tmp/manan-v1`'s files over `public_html` → site is v1 again → re-upload v2 files to roll forward → `git worktree remove /tmp/manan-v1`.
*Path B:* switch the hPanel GIT branch from `main` to `v1` → Deploy → site is v1. Switch back → Deploy → v2. **Run the drill once** so rollback is a proven 2-minute operation, not a theory.

- [ ] **Step 4: Commit runbook**

```bash
git add docs/DEPLOY.md && git commit -m "docs: deploy + rollback runbook" && git push
```

---

## Self-Review (completed)

- **Spec coverage:** Hostinger deployability (T12, no-build constraint) ✓ · rollback via same repo (T1 + T12 drill) ✓ · all v1 content ports (per-page verbatim-content blocks + T11 Step 5 audit) ✓ · mobile cleanliness à la MHI (overlay menu, accordions, 1-col stacking, T11 sweep) ✓ · keep hero/typewriter/tab titles/nav (Global Constraints + T6/T7) ✓ · color scheme from cover image (tokens, sampled hexes) ✓ · MHI UX patterns (Design Language table → chrome/motion/page tasks) ✓.
- **Placeholder scan:** the two `<!-- … -->` markers in T6/T8 are content-mapping instructions pointing at exact v1 sources with recovery commands — intentional, not gaps.
- **Type consistency:** class/function names cross-checked: `.reveal`/`.reveal-group`/`.in`, `.acc`/`.acc__head`/`.acc__body`/`.acc__inner`/`.open`, `initMenu`/`initReveals`/`initAccordions`, token names — consistent across all tasks.
