# Module Review[#](#module-review "Link to this heading")

In this module you built a complete mental model of Newton, from its core abstractions to a coupled multi-solver manipulation task. You saw how a `ModelBuilder` assembles a scene, how `finalize()` produces a device-ready `Model`, and how a `Solver` advances `State` using `Control` and `Contacts`. You accelerated simulations with CUDA graph capture, drove a Franka arm with both torques and position targets, solved batched inverse kinematics to follow a path, and finally coupled a MuJoCo-solved arm with a VBD-solved cable.

These are the same building blocks Isaac Lab uses when it runs on Newton, which is exactly where weâre headed next.

## Knowledge Check[#](#knowledge-check "Link to this heading")

**Question 1:** In a Newton simulation, what does the solver consume on each substep to produce the next state?

A. Only the `Model` and a timestep `dt`  
B. The `Model`, `State`, `Control`, `Contacts`, and a timestep `dt`  
C. Only the `State` and `Control`  
D. A URDF file and a list of joint torques

Show Answer

**Answer: B**

Each substep, the solver consumes the `Model` (compiled scene data), the current `State` (positions, velocities, forces), the `Control` (joint inputs), the `Contacts` (from the collision pipeline), and the timestep `dt`, then writes the next `State`. This is the single pattern that every lesson in the module reused.

---

**Question 2:** Why does CUDA graph capture speed up the simulation loop on the GPU?

A. It increases the solver iteration count automatically  
B. It reduces numerical error in the integrator  
C. It records the exact sequence of kernel launches once so they can be replayed with a single call, removing most per-launch overhead  
D. It moves the simulation from the GPU to the CPU

Show Answer

**Answer: C**

On the GPU, launching many tiny kernels adds up. Graph capture records the kernel launches inside `simulate()` once, and `wp.capture_launch(graph)` replays the whole batch with a single call, removing most of the Python and driver launch overhead. Because it captures exact buffers, you must not reallocate the state buffers after capture.

---

**Question 3:** In the coupled cable pick-and-place task, which solver handles the deformable cable, and how does the gripper interact with it?

A. `SolverMuJoCo` handles the cable, and the gripper is ignored  
B. `SolverXPBD` handles the cable through direct joint targets  
C. `SolverVBD` handles the cable, and `SolverCoupledProxy` exposes the gripper bodies to the VBD collision world  
D. A single solver handles both the arm and the cable with no coupling

Show Answer

**Answer: C**

The rigid Franka arm is solved by `SolverMuJoCo`, while the deformable cable is solved by `SolverVBD`. `SolverCoupledProxy` sends selected gripper bodies from the MuJoCo side into the VBD collision world as proxy bodies, so the cable can feel and be grasped by the gripper while the arm stays under MuJoCo control.

---

## Challenge: Extend the Scene[#](#challenge-extend-the-scene "Link to this heading")

Try adding a second obstacle to the coupled scene, or change the cableâs `bend_stiffness` and `stretch_stiffness` to make it more or less floppy. Observe how the grasp and lift behave. Thereâs no single right answer; the goal is to build intuition for how solver and material parameters shape the result.

## Additional Resources[#](#additional-resources "Link to this heading")

- [Newton GitHub repository](https://github.com/newton-physics/newton)
- [Newton overview](https://newton-physics.github.io/newton/stable/guide/overview.html)
- [Newton core concepts](https://newton-physics.github.io/newton/stable/guide/overview.html#core-concepts)
- [NVIDIA Warp](https://github.com/NVIDIA/warp)
- Coupled solver API: `newton.solvers.experimental.coupled`

## Whatâs Next?[#](#what-s-next "Link to this heading")

In the next module, weâll move from raw Newton to Isaac Lab. Youâll configure Newton as the physics engine inside Isaac Lab, build a reinforcement learning environment for the Franka cube-lift task, and play back a trained policy.

On this page
