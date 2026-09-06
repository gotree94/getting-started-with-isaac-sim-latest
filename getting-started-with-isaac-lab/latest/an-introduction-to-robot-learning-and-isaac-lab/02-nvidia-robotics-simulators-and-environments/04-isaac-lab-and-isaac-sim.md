# Data Flow Between Isaac Sim and Isaac Lab[#](#data-flow-between-isaac-sim-and-isaac-lab "Link to this heading")

The data flow architecture shows how Isaac Sim and Isaac Lab work together in a robotics learning pipeline. Letâs break down their distinct roles and interactions.

## Isaac Simâs Role[#](#isaac-sims-role "Link to this heading")

Isaac Sim handles three key components: assets, physics simulation, and rendering. Itâs where you design your assets - any kind of assets you want for your simulation. It also serves as the physics simulation environment and generates physics states and the visual output of the environment.

## Isaac Labâs Role[#](#isaac-labs-role "Link to this heading")

Meanwhile, Isaac Lab is the task design framework, or the robot learning framework, that uses Python files to handle the state of your simulation. It manages that learning pipeline through states (captures the raw data from the simulator), noise addition (applies randomization and disturbances for sim-to-real transfer), and observations (processes the noisy states into usable observations).

## State vs. Observation[#](#state-vs-observation "Link to this heading")

The distinction between states and observations is important in robotics learning:

**States** represent the actual, pure data from the robot, such as the exact position coordinates.

**Observations** are what the system can actually measure or detect, and may require additional processing. An observation could be something like camera images that need Visual SLAM ( Simultaneous Localization and Mapping) to determine position.

---

Can you think of additional examples of states and observations that apply to your own workflow?

---

## Learning Pipeline Flow[#](#learning-pipeline-flow "Link to this heading")

The robot learning pipeline flow can essentially be broken down into these seven steps:

1. You start with your assets in Isaac Sim. Isaac Sim provides the initial **state** from the physics simulation.
2. Isaac Lab processes this **state** from the simulator.
3. Noise is added to the state, which is crucial for sim-to-real scenarios.
4. The resulting **observation** is passed to the policy, which is the RL library you selected. Isaac Lab provides wrappers for external RL libraries and imitation learning libraries, so you can choose from various approaches for training your robots.
5. The policy generates actions.
6. This action returns to Isaac Sim for physics processing.
7. The cycle continues until task completion.

## Final Product[#](#final-product "Link to this heading")

At the end of this workflow, you get a trained policy in either .pt or .onnx format. This policy encapsulates the learned behavior of your robot, ideally ready for deployment in real-world scenarios.

By understanding this data flow, you can better leverage the power of Isaac Sim and Isaac Lab in your robot learning projects. Remember, the key is in the seamless interaction between the simulation environment and the learning framework.

On this page
