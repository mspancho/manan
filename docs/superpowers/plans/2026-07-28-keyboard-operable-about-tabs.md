# Keyboard-Operable About Tabs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the six desktop About-page tabs operable by keyboard and legible to screen readers, with **zero visual change for mouse users** and no change to any page content.

**Architecture:** Replace the six non-focusable `<p class="tab-links" onclick>` elements with real `<button>` elements carrying the WAI-ARIA tablist pattern (`role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`). A CSS reset strips the browser's default button chrome so the rendering stays pixel-identical to the current `<p>`. `opentab()` is updated to take an explicit element reference (rather than the implicit global `event`) and to maintain a roving tabindex; a `keydown` handler on the tablist adds ←/→/Home/End.

**Tech Stack:** Vanilla HTML/CSS/JS. No build step, no npm, no new dependencies.

## Global Constraints

- **No visible change for mouse users, at rest or on hover or on click.** The tabs must render pixel-identically to today. A focus ring is shown for **keyboard users only**, via `:focus-visible` (user decision, 2026-07-28).
- **No content change.** All six tab titles and all six panels' contents stay byte-identical. Verify with `git show v1.0.0:about.html`.
- **Scope is `about.html` + `css/style.css` only.** Do not touch `js/site.js`, the other four pages, or the mobile accordion rendering (`.about-accs`).
- **The mobile accordion copy is already accessible** (real `<button class="acc__head">`) and must not be modified.
- **No build step, no npm, no frameworks.**
- **Font Awesome Pro retained**; no icon substitutions.
- Existing behavior preserved: exactly one panel visible at a time; the maroon (`--accent-warm`) underline animates on the active tab; panels remain scrollable at `max-height: 460px`.

---

## Current State (read before editing)

`about.html:53-60` — the tab row:
```html
<div class="tab-titles">
  <p class="tab-links active-link" onclick="opentab('skills')">Toolbox</p>
  <p class="tab-links" onclick="opentab('interests')">Interests</p>
  <p class="tab-links" onclick="opentab('education')">Education</p>
  <p class="tab-links" onclick="opentab('coursework')">Coursework</p>
  <p class="tab-links" onclick="opentab('awards')">Awards</p>
  <p class="tab-links" onclick="opentab('certs')">Certifications</p>
</div>
```

Panel ids, in order: `skills`, `interests`, `education`, `coursework`, `awards`, `certs`. Each is `<div class="tab-contents" id="...">` (the first also has `active-tab`).

`about.html:250` — the handler (inside the page's inline `<script>`, which also defines `tablinks` and `tabcontents` via `getElementsByClassName`):
```js
function opentab(tabname){
    for(tablink of tablinks){
        tablink.classList.remove("active-link");
    }
    for(tabcontent of tabcontents){
        tabcontent.classList.remove("active-tab");
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}
```

`css/style.css:174-177` — the styling that must keep rendering identically:
```css
.tab-links { font-size: 1rem; font-weight: 500; cursor: pointer; position: relative; padding-bottom: 0.5rem; }
.tab-links::after { content: ""; width: 0; height: 3px; background: var(--accent-warm);
  position: absolute; left: 0; bottom: -2px; transition: width 0.4s ease; }
.tab-links.active-link::after { width: 100%; }
```

---

### Task A: Convert tabs to buttons with ARIA, reset button chrome

**Files:**
- Modify: `about.html` (tab row at ~53-60; the six `.tab-contents` panels; `opentab()` at ~250)
- Modify: `css/style.css` (`.tab-links` rule at ~174; add focus rules)

**Interfaces:**
- Produces: six `<button class="tab-links" role="tab" id="tab-<panel>">` elements with a roving tabindex (active = `0`, others = `-1`); six panels with `role="tabpanel"` + `tabindex="0"`; an `opentab(tabname, el)` signature that Task B's keyboard handler calls.

- [ ] **Step 1: Replace the tab row markup**

Replace `about.html:53-60` with (note `aria-selected`, `tabindex`, and `id` differ per tab; the visible label text is unchanged):

```html
          <div class="tab-titles" role="tablist" aria-label="About sections">
            <button type="button" class="tab-links active-link" role="tab" id="tab-skills" aria-controls="skills" aria-selected="true" tabindex="0" onclick="opentab('skills', this)">Toolbox</button>
            <button type="button" class="tab-links" role="tab" id="tab-interests" aria-controls="interests" aria-selected="false" tabindex="-1" onclick="opentab('interests', this)">Interests</button>
            <button type="button" class="tab-links" role="tab" id="tab-education" aria-controls="education" aria-selected="false" tabindex="-1" onclick="opentab('education', this)">Education</button>
            <button type="button" class="tab-links" role="tab" id="tab-coursework" aria-controls="coursework" aria-selected="false" tabindex="-1" onclick="opentab('coursework', this)">Coursework</button>
            <button type="button" class="tab-links" role="tab" id="tab-awards" aria-controls="awards" aria-selected="false" tabindex="-1" onclick="opentab('awards', this)">Awards</button>
            <button type="button" class="tab-links" role="tab" id="tab-certs" aria-controls="certs" aria-selected="false" tabindex="-1" onclick="opentab('certs', this)">Certifications</button>
          </div>
```

- [ ] **Step 2: Add panel ARIA attributes**

On each of the six `<div class="tab-contents" id="X">` elements, add `role="tabpanel"`, `aria-labelledby="tab-X"`, and `tabindex="0"`. Change nothing else — not the `id`, not the classes, not one character of the panel contents. Result for the first panel:

```html
          <div class="tab-contents active-tab" id="skills" role="tabpanel" aria-labelledby="tab-skills" tabindex="0">
```

`tabindex="0"` is required because panels scroll (`max-height: 460px`); without it a keyboard user cannot scroll a long panel such as Coursework.

- [ ] **Step 3: Reset button chrome in CSS**

Replace the `.tab-links` rule at `css/style.css:174`. The four added declarations (`font`, `background`, `border`, `color`) neutralize UA button defaults; `padding-bottom: 0.5rem` becomes the equivalent `padding: 0 0 0.5rem` because buttons carry default padding on all sides:

```css
/* Buttons for keyboard operability; the reset keeps them rendering exactly as
   the <p> elements they replaced. */
.tab-links { font: inherit; background: none; border: 0; color: inherit;
  font-size: 1rem; font-weight: 500; cursor: pointer; position: relative;
  padding: 0 0 0.5rem; }
```

- [ ] **Step 4: Add keyboard-only focus ring**

Add immediately after the `.tab-links.active-link::after` rule:

```css
/* Mouse users see no focus ring at all; keyboard users get a visible one. */
.tab-links:focus { outline: none; }
.tab-links:focus-visible { outline: 2px solid var(--brand-deep); outline-offset: 3px; }
```

- [ ] **Step 5: Update `opentab()` to take an explicit element**

Replace the function body at `about.html:250`. The `el` parameter removes the dependency on the implicit global `event`; the fallback keeps any un-migrated inline caller working. It also now maintains `aria-selected` and the roving tabindex:

```js
    function opentab(tabname, el) {
        const clicked = el || (typeof event !== "undefined" && event.currentTarget);
        if (!clicked) return;
        for (const tablink of tablinks) {
            tablink.classList.remove("active-link");
            tablink.setAttribute("aria-selected", "false");
            tablink.tabIndex = -1;
        }
        for (const tabcontent of tabcontents) {
            tabcontent.classList.remove("active-tab");
        }
        clicked.classList.add("active-link");
        clicked.setAttribute("aria-selected", "true");
        clicked.tabIndex = 0;
        document.getElementById(tabname).classList.add("active-tab");
    }
```

- [ ] **Step 6: Verify structurally**

Run each and confirm:

```bash
python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('about.html').read()); print('parsed OK')"
python3 -c "s=open('css/style.css').read(); print('braces balanced:', s.count('{')==s.count('}'))"
# Six tabs, six panels, correct ARIA wiring:
grep -c 'role="tab"' about.html          # expect 6
grep -c 'role="tabpanel"' about.html     # expect 6
grep -c 'aria-selected="true"' about.html   # expect 1
grep -c 'aria-selected="false"' about.html  # expect 5
grep -c 'tabindex="-1"' about.html       # expect 5
# No <p class="tab-links"> left:
grep -c '<p class="tab-links"' about.html   # expect 0
```

Content preservation — every v1 tab title and list item must still be present, each appearing twice (desktop tabs + mobile accordions):

```bash
for t in Toolbox Interests Education Coursework Awards Certifications; do
  printf "%s: %s\n" "$t" "$(grep -c ">$t<" about.html)"
done   # each expect 2
diff <(git show v1.0.0:about.html | grep -o '<span>[^<]*</span>' | sort) \
     <(grep -o '<span>[^<]*</span>' about.html | sort -u) && echo "SPANS PRESERVED"
```

- [ ] **Step 7: Commit**

```bash
git add about.html css/style.css
git commit -m "fix(a11y): make about tabs keyboard-operable with no visual change"
```

---

### Task B: Roving tabindex arrow-key navigation

**Files:**
- Modify: `about.html` (inline `<script>`, after `opentab`)

**Interfaces:**
- Consumes: the `role="tablist"` container and `.tab-links` buttons from Task A; the `opentab(tabname, el)` signature from Task A Step 5.

- [ ] **Step 1: Add the tablist keydown handler**

Insert after the `opentab` function in `about.html`'s inline `<script>`:

```js
    // Standard tablist pattern: Tab enters/leaves the tablist, arrows move within it.
    (function initTabKeys() {
        const tablist = document.querySelector('.tab-titles[role="tablist"]');
        if (!tablist) return;
        const tabs = Array.from(tablist.querySelectorAll('.tab-links'));
        tablist.addEventListener("keydown", (e) => {
            const current = tabs.indexOf(document.activeElement);
            if (current === -1) return;
            let next;
            if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
            else if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = tabs.length - 1;
            else return;
            e.preventDefault();
            tabs[next].focus();
            tabs[next].click();
        });
    })();
```

Enter and Space need no handling — `<button>` fires `click` for both natively, which the existing `onclick` already handles.

- [ ] **Step 2: Verify structurally**

```bash
python3 -c "import html.parser; p=html.parser.HTMLParser(); p.feed(open('about.html').read()); print('parsed OK')"
node --check js/site.js   # unchanged, but confirm nothing else broke
grep -c 'ArrowRight' about.html   # expect 1
```

Extract the page's inline script and syntax-check it:

```bash
python3 - <<'PY'
import re
html = open('about.html').read()
scripts = re.findall(r'<script>(.*?)</script>', html, re.S)
open('/tmp/about_inline.js','w').write("\n".join(scripts))
print("extracted", len(scripts), "script block(s)")
PY
node --check /tmp/about_inline.js && echo "inline JS OK" && rm /tmp/about_inline.js
```

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat(a11y): arrow-key navigation for about tablist"
```

---

## Manual verification (user, after both tasks)

Automated checks cannot confirm the "no visible change" constraint. On `about.html` at desktop width:

1. **Mouse:** tabs look identical at rest, on hover, and when clicked; the maroon underline still slides in over 0.4s; no focus ring appears on click.
2. **Keyboard:** Tab reaches the tab row (one stop, not six); ←/→ move between tabs and switch panels; Home/End jump to first/last; a visible ring appears only during keyboard use.
3. **Panels:** Tab once more from the tab row to reach the panel; a long panel (Coursework) scrolls with ↑/↓.
4. **Mobile (≤720px):** unchanged — accordions, no tab row.

## Self-Review (completed)

- **Spec coverage:** keyboard operability (Task A buttons + Task B arrows) ✓ · no visible change for mouse (Step 3 reset + `:focus-visible`) ✓ · keyboard-only focus ring per user decision ✓ · content unchanged (Step 6 diff) ✓ · mobile untouched (scope constraint) ✓.
- **Placeholder scan:** none — every step contains literal code.
- **Type consistency:** `opentab(tabname, el)` defined in Task A Step 5 is called with two arguments by the markup in Step 1 and by Task B's `.click()` (which routes through the same inline `onclick`). Panel ids (`skills`/`interests`/`education`/`coursework`/`awards`/`certs`) and tab ids (`tab-` + panel id) are consistent across Steps 1, 2, and 5.
