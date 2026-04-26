// Projects Data - All projects combined
// Each project is defined in its own file for maintainability

const allProjects = [
  projectSismLesModel,
  projectFerrariMacarenaWing,
  projectF1DrsAlpine,
  projectCorneringFs,
  project2dSolver,
  projectParaviewAutomation,
  projectLbmInteractive,
  projectCavityFlow,
  projectSupersonicRamp,
  projectAdjointOptimisation,
  projectLavalNozzle,
  projectSupersonicJet,
  projectRayleighBenard,
  projectRichtmyerMeshkov,
  projectFsFrontWing,
  projectCylinderLes,
  projectIntakeManifold,
  projectCoolingCht
];

// Export for use in renderer
if (typeof window !== 'undefined') {
  window.allProjects = allProjects;
}
