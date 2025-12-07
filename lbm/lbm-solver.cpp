#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <vector>
#include <cmath>
#include <algorithm>

using namespace emscripten;

class LBMSolver {
private:
    int width, height;
    double nu, tau, omega, u0;

    // D2Q9 lattice velocities
    static constexpr int ex[9] = {0, 1, 0, -1, 0, 1, -1, -1, 1};
    static constexpr int ey[9] = {0, 0, 1, 0, -1, 1, 1, -1, -1};
    static constexpr double w[9] = {4.0/9.0, 1.0/9.0, 1.0/9.0, 1.0/9.0, 1.0/9.0,
                                     1.0/36.0, 1.0/36.0, 1.0/36.0, 1.0/36.0};

    // Distribution functions (current and temporary)
    std::vector<std::vector<std::vector<double>>> f;
    std::vector<std::vector<std::vector<double>>> fTemp;

    // Macroscopic fields
    std::vector<std::vector<double>> rho;
    std::vector<std::vector<double>> ux;
    std::vector<std::vector<double>> uy;

    // Obstacle array
    std::vector<std::vector<bool>> obstacle;

    // Parameters
    bool running;
    double currentVelocity;
    int stepCount;
    int rampUpSteps;
    std::string currentGeometry;

public:
    LBMSolver(int w, int h) : width(w), height(h), running(false),
                               stepCount(0), rampUpSteps(500), currentGeometry("circle") {
        // Initialize arrays
        f.resize(width, std::vector<std::vector<double>>(height, std::vector<double>(9, 0.0)));
        fTemp.resize(width, std::vector<std::vector<double>>(height, std::vector<double>(9, 0.0)));
        rho.resize(width, std::vector<double>(height, 1.0));
        ux.resize(width, std::vector<double>(height, 0.0));
        uy.resize(width, std::vector<double>(height, 0.0));
        obstacle.resize(width, std::vector<bool>(height, false));

        // Default parameters
        setViscosity(0.02);
        setVelocity(0.15);
        currentVelocity = 0.0;

        reset();
    }

    void setViscosity(double viscosity) {
        nu = viscosity;
        tau = 3.0 * nu + 0.5;
        omega = 1.0 / tau;
    }

    void setVelocity(double velocity) {
        u0 = velocity;
    }

    void setGeometry(std::string geom) {
        currentGeometry = geom;
        reset();
    }

    void reset() {
        stepCount = 0;
        currentVelocity = 0.0;

        // Clear obstacle
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                obstacle[i][j] = false;
            }
        }

        // Create geometry
        if (currentGeometry == "circle") {
            createCircle();
        } else if (currentGeometry == "airfoil") {
            createAirfoil();
        } else if (currentGeometry == "square") {
            createSquare();
        } else if (currentGeometry == "flat_plate") {
            createFlatPlate();
        } else if (currentGeometry == "triangle") {
            createTriangle();
        }

        // Initialize distribution functions
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                double rho0 = 1.0;
                double ux0 = 0.0;
                double uy0 = 0.0;

                for (int k = 0; k < 9; k++) {
                    double cu = 3.0 * (ex[k] * ux0 + ey[k] * uy0);
                    double u2 = 1.5 * (ux0 * ux0 + uy0 * uy0);
                    f[i][j][k] = w[k] * rho0 * (1.0 + cu + 0.5 * cu * cu - u2);
                    fTemp[i][j][k] = f[i][j][k];
                }

                rho[i][j] = rho0;
                ux[i][j] = ux0;
                uy[i][j] = uy0;
            }
        }
    }

    void createCircle() {
        double cx = width * 0.25;
        double cy = height * 0.5;
        double radius = height * 0.16;  // Larger for vortex shedding

        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                double dx = i - cx;
                double dy = j - cy;
                if (dx * dx + dy * dy < radius * radius) {
                    obstacle[i][j] = true;
                }
            }
        }
    }

    void createAirfoil() {
        double cx = width * 0.25;
        double cy = height * 0.5;
        double chord = height / 3.5;
        double thickness = 0.12;
        double angle = 5.0 * M_PI / 180.0;

        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                double dx = i - cx;
                double dy = j - cy;

                double xRot = dx * cos(-angle) - dy * sin(-angle);
                double yRot = dx * sin(-angle) + dy * cos(-angle);

                if (xRot >= 0 && xRot <= chord) {
                    double x_c = xRot / chord;
                    double yt = 5.0 * thickness * chord *
                               (0.2969 * sqrt(x_c) - 0.126 * x_c -
                                0.3516 * x_c * x_c + 0.2843 * x_c * x_c * x_c -
                                0.1015 * x_c * x_c * x_c * x_c);

                    if (std::abs(yRot) <= yt) {
                        obstacle[i][j] = true;
                    }
                }
            }
        }
    }

    void createSquare() {
        double cx = width * 0.25;
        double cy = height * 0.5;
        double size = height * 0.15;

        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                if (std::abs(i - cx) < size && std::abs(j - cy) < size) {
                    obstacle[i][j] = true;
                }
            }
        }
    }

    void createFlatPlate() {
        double cx = width * 0.25;
        double cy = height * 0.5;
        double length = height * 0.25;
        double thickness = 2.5;

        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                if (std::abs(i - cx) < length && std::abs(j - cy) < thickness) {
                    obstacle[i][j] = true;
                }
            }
        }
    }

    void createTriangle() {
        double cx = width * 0.25;
        double cy = height * 0.5;
        double triSize = height * 0.125;

        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                double dx = i - cx;
                double dy = j - cy;

                if (std::abs(dx) < triSize) {
                    double width_at_x = dx < 0 ? (triSize + dx) * 0.8 : (triSize - dx) * 0.8;
                    if (std::abs(dy) < width_at_x) {
                        obstacle[i][j] = true;
                    }
                }
            }
        }
    }

    void step() {
        // Velocity ramp-up
        if (stepCount < rampUpSteps) {
            currentVelocity = u0 * static_cast<double>(stepCount) / rampUpSteps;
            stepCount++;
        } else {
            currentVelocity = u0;
        }

        // Collision step
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                if (obstacle[i][j]) continue;

                // Compute macroscopic quantities
                double rho_local = 0.0;
                double ux_local = 0.0;
                double uy_local = 0.0;

                for (int k = 0; k < 9; k++) {
                    rho_local += f[i][j][k];
                    ux_local += ex[k] * f[i][j][k];
                    uy_local += ey[k] * f[i][j][k];
                }

                ux_local /= rho_local;
                uy_local /= rho_local;

                rho[i][j] = rho_local;
                ux[i][j] = ux_local;
                uy[i][j] = uy_local;

                // Collision with BGK operator
                double u2 = 1.5 * (ux_local * ux_local + uy_local * uy_local);

                for (int k = 0; k < 9; k++) {
                    double cu = 3.0 * (ex[k] * ux_local + ey[k] * uy_local);
                    double feq = w[k] * rho_local * (1.0 + cu + 0.5 * cu * cu - u2);
                    f[i][j][k] += omega * (feq - f[i][j][k]);
                }
            }
        }

        // Streaming step - first copy current state to temp
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                for (int k = 0; k < 9; k++) {
                    fTemp[i][j][k] = f[i][j][k];
                }
            }
        }

        // Now stream from neighbors (pull scheme)
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                if (obstacle[i][j]) {
                    // Bounce-back for obstacles
                    std::swap(fTemp[i][j][1], fTemp[i][j][3]);
                    std::swap(fTemp[i][j][2], fTemp[i][j][4]);
                    std::swap(fTemp[i][j][5], fTemp[i][j][7]);
                    std::swap(fTemp[i][j][6], fTemp[i][j][8]);
                } else {
                    // Stream from neighbors using pull scheme
                    for (int k = 0; k < 9; k++) {
                        int iprev = i - ex[k];
                        int jprev = j - ey[k];

                        if (iprev >= 0 && iprev < width && jprev >= 0 && jprev < height) {
                            fTemp[i][j][k] = f[iprev][jprev][k];
                        }
                    }
                }
            }
        }

        // Swap arrays
        std::swap(f, fTemp);

        // Boundary conditions
        applyBoundaryConditions();
    }

    void applyBoundaryConditions() {
        // Inlet (left boundary) - constant velocity
        for (int j = 0; j < height; j++) {
            double rho_in = 1.0;
            double ux_in = currentVelocity;
            double uy_in = 0.0;
            double u2 = 1.5 * (ux_in * ux_in + uy_in * uy_in);

            for (int k = 0; k < 9; k++) {
                double cu = 3.0 * (ex[k] * ux_in + ey[k] * uy_in);
                f[0][j][k] = w[k] * rho_in * (1.0 + cu + 0.5 * cu * cu - u2);
            }
        }

        // Outlet (right boundary) - zero gradient
        for (int j = 0; j < height; j++) {
            for (int k = 0; k < 9; k++) {
                f[width - 1][j][k] = f[width - 2][j][k];
            }
        }

        // Top and bottom walls - free-slip (specular reflection - only vertical component reflected)
        for (int i = 0; i < width; i++) {
            // Top wall (j=0) - bounce back only vertical components
            std::swap(f[i][0][2], f[i][0][4]);  // swap 2 <-> 4 (vertical)
            std::swap(f[i][0][5], f[i][0][8]);  // swap 5 <-> 8 (northeast <-> southeast)
            std::swap(f[i][0][6], f[i][0][7]);  // swap 6 <-> 7 (northwest <-> southwest)

            // Bottom wall (j=height-1) - bounce back only vertical components
            std::swap(f[i][height - 1][2], f[i][height - 1][4]);
            std::swap(f[i][height - 1][5], f[i][height - 1][8]);
            std::swap(f[i][height - 1][6], f[i][height - 1][7]);
        }
    }

    // Export data for visualization
    val getVelocityMagnitude() {
        val result = val::array();
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                double mag = sqrt(ux[i][j] * ux[i][j] + uy[i][j] * uy[i][j]);
                result.call<void>("push", mag);
            }
        }
        return result;
    }

    val getVorticity() {
        val result = val::array();
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                double omega_z = 0.0;
                if (i > 0 && i < width - 1 && j > 0 && j < height - 1) {
                    omega_z = (uy[i + 1][j] - uy[i - 1][j]) / 2.0 -
                              (ux[i][j + 1] - ux[i][j - 1]) / 2.0;
                }
                result.call<void>("push", omega_z);
            }
        }
        return result;
    }

    val getPressure() {
        val result = val::array();
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                double p = rho[i][j] / 3.0;
                result.call<void>("push", p);
            }
        }
        return result;
    }

    val getObstacle() {
        val result = val::array();
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                result.call<void>("push", static_cast<bool>(obstacle[i][j]));
            }
        }
        return result;
    }

    val getUx() {
        val result = val::array();
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                result.call<void>("push", ux[i][j]);
            }
        }
        return result;
    }

    val getUy() {
        val result = val::array();
        for (int j = 0; j < height; j++) {
            for (int i = 0; i < width; i++) {
                result.call<void>("push", uy[i][j]);
            }
        }
        return result;
    }

    int getWidth() const { return width; }
    int getHeight() const { return height; }

    void setRunning(bool r) { running = r; }
    bool isRunning() const { return running; }
};

// Emscripten bindings
EMSCRIPTEN_BINDINGS(lbm_module) {
    class_<LBMSolver>("LBMSolver")
        .constructor<int, int>()
        .function("setViscosity", &LBMSolver::setViscosity)
        .function("setVelocity", &LBMSolver::setVelocity)
        .function("setGeometry", &LBMSolver::setGeometry)
        .function("reset", &LBMSolver::reset)
        .function("step", &LBMSolver::step)
        .function("getVelocityMagnitude", &LBMSolver::getVelocityMagnitude)
        .function("getVorticity", &LBMSolver::getVorticity)
        .function("getPressure", &LBMSolver::getPressure)
        .function("getObstacle", &LBMSolver::getObstacle)
        .function("getUx", &LBMSolver::getUx)
        .function("getUy", &LBMSolver::getUy)
        .function("getWidth", &LBMSolver::getWidth)
        .function("getHeight", &LBMSolver::getHeight)
        .function("setRunning", &LBMSolver::setRunning)
        .function("isRunning", &LBMSolver::isRunning);
}
