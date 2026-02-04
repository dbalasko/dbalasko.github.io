// LES of Cylinder Wake
const projectCylinderLes = {
  id: 'cylinder-les',
  category: 'LES / transient',
  parallaxSpeed: 0.28,

  media: {
    type: 'gallery',
    images: [
      { src: 'cylinder-les-1.jpg', alt: 'Cylinder LES 1' },
      { src: 'cylinder-les-2.jpg', alt: 'Cylinder LES 2' },
      { src: 'cylinder-les-3.jpg', alt: 'Cylinder LES 3' }
    ]
  },

  title: 'LES of cylinder wake at Re = 10<sup>5</sup>',
  meta: ['OpenFOAM', 'LES (WALE)'],
  role: 'Role: solver setup & validation',

  description: `Transient LES capturing vortex shedding and wake dynamics.
    Strouhal number, drag coefficient, and base pressure compared
    with literature and experiments to assess model performance.`,

  tags: ['LES', 'Turbulence modeling', 'Time-resolved data'],

  details: `
    <p>
      This classic benchmark was used to verify both numerical
      settings and the chosen subgrid-scale model. The mesh was
      designed to have sufficient resolution in the shear layers and
      wake region, while remaining affordable for long time-series.
    </p>
    <p>Highlights:</p>
    <ul>
      <li>WALE SGS model with second-order accurate schemes.</li>
      <li>Time step based on CFL &lt; 0.5 in the shear layer region.</li>
      <li>Monitoring of Cd, Cl and base pressure to ensure statistical convergence.</li>
    </ul>
    <p>
      The predicted Strouhal number and mean drag coefficient matched
      reference values within a few percent, giving confidence in the
      LES setup and filters for future transient projects.
    </p>
  `,

  footer: {
    label: 'Cd, Cl & St vs. references',
    links: [
      { text: 'Git repo', href: '#', external: true }
    ]
  }
};
