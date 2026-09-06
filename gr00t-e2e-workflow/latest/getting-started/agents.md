# Agent Skills[#](#agent-skills "Link to this heading")

Agent skills can give your agent focused instructions for debugging, tutoring, or working through specific parts of the workflow.

This page lists skills that may help you work through the course.

## Available Skills[#](#available-skills "Link to this heading")

### Troubleshooting for This Course[#](#troubleshooting-for-this-course "Link to this heading")

Use the [End-to-End Physical AI With the Unitree G1 troubleshooting skill](https://developer.nvidia.com/downloads/Omniverse/learning/Courses/isaac-gr00t-e2e/End-to-End-Physical-AI-With-the-Unitree-G1-troubleshooting-skill.md) when your agent needs to triage course-specific issues with RealSense cameras, Isaac Teleop, MuJoCo teleop, ROS domain crosstalk, image dimensions, or workflow setup.

Example Prompts

- âMy RealSense camera is not detected in `realsense-viewer`, but `sudo rs-enumerate-devices` works.â
- â`ros2 topic list` shows topics from another robot on the same network.â
- âStarting real robot teleop opens a MuJoCo window instead.â

### Isaac Sim Troubleshooting[#](#isaac-sim-troubleshooting "Link to this heading")

Use the [Isaac Sim troubleshooting skill](https://github.com/isaac-sim/IsaacSim/blob/main/skills/isaac-sim-troubleshooting/SKILL.md) when Isaac Sim hangs, freezes, loads scenes slowly, runs out of GPU memory, or has rendering or physics startup issues.

This can help your agent diagnose issues such as:

- Isaac Sim startup hangs
- USD scene loading delays
- Shader or MDL compilation delays
- Physics startup issues
- Rendering or GPU memory problems

Example Prompts

- âIsaac Sim hangs during startup after I launch the simulation workflow.â
- âMy USD scene takes a long time to load and the viewport stays blank.â
- âIsaac Sim reports GPU memory pressure while loading the robot scene.â

### Physical AI Tutor[#](#physical-ai-tutor "Link to this heading")

Use the [Physical AI Tutor skill](https://developer.nvidia.com/downloads/Omniverse/learning/Courses/isaac-gr00t-e2e/Physical-AI-Tutor-skill.md) when you want an agent to tutor you through the course step by step, explain workflow concepts, or help you decide what to do next.

This skill can also reference other NVIDIA-provided skills for Omniverse and Isaac.

Example Prompts

- âTutor me through this course one step at a time, starting with the prerequisites.â
- âGive me a theory-only overview of this course and quiz me on those concepts.â
- âI want to take the simulation workflow hands-on and pause after each action-heavy step.â
- âExplain the difference between the simulation path and real robot path, then check whether I am ready to choose one.â

On this page
