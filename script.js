// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// -------- Apple-style scroll animations --------
function initScrollAnimations() {
  const projectCards = document.querySelectorAll(".project-card");
  const heroVisual = document.querySelector(".hero-visual");
  const aboutCard = document.querySelector(".about-card");
  const contactCard = document.querySelector(".contact-card");
  const sectionHeaders = document.querySelectorAll(".section-header");

  let scrollTicking = false;

  function updateScrollAnimations() {
    const windowHeight = window.innerHeight;

    // Rotate and scale hero visual on scroll
    if (heroVisual) {
      const heroRect = heroVisual.getBoundingClientRect();
      const heroCenter = heroRect.top + heroRect.height / 2;
      const distanceFromCenter = (windowHeight / 2 - heroCenter) / windowHeight;

      const rotation = distanceFromCenter * 5; // Max 5 degrees
      const scale = 1 - Math.abs(distanceFromCenter) * 0.05;

      heroVisual.style.transform = `perspective(1000px) rotateY(${rotation}deg) scale(${Math.max(scale, 0.95)})`;
    }

    // Animate project cards on scroll
    projectCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distanceFromViewport = cardCenter - windowHeight / 2;
      const normalizedDistance = distanceFromViewport / windowHeight;

      // Subtle 3D rotation based on scroll position
      const rotateX = normalizedDistance * -3;
      const rotateY = normalizedDistance * 2;
      const translateZ = Math.max(-50, -Math.abs(normalizedDistance) * 50);

      // Only apply transform when card is near viewport
      if (Math.abs(normalizedDistance) < 1) {
        card.style.transform = `
          perspective(1200px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(${translateZ}px)
        `;
        card.style.opacity = Math.max(0.3, 1 - Math.abs(normalizedDistance) * 0.7);
      }
    });

    // Subtle lift effect for about card
    if (aboutCard) {
      const rect = aboutCard.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const lift = Math.max(0, (0.5 - Math.abs(progress - 0.5)) * 20);
        aboutCard.style.transform = `translateY(${-lift}px)`;
      }
    }

    // Subtle lift effect for contact card
    if (contactCard) {
      const rect = contactCard.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const lift = Math.max(0, (0.5 - Math.abs(progress - 0.5)) * 20);
        contactCard.style.transform = `translateY(${-lift}px)`;
      }
    }

    // Subtle fade-in and slide for section headers
    sectionHeaders.forEach((header) => {
      const rect = header.getBoundingClientRect();
      if (rect.top < windowHeight - 50) {
        const opacity = Math.min(1, (windowHeight - rect.top) / 200);
        const translateY = Math.max(0, 30 - (windowHeight - rect.top) / 5);
        header.style.opacity = opacity;
        header.style.transform = `translateY(${translateY}px)`;
      }
    });

    scrollTicking = false;
  }

  function requestScrollUpdate() {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollAnimations);
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  updateScrollAnimations(); // Initial call
}

// Initialize scroll animations after DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// -------- Scroll reveal --------
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);
revealEls.forEach((el) => revealObserver.observe(el));

// -------- Parallax on scroll (layers + hero image + project media) --------
let latestScrollY = window.scrollY;
let ticking = false;

const parallaxLayers = document.querySelectorAll("[data-parallax-layer]");
const parallaxImg = document.querySelector("[data-parallax-img]");
const parallaxMediaEls = document.querySelectorAll("[data-parallax-media]");

function onScroll() {
  latestScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

function updateParallax() {
  const scrollY = latestScrollY;

  parallaxLayers.forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-speed")) || 0;
    el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
  });

  if (parallaxImg) {
    const rect = parallaxImg.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const offset = (rect.top + rect.height / 2 - center) / center;
    parallaxImg.style.transform = `translate3d(0, ${offset * -18}px, 0) scale(1.02)`;
  }

  parallaxMediaEls.forEach((wrapper) => {
    const speed = parseFloat(wrapper.getAttribute("data-speed")) || 0.2;
    const rect = wrapper.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const offset = (rect.top + rect.height / 2 - center) / center;
    wrapper.style.transform = `translate3d(0, ${offset * -20 * speed}px, 0)`;
  });

  ticking = false;
}

window.addEventListener("scroll", onScroll, { passive: true });
updateParallax(); // initial

// -------- Filter chip UI (basic) --------
const chips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const category = chip.textContent.trim();
    projectCards.forEach((card) => {
      const cardCat = card.getAttribute("data-category");
      if (category === "All" || cardCat === category) {
        card.style.display = "";
      } else {
        card.classList.remove("expanded");
        card.style.display = "none";
      }
    });
  });
});

// -------- Expandable project "More details" --------
let expandedCard = null;

function expandCard(card) {
  if (!card) return;
  card.classList.add("expanded");
  const toggle = card.querySelector("[data-project-toggle]");
  if (toggle) {
    toggle.firstChild.textContent = "Less details";
  }
  expandedCard = card;
  const rect = card.getBoundingClientRect();
  const offset = rect.top + window.scrollY - 90; // account for navbar
  window.scrollTo({ top: offset, behavior: "smooth" });
}

function collapseCard(card) {
  if (!card) return;
  card.classList.remove("expanded");
  const toggle = card.querySelector("[data-project-toggle]");
  if (toggle) {
    toggle.firstChild.textContent = "More details";
  }
  if (expandedCard === card) {
    expandedCard = null;
  }
}

projectCards.forEach((card) => {
  const toggleBtn = card.querySelector("[data-project-toggle]");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = card.classList.contains("expanded");

    if (expandedCard && expandedCard !== card) {
      collapseCard(expandedCard);
    }

    if (isExpanded) {
      collapseCard(card);
    } else {
      expandCard(card);
    }
  });
});

// -------- LBM Simulator --------
let lbmSolver = null;
let lbmAnimationId = null;

async function initLBM() {
  const canvas = document.getElementById('lbm-canvas');
  if (!canvas) return;

  const width = 750;  // LBM lattice resolution (balanced Re & performance)
  const height = 375;

  // Try to use WASM version if available, otherwise fall back to JavaScript
  const useWASM = typeof LBMSolverWASM !== 'undefined';

  if (useWASM) {
    console.log('Using WebAssembly LBM solver');
    lbmSolver = new LBMSolverWASM(canvas, width, height);
    // Wait for WASM to initialize
    await lbmSolver.initPromise;
  } else {
    console.log('Using JavaScript LBM solver');
    lbmSolver = new LBMSolver(canvas, width, height);
  }

  // Control elements
  const startBtn = document.getElementById('lbm-start');
  const resetBtn = document.getElementById('lbm-reset');
  const geometrySelect = document.getElementById('lbm-geometry');
  const velocitySlider = document.getElementById('lbm-velocity');
  const viscositySlider = document.getElementById('lbm-viscosity');
  const visualSelect = document.getElementById('lbm-visual');
  const velValue = document.getElementById('vel-value');
  const viscValue = document.getElementById('visc-value');
  const physVelValue = document.getElementById('phys-vel-value');
  const physDtValue = document.getElementById('phys-dt-value');
  const timestepsPerSecDisplay = document.getElementById('timesteps-per-sec');

  // Performance tracking
  let timestepCount = 0;
  let lastPerfUpdate = performance.now();

  // Physical scaling parameters (cylinder diameter in lattice units = 2 * radius)
  const D_lattice = 120;          // cylinder diameter in lattice units (height*0.16*2 = 375*0.16*2)
  const D_physical = 0.1;         // cylinder diameter in meters
  const dx = D_physical / D_lattice;  // lattice spacing in meters

  // Function to update physical values display
  function updatePhysicalValues() {
    const u_lattice = parseFloat(velocitySlider.value);
    const nu_lattice = parseFloat(viscositySlider.value);

    // Physical velocity: u_physical = u_lattice * dx / dt
    // From Re matching: Re = U*D/nu (both lattice and physical)
    // So: u_physical/dx = u_lattice and nu_physical/dx^2 = nu_lattice
    const nu_physical = nu_lattice * dx * dx;  // physical kinematic viscosity (m^2/s)
    const dt = dx * dx / nu_lattice;           // physical timestep (s)
    const u_physical = u_lattice * dx / dt;     // physical velocity (m/s)

    physVelValue.textContent = u_physical.toFixed(3) + ' m/s';
    physDtValue.textContent = dt.toExponential(2) + ' s';
  }

  // Animation loop
  function animate() {
    if (lbmSolver && lbmSolver.running) {
      const now = performance.now();

      // Balance between physics speed and visual smoothness
      // Target 20-30 fps rendering
      const stepsPerFrame = 5;

      for (let i = 0; i < stepsPerFrame; i++) {
        lbmSolver.step();
        timestepCount++;
      }

      // Render every frame for smooth visuals
      lbmSolver.render();

      // Update performance display every 0.5 seconds
      if (now - lastPerfUpdate > 500) {
        const timestepsPerSec = (timestepCount / (now - lastPerfUpdate)) * 1000;
        timestepsPerSecDisplay.textContent = Math.round(timestepsPerSec);
        timestepCount = 0;
        lastPerfUpdate = now;
      }

      lbmAnimationId = requestAnimationFrame(animate);
    }
  }

  // Start/Stop button
  startBtn.addEventListener('click', () => {
    if (!lbmSolver.running) {
      lbmSolver.running = true;
      startBtn.textContent = 'Stop';
      startBtn.classList.add('running');
      animate();
    } else {
      lbmSolver.running = false;
      startBtn.textContent = 'Start';
      startBtn.classList.remove('running');
      if (lbmAnimationId) {
        cancelAnimationFrame(lbmAnimationId);
      }
    }
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    const wasRunning = lbmSolver.running;
    lbmSolver.running = false;
    if (lbmAnimationId) {
      cancelAnimationFrame(lbmAnimationId);
    }
    lbmSolver.reset();
    lbmSolver.render();

    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');

    if (wasRunning) {
      // Auto-restart if it was running
      setTimeout(() => {
        lbmSolver.running = true;
        startBtn.textContent = 'Stop';
        startBtn.classList.add('running');
        animate();
      }, 100);
    }
  });

  // Geometry selection
  geometrySelect.addEventListener('change', (e) => {
    const wasRunning = lbmSolver.running;
    lbmSolver.running = false;
    if (lbmAnimationId) {
      cancelAnimationFrame(lbmAnimationId);
    }

    lbmSolver.setGeometry(e.target.value);
    lbmSolver.render();

    if (wasRunning) {
      setTimeout(() => {
        lbmSolver.running = true;
        animate();
      }, 100);
    }
  });

  // Velocity slider
  velocitySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    lbmSolver.setVelocity(value);
    velValue.textContent = value.toFixed(2);
    updatePhysicalValues();
  });

  // Viscosity slider
  viscositySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    lbmSolver.setViscosity(value);
    viscValue.textContent = value.toFixed(3);
    updatePhysicalValues();
  });

  // Visualization mode
  visualSelect.addEventListener('change', (e) => {
    lbmSolver.setVisualization(e.target.value);
    if (!lbmSolver.running) {
      lbmSolver.render();
    }
  });

  // Mesh toggle
  const meshCheckbox = document.getElementById('lbm-mesh');
  meshCheckbox.addEventListener('change', (e) => {
    lbmSolver.toggleMesh(e.target.checked);
    if (!lbmSolver.running) {
      lbmSolver.render();
    }
  });

  // Controls toggle
  const controlsToggle = document.getElementById('lbm-controls-toggle');
  const controlsPanel = document.getElementById('lbm-controls');
  const toggleIcon = controlsToggle.querySelector('.lbm-toggle-icon');

  controlsToggle.addEventListener('click', () => {
    const isCollapsed = controlsPanel.classList.toggle('collapsed');
    toggleIcon.textContent = isCollapsed ? '›' : '‹';
  });

  // Initial render
  lbmSolver.render();

  // Initial physical values display
  updatePhysicalValues();
}

// Initialize LBM when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLBM);
} else {
  initLBM();
}

// -------- Gallery per project --------
const galleries = document.querySelectorAll("[data-gallery]");

galleries.forEach((gallery) => {
  const imgs = gallery.querySelectorAll("[data-gallery-img]");
  if (!imgs.length) return;

  let currentIndex = 0;
  imgs.forEach((img, idx) => {
    if (idx === 0) {
      img.classList.add("active");
    } else {
      img.classList.remove("active");
    }
  });

  const mediaInner = gallery.closest(".project-media-inner");
  const prevBtn = mediaInner.querySelector("[data-gallery-prev]");
  const nextBtn = mediaInner.querySelector("[data-gallery-next]");
  const dotsContainer = mediaInner.querySelector("[data-gallery-dots]");

  const dots = [];

  if (dotsContainer) {
    imgs.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot" + (idx === 0 ? " active" : "");
      dot.dataset.index = idx.toString();
      dotsContainer.appendChild(dot);
      dots.push(dot);

      dot.addEventListener("click", () => {
        showSlide(idx);
      });
    });
  }

  function showSlide(index) {
    const maxIndex = imgs.length - 1;
    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;
    currentIndex = index;

    imgs.forEach((img, idx) => {
      img.classList.toggle("active", idx === currentIndex);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentIndex + 1);
    });
  }
});
