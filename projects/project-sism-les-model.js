// SISM — Shear-Improved Smagorinsky Model for OpenFOAM 10
const projectSismLesModel = {
  id: 'sism-les-model',
  category: 'Code / tools',
  parallaxSpeed: 0.20,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/openfoam-logo.svg', alt: 'OpenFOAM logo' }
    ]
  },

  title: 'SISM — Shear-Improved Smagorinsky SGS Model for OpenFOAM 10',
  meta: ['OpenFOAM', 'C++'],
  role: 'Role: turbulence model development & implementation',

  description: `Custom LES subgrid-scale model library implementing the
    Shear-Improved Smagorinsky Model (Lévêque et al. 2007) for OpenFOAM 10.
    Suppresses excessive SGS dissipation near walls without van Driest damping,
    improving accuracy in wall-bounded and transitional flows.`,

  tags: ['LES', 'Turbulence modeling', 'OpenFOAM', 'C++', 'SGS model'],

  details: `
    <p>
      The standard Smagorinsky model responds to the total resolved strain rate,
      making it over-dissipative wherever mean shear is present — near walls,
      in boundary layers, and in transitional regions. The
      <strong>Shear-Improved Smagorinsky Model (SISM)</strong> (Lévêque, Toschi,
      Shao &amp; Bertoglio, <em>J. Fluid Mech.</em> 570, 2007) addresses this by
      subtracting the mean strain-rate magnitude from the instantaneous one before
      computing the eddy viscosity:
    </p>
    <pre style="background:#0a0e1a;padding:0.75rem 1rem;border-radius:6px;overflow-x:auto;font-size:0.82rem;">νT = (Cs Δ)² ( |S̄| − |⟨S̄⟩| )</pre>
    <p>
      The mean strain rate is tracked via an exponential running average updated
      every time step, preserving the averaging history across restarts via the
      <code>meanS</code> field.
    </p>
    <p>Key properties of the implementation:</p>
    <ul>
      <li>Naturally <strong>damps SGS viscosity near walls</strong> where mean shear dominates — no van Driest function needed.</li>
      <li>Recovers standard Smagorinsky behaviour in isotropic turbulence where <code>|S̄| >> |⟨S̄⟩|</code>.</li>
      <li>Correctly captures laminar-to-turbulent transition without ad-hoc fixes.</li>
      <li>Matches DNS data for channel flow at Re<sub>τ</sub> = 395 and 590 at a fraction of the cost of the dynamic model.</li>
      <li>Tunable <code>averagingCoeff</code> (α) to set the effective averaging time scale: <code>T_avg ≈ dt / α</code>.</li>
    </ul>
    <p>
      The library compiles with <code>wmake libso</code> and is loaded at runtime via
      <code>libs ("libSISM.so");</code> in <code>system/controlDict</code>. Drop-in
      replacement for any incompressible LES solver (e.g. <code>pisoFoam</code>).
    </p>
  `,

  footer: {
    label: 'Lévêque et al. (2007), J. Fluid Mech. 570, 491–502',
    links: [
      { text: 'GitHub', href: 'https://github.com/dbalasko/OpenFOAM_SISM', external: true }
    ]
  }
};
