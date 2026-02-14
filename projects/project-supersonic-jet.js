// Supersonic Jet: Over- and Under-Expanded Nozzle Flow
const projectSupersonicJet = {
  id: 'supersonic-jet',
  category: 'Internal flows',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/Jet_p_stat_0_4_bar_Ma.png', alt: 'Over-expanded jet: Mach number showing oblique shock train' },
      { src: 'projects/figs/Jet_p_stat_0_4_bar_p_stat.png', alt: 'Over-expanded jet: static pressure distribution' },
      { src: 'projects/figs/Jet_p_stat_0_4_bar_p_tot.png', alt: 'Over-expanded jet: total pressure losses across shocks' },
      { src: 'projects/figs/Jet_p_stat_1_4_bar_Ma.png', alt: 'Under-expanded jet: Mach number showing expansion fans' },
      { src: 'projects/figs/Jet_p_stat_1_4_bar_p_stat.png', alt: 'Under-expanded jet: static pressure distribution' },
      { src: 'projects/figs/Jet_p_stat_1_4_bar_p_tot.png', alt: 'Under-expanded jet: total pressure losses' }
    ]
  },

  title: 'Supersonic Jet: Shock Diamonds & Expansion Fans',
  meta: ['ANSYS CFX', 'Euler'],
  role: 'Role: Euler setup, shock train analysis & mesh resolution study',

  description: `2D inviscid Euler simulation of over- and under-expanded supersonic jets
    exiting a Laval nozzle. Investigation of oblique shock patterns, expansion fans,
    and total pressure losses across shock diamonds.`,

  tags: ['Compressible', 'Euler', 'Oblique shocks', 'Expansion fan', 'Shock diamonds'],

  details: `
    <p><strong>Background:</strong> When nozzle exit pressure doesn't match ambient, the jet forms a series of oblique shocks and expansion fans to equilibrate, creating the characteristic "shock diamond" pattern.</p>

    <p><strong>Setup:</strong></p>
    <ul>
      <li>2D supersonic jet, inlet Ma = 1.5 (p₀/p = 3.671)</li>
      <li>Inviscid Euler (μ=0, λ=0), total energy model</li>
      <li>Inlet: p_stat = 1 bar, T₀ = 293 K, γ = 1.4, R = 287 J/(kg·K)</li>
      <li>Three operating conditions tested</li>
      <li>Coarse and fine mesh comparison</li>
    </ul>

    <p><strong>Operating conditions:</strong></p>
    <ul>
      <li><strong>Over-expanded (p_exit = 0.4 bar):</strong> exit pressure < ambient → oblique shock train forms at jet boundary to compress flow back to ambient</li>
      <li><strong>Under-expanded (p_exit = 1.4 bar):</strong> exit pressure > ambient → Prandtl-Meyer expansion fan at nozzle lip, followed by oblique shock reflections</li>
      <li><strong>Matched (p_exit = 1.0 bar):</strong> exit pressure = ambient → minimal shock structure</li>
    </ul>

    <p><strong>Key findings:</strong></p>
    <ul>
      <li>Over-expanded case shows strong compression immediately at nozzle exit</li>
      <li>Under-expanded case exhibits expansion fan followed by recompression shocks</li>
      <li>Total pressure losses concentrated across shock fronts (isentropic elsewhere)</li>
      <li>Line P5P6 (near shock boundary) shows largest p₀ variations due to oblique shock crossings</li>
      <li>Finer mesh resolves shock fronts more sharply, reduces numerical diffusion</li>
    </ul>

    <p><strong>Mesh resolution study:</strong></p>
    <ul>
      <li>Coarse mesh: shock diamonds visible but smeared</li>
      <li>Fine mesh: sharper shock definition, closer to analytical jump solution</li>
      <li>Key improvement: better capture of total pressure gradients across shocks</li>
    </ul>

    <p><strong>Physical insight:</strong> The oblique shock pattern is self-adjusting, the jet continuously tries to match ambient pressure through a series of compression and expansion waves, creating the repeating diamond structure.</p>
  `,

  footer: {
    label: 'Oblique shock train: over- vs under-expanded jet',
    links: []
  }
};
