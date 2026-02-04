// Projects Data - All projects combined
// Each project is defined in its own file for maintainability

const allProjects = [
  projectFsFrontWing,
  projectCorneringFs,
  projectCylinderLes,
  projectIntakeManifold,
  project2dSolver,
  projectCoolingCht,
  projectParaviewAutomation,
  projectLbmInteractive,
  projectCavityFlow,
  projectSupersonicRamp
];

// Export for use in renderer
if (typeof window !== 'undefined') {
  window.allProjects = allProjects;
}
