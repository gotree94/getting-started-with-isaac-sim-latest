# Module Review[#](#module-review "Link to this heading")

In this module you connected Newton to Isaac Lab and built a complete robot-learning workflow. You bootstrapped the notebook with `AppLauncher`, used `launch_simulation` in the canonical scripts, configured Newton through the three-layer `MJWarpSolverCfg` â `NewtonCfg` â `SimulationCfg` stack, and walked through every stage of the RL pipeline: actions, rewards, resets, and observations. You ran a random-action baseline, played back a trained PPO policy, and learned the commands to train your own.

Together with *Newton Fundamentals*, youâve now seen the full stack, from a single rigid body dropping onto a plane to a learned manipulation policy running across thousands of parallel environments.

## Knowledge Check[#](#knowledge-check "Link to this heading")

**Question 1:** How do the notebook and canonical external-project scripts start the simulation runtime?

A. Both import `AppLauncher` after constructing the environment  
B. The notebook creates `AppLauncher` before the environment, while the scripts construct the environment inside `launch_simulation`  
C. The notebook launches Newton, while the scripts do not start a runtime  
D. Both rely on `gym.make` to start and stop the runtime

Show Answer

**Answer: B**

The notebook creates `AppLauncher` before constructing the environment. The standalone scripts resolve their task configuration first, then create and run the environment inside `with launch_simulation(env_cfg, args_cli):`, which owns runtime startup and shutdown.

---

**Question 2:** What are the three layers of the Newton physics configuration in Isaac Lab, from innermost to outermost?

A. `SimulationCfg` â `NewtonCfg` â `MJWarpSolverCfg`  
B. `MJWarpSolverCfg` â `NewtonCfg` â `SimulationCfg`  
C. `NewtonCfg` â `SimulationCfg` â `MJWarpSolverCfg`  
D. `RigidBodyMaterialCfg` â `NewtonCfg` â `SimulationCfg`

Show Answer

**Answer: B**

The solver itself is `MJWarpSolverCfg`, which is wrapped by `NewtonCfg` (the physics engine), which is wrapped by `SimulationCfg` (top-level simulation parameters such as `dt` and render interval). The solver is the innermost layer and the simulation config is the outermost.

---

**Question 3:** Why are the observations expressed relative to the default pose and the fingertips rather than in absolute world coordinates?

A. Absolute coordinates are impossible to compute in Newton  
B. Relative features reduce the observation to fewer than 10 dimensions  
C. Relative features generalize better and make the policy robust to where the cube spawns  
D. Relative features are required by the gym API

Show Answer

**Answer: C**

Expressing positions relative to the default pose and the fingertips (rather than absolute world coordinates) helps the policy generalize. It learns the geometry of reaching and grasping instead of memorizing specific world positions, which makes it robust to the randomized cube spawn location.

---

## Challenge: Reshape the Reward[#](#challenge-reshape-the-reward "Link to this heading")

Try adjusting the reward scales in the environment configuration, for example lowering `lifting_object_scale` or raising `reaching_object_scale`, then retrain and observe how the learned behavior changes. Reward shaping is one of the most impactful levers in RL, and building intuition for it pays off across every task.

## Additional Resources[#](#additional-resources "Link to this heading")

- [Isaac Lab documentation](https://isaac-sim.github.io/IsaacLab/)
- [Newton GitHub repository](https://github.com/newton-physics/newton)
- [RSL-RL](https://github.com/leggedrobotics/rsl_rl)
- [Proximal Policy Optimization (PPO) paper](https://arxiv.org/abs/1707.06347)

## Whatâs Next?[#](#what-s-next "Link to this heading")

Youâve completed the course. From here, try applying the same pipeline to a new task: change the object, add a second cube, or define a new reward. Everything you built on top of Newton and Isaac Lab transfers directly to your own robot-learning projects.

Continue learning with self-paced [Physical AI Learning](https://docs.nvidia.com/learning/physical-ai/) courses.

On this page
