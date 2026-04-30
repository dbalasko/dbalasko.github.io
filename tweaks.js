// Tweaks panel — exposes light/dark + flavor (apple / vision / editorial).

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "flavor": "apple",
  "material": "original"
}/*EDITMODE-END*/;

(function () {
  const state = { ...TWEAK_DEFAULTS };

  function apply() {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.flavor = state.flavor;
    if (window.__setCarMaterial) window.__setCarMaterial(state.material);
  }
  apply();
  // Re-apply material once car is loaded (car loads async)
  setTimeout(apply, 1200);
  setTimeout(apply, 3000);

  // Build panel
  const panel = document.createElement('div');
  panel.className = 'tweaks-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="tweaks-header">
      <span>Tweaks</span>
      <button class="tweaks-close" aria-label="Close">×</button>
    </div>
    <div class="tweaks-row">
      <label class="tweaks-label">Appearance</label>
      <div class="tweaks-seg" data-group="theme">
        <button data-val="light">Light</button>
        <button data-val="dark">Dark</button>
      </div>
    </div>
    <div class="tweaks-row">
      <label class="tweaks-label">Flavor</label>
      <div class="tweaks-seg vert" data-group="flavor">
        <button data-val="apple">apple.com</button>
        <button data-val="vision">Vision / glass</button>
        <button data-val="editorial">Newsroom editorial</button>
      </div>
    </div>
    <div class="tweaks-row">
      <label class="tweaks-label">Car material</label>
      <div class="tweaks-seg vert" data-group="material">
        <button data-val="original">Original (PBR)</button>
        <button data-val="carbon">Carbon</button>
        <button data-val="paint">Race paint</button>
        <button data-val="ghost">Ghost</button>
      </div>
    </div>
    <div class="tweaks-foot">Scroll-storytelling prototype</div>
  `;
  document.body.appendChild(panel);

  function syncButtons() {
    panel.querySelectorAll('[data-group]').forEach((g) => {
      const key = g.dataset.group;
      g.querySelectorAll('button').forEach((b) => {
        b.classList.toggle('on', b.dataset.val === state[key]);
      });
    });
  }
  syncButtons();

  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-val]');
    if (b) {
      const key = b.parentElement.dataset.group;
      state[key] = b.dataset.val;
      apply();
      syncButtons();
      try {
        window.parent.postMessage(
          { type: '__edit_mode_set_keys', edits: { [key]: state[key] } }, '*'
        );
      } catch (_) {}
    }
    if (e.target.classList.contains('tweaks-close')) {
      panel.hidden = true;
    }
  });

  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') panel.hidden = false;
    if (d.type === '__deactivate_edit_mode') panel.hidden = true;
  });

  // Announce availability AFTER listener is set up
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (_) {}
})();
