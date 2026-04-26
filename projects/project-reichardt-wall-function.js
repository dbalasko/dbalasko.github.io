// Reichardt Wall Function for OpenFOAM 10
const projectReichardtWallFunction = {
  id: 'reichardt-wall-function',
  category: 'Code / tools',
  parallaxSpeed: 0.20,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/openfoam-logo.svg', alt: 'OpenFOAM logo' }
    ]
  },

  title: 'Reichardt Wall Function — Continuous ν<sub>t</sub> BC for OpenFOAM 10',
  meta: ['OpenFOAM', 'C++'],
  role: 'Role: boundary condition development & implementation',

  description: `Custom <code>nutWallFunction</code> boundary condition for OpenFOAM 10
    based on Reichardt's (1951) continuous law of the wall. Provides a single smooth
    u<sup>+</sup> profile from the viscous sublayer through the buffer layer and into
    the log-law region — valid down to y<sup>+</sup> = 0.`,

  tags: ['Wall function', 'Turbulence modeling', 'OpenFOAM', 'C++', 'RANS'],

  details: `
    <p>
      Standard wall functions in OpenFOAM are built on the two-layer (viscous sublayer
      + log law) approximation, which is discontinuous at the buffer layer and requires
      careful placement of the first cell (30 &lt; y<sup>+</sup> &lt; 300). This
      implementation replaces that with <strong>Reichardt's (1951)</strong> single
      continuous profile:
    </p>
    <pre style="background:#0a0e1a;padding:0.75rem 1rem;border-radius:6px;overflow-x:auto;font-size:0.82rem;">u⁺ = (1/κ) ln(1 + κ y⁺) + C [1 − exp(−y⁺/11) − (y⁺/11) exp(−y⁺/3)]</pre>
    <p>
      The friction velocity u<sub>τ</sub> is recovered via <strong>Newton–Raphson
      iteration</strong> of the implicit profile equation, then the turbulent viscosity
      is back-calculated as:
    </p>
    <pre style="background:#0a0e1a;padding:0.75rem 1rem;border-radius:6px;overflow-x:auto;font-size:0.82rem;">νt = uτ² / |∂U/∂n| − ν</pre>
    <p>Key properties:</p>
    <ul>
      <li>Smooth, single-formula profile valid from y<sup>+</sup> = 0 to the log-law region — no discontinuity at the buffer layer.</li>
      <li>Drop-in replacement for the built-in <code>nutWallFunction</code>; compatible with any RANS or hybrid LES/RANS solver.</li>
      <li>Single tuning parameter: <code>C</code> (Reichardt's constant, default 7.8).</li>
      <li>Inherits <code>yPlus</code> reporting and all standard OpenFOAM wall-function infrastructure.</li>
    </ul>
    <p>
      Compiled with <code>wmake libso</code> and activated by setting
      <code>type myReichardtWallFunction;</code> on any wall patch in
      <code>0/nut</code>.
    </p>
  `,

  footer: {
    label: 'Reichardt, H. (1951). ZAMM, 31(7), 208–219',
    links: [
      { text: 'GitHub', href: 'https://github.com/dbalasko/OpenFOAM_ReichardtsWallFunction', external: true }
    ]
  }
};
