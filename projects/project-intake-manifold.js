// Intake Manifold Pressure Loss Analysis
const projectIntakeManifold = {
  id: 'intake-manifold',
  category: 'Internal flows',
  parallaxSpeed: 0.24,

  media: {
    type: 'gallery',
    images: [
      { src: 'intake-manifold-1.jpg', alt: 'Intake manifold CFD 1' },
      { src: 'intake-manifold-2.jpg', alt: 'Intake manifold CFD 2' }
    ]
  },

  title: 'Intake manifold pressure loss analysis Work in Progress',
  meta: ['STAR-CCM+', 'Steady RANS'],
  role: 'Role: parametric design & CFD',

  description: `Internal flow study of an intake manifold to reduce separation
    and improve flow uniformity. Geometry variants evaluated based
    on pressure loss and mass flow distribution across runners.`,

  tags: ['Internal flow', 'Pressure loss', 'Design iterations'],

  details: `
    <p>
      The baseline manifold showed strong separation at the plenum
      entrance and uneven distribution between runners, leading to
      cylinder-to-cylinder imbalances. Several baffle and diffuser
      concepts were evaluated.
    </p>
    <p>Metrics tracked:</p>
    <ul>
      <li>Total pressure loss between inlet and runner exits.</li>
      <li>Flow uniformity index for all runners.</li>
      <li>Local Mach number and recirculation regions.</li>
    </ul>
    <p>
      The optimized design reduced pressure loss by ~12% and improved
      mass flow uniformity significantly, giving a more consistent
      air delivery without increasing packaging complexity.
    </p>
  `,

  footer: {
    label: 'Δp and maldistribution index',
    links: [
      { text: 'Summary', href: '#', external: true }
    ]
  }
};
