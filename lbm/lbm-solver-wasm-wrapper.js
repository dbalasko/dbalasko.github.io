// JavaScript wrapper for the WebAssembly LBM solver
// This provides the same interface as the JavaScript version but uses the C++ WASM backend

class LBMSolverWASM {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.running = false;
    this.visualMode = 'velocity';
    this.showMesh = false;

    // The C++ solver instance will be created when WASM loads
    this.solver = null;
    this.wasmReady = false;

    // Initialize when WASM module is ready
    this.initPromise = this.initWASM();
  }

  async initWASM() {
    // Initialize the WASM module (it's a factory function with MODULARIZE=1)
    if (!window.LBMWASMModule) {
      // Call the Module factory function and wait for it to initialize
      window.LBMWASMModule = await Module({
        locateFile: (path) => {
          // Ensure WASM file is loaded from the lbm/ directory
          if (path.endsWith('.wasm')) {
            return 'lbm/' + path;
          }
          return 'lbm/' + path;
        }
      });
      console.log('WASM Module factory initialized');
    }

    // Create the C++ solver instance
    this.solver = new window.LBMWASMModule.LBMSolver(this.width, this.height);
    this.wasmReady = true;
    console.log('WASM LBM Solver initialized');
  }

  async ensureReady() {
    if (!this.wasmReady) {
      await this.initPromise;
    }
  }

  async setVelocity(velocity) {
    await this.ensureReady();
    this.solver.setVelocity(velocity);
  }

  async setViscosity(viscosity) {
    await this.ensureReady();
    this.solver.setViscosity(viscosity);
  }

  async setGeometry(geometry) {
    await this.ensureReady();
    this.solver.setGeometry(geometry);
  }

  setVisualization(mode) {
    this.visualMode = mode;
  }

  toggleMesh(show) {
    this.showMesh = show;
  }

  async reset() {
    await this.ensureReady();
    this.solver.reset();
  }

  async step() {
    await this.ensureReady();
    this.solver.step();
  }

  async render() {
    await this.ensureReady();

    if (!this.imageData) {
      this.imageData = this.ctx.createImageData(this.width, this.height);
    }
    const data = this.imageData.data;

    // Get data from C++ solver
    let values, maxVal;

    if (this.visualMode === 'velocity') {
      const velocityArray = this.solver.getVelocityMagnitude();
      values = [];
      maxVal = 0.01;

      // Handle different array types (native JS array, typed array, or Emscripten vector)
      const arraySize = velocityArray.size ? velocityArray.size() : velocityArray.length;
      for (let i = 0; i < arraySize; i++) {
        const val = velocityArray.get ? velocityArray.get(i) : velocityArray[i];
        values.push(val);
        if (val > maxVal) maxVal = val;
      }
      if (velocityArray.delete) velocityArray.delete(); // Clean up if it's a C++ vector
    } else if (this.visualMode === 'vorticity') {
      const vorticityArray = this.solver.getVorticity();
      values = [];
      maxVal = 0.01;

      const arraySize = vorticityArray.size ? vorticityArray.size() : vorticityArray.length;
      for (let i = 0; i < arraySize; i++) {
        const val = vorticityArray.get ? vorticityArray.get(i) : vorticityArray[i];
        values.push(val);
        if (val > maxVal) maxVal = val;
      }
      if (vorticityArray.delete) vorticityArray.delete();
    } else if (this.visualMode === 'pressure') {
      const pressureArray = this.solver.getPressure();
      values = [];
      maxVal = 0.01;

      const arraySize = pressureArray.size ? pressureArray.size() : pressureArray.length;
      for (let i = 0; i < arraySize; i++) {
        const val = pressureArray.get ? pressureArray.get(i) : pressureArray[i];
        values.push(val);
        if (val > maxVal) maxVal = val;
      }
      if (pressureArray.delete) pressureArray.delete();
    }

    // Get obstacle mask
    const obstacleArray = this.solver.getObstacle();
    const obstacles = [];
    const obstacleSize = obstacleArray.size ? obstacleArray.size() : obstacleArray.length;
    for (let i = 0; i < obstacleSize; i++) {
      obstacles.push(obstacleArray.get ? obstacleArray.get(i) : obstacleArray[i]);
    }
    if (obstacleArray.delete) obstacleArray.delete(); // Clean up if it's a C++ vector

    const invMaxVal = 1.0 / maxVal;

    // Colorize directly into imageData
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const idx = (j * this.width + i) * 4;
        const dataIdx = j * this.width + i;

        if (obstacles[dataIdx]) {
          // Solid objects in dark gray
          data[idx] = 40;
          data[idx + 1] = 40;
          data[idx + 2] = 40;
          data[idx + 3] = 255;
        } else {
          const normalized = values[dataIdx] * invMaxVal;

          // Classic colormap: blue -> cyan -> green -> yellow -> red
          let r, g, b;
          if (normalized < 0.25) {
            const t = normalized * 4;
            r = 0;
            g = Math.floor(t * 255);
            b = 255;
          } else if (normalized < 0.5) {
            const t = (normalized - 0.25) * 4;
            r = 0;
            g = 255;
            b = Math.floor((1 - t) * 255);
          } else if (normalized < 0.75) {
            const t = (normalized - 0.5) * 4;
            r = Math.floor(t * 255);
            g = 255;
            b = 0;
          } else {
            const t = (normalized - 0.75) * 4;
            r = 255;
            g = Math.floor((1 - t) * 255);
            b = 0;
          }

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
        }
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);

    // Draw streamlines for velocity visualization
    if (this.visualMode === 'velocity') {
      this.drawStreamlines();
    }

    // Draw mesh grid if enabled
    if (this.showMesh) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.lineWidth = 0.5;

      const gridSpacing = 10;

      // Vertical lines
      for (let i = 0; i < this.width; i += gridSpacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.height);
        this.ctx.stroke();
      }

      // Horizontal lines
      for (let j = 0; j < this.height; j += gridSpacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, j);
        this.ctx.lineTo(this.width, j);
        this.ctx.stroke();
      }
    }

    // Draw colorbar
    this.drawColorbar(maxVal);
  }

  drawStreamlines() {
    const spacing = 20;  // Distance between streamline seed points
    const stepSize = 1.5;  // Integration step size
    const maxSteps = 200;  // Maximum steps per streamline

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 1.0;

    // Get velocity and obstacle data from C++ solver
    const uxArray = this.solver.getUx();
    const uyArray = this.solver.getUy();
    const obstacleArray = this.solver.getObstacle();

    // Convert to JavaScript arrays for easier access
    const ux = [];
    const uy = [];
    const obstacle = [];
    const arraySize = uxArray.size ? uxArray.size() : uxArray.length;
    for (let idx = 0; idx < arraySize; idx++) {
      ux.push(uxArray.get ? uxArray.get(idx) : uxArray[idx]);
      uy.push(uyArray.get ? uyArray.get(idx) : uyArray[idx]);
      obstacle.push(obstacleArray.get ? obstacleArray.get(idx) : obstacleArray[idx]);
    }
    if (uxArray.delete) uxArray.delete();
    if (uyArray.delete) uyArray.delete();
    if (obstacleArray.delete) obstacleArray.delete();

    // Create seed points in a regular grid
    for (let x0 = spacing; x0 < this.width; x0 += spacing) {
      for (let y0 = spacing / 2; y0 < this.height; y0 += spacing) {
        const idx0 = Math.floor(y0) * this.width + Math.floor(x0);
        if (obstacle[idx0]) continue;

        this.ctx.beginPath();
        let x = x0;
        let y = y0;

        // Trace streamline forward
        for (let step = 0; step < maxSteps; step++) {
          const i = Math.floor(x);
          const j = Math.floor(y);

          // Check bounds
          if (i < 1 || i >= this.width - 1 || j < 1 || j >= this.height - 1) break;

          const idx = j * this.width + i;
          if (obstacle[idx]) break;

          // Get velocity at current position
          const ux_val = ux[idx];
          const uy_val = uy[idx];
          const speed = Math.sqrt(ux_val * ux_val + uy_val * uy_val);

          if (speed < 0.001) break;  // Stop in stagnant regions

          if (step === 0) {
            this.ctx.moveTo(x, y);
          } else {
            this.ctx.lineTo(x, y);
          }

          // Integrate forward (Euler method)
          x += ux_val * stepSize / speed * 3;
          y += uy_val * stepSize / speed * 3;
        }

        this.ctx.stroke();
      }
    }
  }

  drawColorbar(maxVal) {
    const barWidth = 20;
    const barHeight = 200;
    const barX = this.width - barWidth - 15;
    const barY = 15;

    // Create high-resolution gradient (pixel-by-pixel for crisp rendering)
    for (let i = 0; i < barHeight; i++) {
      const normalized = 1 - (i / barHeight);

      // Use same colormap as main visualization
      let r, g, b;
      if (normalized < 0.25) {
        const t = normalized * 4;
        r = 0;
        g = Math.floor(t * 255);
        b = 255;
      } else if (normalized < 0.5) {
        const t = (normalized - 0.25) * 4;
        r = 0;
        g = 255;
        b = Math.floor((1 - t) * 255);
      } else if (normalized < 0.75) {
        const t = (normalized - 0.5) * 4;
        r = Math.floor(t * 255);
        g = 255;
        b = 0;
      } else {
        const t = (normalized - 0.75) * 4;
        r = 255;
        g = Math.floor((1 - t) * 255);
        b = 0;
      }

      this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      this.ctx.fillRect(barX, barY + i, barWidth, 1);
    }

    // Draw crisp border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(barX - 0.5, barY - 0.5, barWidth + 1, barHeight + 1);

    // Draw labels with clean styling
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.font = '10px -apple-system, monospace';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';

    const labels = [
      { val: maxVal, y: barY + 4 },
      { val: maxVal * 0.75, y: barY + barHeight * 0.25 },
      { val: maxVal * 0.5, y: barY + barHeight * 0.5 },
      { val: maxVal * 0.25, y: barY + barHeight * 0.75 },
      { val: 0, y: barY + barHeight - 4 }
    ];

    // Add text background for better readability
    labels.forEach(label => {
      const text = label.val < 0.01 ? label.val.toExponential(1) : label.val.toFixed(3);
      const textWidth = this.ctx.measureText(text).width;

      // Semi-transparent background
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(barX - textWidth - 8, label.y - 7, textWidth + 4, 14);

      // White text
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.fillText(text, barX - 6, label.y);
    });

    // Draw title
    this.ctx.save();
    this.ctx.translate(barX + barWidth + 15, barY + barHeight / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '11px -apple-system, sans-serif';

    let title = '';
    if (this.visualMode === 'velocity') {
      title = 'Velocity (m/s)';
    } else if (this.visualMode === 'vorticity') {
      title = 'Vorticity (1/s)';
    } else if (this.visualMode === 'pressure') {
      title = 'Density';
    }

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillText(title, 0, 0);

    this.ctx.restore();
  }
}
