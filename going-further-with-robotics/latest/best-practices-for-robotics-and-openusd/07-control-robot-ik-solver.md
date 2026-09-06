# Control the Robot Using an IK Solver[#](#control-the-robot-using-an-ik-solver "Link to this heading")

We have prepared an Isaac Sim standalone script that would control the robot that you made earlier using an inverse kinematics solver. This lets us command a position for the end of the robot, while the solver determines the individual joint positions to determine that pose.

We will launch a standalone package to demonstrate robot simulation control and conclude todayâs session with a competition, manually controlled pick and place.

## Launch the Follow Target Example[#](#launch-the-follow-target-example "Link to this heading")

1. Close any other instances of Isaac Sim.
2. Open the `LOUSD_RBP_example/tasks` folder in the course assets, and locate the **follow\_target.py** file.
3. Open this file in a code editor. For example, right click and choose **Open With Text Editor**.
4. Change the asset path in **line 51** to the path of the completed warehouse scene you created earlier.
5. Confirm the prim paths on **lines 57 and 71** match the end effector prim path of your file.
6. Save the file.
7. Open a new terminal.
8. Run this command:

```
cd ~/LOUSD\_RBP\_example
```

7. Launch the package using the following command in the terminal:

```
~/IsaacSim-main/\_build/linux-x86\_64/release/python.sh follow\_target\_example.py
```

8. Use the camera controls to frame the robot. By default, the camera may be looking at the wall.

Tip

If Isaac Sim closes then shuts down, itâs likely that the asset paths from step 4 need to be updated.

## Controlling the robot[#](#controlling-the-robot "Link to this heading")

![alt text](../_images/ur_gripper_demo_2.gif)

1. Locate the **TargetCube** prim in the Stage panel. This primâs position and orientation controls the end of the robot.
2. To change the orientation, simply drag the TargetCube (located in /World/TargetCube) using the 3D widget transformation tool.
3. To control the robot arm end effectorâs orientation, switch to the Rotate tool.
4. To control the gripper, press the âNâ key to switch the state. For example, if the gripper was open, pressing âNâ would close it.

If it is in a position that the robot cannot reach, a warning will be issued to the console.

## Challenge[#](#challenge "Link to this heading")

Use the target cube, and the gripper to pick up the toolbox, after you pick it up and lift it off the ground.

On this page
