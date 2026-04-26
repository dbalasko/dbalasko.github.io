// Automated Post-processing Pipeline
const projectParaviewAutomation = {
  id: 'paraview-automation',
  category: 'Code / tools',
  parallaxSpeed: 0.22,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/paraview-logo.webp', alt: 'ParaView logo' }
    ]
  },

  title: 'Automated post-processing pipeline',
  meta: ['Python', 'ParaView API'],
  role: 'Role: scripting & tooling',

  description: `Python-based tools to drive ParaView, generate plots, tables,
    and PDF reports from series of runs. Reduced manual work and
    improved reproducibility of CFD studies.`,

  tags: ['Automation', 'Python', 'ParaView'],

  details: `
    <p>
      These tools were created to standardize how CFD results are
      processed across projects. The scripts connect to ParaView,
      apply predefined filters, and export visualizations and data.
    </p>
    <p>Capabilities:</p>
    <ul>
      <li>Batch processing of time-series or design variants.</li>
      <li>Automatic creation of plots for forces, coefficients and probes.</li>
      <li>Scripted layout exports for consistent figure styling.</li>
    </ul>
    <p>
      This significantly reduced the time from "results finished" to
      "ready-to-share report" and improved traceability of how each
      figure was generated.
    </p>
  `,

  footer: {
    label: 'Reusable scripts and templates',
    links: [
      { text: 'Scripts', href: '#', external: true }
    ]
  }
};
