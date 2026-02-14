// Rayleigh-Bénard Convection: Natural Convection in Closed Cavities
const projectRayleighBenard = {
  id: 'rayleigh-benard',
  category: 'Internal flows',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/Rayleigh Bernard_Ra_500_001.png', alt: '2D periodic layer: Ra = 500, conduction-dominated (no convection cells)' },
      { src: 'projects/figs/Rayleigh Bernard_Ra_5000_001.png', alt: '2D periodic layer: Ra = 5000, convection cells emerging' },
      { src: 'projects/figs/Rayleigh Bernard_Ra_50000_001.png', alt: '2D periodic layer: Ra = 50,000, strong convection with steep temperature gradients' },
      { src: 'projects/figs/Rayleigh Bernard_2D_combined_plot.png', alt: '2D Nusselt number and velocity comparison across Rayleigh numbers' },
      { src: 'projects/figs/Rayleigh Bernard_3D_Ra_40000_streamline.png', alt: '3D cavity: Ra = 40,000, streamlines showing two counter-rotating cells' },
      { src: 'projects/figs/Rayleigh Bernard_3D_Ra_80000_streamline.png', alt: '3D cavity: Ra = 80,000, stronger circulation and heat transfer' },
      { src: 'projects/figs/Rayleigh Bernard_3D_Ra_800000_streamline.png', alt: '3D cavity: Ra = 800,000, multiple convection cells at boundaries' }
    ]
  },

  title: 'Rayleigh-Bénard Convection: Buoyancy-Driven Flow Instability',
  meta: ['ANSYS CFX', 'Boussinesq'],
  role: 'Role: Boussinesq setup, convection cell analysis & Nusselt correlation',

  description: `Numerical study of natural convection in closed cavities using the Boussinesq
    approximation. Investigation of the transition from conduction-dominated to convection-dominated
    heat transfer at varying Rayleigh numbers, with analysis of convection cell formation and Nusselt number scaling.`,

  tags: ['Natural convection', 'Boussinesq', 'Heat transfer', 'Nusselt number', 'Buoyancy'],

  details: `
    <p><strong>Background:</strong> Rayleigh-Bénard convection occurs when a fluid is heated from below, creating buoyancy-driven flow. At low Ra, heat transfer is purely conductive; above a critical Ra ≈ 1707, convection cells spontaneously form, dramatically enhancing heat transfer.</p>

    <p><strong>Setup:</strong></p>
    <ul>
      <li>Two configurations: 2D periodic layer (20×5 mm) and 3D square cavity (10×10×20 mm)</li>
      <li>Boussinesq approximation: buoyancy force proportional to local temperature deviation</li>
      <li>Laminar solver with thermal energy equation</li>
      <li>Water properties: β = 2.57×10⁻⁴ K⁻¹, ν = 8.926×10⁻⁷ m²/s, λ = 0.607 W/(m·K)</li>
      <li>Heated bottom wall, cooled top wall, adiabatic sidewalls (3D case)</li>
    </ul>

    <p><strong>2D periodic convection:</strong></p>
    <ul>
      <li><strong>Ra = 500:</strong> Below critical → linear temperature profile, no convection cells</li>
      <li><strong>Ra = 5000:</strong> Above critical → convection cells form, enhanced heat transfer</li>
      <li><strong>Ra = 50,000:</strong> Stronger convection cells, steeper temperature gradients at centerline</li>
      <li>Nusselt number validates empirical correlation: Nu ≈ 1.56(Ra/Ra_c)^0.296</li>
      <li>Local Nu minima correspond to vertical velocity minima (reduced convective transport)</li>
    </ul>

    <p><strong>3D cavity convection:</strong></p>
    <ul>
      <li><strong>Ra = 8000:</strong> Single symmetric convection cell, Nu_avg = 1.00 (nearly conductive)</li>
      <li><strong>Ra = 40,000:</strong> Two counter-rotating cells emerge, Nu_avg = 3.43</li>
      <li><strong>Ra = 80,000:</strong> Stronger cell circulation, Nu_avg = 5.94</li>
      <li><strong>Ra = 800,000:</strong> Multiple cells at top/bottom boundaries, Nu_avg = 14.32</li>
      <li>Non-linear, degressive growth of Nu and velocity with Ra</li>
      <li>Ratio Nu_max/Nu_avg increases from 1.03 to 1.76, indicating flow becomes less isotropic</li>
    </ul>

    <p><strong>Key findings:</strong></p>
    <ul>
      <li>Transition from conduction (Ra < Ra_c) to convection (Ra > Ra_c) clearly demonstrated</li>
      <li>Number and position of convection cells depend on Rayleigh number and geometry</li>
      <li>Nusselt number scales with Ra according to power-law correlations</li>
      <li>At high Ra, convective heat transfer dominates, max velocity increases by 5 orders of magnitude</li>
      <li>Flow structure transitions from isotropic to highly anisotropic with strong boundary layers</li>
    </ul>

    <p><strong>Physical insight:</strong> The Rayleigh number (Ra = gβρc_p ΔT L³ / νλ) represents the ratio of buoyancy forces to viscous forces. When buoyancy overcomes damping, convection cells spontaneously organize into roll patterns that efficiently transport heat vertically.</p>
  `,

  footer: {
    label: 'Rayleigh-Bénard: Ra = 500 to 800,000, Nu up to 14.3',
    links: []
  }
};
