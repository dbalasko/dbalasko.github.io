// Interactive D2Q9 Lattice Boltzmann Solver
const projectLbmInteractive = {
  id: 'lbm-interactive',
  category: 'Code / tools',
  parallaxSpeed: 0.26,

  media: {
    type: 'lbm-canvas',
    canvasId: 'lbm-canvas',
    width: 700,
    height: 350
  },

  title: 'Interactive D2Q9 Lattice Boltzmann Solver',
  meta: ['JavaScript', 'Real-time CFD'],
  role: 'Role: numerical implementation & visualization',

  description: `Browser-based implementation of the D2Q9 Lattice Boltzmann Method
    for incompressible flow simulation. Run live simulations with
    adjustable parameters and multiple geometries—no installation required.`,

  tags: ['LBM', 'Interactive', 'WebGL/Canvas'],

  details: `
    <p>
      This is a fully functional Lattice Boltzmann Method solver running
      entirely in the browser. The D2Q9 lattice scheme solves the
      incompressible Navier–Stokes equations using kinetic theory and
      local collision operators.
    </p>
    <p>Key features:</p>
    <ul>
      <li>D2Q9 lattice with BGK collision operator.</li>
      <li>Bounce-back boundary conditions for solid walls and objects.</li>
      <li>Real-time visualization of velocity, vorticity, or pressure fields.</li>
      <li>Multiple geometries: cylinder, airfoil (NACA 0012), square, flat plate, triangle.</li>
      <li>Interactive parameter control: inlet velocity, kinematic viscosity.</li>
      <li>Pure JavaScript implementation—no external CFD libraries.</li>
    </ul>
    <p>
      The solver updates at interactive frame rates, allowing you to
      explore how flow behaves around different shapes. Watch vortex
      shedding develop behind a cylinder or see boundary layer separation
      on an airfoil—all computed in real time.
    </p>
  `,

  footer: {
    label: 'Live CFD in your browser',
    links: [
      { text: 'Code', href: '#', external: true }
    ]
  },

  // Custom controls HTML for the LBM simulator
  controlsHtml: `
    <button class="lbm-controls-toggle" id="lbm-controls-toggle" aria-label="Toggle controls">
      <span class="lbm-toggle-icon">▼</span>
    </button>
    <div class="lbm-controls" id="lbm-controls">
      <div class="lbm-control-group">
        <label>Geometry:</label>
        <select id="lbm-geometry">
          <option value="circle">Circle</option>
          <option value="airfoil">Airfoil (NACA 0012)</option>
          <option value="square">Square</option>
          <option value="plate">Flat Plate</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <div class="lbm-control-group">
        <label>Velocity: <span id="vel-value">0.15</span></label>
        <input type="range" id="lbm-velocity" min="0.02" max="0.30" step="0.01" value="0.15">
      </div>
      <div class="lbm-control-group">
        <label>Viscosity: <span id="visc-value">0.010</span></label>
        <input type="range" id="lbm-viscosity" min="0.002" max="0.05" step="0.001" value="0.01">
      </div>
      <div class="lbm-control-group">
        <label>Physical velocity: <span id="phys-vel-value">0.0 m/s</span></label>
      </div>
      <div class="lbm-control-group">
        <label>Physical Δt: <span id="phys-dt-value">0.0 s</span></label>
      </div>
      <div class="lbm-control-group">
        <label>Performance: <span id="timesteps-per-sec">0</span> steps/s</label>
      </div>
      <div class="lbm-control-group">
        <label>Physical time: <span id="lbm-physical-time">0.000 s</span></label>
      </div>
      <div class="lbm-control-group">
        <label>Display:</label>
        <select id="lbm-visual">
          <option value="velocity">Velocity magnitude</option>
          <option value="vorticity">Vorticity</option>
          <option value="pressure">Pressure</option>
        </select>
      </div>
      <div class="lbm-control-group">
        <label>
          <input type="checkbox" id="lbm-mesh"> Show Mesh Grid
        </label>
      </div>
      <div class="lbm-control-buttons">
        <button id="lbm-start" class="lbm-btn lbm-btn-start">Start</button>
        <button id="lbm-reset" class="lbm-btn lbm-btn-reset">Reset</button>
      </div>
    </div>
  `
};
