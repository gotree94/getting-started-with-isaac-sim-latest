# Newton Fundamentals[#](#newton-fundamentals "Link to this heading")

*Newton Fundamentals* is a guided, hands-on introduction to the Newton physics engine. We start with the high-level ideas, build practical intuition with small interactive simulations, and finish with a Franka cable pick-and-place task that combines inverse kinematics with Newtonâs coupled-solver workflow.

Newton Physics Engine is an open-source, extensible physics engine built on NVIDIA Warp and OpenUSD, developed by NVIDIA, Google DeepMind, and Disney Research, and managed by the Linux Foundation

Because Newton is built on [NVIDIA Warp](https://github.com/NVIDIA/warp), everything you build here runs on the GPU with near low-level performance while you stay in Python.

Understanding these fundamentals matters because they are the same abstractions Isaac Lab uses under the hood, which is exactly what weâll explore in the next module.

## How This Module Runs[#](#how-this-module-runs "Link to this heading")

Choose the NVIDIA Brev or local setup in [Getting Started: Newton Fundamentals](../getting-started/setup.html#newton-fundamentals).

This module should take about 2 hours to complete.

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this module, youâll be able to:

- **Describe** the Newton simulation abstractions and how a solver consumes them each step.
- **Build** a scene with `ModelBuilder`, finalize it into a `Model`, and run a stepping loop.
- **Apply** CUDA graph capture to reduce per-step launch overhead on the GPU.
- **Control** a Franka arm with joint forces and joint position targets.
- **Solve** batched inverse kinematics to follow a task-space path.
- **Assemble** a coupled scene where a rigid arm manipulates a deformable cable.

## What Youâll Build[#](#what-you-ll-build "Link to this heading")

Each lesson introduces one idea at a time with a focused snippet, then hands you a single **complete script** you can run in isolation. The same scripts ship as standalone files in [`newton-fundamentals-examples`](https://developer.nvidia.com/downloads/Omniverse/learning/Courses/GettingStartedNewton/getting_started_with_newton_fundamentals_examples.zip). By the end youâll have a small library of runnable Newton examples covering everything from a two-object drop test to a full coupled manipulation task.

---

On this page
