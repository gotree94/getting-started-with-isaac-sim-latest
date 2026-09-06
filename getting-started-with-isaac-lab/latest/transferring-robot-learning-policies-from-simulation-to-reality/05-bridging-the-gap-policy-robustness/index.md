# Regularization[#](#regularization "Link to this heading")

Regularization plays a crucial role in transferring policies from simulation to real robots. There are several key quantities we need to minimize through rewards or termination conditions to ensure safe and sustainable robot operation.

## Action Rate Control[#](#action-rate-control "Link to this heading")

**Action rate control** is aimed at producing smoother and more stable behavior in robotic systems. It involves minimizing the rate at which the output of a policy (the robotâs actions) changes over time.

Action rate control is typically achieved by adding an action rate penalty to the optimization objective. This prevents the robot from making rapid, high-frequency changes in its movements. While quick changes might work in simulation, they can cause harmful vibrations in real robots.

## Joint Velocity Management[#](#joint-velocity-management "Link to this heading")

Minimizing **joint velocities** helps moderate the robotâs overall movement speed. This is particularly important in tasks like pose tracking with robotic arms. Without this control, a robot might move at maximum speed to reach its target, potentially damaging its hardware.

## Contact Force Regulation[#](#contact-force-regulation "Link to this heading")

Source: [ANYmal parkour: Learning agile navigation for quadrupedal robots](https://www.science.org/doi/10.1126/scirobotics.adi7566)

Managing **contact forces** is essential for protecting the robotâs hardware. In parkour experiments, we can see the dramatic difference this makes. Without contact force penalties, the robot would simply slam into the ground when jumping down from boxes - technically achieving its goal but risking hardware damage. After implementing contact force minimization, the robotâs behavior becomes notably more cautious and smooth, leading to more sustainable movements that preserve the hardwareâs longevity.

These regularization techniques work together to create more hardware-friendly behaviors, bridging the gap between simulation and real-world performance while protecting the robotâs physical components.

On this page
