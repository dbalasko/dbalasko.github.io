// Lid-Driven Cavity Flow Simulator
const projectCavityFlow = {
  id: 'cavity-flow',
  category: 'Code / tools',
  parallaxSpeed: 0.24,

  media: {
    type: 'cavity-canvas',
    canvasId: 'cavity-canvas',
    width: 400,
    height: 400
  },

  title: 'Lid-Driven Cavity Flow Simulator',
  meta: ['CFD Benchmark', 'LBM / D2Q9'],
  role: 'Role: Development & implementation',

  description: `Classic CFD benchmark problem: a square cavity with a moving top wall
    that drives recirculation inside. Observe the formation of primary and
    secondary vortices at different Reynolds numbers.`,

  tags: ['LBM', 'Benchmark case', 'Interactive'],

  details: `
    <p>
      The lid-driven cavity is one of the most widely used benchmark cases
      for testing CFD solvers. The problem is simple to define but exhibits
      rich flow physics: a square cavity filled with fluid, where the top
      wall moves at constant velocity while all other walls remain stationary.
    </p>
    <p>Key features:</p>
    <ul>
      <li>D2Q9 Lattice Boltzmann Method with BGK collision operator.</li>
      <li>Push streaming scheme for efficient computation.</li>
      <li>Moving lid boundary condition at the top wall with velocity correction.</li>
      <li>Bounce-back boundary conditions on stationary walls.</li>
      <li>Adjustable lid velocity and viscosity to control Reynolds number.</li>
      <li>Real-time visualization of velocity, vorticity, and pressure fields.</li>
      <li>Formation of counter-rotating corner vortices at higher Re.</li>
    </ul>
    <p>
      At low Reynolds numbers (Re ≈ 100), you'll see a single primary vortex
      filling most of the cavity. As Re increases (Re ≈ 400-1000), secondary
      vortices appear in the bottom corners. This benchmark has been extensively
      studied and validated against high-resolution reference data.
    </p>
  `,

  footer: {
    label: 'Classic CFD validation case',
    links: [
      { text: 'Code', href: '#', external: true }
    ]
  },

  // Custom controls HTML for the Cavity simulator
  controlsHtml: `
    <button class="lbm-controls-toggle" id="cavity-controls-toggle" aria-label="Toggle controls">
      <span class="lbm-toggle-icon">▼</span>
    </button>
    <div class="lbm-controls collapsed" id="cavity-controls">
      <div class="lbm-control-group">
        <label>Lid velocity: <span id="cavity-vel-value">0.10</span></label>
        <input type="range" id="cavity-velocity" min="0.02" max="0.20" step="0.01" value="0.10">
      </div>
      <div class="lbm-control-group">
        <label>Viscosity: <span id="cavity-visc-value">0.020</span></label>
        <input type="range" id="cavity-viscosity" min="0.005" max="0.05" step="0.001" value="0.02">
      </div>
      <div class="lbm-control-group">
        <label>Reynolds number: <span id="cavity-reynolds">200</span></label>
      </div>
      <div class="lbm-control-group">
        <label>Performance: <span id="cavity-timesteps-per-sec">0</span> steps/s</label>
      </div>
      <div class="lbm-control-group">
        <label>Physical time: <span id="cavity-physical-time">0.000 s</span></label>
      </div>
      <div class="lbm-control-group">
        <label>Display:</label>
        <select id="cavity-visual">
          <option value="velocity">Velocity magnitude</option>
          <option value="vorticity">Vorticity</option>
          <option value="pressure">Pressure</option>
        </select>
      </div>
      <div class="lbm-control-group">
        <label>
          <input type="checkbox" id="cavity-streamlines">
          Show streamlines
        </label>
      </div>
      <div class="lbm-control-group">
        <label>
          <input type="checkbox" id="cavity-mesh">
          Show mesh
        </label>
      </div>
      <div class="lbm-control-group">
        <button id="cavity-start" class="lbm-btn">Start</button>
        <button id="cavity-reset" class="lbm-btn">Reset</button>
      </div>
    </div>
  `
};
