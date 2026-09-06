# Accessing Data[#](#accessing-data "Link to this heading")

## Installing ROS 2 Humble[#](#installing-ros-2-humble "Link to this heading")

In this lesson, you will learn how to stream sensor data from Isaac Sim to ROS 2, enabling advanced data processing and visualization. You will set up the ROS 2 environment, integrate ROS 2 Bridge extensions, and configure ActionGraphs to facilitate data streaming.

By the end of this lesson, you will be able to visualize sensor data in RViz and ensure seamless communication between Isaac Sim and ROS 2.

Note

**Note**
For this module, we use the [Running Native ROS](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/install_ros.html#running-native-ros) method on Ubuntu. Follow the instructions under: **Running Native ROS > ROS 2 > Ubuntu 22.04 > Humble**.

### Learning Objectives[#](#learning-objectives "Link to this heading")

- **Install and configure ROS 2 Humble** for integration with Isaac Sim.
- **Create ActionGraphs** for streaming RGB and lidar data to ROS 2.
- **Configure ROS 2 Bridge** extensions to enable data communication.
- **Visualize sensor data** using RViz for real-time monitoring.
- **Troubleshoot common issues** related to data streaming and visualization.

## Bridging Isaac Sim and ROS 2[#](#bridging-isaac-sim-and-ros-2 "Link to this heading")

We need to take a quick moment to prepare the simulation environment to integrate with ROS 2, enabling advanced data streaming and control capabilities. This section will guide you through how to configure your workspace and launch Isaac Sim with ROS 2 support, setting the stage for seamless communication between your robot simulations and ROS 2 applications.

By the end of this section, youâll be ready to stream sensor data and control your robot using ROS 2, paving the way for more complex robotics projects.

---

### Preparing for ROS 2 Integration[#](#preparing-for-ros-2-integration "Link to this heading")

With our sensors added to **SimpleRobot**, weâre going to stream the data from Isaac Sim to ROS 2. Before we relaunch Isaac Sim, we need to confirm that ROS 2 Humble is installed on your system.

1. Check ROS 2 Installation:

   - Visit the [ROS 2 Humble](https://docs.ros.org/en/humble/index.html) installation page to verify installation instructions.
   - For this module, ensure you are using version **22.04**.
   - Install using the method best suited for your system, typically through Debian packages if youâre on Ubuntu 22.04
2. Refer to our [Isaac Sim Installation](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/install_ros.html#running-native-ros) docs for further installation notes
3. After installation of ROS 2, install the **vision\_msgs\_package** required by ROS 2 Bridge

---

### Relaunching Isaac Sim With ROS 2[#](#relaunching-isaac-sim-with-ros-2 "Link to this heading")

After confirming ROS 2 is installed, letâs reopen Isaac Sim to change the environment and enable streaming to ROS 2.

4. Open a terminal window.
5. Source your ROS workspace by running the command: source /opt/ros/humble/setup.bash

   - This command ensures that the ROS2 environment is correctly configured and allows you to use ROS 2 commands.
6. Run a simple ros2 command in the terminal to verify that ROS 2 is sourced and installed correctly.

   - For example, the command ros2 topic list should output a couple of default values if ROS 2 is sourced correctly. We will cover this command in later modules.
7. Use the terminal to launch Isaac Sim with the command:./isaac-sim.sh This might take a little longer to load.

---

### Loading Your Project[#](#loading-your-project "Link to this heading")

**Isaac Sim 4.2**

8. Once Isaac Sim is running, open your saved project file from the previous lesson by selecting **File > Open Recent**.  
9. If desired, open a second viewport by selecting **Window > Viewport > Viewport 2** in the menu bar.

**Isaac Sim 4.5**

8. Once Isaac Sim is running, open your saved project file from the previous lesson by selecting **File > Open Recent**.  
9. If desired, open a second viewport by selecting **Window > Viewports >** in the menu bar, and checking both **Viewport 1** and **Viewport 2**.

- Set your perspective view as needed for your project.

---

### Enabling ROS 2 Bridge Extension[#](#enabling-ros-2-bridge-extension "Link to this heading")

10. Go to **Window > Extensions** to open the *Extension Manager.*
11. Search â**ROS2**â. The ROS 2 Bridge extension should already be enabled, but if not, enable it now.

    - The ROS 2 Bridge extension provides OmniGraph nodes suitable for robotics tasks.
    - Enabling this extension within Isaac Sim to facilitate communication between your simulation and ROS 2.

By following these steps, you have prepared your environment for integrating Isaac Sim with ROS 2, allowing you to stream sensor data and control your robot using ROS 2 capabilities.

## Accessing 2D Lidar Data[#](#accessing-2d-lidar-data "Link to this heading")

For the last section in this module, weâre going to stream lidar sensor data from Isaac Sim to ROS 2 for advanced visualization and analysis. This section will guide you through creating an ActionGraph specifically for lidar data, configuring nodes to read and publish lidar beams, and synchronizing data with the simulationâs timestamp. Youâll connect these nodes to ensure accurate data streaming and adjust settings to visualize the lidar output in RViz effectively.

By the end of this section, youâll be able to monitor environmental interactions using lidar data, enhancing your robotâs perception capabilities within the simulation environment.

---

### Setting Up the Lidar Data Stream[#](#setting-up-the-lidar-data-stream "Link to this heading")

Note

Before proceeding, ensure the simulation in Isaac Sim is stopped.

1. Create a new **ActionGraph** and rename it to **ROS2\_LidarStream**.
2. Add **Nodes** to the Graph:

   - **Isaac Read lidar Beams Node:** Search for and add this node to the graph. It will read data from the lidar sensor.
   - **ROS 2 Publish Laser Scan Node:** Add this node to publish lidar data to ROS 2.
   - **Isaac Read Simulation Time Node:** Add this node to synchronize data with the simulationâs timestamp.
   - **On Playback Tick Node:** Add this node to ensure data is processed every frame.

---

### Configuring the Nodes[#](#configuring-the-nodes "Link to this heading")

First, letâs configure **Isaac Read Lidar Beams Node**.

3. Set the **LidarPrim** target to your lidar sensor by selecting â**Add Target**â and searching for â**lidar**â. This node calculates all necessary information from the lidar.
4. Next, connect relevant outputs from the **Isaac Read Lidar Beams Node** to inputs on the **ROS 2 Publish Laser Scan** node.

   - Connect âOn Playback Tickâ to the Isaac Read lidar Beams node.
   - Connect âIsaac Read Simulation Timeâ to the Timestamp input on ROS 2 Publish Laser Scan.
5. In **ROS 2 Publish Laser Scan**, you can change the name of the sensor that is sent by changing the **TopicName** if you have many sensors.
6. Change the **TopicName** to **scan\_lidar**

Take note of the FrameID, as it will be used in RViz for visualization (e.g., âsim\_lidarâ).

---

Warning

This video contains strobe effects/rapidly flashing images.

### Running and Visualizing in RViz[#](#running-and-visualizing-in-rviz "Link to this heading")

7. Start Simulation: Press **Play** in Isaac Sim to start streaming data.
8. Next, verify that the data is streaming. Open a **terminal** and source the workspace source /opt/ros/humble/setup.bash
9. Run ros2 topic list to see active topics, including the scan topic.
10. Run rviz2 in your terminal to open RViz.
11. Change the **Fixed Frame** option in RViz to match the **Topic** noted earlier (e.g., âscan\_lidarâ).
12. In the bottom left window, select **Add**, switch to the **By Topic** tab, select â**laser scan**â, and press **OK** to add lidar sensor in RViz.
13. Finally, observe the lidar data. You should see red dots representing detected objects in the viewport.

Note

If your lidar sensor is too low, it might detect parts of your robot, such as the wheels. Adjust its height in Isaac Sim if necessary.

---

### Driving and Observing[#](#driving-and-observing "Link to this heading")

Note

In RViz, you will see the environment moving around a stationary robot rather than seeing your robot moving around the environment.

14. Use your keyboard in Isaac Sim to drive the robot around and observe the obstacles in the environment.

By completing these steps, you have successfully integrated 2D lidar data streaming from Isaac Sim to ROS 2 and visualized it using RViz. This allowed you to monitor environmental interactions as your robot navigates its surroundings.

**SAVE**

Go to **File > Save** to save your work!

## Review[#](#review "Link to this heading")

In this lesson, you successfully integrated Isaac Sim with ROS 2, allowing you to stream sensor data for advanced processing. You installed and configured ROS 2 Humble, created ActionGraphs for RGB and lidar data streaming, and visualized this data in RViz.

### Learning Objectives[#](#id1 "Link to this heading")

- **Installed and configured ROS 2 Humble** for use with Isaac Sim.
- **Created ActionGraphs to stream** RGB and lidar data to ROS 2.
- **Configured ROS 2 Bridge extensions** for seamless communication.
- **Visualized sensor data in RViz**, enhancing real-time monitoring capabilities.
- **Troubleshoot issues** related to streaming and visualization.

---

### Quiz[#](#quiz "Link to this heading")

1. Which command should you run in the terminal to verify that ROS2 Humble is installed correctly?

   1. âros2 âcheckInstallâ
   2. âros2 launch isaac\_sim.launchâ
   3. âros2â
   4. âsource /opt/ros/humble/setup.bashâ

Answer

**C**  
Running the simple command âros2â will confirm whether ROS2 Humble is installed on your system. This is a quick way to verify that ROS2 is set up correctly before integrating it with Isaac Sim.

2. Which node in an ActionGraph is responsible for streaming RGB data from the robotâs camera to ROS2?

   1. Isaac Create Render Product
   2. ROS2 Camera Helper
   3. On Playback Tick
   4. Isaac Read Simulation Time

Answer

**B**  
The ROS2 Camera Helper Node is responsible for streaming RGB data from the robotâs camera to ROS2. This node connects the camera feed to ROS2, enabling real-time data transmission for further processing or visualization.

3. What role does the ROS2 Bridge extension play in Isaac Sim?

   1. It controls robot movement directly.
   2. It improves the visual quality of simulations.
   3. It enables communication between Isaac Sim and ROS2 through OmniGraph nodes.
   4. It allows adding more sensors to the robot.

Answer

**C**  
The ROS2 Bridge extension provides the necessary OmniGraph nodes that allow data communication between Isaac Sim and ROS2, enabling seamless integration for tasks like sensor data streaming.

4. How can you visualize RGB camera data from Isaac Sim in RViz?

   1. Use âros2 topic echo /rgbâ in a terminal window
   2. Add a Camera Display in RViz by selecting âImageâ under By Topic tab
   3. Enable âDraw Pointsâ in Raw USD Properties of the camera sensor
   4. Increase the resolution of the camera feed

Answer

**B**  
To visualize RGB camera data in RViz, you need to add a Camera Display by selecting âImageâ under the By Topic tab in RVizâs display settings. This allows real-time monitoring of the sensorâs output.

5. If Lidar data is not appearing correctly in RViz, what could be a potential issue?

   1. The cameraâs field of view is overlapping with the Lidar sensor
   2. The Lidar sensor is not facing the correct direction
   3. The FrameID in RViz does not match the FrameID set in Isaac Simâs Lidar configuration
   4. The Lidar rotation speed is too slow

Answer

**C**  
If Lidar data is not displaying correctly in RViz, one common issue could be that the FrameID used in RViz doesnât match the FrameID set during Lidar configuration in Isaac Sim. Ensuring these IDs match is crucial for proper visualization.

On this page
