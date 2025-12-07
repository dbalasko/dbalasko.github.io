// Lid-Driven Cavity Flow - LBM Solver (D2Q9)
// Based on working C++ implementation with push streaming scheme

class LBMCavity {
  constructor(canvas, size) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.size = size;  // Square cavity
    this.running = false;
    this.visualMode = 'velocity';
    this.showMesh = false;
    this.showStreamlines = false;

    // LBM parameters
    this.lidVelocity = 0.1;  // Top wall velocity
    this.viscosity = 0.02;   // Kinematic viscosity
    this.omega = 1 / (3 * this.viscosity + 0.5);  // Relaxation parameter

    // D2Q9 lattice: separate array for each direction (like C++ code)
    // Naming: f{x}{y} where x,y in {m,0,p} = {minus, zero, plus}
    this.f00 = [];  // center (0, 0)
    this.fp0 = [];  // east (+1, 0)
    this.fm0 = [];  // west (-1, 0)
    this.f0p = [];  // north (0, +1)
    this.f0m = [];  // south (0, -1)
    this.fpp = [];  // northeast (+1, +1)
    this.fpm = [];  // southeast (+1, -1)
    this.fmp = [];  // northwest (-1, +1)
    this.fmm = [];  // southwest (-1, -1)

    // Post-collision arrays (S = streamed)
    this.f00S = [];
    this.fp0S = [];
    this.fm0S = [];
    this.f0pS = [];
    this.f0mS = [];
    this.fppS = [];
    this.fpmS = [];
    this.fmpS = [];
    this.fmmS = [];

    // Macroscopic variables
    this.ux = [];
    this.uy = [];
    this.rho = [];

    this.initArrays();
    this.reset();
  }

  initArrays() {
    const w0 = 4/9, w1 = 1/9, w2 = 1/36;

    for (let i = 0; i < this.size; i++) {
      this.f00[i] = []; this.fp0[i] = []; this.fm0[i] = [];
      this.f0p[i] = []; this.f0m[i] = [];
      this.fpp[i] = []; this.fpm[i] = []; this.fmp[i] = []; this.fmm[i] = [];

      this.f00S[i] = []; this.fp0S[i] = []; this.fm0S[i] = [];
      this.f0pS[i] = []; this.f0mS[i] = [];
      this.fppS[i] = []; this.fpmS[i] = []; this.fmpS[i] = []; this.fmmS[i] = [];

      this.ux[i] = []; this.uy[i] = []; this.rho[i] = [];

      for (let j = 0; j < this.size; j++) {
        // Initialize with equilibrium at rest
        this.f00[i][j] = w0; this.f00S[i][j] = w0;
        this.fp0[i][j] = w1; this.fp0S[i][j] = w1;
        this.fm0[i][j] = w1; this.fm0S[i][j] = w1;
        this.f0p[i][j] = w1; this.f0pS[i][j] = w1;
        this.f0m[i][j] = w1; this.f0mS[i][j] = w1;
        this.fpp[i][j] = w2; this.fppS[i][j] = w2;
        this.fpm[i][j] = w2; this.fpmS[i][j] = w2;
        this.fmp[i][j] = w2; this.fmpS[i][j] = w2;
        this.fmm[i][j] = w2; this.fmmS[i][j] = w2;

        this.ux[i][j] = 0;
        this.uy[i][j] = 0;
        this.rho[i][j] = 1;
      }
    }
  }

  reset() {
    const w0 = 4/9, w1 = 1/9, w2 = 1/36;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.f00[i][j] = w0; this.fp0[i][j] = w1; this.fm0[i][j] = w1;
        this.f0p[i][j] = w1; this.f0m[i][j] = w1;
        this.fpp[i][j] = w2; this.fpm[i][j] = w2; this.fmp[i][j] = w2; this.fmm[i][j] = w2;
        this.ux[i][j] = 0;
        this.uy[i][j] = 0;
        this.rho[i][j] = 1;
      }
    }
  }

  setLidVelocity(velocity) {
    this.lidVelocity = velocity;
  }

  setViscosity(viscosity) {
    this.viscosity = viscosity;
    this.omega = 1 / (3 * this.viscosity + 0.5);
  }

  setVisualization(mode) {
    this.visualMode = mode;
  }

  toggleMesh(show) {
    this.showMesh = show;
  }

  toggleStreamlines(show) {
    this.showStreamlines = show;
  }

  step() {
    const imax = this.size - 1;
    const jmax = this.size - 1;
    const u = this.lidVelocity;
    const omega = this.omega;

    // COLLISION + PUSH STREAMING (only interior cells)
    for (let j = 1; j < jmax; j++) {
      for (let i = 1; i < imax; i++) {

        // Compute density
        const rho = this.fmp[i][j] + this.f0p[i][j] + this.fpp[i][j] +
                    this.fm0[i][j] + this.f00[i][j] + this.fp0[i][j] +
                    this.fmm[i][j] + this.f0m[i][j] + this.fpm[i][j];

        // Compute velocity
        const ux = (this.fp0[i][j] + this.fpp[i][j] + this.fpm[i][j] -
                    this.fm0[i][j] - this.fmm[i][j] - this.fmp[i][j]) / rho;
        const uy = (this.f0p[i][j] + this.fpp[i][j] + this.fmp[i][j] -
                    this.f0m[i][j] - this.fmm[i][j] - this.fpm[i][j]) / rho;

        this.rho[i][j] = rho;
        this.ux[i][j] = ux;
        this.uy[i][j] = uy;

        // Equilibrium (moment matching from C++ code)
        const ux2 = ux * ux, uy2 = uy * uy;
        const feq00 = (rho * (-2 + 3*ux2) * (-2 + 3*uy2)) / 9;

        const feqm0 = -(rho * (1 + 3*(-1 + ux)*ux) * (-2 + 3*uy2)) / 18;
        const feqp0 = -(rho * (1 + 3*ux*(1 + ux)) * (-2 + 3*uy2)) / 18;
        const feq0m = -(rho * (1 + 3*(-1 + uy)*uy) * (-2 + 3*ux2)) / 18;
        const feq0p = -(rho * (1 + 3*uy*(1 + uy)) * (-2 + 3*ux2)) / 18;

        const feqmm = (rho * (1 + 3*(-1 + ux)*ux) * (1 + 3*(-1 + uy)*uy)) / 36;
        const feqpp = (rho * (1 + 3*ux*(1 + ux)) * (1 + 3*uy*(1 + uy))) / 36;
        const feqpm = (rho * (1 + 3*ux*(1 + ux)) * (1 + 3*(-1 + uy)*uy)) / 36;
        const feqmp = (rho * (1 + 3*(-1 + ux)*ux) * (1 + 3*uy*(1 + uy))) / 36;

        // BGK collision + PUSH streaming
        this.f00S[i][j]     = this.f00[i][j] - omega * (this.f00[i][j] - feq00);
        this.fm0S[i-1][j]   = this.fm0[i][j] - omega * (this.fm0[i][j] - feqm0);
        this.fp0S[i+1][j]   = this.fp0[i][j] - omega * (this.fp0[i][j] - feqp0);
        this.f0mS[i][j-1]   = this.f0m[i][j] - omega * (this.f0m[i][j] - feq0m);
        this.f0pS[i][j+1]   = this.f0p[i][j] - omega * (this.f0p[i][j] - feq0p);
        this.fppS[i+1][j+1] = this.fpp[i][j] - omega * (this.fpp[i][j] - feqpp);
        this.fpmS[i+1][j-1] = this.fpm[i][j] - omega * (this.fpm[i][j] - feqpm);
        this.fmpS[i-1][j+1] = this.fmp[i][j] - omega * (this.fmp[i][j] - feqmp);
        this.fmmS[i-1][j-1] = this.fmm[i][j] - omega * (this.fmm[i][j] - feqmm);
      }
    }

    // BOUNDARY CONDITIONS (exactly from C++ code)

    // Left and Right walls
    for (let j = 1; j < jmax; j++) {
      // Left wall (i=0): bounce-back
      this.fp0S[1][j]   = this.fm0[0][j];
      this.fppS[1][j+1] = this.fmm[0][j];
      this.fpmS[1][j-1] = this.fmp[0][j];

      // Right wall (i=imax): bounce-back
      this.fm0S[imax-1][j]   = this.fp0[imax][j];
      this.fmpS[imax-1][j+1] = this.fpm[imax][j];
      this.fmmS[imax-1][j-1] = this.fpp[imax][j];
    }

    // Top and Bottom walls
    for (let i = 1; i < imax; i++) {
      // Top wall (j=jmax): moving lid with velocity u
      this.f0mS[i][jmax-1]   = this.f0p[i][jmax];
      this.fmmS[i-1][jmax-1] = this.fpp[i][jmax] - (1/6)*u;
      this.fpmS[i+1][jmax-1] = this.fmp[i][jmax] + (1/6)*u;

      // Bottom wall (j=0): bounce-back
      this.f0pS[i][1]   = this.f0m[i][0];
      this.fmpS[i-1][1] = this.fmm[i][0];
      this.fppS[i+1][1] = this.fpm[i][0];
    }

    // Corners: bounce-back
    this.fppS[1][1]           = this.fmm[0][0];
    this.fmpS[1][jmax-1]      = this.fpm[0][jmax];
    this.fpmS[imax-1][1]      = this.fmp[imax][0];
    this.fmmS[imax-1][jmax-1] = this.fpp[imax][jmax];

    // Swap arrays (A <-> B)
    [this.f00, this.f00S] = [this.f00S, this.f00];
    [this.fp0, this.fp0S] = [this.fp0S, this.fp0];
    [this.fm0, this.fm0S] = [this.fm0S, this.fm0];
    [this.f0p, this.f0pS] = [this.f0pS, this.f0p];
    [this.f0m, this.f0mS] = [this.f0mS, this.f0m];
    [this.fpp, this.fppS] = [this.fppS, this.fpp];
    [this.fpm, this.fpmS] = [this.fpmS, this.fpm];
    [this.fmp, this.fmpS] = [this.fmpS, this.fmp];
    [this.fmm, this.fmmS] = [this.fmmS, this.fmm];
  }

  render() {
    if (!this.imageData) {
      this.imageData = this.ctx.createImageData(this.size, this.size);
    }

    const data = this.imageData.data;
    let values = [];
    let maxVal = 0.01;

    // Compute visualization values
    if (this.visualMode === 'velocity') {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const speed = Math.sqrt(this.ux[i][j] ** 2 + this.uy[i][j] ** 2);
          values.push(speed);
          if (speed > maxVal) maxVal = speed;
        }
      }
    } else if (this.visualMode === 'vorticity') {
      for (let i = 1; i < this.size - 1; i++) {
        for (let j = 1; j < this.size - 1; j++) {
          const duydx = (this.uy[i+1][j] - this.uy[i-1][j]) / 2;
          const duxdy = (this.ux[i][j+1] - this.ux[i][j-1]) / 2;
          const vort = Math.abs(duydx - duxdy);
          values.push(vort);
          if (vort > maxVal) maxVal = vort;
        }
      }
    } else if (this.visualMode === 'pressure') {
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          const p = this.rho[i][j] / 3;
          values.push(p);
          if (p > maxVal) maxVal = p;
        }
      }
    }

    const invMaxVal = 1.0 / maxVal;

    // Colorize (flip y-coordinate so j=size-1 appears at top of canvas)
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const canvasJ = this.size - 1 - j;  // Flip y-coordinate
        const idx = (canvasJ * this.size + i) * 4;
        let dataIdx;

        if (this.visualMode === 'vorticity') {
          dataIdx = (j - 1) * (this.size - 2) + (i - 1);
          if (i === 0 || i === this.size - 1 || j === 0 || j === this.size - 1) {
            dataIdx = -1;
          }
        } else {
          dataIdx = j * this.size + i;
        }

        const normalized = dataIdx >= 0 ? values[dataIdx] * invMaxVal : 0;

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

    this.ctx.putImageData(this.imageData, 0, 0);

    // Draw streamlines if enabled
    if (this.showStreamlines && this.visualMode === 'velocity') {
      this.drawStreamlines();
    }

    // Draw mesh grid if enabled
    if (this.showMesh) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      this.ctx.lineWidth = 0.5;

      const gridSpacing = Math.max(10, Math.floor(this.size / 40));

      for (let i = 0; i < this.size; i += gridSpacing) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.size);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(this.size, i);
        this.ctx.stroke();
      }
    }

    // Draw colorbar
    this.drawColorbar(maxVal);
  }

  drawStreamlines() {
    const spacing = Math.max(15, Math.floor(this.size / 20));
    const stepSize = 1.0;
    const maxSteps = 500;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 0.8;

    for (let x0 = spacing; x0 < this.size; x0 += spacing) {
      for (let y0 = spacing; y0 < this.size; y0 += spacing) {
        this.ctx.beginPath();
        let x = x0;
        let y = y0;

        for (let step = 0; step < maxSteps; step++) {
          const i = Math.floor(x);
          const j = Math.floor(y);

          if (i < 1 || i >= this.size - 1 || j < 1 || j >= this.size - 1) break;

          const ux_val = this.ux[i][j];
          const uy_val = this.uy[i][j];
          const speed = Math.sqrt(ux_val * ux_val + uy_val * uy_val);

          if (speed < 0.001) break;

          // Convert physics coordinates to canvas coordinates (flip y)
          const canvasX = x;
          const canvasY = this.size - 1 - y;

          if (step === 0) {
            this.ctx.moveTo(canvasX, canvasY);
          } else {
            this.ctx.lineTo(canvasX, canvasY);
          }

          x += ux_val * stepSize / speed * 2;
          y += uy_val * stepSize / speed * 2;
        }

        this.ctx.stroke();
      }
    }
  }

  drawColorbar(maxVal) {
    const barWidth = 20;
    const barHeight = 150;
    const barX = this.size - barWidth - 10;
    const barY = 10;

    for (let i = 0; i < barHeight; i++) {
      const normalized = 1 - (i / barHeight);

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

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(barX - 0.5, barY - 0.5, barWidth + 1, barHeight + 1);

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.font = '9px -apple-system, monospace';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';

    const labels = [
      { val: maxVal, y: barY + 4 },
      { val: maxVal * 0.5, y: barY + barHeight * 0.5 },
      { val: 0, y: barY + barHeight - 4 }
    ];

    labels.forEach(label => {
      const text = label.val < 0.01 ? label.val.toExponential(1) : label.val.toFixed(3);
      const textWidth = this.ctx.measureText(text).width;

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(barX - textWidth - 6, label.y - 6, textWidth + 3, 12);

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.fillText(text, barX - 4, label.y);
    });
  }
}
