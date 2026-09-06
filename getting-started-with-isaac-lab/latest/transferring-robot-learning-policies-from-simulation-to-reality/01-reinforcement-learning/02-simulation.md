# Simulation: A Game-Changer[#](#simulation-a-game-changer "Link to this heading")

Fortunately, simulation offers a solution to many of these problems. At NVIDIA, weâve developed expertise in this area, and itâs become a core part of the Omniverse platform.

## Benefits of Simulation[#](#benefits-of-simulation "Link to this heading")

- **Speed**: Simulations can run much faster than real-time. For example, with the rough terrain locomotion task using the Unitree G1 humanoid robot, one second in simulation in Isaac Lab on a GeForce RTXâ¢ 4090 GPU equates to about 27 minutes of real-world experience. This dramatically accelerates the learning process.
- **Access to Information**: In a simulation, you have access to all the data about the robot and its environment. This âprivileged informationâ can be invaluable for training and debugging.
- **Scenario Generation**: You can procedurally generate an infinite number of scenarios, exposing the robot to a wide range of situations it might encounter in the real world.how

Tip

Learn more: [Learning a State Representation and Navigation in Cluttered and Dynamic Environments](https://arxiv.org/pdf/2103.04351)

## Sim-to-Real Transfer[#](#sim-to-real-transfer "Link to this heading")

This is where the concept of sim-to-real comes into play. The process involves training a policy in simulation, then transferring it to the real robot.

*Training in Simulation vs Zero-Shot Deployment*

*ANYmal parkour: Learning agile navigation for quadrupedal robots. (Published in Science Robotics, <https://www.science.org/doi/abs/10.1126/scirobotics.adi7566>)*

In practice, this means taking the weights of the trained neural network and loading that file onto the robotâs hardware for inferenceâthis is how you tell the robot what to do.

However, itâs not quite as simple as it sounds. Thereâs a catch.

On this page
