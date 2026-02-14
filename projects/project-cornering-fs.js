// Aerodynamics of a Cornering Formula Student Car
const projectCorneringFs = {
  id: 'cornering-fs',
  category: 'External aero',
  parallaxSpeed: 0.22,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/fe-25-1243_f007.png', alt: 'Pressure distribution under yaw' },
      { src: 'projects/figs/fe-25-1243_f005.png', alt: 'Cornering aerodynamics analysis' },
      { src: 'projects/figs/fe-25-1243_f006.png', alt: 'Flow field comparison' },
      { src: 'projects/figs/fe-25-1243_f010.png', alt: 'Wake asymmetry visualization' },
      { src: 'projects/figs/fe-25-1243_f011.png', alt: 'Downforce distribution analysis' },
      { src: 'projects/figs/fe-25-1243_f016.png', alt: 'Aerodynamic load imbalance' }
    ]
  },

  title: 'Aerodynamics of a Cornering Formula Student Car',
  meta: ['Published Research', 'ASME J. Fluids Eng.'],
  role: 'Role: Lead researcher & CFD analysis',

  description: `Published peer-reviewed research examining the aerodynamic behavior
    of Formula Student race cars during cornering maneuvers. CFD study
    investigating aerodynamic load variations, flow field changes, and
    performance implications under dynamic cornering conditions.`,

  tags: ['Published paper', 'External aero', 'Cornering dynamics'],

  details: `
    <p>
      This research investigated how cornering affects the aerodynamic
      performance of Formula Student vehicles, a critical but often
      overlooked aspect of race car aerodynamics. Most studies focus on
      straight-line performance, but significant lap time is spent in
      corners where aerodynamic behavior differs substantially.
    </p>
    <p>Key research contributions:</p>
    <ul>
      <li>CFD analysis of full-vehicle aerodynamics under cornering conditions.</li>
      <li>Investigation of yaw angle and roll effects on downforce distribution.</li>
      <li>Quantification of left-right aerodynamic load imbalance during cornering.</li>
      <li>Flow field analysis showing wake asymmetry and ground effect variations.</li>
      <li>Validation against reference data and experimental measurements.</li>
    </ul>
    <p>
      The study provides insights into how cornering maneuvers alter
      pressure distributions, flow separation patterns, and overall
      aerodynamic balance—critical information for optimizing vehicle
      setup and design for circuit performance rather than just
      straight-line speed.
    </p>
  `,

  footer: {
    label: 'Published in ASME Journal of Fluids Engineering',
    links: [
      { text: 'View paper', href: 'https://doi.org/10.1115/1.4069995', external: true }
    ]
  }
};
