// Projects Data - All projects combined
// Each project is defined in its own file for maintainability

const allProjects = [
  projectFerrariMacarenaWing,
  projectF1DrsAlpine,
  projectFsFrontWing,
  projectCorneringFs,
  projectCylinderLes,
  projectIntakeManifold,
  project2dSolver,
  projectCoolingCht,
  projectParaviewAutomation,
  projectLbmInteractive,
  projectCavityFlow,
  projectSupersonicRamp,
  projectAdjointOptimisation,
  projectLavalNozzle,
  projectSupersonicJet,
  projectRayleighBenard,
  projectRichtmyerMeshkov
];

// Export for use in renderer
if (typeof window !== 'undefined') {
  window.allProjects = allProjects;
}
