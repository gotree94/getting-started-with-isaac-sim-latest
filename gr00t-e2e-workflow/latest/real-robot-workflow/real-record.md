# Data Recording[#](#data-recording "Link to this heading")

This lesson covers capturing teleoperation demonstrations in MCAP format.

Run this lesson on a Jetson AGX Thor connected to the G1, either as an external system or as a Thor backpack.

Before starting, open a second terminal and keep the teleop stack running in the first terminal.

Tip

Clean Demonstrations
Use the [Teleoperation Data Collection Guide](../shared/teleoperation-data-collection-guide.html) while recording. Save only clean runs, use slow and smooth motions, keep the body fixed, vary grasp styles, and record at least 200 successful demonstrations for the apple-to-plate dataset.

Warning

Having at least two people work on this workflow is recommended:

- One person for teleoperation
- One person to monitor the robot for safety purposes

## Workspace Prep[#](#workspace-prep "Link to this heading")

1. Before recording, recreate the physical [workspace setup](g1-introduction-and-safety.html#workspace-setup).
2. Keep the table, object appearance, robot pelvis position, and head pose consistent across the dataset.
3. On the Thor host, outside the container, confirm the kernel sees the RealSense camera over USB:

   ```
   lsusb | grep -i intel
   ```
4. Inside the Isaac ROS environment, confirm the camera is visible to the container:

   ```
   isaac-ros activate
   rs-enumerate-devices
   ```

   The output should include a connected RealSense with its serial number and firmware version.
5. Confirm the ego-view camera frame in RViz:

   ```
   rviz2
   ```

   Select **Add > By topic > /realsense\_d435\_rgb/color/image\_raw/Image > OK** and verify the workspace is visible before starting the recorder.

## Start the Recorder[#](#start-the-recorder "Link to this heading")

1. Activate Isaac ROS:

   ```
   isaac-ros activate
   ```
2. Run the recorder:

   ```
   ros2 run isaac\_ros\_unitree\_g1\_recorder record -- \
   task\_description:="move the apple to the plate"
   ```
3. Verify that the camera is capturing data. Two methods to check:

   - Use RViz to view camera topics
   - Use a second ROS-sourced terminal to list topics with `ros2 topic list`

   If camera data is not being recorded

   If camera data is not recorded, check the camera connection. To reset, follow this procedure:

   - Stop the ROS recorder app
   - Unplug the RealSense camera
   - Replug the RealSense camera
   - Restart the ROS app
4. Use the terminal UI:

   - Press **Space** to start an episode.
   - Press **Space** again to save.
   - Press **c** to discard.

Recordings are stored in `${ISAAC_ROS_WS}/recordings/`.

Recording Quality

- For high-quality datasets, teleoperate slow movements and keep the robot body fixed.
- After completing the task, move the left hand out of view and hold it still for 2 to 3 seconds before saving the recording.
- For the apple-to-plate task, only the left hand should move and perform the task. Favor side grasps with a bottle-holding-style hand pose so the ego-view camera can see the hand and apple clearly.
- Vary the apple and plate position and orientation between episodes, but keep both reachable while the robot stands still. Keep apple type, plate type, table height, lighting, and camera setup fixed for the baseline dataset.
- Keep the right arm mostly outside the camera field of view. It is acceptable for right-hand fingers to appear occasionally because the right hand may enter view during deployment.
- Keep the baseline dataset focused on clean successful episodes. Add failed-grasp recovery examples only when you intentionally want a broader dataset, and keep them limited so they do not dominate the training signal. Record at least 200 successful episodes.

See also

Refer to the [isaac\_ros\_unitree\_g1\_recorder](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_physical_ai/isaac_ros_unitree_g1_recorder/index.html) documentation for full keyboard reference, launch arguments, recorded topics, services, build-from-source instructions, and troubleshooting.

On this page
