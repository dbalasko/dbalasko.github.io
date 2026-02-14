// Projects Renderer - Generates HTML from project data

const ProjectsRenderer = {
  /**
   * Renders a single project card
   * @param {Object} project - Project data object
   * @returns {string} HTML string for the project card
   */
  renderProjectCard(project) {
    const mediaHtml = this.renderMedia(project);
    const tagsHtml = project.tags.map(tag =>
      `<span class="project-tag">${tag}</span>`
    ).join('\n                  ');

    const linksHtml = project.footer.links.map(link =>
      `<a class="project-link" href="${link.href}"${link.external ? ' target="_blank"' : ''}>${link.text}</a>`
    ).join('\n                  ');

    return `
          <!-- Project: ${project.title} -->
          <article class="project-card reveal" data-category="${project.category}">
            <div class="project-media" data-parallax-media data-speed="${project.parallaxSpeed}">
              <div class="project-media-inner">
                ${mediaHtml}
              </div>
            </div>

            <div class="project-content">
              <div class="project-body">
                <div class="project-title-row">
                  <h3 class="project-title">
                    ${project.title}
                  </h3>
                  <div class="project-meta">
                    <div>${project.meta[0]}</div>
                    <div>${project.meta[1]}</div>
                  </div>
                </div>
                <p class="project-role">
                  ${project.role}
                </p>
                <p class="project-desc">
                  ${project.description}
                </p>
                <div class="project-tags">
                  ${tagsHtml}
                </div>
              </div>

              <div class="project-details">
                ${project.details}
              </div>

              <div class="project-footer">
                <div>${project.footer.label}</div>
                <div class="project-links">
                  <button class="project-link project-toggle" type="button" data-project-toggle>
                    More details
                    <span class="project-toggle-icon">›</span>
                  </button>
                  ${linksHtml}
                </div>
              </div>
            </div>
          </article>`;
  },

  /**
   * Renders the media section based on media type
   * @param {Object} project - Project data object
   * @returns {string} HTML string for the media section
   */
  renderMedia(project) {
    const media = project.media;

    switch (media.type) {
      case 'gallery':
        return this.renderGallery(media.images);
      case 'lbm-canvas':
        return this.renderLbmCanvas(project);
      case 'cavity-canvas':
        return this.renderCavityCanvas(project);
      default:
        return this.renderGallery(media.images);
    }
  },

  /**
   * Renders a gallery with navigation
   * @param {Array} images - Array of image/video objects with src and alt
   * @returns {string} HTML string for the gallery
   */
  renderGallery(images) {
    const imagesHtml = images.map(img => {
      const isVideo = /\.(mp4|webm|mov)$/i.test(img.src);

      if (isVideo) {
        return `<video
                    src="${img.src}"
                    data-gallery-img
                    autoplay
                    loop
                    muted
                    playsinline
                  ></video>`;
      } else {
        return `<img
                    src="${img.src}"
                    alt="${img.alt}"
                    data-gallery-img
                  />`;
      }
    }).join('\n                  ');

    return `
                <div class="project-gallery" data-gallery>
                  ${imagesHtml}
                </div>
                <button
                  class="gallery-nav gallery-nav-prev"
                  type="button"
                  data-gallery-prev
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  class="gallery-nav gallery-nav-next"
                  type="button"
                  data-gallery-next
                  aria-label="Next image"
                >
                  ›
                </button>
                <div class="gallery-dots" data-gallery-dots></div>
                <div class="project-media-gradient"></div>`;
  },

  /**
   * Renders the LBM interactive canvas
   * @param {Object} project - Project data object
   * @returns {string} HTML string for the LBM canvas
   */
  renderLbmCanvas(project) {
    return `
                <canvas id="${project.media.canvasId}" width="${project.media.width}" height="${project.media.height}"></canvas>
                ${project.controlsHtml || ''}`;
  },

  /**
   * Renders the Cavity flow canvas
   * @param {Object} project - Project data object
   * @returns {string} HTML string for the cavity canvas
   */
  renderCavityCanvas(project) {
    return `
                <canvas id="${project.media.canvasId}" width="${project.media.width}" height="${project.media.height}"></canvas>
                ${project.controlsHtml || ''}`;
  },

  /**
   * Renders all projects into the container
   * @param {string} containerId - ID of the container element
   * @param {Array} projects - Array of project data objects
   */
  renderAllProjects(containerId, projects) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    const projectsHtml = projects.map(project =>
      this.renderProjectCard(project)
    ).join('\n');

    container.innerHTML = projectsHtml;

    // Dispatch event to signal projects are loaded
    window.dispatchEvent(new CustomEvent('projectsLoaded'));
  },

  /**
   * Gets unique categories from projects
   * @param {Array} projects - Array of project data objects
   * @returns {Array} Array of unique category strings
   */
  getCategories(projects) {
    const categories = new Set(projects.map(p => p.category));
    return ['All', ...categories];
  },

  /**
   * Renders filter chips
   * @param {string} containerId - ID of the filters container
   * @param {Array} projects - Array of project data objects
   */
  renderFilters(containerId, projects) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const categories = this.getCategories(projects);
    const filtersHtml = categories.map((cat, idx) =>
      `<button class="filter-chip${idx === 0 ? ' active' : ''}" type="button">${cat}</button>`
    ).join('\n          ');

    container.innerHTML = filtersHtml;
  }
};

// Initialize when DOM is ready
function initProjects() {
  if (typeof allProjects !== 'undefined') {
    ProjectsRenderer.renderAllProjects('projects-grid', allProjects);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjects);
} else {
  initProjects();
}

// Export for use elsewhere
if (typeof window !== 'undefined') {
  window.ProjectsRenderer = ProjectsRenderer;
}
