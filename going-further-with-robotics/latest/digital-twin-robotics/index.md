# Digital Twin Robotics: Immersive Software-in-the-Loop Testing With OpenUSD, Isaac Sim, and ROS[#](#digital-twin-robotics-immersive-software-in-the-loop-testing-with-openusd-isaac-sim-and-ros "Link to this heading")

## Overview[#](#overview "Link to this heading")

In this lab, we will use a pre-trained policy for a humanoid robot. This policy allows the robot to walk, while balancing itself on flat terrain. The âpolicyâ is basically a simple neural network which takes the observations as the input and outputs the actions.

We will demonstrate how to use this policy to test against a simulated robot, using a process known as âSoftware-in-the-Loopâ testing. This allows us to test how our policy performs against a simulated robot, before testing on a more expensive physical robot. This testing is essential in the development of Physical AI.

### In this module, participants will learn how to:[#](#in-this-module-participants-will-learn-how-to "Link to this heading")

- Create and configure scenes using OpenUSD in Omniverse.
- Integrate a humanoid robot into Isaac Sim environments.
- Configure information from a policy training, for use in Isaac Sim.
- Simulate robot movement and validate behavior using ROS commands.
- Apply SIL (software-in-the-loop) principles to robotics development.

#### Reinforcement Learning With Isaac Lab[#](#reinforcement-learning-with-isaac-lab "Link to this heading")

**Reinforcement learning in robotics** is a way for robots to learn by doing. The robot tries different actions, gets feedback (rewards or penalties), and then learns which actions work best to achieve a goal. Over time, we build whatâs called a âpolicyâ of how the robot behaves. This policy can be improved by balancing exploration and exploiting what works, repeating what works and avoiding what doesnât.

We train reinforcement learning policies using **Isaac Lab**, a simulation platform built for scalability. It allows **thousands of robots to train at the same time in simulation**, compressing **years of real-world experience into just minutes**.

#### Robotics Simulation With Isaac Sim[#](#robotics-simulation-with-isaac-sim "Link to this heading")

**Isaac Sim** is NVIDIAâs robotics simulation platform built on **Omniverse**. It provides **highly realistic physics, lighting, and sensor simulation**, allowing robots to be trained and tested in virtual environments before deployment.

We will deploy the policy in Isaac Sim, in a simulated warehouse environment using ROS, Isaac Sim ROS bridge, and teleoperate (remote control) the robot using a keyboard.

#### Robotics Operating System (ROS)[#](#robotics-operating-system-ros "Link to this heading")

Robotics Operating System, it is a modular robotics middleware that enables communication and coordination between different compute nodes, and offers many robotics libraries for navigation and SLAM.

In this lab, we will publish sensor and simulation data from Isaac Sim, via ROS to the whole body controller ROS nodes.

The ROS nodes will use the observations and the neural network to determine the actions for the robot.

Then the actions are sent back to the simulator.

On this page
