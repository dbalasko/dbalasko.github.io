// Richtmyer-Meshkov Instability: Shock-Interface Interaction
const projectRichtmyerMeshkov = {
  id: 'richtmyer-meshkov',
  category: 'Internal flows',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/Richtmeyer_Meshkov_SF6_mass_fraction.gif', alt: 'SF₆ mass fraction evolution: mushroom-shaped interface roll-up from shock impact' },
      { src: 'projects/figs/Richtmeyer_Meshkov_Backward_Euler.gif', alt: 'First-order Backward Euler: diffusive error smears interface structures' },
      { src: 'projects/figs/Richtmeyer_Meshkov_advection_scheme_comparison_t_0015.png', alt: 'Pressure distribution comparison: Upwind vs High Resolution advection schemes' }
    ]
  },

  title: 'Richtmyer–Meshkov Instability: Shock-Driven Mixing',
  meta: ['ANSYS CFX', 'Transient'],
  role: 'Role: transient compressible setup, shock-interface analysis & numerical scheme comparison',

  description: `Transient compressible simulation of shock-interface interaction between two fluids
    (acetone-air and SF₆). Investigation of vorticity generation, mushroom-shaped interface roll-up,
    and enhanced mixing due to Richtmyer-Meshkov instability. Comparison of numerical schemes.`,

  tags: ['Compressible', 'Shock waves', 'Two-phase', 'Transient', 'Mixing'],

  details: `
    <p><strong>Background:</strong> The Richtmyer-Meshkov instability occurs when a shockwave hits the interface between two fluids of different densities. The misalignment of pressure and density gradients generates vorticity, causing the interface to roll up into a characteristic mushroom shape and dramatically enhancing mixing.</p>

    <p><strong>Setup:</strong></p>
    <ul>
      <li>2D transient simulation with sinusoidal interface (λ = 59.3 mm, amplitude a₀ = 4 mm)</li>
      <li>Two fluids: acetone-air mixture (γ = 1.276, M = 34.76 g/mol) and SF₆ (γ = 1.093, M = 146.05 g/mol)</li>
      <li>Calorically perfect ideal gas mixture with variable composition</li>
      <li>Total energy model for compressible flow</li>
      <li>Pre-shock: p = 0.956 bar, T = 296 K (aa), 305 K (SF₆)</li>
      <li>Post-shock: p = 1.648 bar, density ratio ρ_SF₆/ρ_aa ≈ 4.4</li>
      <li>Two-stage approach: coarse uniform grid (0-0.7 ms), then refined grid near interface (0.7-5 ms)</li>
    </ul>

    <p><strong>Physical phenomena observed:</strong></p>
    <ul>
      <li><strong>Shock reflection:</strong> When shock hits interface at t ≈ 0.7 ms, one shock transmits into SF₆, one reflects back</li>
      <li><strong>Vorticity generation:</strong> Misaligned pressure and density gradients create baroclinic vorticity: ω ∝ ∇ρ × ∇p</li>
      <li><strong>Interface roll-up:</strong> Vorticity causes mushroom-shaped roll-up, visible in SF₆ mass fraction contours</li>
      <li><strong>Enhanced mixing:</strong> Roll-up dramatically increases interfacial area and mixing rate</li>
      <li><strong>Pressure oscillations:</strong> Upstream of shock, oscillations amplify with time and drive interface deformation</li>
    </ul>

    <p><strong>Numerical scheme comparison:</strong></p>
    <ul>
      <li><strong>Advection schemes (Upwind vs High Resolution):</strong>
        <ul>
          <li>Upwind: more stable, no oscillations, but higher numerical dissipation</li>
          <li>High Resolution: sharper shock capture, preserves gradients, but small oscillations near discontinuities</li>
          <li>Peak pressure differences up to 5% at shock front</li>
        </ul>
      </li>
      <li><strong>Time integration (1st vs 2nd order Backward Euler):</strong>
        <ul>
          <li>First order: diffusive error smears sharp gradients, damps high-frequency oscillations</li>
          <li>Second order: preserves small-scale vortex structures, sharper interface definition</li>
          <li>First order acts like numerical viscosity, dissipating fine-scale structures</li>
        </ul>
      </li>
    </ul>

    <p><strong>Key findings:</strong></p>
    <ul>
      <li>Shock-interface interaction successfully captured with mushroom-shaped roll-up at t = 1-5 ms</li>
      <li>Velocity swirl Z-component shows vortex pair formation at interface</li>
      <li>Vorticity enhances mixing by orders of magnitude compared to pure diffusion</li>
      <li>Second-order time scheme + High Resolution advection needed to resolve small-scale structures</li>
      <li>Symmetry boundary reduces computational cost but cannot capture asymmetric perturbations</li>
    </ul>

    <p><strong>Physical insight:</strong> The R-M instability is fundamentally driven by baroclinic vorticity generation. Unlike Rayleigh-Taylor (gravity-driven), it's impulsive—vorticity is deposited during shock passage and then convects/diffuses. This makes it crucial in inertial confinement fusion, supernova explosions, and scramjet combustors.</p>
  `,

  footer: {
    label: 'Shock-driven mixing: acetone-air/SF₆ interface instability',
    links: []
  }
};
