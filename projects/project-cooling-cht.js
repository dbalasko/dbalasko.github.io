// Cooling Duct CHT Optimization
const projectCoolingCht = {
  id: 'cooling-cht',
  category: 'Internal flows',
  parallaxSpeed: 0.18,

  media: {
    type: 'gallery',
    images: [
      { src: 'cooling-cht-1.jpg', alt: 'Cooling duct CHT 1' },
      { src: 'cooling-cht-2.jpg', alt: 'Cooling duct CHT 2' }
    ]
  },

  title: 'Cooling duct CHT optimization',
  meta: ['STAR-CCM+', 'CHT'],
  role: 'Role: setup & optimization',

  description: `Conjugate heat transfer analysis of an electronics cooling duct,
    exploring trade-offs between maximum component temperature and
    pressure drop through automated design sweeps.`,

  tags: ['Heat transfer', 'Optimization'],

  details: `
    <p>
      The system combined solid and fluid regions to capture conduction,
      convection, and contact resistances. Several fin layouts, duct
      shapes, and flow rates were compared.
    </p>
    <p>The design space was explored via:</p>
    <ul>
      <li>Automated parametric sweeps driven by design tables.</li>
      <li>Monitoring of key temperatures and pressure drop.</li>
      <li>Post-processing templates to compare variants consistently.</li>
    </ul>
    <p>
      The final design reduced peak component temperature by ~9&nbsp;K
      while keeping the pressure drop within the fan's operating
      limits.
    </p>
  `,

  footer: {
    label: 'Tmax & Δp vs. design',
    links: [
      { text: 'Results', href: '#', external: true }
    ]
  }
};
