// Projects Data - All projects combined
// Each project is defined in its own file for maintainability

const allProjects = [
  projectFerrariMacarenaWing,
  projectF1DrsAlpine,
  projectSismLesModel,
  projectReichardtWallFunction,
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
  //projectFsFrontWing,
  projectCylinderLes,
  //projectIntakeManifold,
  //projectCoolingCht
];

// Export for use in renderer
if (typeof window !== 'undefined') {
  window.allProjects = allProjects;
}
