# Run Locomotion Policy With Teleoperation[#](#run-locomotion-policy-with-teleoperation "Link to this heading")

In this module weâll launch both a full body controller for the humanoid robot, and a teleoperation script to run alongside our simulation.

In total, we will have three terminal windows open:

- One running Isaac Sim
- One for the full body robot controller through ROS 2
- One for teleoperation through ROS 2

## Set up the Controller[#](#set-up-the-controller "Link to this heading")

Now that the asset is set up, letâs run our policy through ROS 2.

1. Open a new terminal.
2. Source the system ROS and the ROS 2 workspace using these commands:

```
source /opt/ros/humble/setup.sh
source ~/IsaacSim-ros\_workspaces/humble\_ws/install/setup.bash
```

3. Launch the **h1\_fullbody\_controller** ROS 2 package by running the following command.

```
ros2 launch h1\_fullbody\_controller h1\_fullbody\_controller.launch.py
```

4. Wait until the full body controller is initialized before continuing. This line will be printed in the terminal when ready to move on: `Initializing H1FullbodyController`

Note

Make sure to start the full body controller before starting the simulation, otherwise the robot will fall over.

## Set up the Teleoperation[#](#set-up-the-teleoperation "Link to this heading")

Checkpoint

If you had any troubles with these steps, load the completed environment checkpoint file:  
`h1_ros_locomotion_warehouse/h1_ros_locomotion_policy_tutorial.usd`

1. In Isaac Sim, open the USD file with the robot and scenario you created earlier.
2. Press the **Play** button to start the simulation.
3. Open another terminal window.
4. Run the commands below to source ROS, and use teleop\_twist\_keyboard to publish Twist messages using the commands below.

```
source /opt/ros/humble/setup.sh
ros2 run teleop\_twist\_keyboard teleop\_twist\_keyboard
```

## Control the robot[#](#control-the-robot "Link to this heading")

You can now control the H1 humanoid robot using your keyboard!

This ROS2 package computes observations and actions using the ROS messages that we are publishing above and the flat terrain locomotion policy. When no command velocities are received, the robot will stand still and maintain balance.

Try the controls and see if the robot moves as expected. Make sure youâre clicked into the teleoperation terminal before pressing these commands.

- Forward: i
- Forward + Turn Left: u
- Forward + Turn Right: o
- Turn Left: j
- Turn Right: l
- Stand Still: k

![H1 robot teleoperation controls](../_images/isim_5.0_full_tut_gui_rl_ros_controller_5.gif)

Note: this video is sped up for demonstration purposes

Important

If your robot falls over or you stop the simulation, follow these steps to reset. In short, Stop the Isaac Sim install and re-run the full body controller.

1. Press **Stop** on the Isaac Sim simulation.
2. Restart the Full Body Controller terminal. In the terminal running that command, press **Ctrl+C** to stop the command, up arrow to see the most recent command, and hit enter to run it again.

## Troubleshooting Tips[#](#troubleshooting-tips "Link to this heading")

1. If the robot leans forward and backward, then falls face-first, the policy (full body controller) likely isnât running. Make sure the full body controller is running before starting the Isaac Sim simulation.
2. If the robot explodes or behaves wildly, make sure to stop Isaac Sim, then reset the full body controller, before starting simulation.
3. Reset all terminals as shown above before playing the Simulation.
4. Double check the OmniGraphs - particularly that **On Playback Tick** nodes were replaced with **On Physics Step** nodes.

## Bonus[#](#bonus "Link to this heading")

Now that the teleoperation is working, you might want to observe the robot from another point of view.

If youâd like a challenge, consider adding another camera parented to the robot, to change the point of view.

At a high-level:

1. Add a new camera.
2. Parent it to a rigid body from the robot.
3. Change the viewport to this camera.

## Review[#](#review "Link to this heading")

Congratulations, youâve completed the course! We hope this has given you a deeper understanding how leveraging SIL techniques to validate and test policies in simulation before deploying to hardware.

On this page
