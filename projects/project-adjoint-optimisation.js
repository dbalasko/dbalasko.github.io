// Adjoint Shape Optimisation of Ground Vehicles
const projectAdjointOptimisation = {
  id: 'adjoint-optimisation',
  category: 'External aero',
  parallaxSpeed: 0.25,

  media: {
    type: 'gallery',
    images: [
      { src: 'projects/figs/adjoint_Geometry.gif', alt: 'Geometry optimization evolution' },
      { src: 'projects/figs/adjoint_Wake.gif', alt: 'Wake structure evolution' },
      { src: 'projects/figs/adjoint_ahmed_mesh.gif', alt: 'Ahmed body mesh deformation' },
      { src: 'projects/figs/adjoint_Ahmed_body_Cp.png', alt: 'Ahmed body pressure coefficient distribution' },
      { src: 'projects/figs/adjoint_Ahmed_Cp_3D.png', alt: 'Ahmed body 3D Cp visualization' },
      { src: 'projects/figs/adjoint_controlPoints.png', alt: 'FFD control points visualization' },
      { src: 'projects/figs/adjoint_DrivAer_adjoint_sensitivity.png', alt: 'DrivAer shape sensitivity map' }
    ]
  },

  title: 'Adjoint Shape Optimisation of Ground Vehicles',
  meta: ['OpenFOAM', 'DAFoam'],
  role: 'Role: solver setup, FFD parameterisation & optimisation pipeline',

  description: `Gradient-based aerodynamic shape optimisation of ground vehicles using
    adjoint methods. Two frameworks compared — DAFoam (discrete adjoint) and
    adjointShapeOptimisation (continuous adjoint) — applied to the Ahmed body and
    DrivAer fastback, targeting drag minimisation.`,

  tags: ['Adjoint', 'Spalart-Allmaras', 'FFD morphing', 'Drag optimisation'],

  details: `
    <p><strong>Adjoint methods:</strong> compute sensitivity df/dx at cost independent of design variables.</p>

    <p><strong>Two frameworks compared:</strong></p>
    <ul>
      <li><strong>DAFoam (discrete):</strong> higher accuracy, memory limited (~300k cells)</li>
      <li><strong>adjointShapeOptimisation (continuous):</strong> more stable, scales to 1.5M cells</li>
    </ul>

    <p><strong>Setup:</strong></p>
    <ul>
      <li>Geometries: Ahmed body, DrivAer fastback</li>
      <li>FFD parameterisation with B-spline morphing (8×6×8 control points)</li>
      <li>Spalart-Allmaras + Spalding wall function, y+ ≈ 62</li>
      <li>snappyHexMesh, 2 prism layers</li>
    </ul>

    <p><strong>Results:</strong></p>
    <ul>
      <li>Ahmed body: 1.88% drag reduction (rear ramp optimisation)</li>
      <li>DrivAer (DAFoam): ~11% drag reduction (10 iterations)</li>
      <li>DrivAer (continuous): ~15.3% drag reduction (20 iterations, finer mesh)</li>
    </ul>

    <p><strong>Key findings:</strong></p>
    <ul>
      <li>Continuous adjoint more practical for complex geometries</li>
      <li>Mesh resolution affects the optimum</li>
      <li>Smooth wall functions critical for gradient accuracy</li>
    </ul>
  `,

  footer: {
    label: 'Drag reduction: Ahmed 1.88%, DrivAer up to 15.3%',
    links: [
      { text: 'Report', href: 'projects/Simulation_of_Thermofluids_with_Open_Source_Tools___Final_Project_Report.pdf', external: true },
      { text: 'DrivAer adjoint', href: 'https://github.com/dbalasko/DrivAer_adjoint', external: true },
      { text: 'DrivAer DAFoam', href: 'https://github.com/dbalasko/DrivAer_dafoam', external: true }
    ]
  }
};
