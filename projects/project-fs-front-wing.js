// Formula Student Front Wing Aerodynamics
const projectFsFrontWing = {
  id: 'fs-front-wing',
  category: 'External aero',
  parallaxSpeed: 0.2,

  media: {
    type: 'gallery',
    images: [
      { src: 'fs-front-wing-1.jpg', alt: 'FS front wing CFD 1' },
      { src: 'fs-front-wing-2.jpg', alt: 'FS front wing CFD 2' },
      { src: 'fs-front-wing-3.jpg', alt: 'FS front wing CFD 3' }
    ]
  },

  title: 'Formula Student front wing aerodynamics',
  meta: ['STAR-CCM+', 'Steady RANS'],
  role: 'Role: geometry cleanup, meshing & setup',

  description: `Parametric study of a multi-element front wing to maximize front
    axle downforce at acceptable drag levels. Included mesh
    independence, y<sup>+</sup> control, and correlation against a
    reference baseline.`,

  tags: ['External aero', 'k-ω SST', 'Mesh independence'],

  details: `
    <p>
      The goal of this study was to quantify how front wing geometry
      influences balance and overall aerodynamic efficiency of a
      Formula Student car. Several configurations were explored
      (variation in camber, AoA, and endplate design) under a range of
      ride heights.
    </p>
    <p>Key aspects of the setup:</p>
    <ul>
      <li>Cleaned and defeatured CAD from the FS chassis team.</li>
      <li>Hybrid prism / polyhedral mesh with systematic y<sup>+</sup> checks.</li>
      <li>k–ω SST model with steady RANS, pressure-based solver.</li>
      <li>Mesh independence study on 3 mesh densities.</li>
    </ul>
    <p>
      The final configuration improved front axle downforce by ~18%
      while adding only ~6% drag compared to the baseline. This
      allowed a more forward aero balance, helping tyre utilization
      without excessively penalizing straight-line speed.
    </p>
  `,

  footer: {
    label: 'CL & CD vs. angle of attack',
    links: [
      { text: 'Report', href: '#', external: true },
      { text: 'Slides', href: '#', external: true }
    ]
  }
};
