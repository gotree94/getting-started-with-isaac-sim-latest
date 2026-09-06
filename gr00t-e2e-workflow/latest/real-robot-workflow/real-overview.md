# Real Robot Workflow[#](#real-robot-workflow "Link to this heading")

This section covers the complete real-hardware pipeline:

- Preparing the Unitree G1
- Teleoperating the G1 to collect demonstration data
- Exporting data for training
- Fine-tuning GR00T 1.7
- Deploying the trained policy on the physical robot

[![Teleoperation environment for this task.](../_images/apple_to_plate.gif)](../_images/apple_to_plate.gif "Teleoperation environment for this task.")

Teleoperation environment for this task.[#](#id1 "Link to this image")

Warning

Working with a physical humanoid robot introduces real safety considerations. Read the [G1 Introduction and Safety](g1-introduction-and-safety.html) lesson in full before powering on the robot.

Having at least two people work on this workflow is recommended:

- One person for teleoperation
- One person to monitor the robot for safety purposes

Note

This workflow is fully independent of the Simulation Workflow. You can complete it on its own if you have G1 hardware available.

Tip

If you want a starting point before collecting or training your own assets, see the [real robot model and dataset](../resources/models-and-datasets.html#real-robot-workflow) links.

## Unitree G1 Hardware Overview[#](#unitree-g1-hardware-overview "Link to this heading")

This workflow uses a Unitree G1 humanoid with Dex3-1 hands, a head-mounted Intel RealSense camera, and a Jetson AGX Thor connected either externally or through the Unitree Thor backpack.

The Thor runs Isaac ROS for all controllers and policies. The AGILE WBC controls lower body stability, while an operator or the GR00T policy commands the upper body for manipulation.

## Workflow Overview[#](#workflow-overview "Link to this heading")

| # | Tutorial | Supported compute platform |
| --- | --- | --- |
| 1 | [Set Up Isaac ROS on Thor](isaac-ros-setup.html) | Jetson AGX Thor |
| 2 | [Set Up the G1 Hardware](g1-introduction-and-safety.html) | Jetson AGX Thor |
| 3 | [Teleoperate the Unitree G1](real-teleop.html) | Jetson AGX Thor |
| 4 | [Record Demonstrations](real-record.html) | Jetson AGX Thor |
| 5 | [Convert MCAP Bags to a LeRobot Dataset](real-data-export.html) | x86\_64 or Jetson AGX Thor |
| 6 | [Fine-Tune GR00T 1.7](real-fine-tuning-and-leapp.html) | x86\_64 |
| 7 | [Export the Policy with LEAPP](real-leapp-export.html) | x86\_64 |
| 8 | [Deploy the Fine-Tuned Policy](real-deployment.html) | Jetson AGX Thor |

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this section, youâll be able to:

- **Apply** workflow safety checkpoints before teleoperation, recording, and deployment.
- **Teleoperate** the physical G1 through AGILE and record real-world pick-and-place demonstrations.
- **Export** real demonstration data from MCAP to LeRobot format.
- **Fine-tune** GR00T 1.7 on real-world data and prepare LEAPP deployment assets.
- **Deploy** a trained manipulation policy to the G1 via NVIDIA Thor and evaluate on hardware.

---

On this page
