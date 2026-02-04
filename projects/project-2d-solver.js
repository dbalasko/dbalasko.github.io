// 2D Unsteady CFD Solver
const project2dSolver = {
  id: '2d-solver',
  category: 'Code / tools',
  parallaxSpeed: 0.3,

  media: {
    type: 'gallery',
    images: [
      { src: 'unsteady-solver-1.jpg', alt: '2D unsteady solver 1' },
      { src: 'unsteady-solver-2.jpg', alt: '2D unsteady solver 2' }
    ]
  },

  title: '2D unsteady CFD solver (FVM, C++)',
  meta: ['C++', 'In-house code'],
  role: 'Role: numerical implementation',

  description: `In-house 2D unsteady finite volume solver for incompressible
    Navier–Stokes equations. Staggered grid, pressure–velocity
    coupling, second-order schemes, and time integration tested on
    canonical flows.`,

  tags: ['Code / tools', 'FVM', 'C++'],

  details: `
    <p>
      The solver was built to better understand how discretization
      choices impact stability and accuracy. It includes modular
      components for time integration, linear solvers, and boundary
      conditions.
    </p>
    <p>Implemented features:</p>
    <ul>
      <li>Staggered grid arrangement for pressure–velocity coupling.</li>
      <li>Second-order upwind and central differencing schemes.</li>
      <li>Pressure correction loop for incompressibility.</li>
    </ul>
    <p>
      Validation was carried out on lid-driven cavity and fully
      developed channel flow, comparing velocity profiles and drag
      with literature and analytical solutions.
    </p>
  `,

  footer: {
    label: 'Lid-driven cavity, channel flow',
    links: [
      { text: 'Git repo', href: '#', external: true }
    ]
  }
};
