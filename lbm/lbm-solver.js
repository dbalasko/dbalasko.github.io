// D2Q9 Lattice Boltzmann Method Solver
class LBMSolver {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = width;
    this.height = height;

    // D2Q9 lattice velocities
    this.ex = [0, 1, 0, -1, 0, 1, -1, -1, 1];
    this.ey = [0, 0, 1, 0, -1, 1, 1, -1, -1];

    // D2Q9 weights
    this.w = [4/9, 1/9, 1/9, 1/9, 1/9, 1/36, 1/36, 1/36, 1/36];

    // Opposite directions for bounce-back
    this.opp = [0, 3, 4, 1, 2, 7, 8, 5, 6];

    // Flow parameters
    this.u0 = 0.1;  // inlet velocity (target)
    this.nu = 0.02; // kinematic viscosity
    this.tau = 3 * this.nu + 0.5; // relaxation time
    this.omega = 1 / this.tau;

    // Ramp-up parameters
    this.currentVelocity = 0.0;  // start from zero
    this.rampUpSteps = 500;       // ramp up over 500 steps
    this.stepCount = 0;

    // Initialize arrays
    this.f = [];      // distribution functions
    this.feq = [];    // equilibrium distribution
    this.rho = [];    // density
    this.ux = [];     // x-velocity
    this.uy = [];     // y-velocity
    this.solid = [];  // solid flags

    this.running = false;
    this.geometry = 'circle';
    this.visualMode = 'velocity';
    this.showMesh = false;

    this.init();
  }

  init() {
    // Reset ramp-up
    this.currentVelocity = 0.0;
    this.stepCount = 0;

    // Initialize arrays
    for (let i = 0; i < this.width; i++) {
      this.f[i] = [];
      this.feq[i] = [];
      this.rho[i] = [];
      this.ux[i] = [];
      this.uy[i] = [];
      this.solid[i] = [];

      for (let j = 0; j < this.height; j++) {
        this.f[i][j] = new Array(9);
        this.feq[i][j] = new Array(9);
        this.rho[i][j] = 1.0;
        this.ux[i][j] = 0.0;  // Start from zero
        this.uy[i][j] = 0.0;
        this.solid[i][j] = false;

        // Initialize distribution functions with equilibrium
        for (let k = 0; k < 9; k++) {
          this.f[i][j][k] = this.w[k];
          this.feq[i][j][k] = this.w[k];
        }
      }
    }

    this.setGeometry(this.geometry);
  }

  setGeometry(type) {
    this.geometry = type;
    const cx = Math.floor(this.width / 4);
    const cy = Math.floor(this.height / 2);

    // Clear solid flags
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.solid[i][j] = false;
      }
    }

    switch(type) {
      case 'circle':
        const radius = Math.min(this.width, this.height) / 7;  // Larger for vortex shedding
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.height; j++) {
            const dx = i - cx;
            const dy = j - cy;
            if (dx * dx + dy * dy < radius * radius) {
              this.solid[i][j] = true;
            }
          }
        }
        break;

      case 'square':
        const size = Math.min(this.width, this.height) / 8;
        for (let i = cx - size; i < cx + size; i++) {
          for (let j = cy - size; j < cy + size; j++) {
            if (i >= 0 && i < this.width && j >= 0 && j < this.height) {
              this.solid[i][j] = true;
            }
          }
        }
        break;

      case 'airfoil':
        // NACA 0012 - higher resolution
        const chord = Math.min(this.width, this.height) / 3.5;
        const thickness = 0.12;
        const angleOfAttack = 5 * Math.PI / 180; // 5 degrees AoA

        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.height; j++) {
            // Rotate coordinates for angle of attack
            const dx = i - cx;
            const dy = j - cy;
            const x_rot = (dx * Math.cos(angleOfAttack) + dy * Math.sin(angleOfAttack)) / chord;
            const y_rot = (-dx * Math.sin(angleOfAttack) + dy * Math.cos(angleOfAttack)) / chord;

            if (x_rot >= 0 && x_rot <= 1) {
              // NACA 0012 thickness distribution
              const yt = 5 * thickness * (
                0.2969 * Math.sqrt(Math.max(0, x_rot)) -
                0.1260 * x_rot -
                0.3516 * x_rot * x_rot +
                0.2843 * x_rot * x_rot * x_rot -
                0.1015 * x_rot * x_rot * x_rot * x_rot
              );

              if (Math.abs(y_rot) <= yt) {
                this.solid[i][j] = true;
              }
            }
          }
        }
        break;

      case 'plate':
        const plateLength = Math.min(this.width, this.height) / 4;
        for (let i = cx; i < cx + plateLength; i++) {
          if (i >= 0 && i < this.width) {
            this.solid[i][cy] = true;
          }
        }
        break;

      case 'triangle':
        const triSize = Math.min(this.width, this.height) / 8;
        for (let i = 0; i < this.width; i++) {
          for (let j = 0; j < this.height; j++) {
            const dx = i - cx;
            const dy = j - cy;
            // Streamlined triangle (pointing right) with rounded edges
            if (dx > -triSize/2 && dx < triSize) {
              const width_at_x = dx < 0 ?
                (triSize/2 + dx) * 0.8 :
                (triSize - dx) * 0.8;
              if (Math.abs(dy) < width_at_x) {
                this.solid[i][j] = true;
              }
            }
          }
        }
        break;
    }
  }

  computeEquilibrium(rho, ux, uy, feq) {
    const ux2 = ux * ux;
    const uy2 = uy * uy;
    const u2 = ux2 + uy2;

    for (let k = 0; k < 9; k++) {
      const eu = this.ex[k] * ux + this.ey[k] * uy;
      feq[k] = this.w[k] * rho * (1 + 3 * eu + 4.5 * eu * eu - 1.5 * u2);
    }
  }

  step() {
    const omega = this.omega;
    const width = this.width;
    const height = this.height;

    // Velocity ramp-up to prevent divergence
    if (this.stepCount < this.rampUpSteps) {
      this.currentVelocity = this.u0 * (this.stepCount / this.rampUpSteps);
      this.stepCount++;
    } else {
      this.currentVelocity = this.u0;
    }

    // Collision step - optimized
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (this.solid[i][j]) continue;

        const fij = this.f[i][j];

        // Compute macroscopic quantities - unrolled
        const rho = fij[0] + fij[1] + fij[2] + fij[3] + fij[4] +
                    fij[5] + fij[6] + fij[7] + fij[8];
        const ux = (fij[1] - fij[3] + fij[5] - fij[7] - fij[6] + fij[8]) / rho;
        const uy = (fij[2] - fij[4] + fij[5] + fij[6] - fij[7] - fij[8]) / rho;

        this.rho[i][j] = rho;
        this.ux[i][j] = ux;
        this.uy[i][j] = uy;

        // Compute equilibrium inline
        const ux2 = ux * ux;
        const uy2 = uy * uy;
        const u2 = ux2 + uy2;
        const u215 = 1.5 * u2;

        // Equilibrium with collision in one step - unrolled for speed
        fij[0] += omega * (this.w[0] * rho * (1 - u215) - fij[0]);

        let eu = ux;
        fij[1] += omega * (this.w[1] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[1]);

        eu = uy;
        fij[2] += omega * (this.w[2] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[2]);

        eu = -ux;
        fij[3] += omega * (this.w[3] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[3]);

        eu = -uy;
        fij[4] += omega * (this.w[4] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[4]);

        eu = ux + uy;
        fij[5] += omega * (this.w[5] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[5]);

        eu = -ux + uy;
        fij[6] += omega * (this.w[6] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[6]);

        eu = -ux - uy;
        fij[7] += omega * (this.w[7] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[7]);

        eu = ux - uy;
        fij[8] += omega * (this.w[8] * rho * (1 + 3*eu + 4.5*eu*eu - u215) - fij[8]);
      }
    }

    // Streaming step - in-place with temporary storage optimization
    if (!this.fTemp) {
      this.fTemp = new Array(width);
      for (let i = 0; i < width; i++) {
        this.fTemp[i] = new Array(height);
        for (let j = 0; j < height; j++) {
          this.fTemp[i][j] = new Float64Array(9);
        }
      }
    }

    // Copy current state
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const src = this.f[i][j];
        const dst = this.fTemp[i][j];
        for (let k = 0; k < 9; k++) {
          dst[k] = src[k];
        }
      }
    }

    // Stream
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (this.solid[i][j]) {
          // Bounce-back
          const fij = this.f[i][j];
          const temp = this.fTemp[i][j];
          fij[0] = temp[0];
          fij[1] = temp[3];
          fij[2] = temp[4];
          fij[3] = temp[1];
          fij[4] = temp[2];
          fij[5] = temp[7];
          fij[6] = temp[8];
          fij[7] = temp[5];
          fij[8] = temp[6];
        } else {
          // Stream from neighbors
          const fij = this.f[i][j];

          fij[0] = this.fTemp[i][j][0];

          const i1 = i - 1;
          if (i1 >= 0) fij[1] = this.fTemp[i1][j][1];

          const j2 = j - 1;
          if (j2 >= 0) fij[2] = this.fTemp[i][j2][2];

          const i3 = i + 1;
          if (i3 < width) fij[3] = this.fTemp[i3][j][3];

          const j4 = j + 1;
          if (j4 < height) fij[4] = this.fTemp[i][j4][4];

          if (i1 >= 0 && j2 >= 0) fij[5] = this.fTemp[i1][j2][5];
          if (i3 < width && j2 >= 0) fij[6] = this.fTemp[i3][j2][6];
          if (i3 < width && j4 < height) fij[7] = this.fTemp[i3][j4][7];
          if (i1 >= 0 && j4 < height) fij[8] = this.fTemp[i1][j4][8];
        }
      }
    }

    // Boundary conditions
    this.applyBoundaryConditions();
  }

  applyBoundaryConditions() {
    // Left boundary: inlet with ramped velocity
    for (let j = 0; j < this.height; j++) {
      const rho = 1.0;
      const ux = this.currentVelocity;  // Use ramped velocity
      const uy = 0.0;

      this.rho[0][j] = rho;
      this.ux[0][j] = ux;
      this.uy[0][j] = uy;

      this.computeEquilibrium(rho, ux, uy, this.f[0][j]);
    }

    // Right boundary: outlet (zero gradient)
    for (let j = 0; j < this.height; j++) {
      for (let k = 0; k < 9; k++) {
        this.f[this.width - 1][j][k] = this.f[this.width - 2][j][k];
      }
    }

    // Top and bottom: free-slip walls (specular reflection - only vertical component reflected)
    for (let i = 0; i < this.width; i++) {
      // Top wall - free-slip (bounce back only vertical components)
      const temp2_t = this.f[i][0][2];
      const temp5_t = this.f[i][0][5];
      const temp6_t = this.f[i][0][6];

      this.f[i][0][2] = this.f[i][0][4];  // swap 2 <-> 4 (vertical)
      this.f[i][0][5] = this.f[i][0][8];  // swap 5 <-> 8 (northeast <-> southeast)
      this.f[i][0][6] = this.f[i][0][7];  // swap 6 <-> 7 (northwest <-> southwest)
      this.f[i][0][4] = temp2_t;
      this.f[i][0][8] = temp5_t;
      this.f[i][0][7] = temp6_t;

      // Bottom wall - free-slip (bounce back only vertical components)
      const temp2_b = this.f[i][this.height - 1][2];
      const temp5_b = this.f[i][this.height - 1][5];
      const temp6_b = this.f[i][this.height - 1][6];

      this.f[i][this.height - 1][2] = this.f[i][this.height - 1][4];
      this.f[i][this.height - 1][5] = this.f[i][this.height - 1][8];
      this.f[i][this.height - 1][6] = this.f[i][this.height - 1][7];
      this.f[i][this.height - 1][4] = temp2_b;
      this.f[i][this.height - 1][8] = temp5_b;
      this.f[i][this.height - 1][7] = temp6_b;
    }
  }

  render() {
    if (!this.imageData) {
      this.imageData = this.ctx.createImageData(this.width, this.height);
    }
    const data = this.imageData.data;
    const width = this.width;
    const height = this.height;

    let maxVal = 0.01; // avoid division by zero
    let minVal = 0;

    // Single pass: compute values and find max
    if (this.visualMode === 'velocity') {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!this.solid[i][j]) {
            const ux = this.ux[i][j];
            const uy = this.uy[i][j];
            const val = Math.sqrt(ux * ux + uy * uy);
            this.rho[i][j] = val; // reuse rho array for temporary storage
            if (val > maxVal) maxVal = val;
          }
        }
      }
    } else if (this.visualMode === 'vorticity') {
      for (let i = 1; i < width - 1; i++) {
        for (let j = 1; j < height - 1; j++) {
          if (!this.solid[i][j]) {
            const duy_dx = (this.uy[i + 1][j] - this.uy[i - 1][j]) * 0.5;
            const dux_dy = (this.ux[i][j + 1] - this.ux[i][j - 1]) * 0.5;
            const val = Math.abs(duy_dx - dux_dy);
            this.rho[i][j] = val;
            if (val > maxVal) maxVal = val;
          }
        }
      }
    } else if (this.visualMode === 'pressure') {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!this.solid[i][j]) {
            const val = this.rho[i][j];
            if (val > maxVal) maxVal = val;
          }
        }
      }
    }

    const invMaxVal = 1.0 / maxVal;

    // Colorize directly into imageData
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const idx = (j * width + i) * 4;

        if (this.solid[i][j]) {
          // Solid objects in dark gray
          data[idx] = 40;
          data[idx + 1] = 40;
          data[idx + 2] = 40;
          data[idx + 3] = 255;
        } else {
          const normalized = this.rho[i][j] * invMaxVal;

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

      const gridSpacing = 10; // Draw every 10th grid line

      // Vertical lines
      for (let i = 0; i < width; i += gridSpacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, height);
        this.ctx.stroke();
      }

      // Horizontal lines
      for (let j = 0; j < height; j += gridSpacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, j);
        this.ctx.lineTo(width, j);
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

    // Create seed points in a regular grid
    for (let x0 = spacing; x0 < this.width; x0 += spacing) {
      for (let y0 = spacing / 2; y0 < this.height; y0 += spacing) {
        if (this.solid[Math.floor(x0)][Math.floor(y0)]) continue;

        this.ctx.beginPath();
        let x = x0;
        let y = y0;
        let validStart = true;

        // Trace streamline forward
        for (let step = 0; step < maxSteps; step++) {
          const i = Math.floor(x);
          const j = Math.floor(y);

          // Check bounds
          if (i < 1 || i >= this.width - 1 || j < 1 || j >= this.height - 1) break;
          if (this.solid[i][j]) break;

          // Get velocity at current position (simple nearest neighbor)
          const ux = this.ux[i][j];
          const uy = this.uy[i][j];
          const speed = Math.sqrt(ux * ux + uy * uy);

          if (speed < 0.001) break;  // Stop in stagnant regions

          if (step === 0) {
            this.ctx.moveTo(x, y);
            if (!validStart) break;
          } else {
            this.ctx.lineTo(x, y);
          }

          // Integrate forward (Euler method)
          x += ux * stepSize / speed * 3;
          y += uy * stepSize / speed * 3;
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

  getColor(value) {
    // Colormap: blue -> cyan -> green -> yellow -> red
    value = Math.max(0, Math.min(1, value));

    let r, g, b;

    if (value < 0.25) {
      const t = value / 0.25;
      r = 0;
      g = Math.floor(t * 255);
      b = 255;
    } else if (value < 0.5) {
      const t = (value - 0.25) / 0.25;
      r = 0;
      g = 255;
      b = Math.floor((1 - t) * 255);
    } else if (value < 0.75) {
      const t = (value - 0.5) / 0.25;
      r = Math.floor(t * 255);
      g = 255;
      b = 0;
    } else {
      const t = (value - 0.75) / 0.25;
      r = 255;
      g = Math.floor((1 - t) * 255);
      b = 0;
    }

    return { r, g, b };
  }

  setVelocity(u0) {
    this.u0 = u0;
  }

  setViscosity(nu) {
    this.nu = nu;
    this.tau = 3 * this.nu + 0.5;
    this.omega = 1 / this.tau;
  }

  setVisualization(mode) {
    this.visualMode = mode;
  }

  toggleMesh(show) {
    this.showMesh = show;
  }

  reset() {
    this.init();
  }
}
