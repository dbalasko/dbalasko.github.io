// Supersonic Double Ramp Flow - CFD Study
const projectSupersonicRamp = {
  id: 'supersonic-ramp',
  category: 'External aero',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/supersonic-ramp-pressure.jpg', alt: 'Total pressure contour showing shock structure' },
      { src: 'projects/figs/supersonic-ramp-mesh-refined.jpg', alt: 'Shock-aligned refined structured mesh' },
      { src: 'projects/figs/supersonic-ramp-density.jpg', alt: 'Density field comparison between meshes' },
      { src: 'projects/figs/supersonic-ramp-convergence-0.jpg', alt: 'Residual convergence history' },
      { src: 'projects/figs/supersonic-ramp-convergence-1.jpg', alt: 'Monitor point convergence' }
    ]
  },

  title: 'Supersonic Double Ramp Flow at Mach 3.8',
  meta: ['ANSYS CFX', 'Compressible RANS'],
  role: 'Role: Meshing strategy, solver setup & turbulence model comparison',

  description: `High-speed compressible flow simulation over a double ramp geometry
    at M = 3.8. Study of oblique shock interactions, shock-boundary layer coupling,
    and the critical role of structured mesh alignment in capturing steep gradients.`,

  tags: ['Supersonic', 'Shock waves', 'Structured mesh', 'BSL EARSM'],

  details: `
    <p>
      This study investigated supersonic flow over a double ramp configuration
      (α = 8°, β = 22°) at Mach 3.8, featuring oblique shock formation, shock-shock
      interaction, and shock-boundary layer coupling. Three simulation approaches
      were compared: inviscid Euler, RANS k-ε, and RANS BSL EARSM.
    </p>
    <p>Supersonic flow phenomena captured:</p>
    <ul>
      <li>Two distinct oblique shocks originating from each ramp kink.</li>
      <li>Shock interaction region where the weaker first shock bends under influence of the stronger second shock.</li>
      <li>Expansion fan downstream of the second shock affecting shock trajectory.</li>
      <li>Total pressure losses across shocks: Δp<sub>01</sub> ≈ 6 kPa (weak), Δp<sub>02</sub> ≈ 40 kPa (strong).</li>
      <li>Post-shock Mach numbers: M<sub>1</sub> = 3.26, M<sub>2</sub> = 2.31.</li>
    </ul>
    <p>Structured mesh approach & orthogonality control:</p>
    <ul>
      <li>Hexahedral structured grid chosen for lower numerical diffusion when aligned with flow.</li>
      <li>Initial universal mesh with 5-block topology split at geometry kinks.</li>
      <li>Refined mesh with shock-aligned blocking—additional splits oriented at predicted shock angles.</li>
      <li>Biexponential node distribution to concentrate cells at expected shock locations.</li>
      <li>O-block topology at outlet to avoid excessive skewness in the interaction region.</li>
      <li>Prism layer refinement: 25 layers (k-ε, Y+ = 30–300) and 64 layers (BSL EARSM, Y+ < 5).</li>
    </ul>
    <p>
      The refined mesh with shock-aligned cells showed significantly sharper gradient
      resolution and reduced numerical diffusion compared to the universal grid, despite
      introducing some cell distortion (min. orthogonality 15.9°, skew 0.18). The BSL EARSM
      model with full boundary layer resolution provided the most accurate shock angles
      and handled flow anisotropy in the shock-boundary layer interaction region.
    </p>
  `,

  footer: {
    label: 'Shock angles, Mach distribution & turbulence model comparison',
    links: [
      { text: 'Report', href: 'projects/ACFD_merged_final_reducted.pdf', external: true }
    ]
  }
};
