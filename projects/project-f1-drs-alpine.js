// F1 Alpine DRS Philosophy - Transient LES Analysis
const projectF1DrsAlpine = {
  id: 'f1-drs-alpine',
  category: 'External aero',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/Alpine_video.mp4', alt: 'Alpine DRS concept velocity video' },
      { src: 'projects/figs/Alpine_plot.png', alt: 'Hysteresis plot of Alpine DRS concept' }
    ]
  },

  title: 'Alpine F1 DRS Philosophy: Innovation or Compromise?',
  meta: ['STAR-CCM+', 'Transient LES'],
  role: 'Role: transient LES setup, wing motion modeling & aero analysis',

  description: `Transient LES comparison of two F1 rear wing DRS concepts: conventional
    rear-hinged vs Alpine's front-hinged design. Investigation of drag reduction,
    lift hysteresis, and transient stability during DRS activation and closure.`,

  tags: ['LES', 'F1', 'DRS', 'Transient flow', 'Overset mesh'],

  details: `
    <p><strong>Background:</strong> Alpine's DRS uses a front-hinged flap rotating downward, unlike the conventional rear-hinged design. This study investigates the aerodynamic tradeoffs.</p>

    <p><strong>Setup:</strong></p>
    <ul>
      <li>Transient LES with WMLES (WALE subgrid model)</li>
      <li>2-element rear wing: NACA 4415 mainplane + S1223 flap</li>
      <li>Identical mesh and motion law for both concepts</li>
      <li>Overset mesh to capture DRS opening and closure</li>
    </ul>

    <p><strong>Two DRS concepts:</strong></p>
    <ul>
      <li><strong>Conventional DRS:</strong> rear-hinged flap rotates upward, substantially reduces mainplane loading</li>
      <li><strong>Alpine-style DRS:</strong> front-hinged flap rotates downward, preserves aerodynamic coupling to mainplane</li>
    </ul>

    <p><strong>Key findings:</strong></p>
    <ul>
      <li>Overall drag reduction nearly identical between concepts</li>
      <li>Alpine design shows opposing hysteresis: higher lift during closure vs opening</li>
      <li>Conventional DRS shows lower lift during closure</li>
      <li>Front-hinge geometry promotes faster pressure recovery and cleaner force rebuild when closing</li>
      <li>Alpine prioritizes reduced hysteresis and transient stability over maximum drag reduction</li>
    </ul>

    <p><strong>Conclusion:</strong> Alpine's design philosophy favors predictable transient behavior and stability during late DRS closure, critical for driver confidence in high-speed corners.</p>
  `,

  footer: {
    label: 'Transient LES: conventional vs Alpine DRS hysteresis',
    links: [
      { text: 'LinkedIn post', href: 'https://www.linkedin.com/posts/dominik-balasko_f1-formula1-aerodynamics-activity-7426890258660667392-nkJk', external: true }
    ]
  }
};
