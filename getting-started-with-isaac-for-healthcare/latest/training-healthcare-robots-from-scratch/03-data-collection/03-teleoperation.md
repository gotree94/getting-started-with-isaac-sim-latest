# Teleoperation[#](#teleoperation "Link to this heading")

## Teleoperation Witth Isaac Lab[#](#teleoperation-witth-isaac-lab "Link to this heading")

NVIDIA Isaac Lab is a unified and modular framework for robot learning. Isaac Lab also provides standalone scripts to launch applications. Isaac for Healthcare is an extension of Isaac Lab, and therefore follows its [scene creation](https://isaac-sim.github.io/IsaacLab/main/source/api/lab/isaaclab.scene.html) guidelines.

Tip

If you are new to Isaac Lab, we recommend taking these courses first. They provide a strong foundation in Isaac Lab concepts, scene creation, and simulation workflows. They are highly recommended as a reference for building custom applications and understanding the underlying principles used in this chapter.

- [Train Your First Robot in Isaac Lab](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-OV-46+V1)
- [Train Your Second Robot in Isaac Lab](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-OV-47+V1)

When building a new application, itâs often helpful to start from a related template. This teleoperation example is a great choice, because it allows you to build simple interactive environments, and test your robotâs ability to interact with the scene.

---

### Code Walkthrough[#](#code-walkthrough "Link to this heading")

Have a look at the following code files within the I4H workflows repo:

#### Key Files Structure[#](#key-files-structure "Link to this heading")

- [`workflows/robotic_ultrasound/scripts/simulation/environments/teleoperation/teleop_se3_agent.py`](https://github.com/isaac-for-healthcare/i4h-workflows/blob/920bccf90fd3fe765545c01696491b73ce58d0c7/workflows/robotic_ultrasound/scripts/simulation/environments/teleoperation/teleop_se3_agent.py) - Contains our teleoperation application, with the default task `Isaac-Teleop-Torso-FrankaUsRs-IK-RL-Rel-v0`
- Environment Configuration - Searching for this task will lead us to the [environment configuration file](https://github.com/isaac-for-healthcare/i4h-workflows/blob/8c8a055fefeaf25e31b3d9dcefd28f9a546f54aa/workflows/robotic_ultrasound/scripts/simulation/exts/robotic_us_ext/robotic_us_ext/tasks/ultrasound/approach/config/teleop/ik_rel_env_cfg.py#L36) and class called `ModFrankaUltrasoundTeleopEnv`
- `RoboticIkRlEnvCfg` Class - Defines all Markov Decision Process (MDP) related components, and contains the [scene](https://github.com/isaac-for-healthcare/i4h-workflows/blob/8c8a055fefeaf25e31b3d9dcefd28f9a546f54aa/workflows/robotic_ultrasound/scripts/simulation/exts/robotic_us_ext/robotic_us_ext/tasks/ultrasound/approach/config/franka/franka_manager_rl_env_cfg.py#L398C7-L398C24) for our application
- Scene Configuration - A closer look at the [scene](https://github.com/isaac-for-healthcare/i4h-workflows/blob/8c8a055fefeaf25e31b3d9dcefd28f9a546f54aa/workflows/robotic_ultrasound/scripts/simulation/exts/robotic_us_ext/robotic_us_ext/tasks/ultrasound/approach/config/franka/franka_manager_rl_env_cfg.py#L55) reveals that we create a basic scene with:

  - Ground plane
  - Lights
  - Rigid table
  - Phantom model
  - Robot

Any of these assets can be exchanged by overriding the variable in a derived scene. This is a good place to test your own assets.

Tip

For more details on gym environments and how to register them, see [Isaac Labâs tutorials](https://isaac-sim.github.io/IsaacLab/main/source/tutorials/03_envs/register_rl_env_gym.html).

---

### Teleoperation Logic[#](#teleoperation-logic "Link to this heading")

The core [teleoperation logic](https://github.com/isaac-for-healthcare/i4h-workflows/blob/8c8a055fefeaf25e31b3d9dcefd28f9a546f54aa/workflows/robotic_ultrasound/scripts/simulation/environments/teleoperation/teleop_se3_agent.py#L367) reads the command from the input device and converts it to an action in the robotâs end-effector space.

---

### Code Instructions[#](#code-instructions "Link to this heading")

#### Launching the Teleoperation Script[#](#launching-the-teleoperation-script "Link to this heading")

The process launches:

1. **Ultrasound simulation application** - receiving pose information from IsaacSim, publishing simulated ultrasound B-mode frames
2. **Isaac Sim application window** - with our robotic ultrasound environment, listening to keyboard input to drive the robot
3. **Visualization application** - to show the three simulated visual data-streams: room camera, wrist camera and ultrasound simulation

From your i4h-workflows folder, run the command below to launch teleoperation:

```
conda activate robotic\_ultrasound
(
python -m simulation.examples.ultrasound\_raytracing &
python -m simulation.environments.teleoperation.teleop\_se3\_agent --enable\_cameras &
python -m utils.visualization &
wait
)
```

#### Process Termination[#](#process-termination "Link to this heading")

**Process Termination**: Use **Ctrl+C** followed by running the script below to cleanly terminate all distributed processes.

```
./workflows/robotic\_ultrasound/reset.sh
```

---

### Teleoperation With Keyboard[#](#teleoperation-with-keyboard "Link to this heading")

Use the controls below to control the robot arm during teleoperation.

#### Keyboard Controller for SE(3): Se3Keyboard[#](#keyboard-controller-for-se-3-se3keyboard "Link to this heading")

```
Reset all commands: R
Toggle gripper (open/close): K
Move arm along x-axis: W/S
Move arm along y-axis: A/D
Move arm along z-axis: Q/E
Rotate arm along x-axis: Z/X
Rotate arm along y-axis: T/G
Rotate arm along z-axis: C/V
```

---

### Teleoperation Code Deep Drive & Video Walkthrough[#](#teleoperation-code-deep-drive-video-walkthrough "Link to this heading")

See the video below for an example of the intended workflow.

In this video, we explore the key objects that enable teleoperation in the application. We discuss registering our environment with gym, before we detail our environment and scene configuration classes. These classes allow to build the scene programatically, and define how assets in the scene can be manipulated and articulated. Finally, we discuss the logic of the teleoperation script, which allows us to move the robotic arm in six degrees of freedom about the tool center point.

On this page
