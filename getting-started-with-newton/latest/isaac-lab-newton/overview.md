# Isaac Lab and Newton[#](#isaac-lab-and-newton "Link to this heading")

In *Newton Fundamentals* we drove robots with raw Newton APIs. Now weâll use [Isaac Lab](https://isaac-sim.github.io/IsaacLab/), NVIDIAâs framework for robot learning, and use Newton as its physics engine. Weâll build a complete reinforcement learning (RL) pipeline that teaches a Franka robot to pick up a cube, then watch a trained policy do the job.

Isaac Lab handles the environment plumbing (vectorized environments, resets, observations, rewards, and the gym API), while Newton provides the fast, GPU-accelerated physics underneath. Understanding how the two fit together is the payoff for everything you learned in the previous module.

This module should take about 90 minutes to complete.

![The reinforcement learning loop: the environment produces observations and rewards, and the policy produces actions](../_images/rl.png)

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this module, youâll be able to:

- **Configure** Newton as the Isaac Lab physics engine with the three-layer solver configuration.
- **Describe** how a Direct RL environment defines a scene, actions, observations, rewards, and resets.
- **Run** a vectorized environment loop and interpret its statistics.
- **Load and play back** a trained PPO policy and compare it to random behavior.

## How This Module Runs[#](#how-this-module-runs "Link to this heading")

Choose the NVIDIA Brev or local setup in [Getting Started: Isaac Lab and Newton](../getting-started/setup.html#isaac-lab-and-newton).

Note

The complete, canonical implementation lives in the `franka_cube` extension under `source/franka_cube/`. Use the snippets to learn each concept, and the extension source as the runnable reference.

---

On this page
