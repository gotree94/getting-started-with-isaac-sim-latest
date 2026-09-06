# Accelerating Robot Learning With Isaac Lab and Newton[#](#accelerating-robot-learning-with-isaac-lab-and-newton "Link to this heading")

This course is a hands-on introduction to the [Newton](https://github.com/newton-physics/newton) physics engine, and how it powers robot learning inside [Isaac Lab](https://isaac-sim.github.io/IsaacLab/).

Weâll start from the core Newton abstractions, build practical intuition with small simulations you run yourself. In the second course, we finish by training and playing back a reinforcement learning (RL) policy with Isaac Lab.

[Your browser does not support the video tag.](_images/Newton_Lab_Franka.mp4)

*A preview of what youâll build: a Franka arm driven through Newton-powered simulation, from basic control to a trained cube-lift policy.*

We have both options to run this course on your own computer, or on the cloud with NVIDIA Brev.

Every concept is introduced with a focused code snippet, and at the end of each lesson we assemble those snippets into a single complete script to run on your own computer.

## Who This Course Is For[#](#who-this-course-is-for "Link to this heading")

We designed this course for robotics engineers, simulation developers, and machine learning practitioners who have some background in robotics, simulation, or RL and want to add Newton to their toolkit. Comfort with Python is required. Prior exposure to [NVIDIA Warp](https://github.com/NVIDIA/warp), MuJoCo, or GPU computing is helpful but not required.

## What Youâll Learn[#](#what-you-ll-learn "Link to this heading")

By the end of this course, youâll be able to:

- **Explain** the core Newton abstractions: `ModelBuilder`, `Model`, `State`, `Control`, `Contacts`, and `Solver`.
- **Build and step** a Newton simulation, and **accelerate** it with CUDA graph capture.
- **Control** a Franka robot arm with joint forces, joint position targets, and batched inverse kinematics.
- **Assemble** a coupled multi-solver scene for deformable cable manipulation.
- **Configure** Newton as the physics engine inside Isaac Lab and **train and play back** an RL manipulation policy.

## How the Course Is Organized[#](#how-the-course-is-organized "Link to this heading")

Getting Started

Prepare your machine and launch the isolated course environment.

[Getting Started](getting-started/setup.html)

Newton Fundamentals

Core concepts, simulation loops, robot control, IK, and coupled manipulation.

[Newton Fundamentals](newton-fundamentals/overview.html)

Isaac Lab and Newton

Configure Newton in Isaac Lab and train a Franka cube-lift policy.

[Isaac Lab and Newton](isaac-lab-newton/overview.html)

On this page
