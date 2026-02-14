// Laval Nozzle Compressible Flow - Inviscid Euler Simulation
const projectLavalNozzle = {
  id: 'laval-nozzle',
  category: 'Internal flows',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [

      { src: 'projects/figs/Laval_Ma.png', alt: 'Mach number contours in Laval nozzle' },
      { src: 'projects/figs/Laval_P.png', alt: 'Pressure contours in Laval nozzle' }, 
      { src: 'projects/figs/Laval_T_P.png', alt: 'Total pressure contours in Laval nozzle' }, 
      { src: 'projects/figs/Laval_Entropy.png', alt: 'Entropy contours in Laval nozzle' }
    ]
  },

  title: 'Laval Nozzle: Inviscid Compressible Flow & Shock Formation',
  meta: ['ANSYS CFX', 'Euler'],
  role: 'Role: analytical calculation, Euler setup & shock analysis',

  description: `2D inviscid Euler simulation of a converging-diverging Laval nozzle.
    Investigation of sonic throat conditions, supersonic expansion, and normal shock
    formation at varying back pressures. Validation against 1D isentropic theory.`,

  tags: ['Compressible', 'Euler', 'Supersonic', 'Normal shock', 'Choking'],

  details: `
    <p><strong>Background:</strong> Laval nozzles accelerate flow to supersonic speeds by exploiting area-Mach relations. Flow reaches M=1 at the throat, then expands to supersonic in the diverging section.</p>

    <p><strong>Setup:</strong></p>
    <ul>
      <li>2D converging-diverging nozzle (axisymmetric, half-domain)</li>
      <li>Geometry: throat height y* = 15 mm, inlet/outlet h = 60 mm, radius r = 400 mm</li>
      <li>Inviscid Euler (μ=0, λ=0), total energy model</li>
      <li>Inlet: p₀ = 1 bar, T₀ = 293 K, γ = 1.4, R = 287 J/(kg·K)</li>
      <li>Back pressures tested: 0.984, 0.884, 0.784, 0.184 bar</li>
    </ul>

    <p><strong>Analytical calculation:</strong></p>
    <ul>
      <li>Critical back pressure for sonic throat with fully subsonic diverging section: p₂ = 0.98511 bar</li>
      <li>Calculated using isentropic area-Mach relation with A/A* = 4.0</li>
      <li>Choked mass flow: ṁ = 0.035417 kg/s (analytical) vs 0.035414 kg/s (CFX)</li>
    </ul>

    <p><strong>Key findings:</strong></p>
    <ul>
      <li>Mass flow remains constant across all back pressures (choking at throat with M=1)</li>
      <li>Lower back pressures create supersonic expansion in diverging section</li>
      <li>At p₂ = 0.184 bar: normal shock forms at outlet (CFX enforces subsonic exit)</li>
      <li>Maximal Mach numbers: 1.08 (p₂=0.984), 1.57 (p₂=0.884), 1.81 (p₂=0.784), 3.44 (p₂=0.184)</li>
      <li>Total pressure losses visible across shock, entropy generation confirmed</li>
    </ul>

    <p><strong>Physical insight:</strong> The nozzle exhibits classic choked flow behavior—once the throat reaches M=1, further reductions in back pressure don't increase mass flow. Instead, the flow adjusts by forming shocks downstream.</p>
  `,

  footer: {
    label: 'Choked flow: ṁ = 0.035414 kg/s, max Ma = 3.44',
    links: []
  }
};
