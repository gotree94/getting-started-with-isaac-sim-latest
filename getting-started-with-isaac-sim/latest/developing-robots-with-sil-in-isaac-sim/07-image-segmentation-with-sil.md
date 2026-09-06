# Image Segmentation With Simulation[#](#image-segmentation-with-simulation "Link to this heading")

## Overview[#](#overview "Link to this heading")

In this module, we will integrate the **Isaac ROS image segmentation package** with a simulated environment in Isaac Sim. Using images captured from a simulated camera mounted on a robot, we will demonstrate how **Software-in-the-Loop** (SIL) enables testing and validating software in a controlled virtual setting. This approach is applicable to any robot type, making it a versatile method for robotics development.

By running the `PeopleSemSegNet` model on simulated images, we will see how SIL can be used to replicate real-world scenarios, test perception algorithms, and refine robotics software without requiring physical hardware. This module builds on the work completed in previous modules, where we tested the same image segmentation package on pre-recorded data.

**At the end of this module, you will:**

- Understand how to use Isaac ROS with Isaac Sim to enable SIL.
- Run an image segmentation package using simulated camera data.
- Visualize segmentation results and evaluate the performance of the software.

This module solidifies your understanding of SIL and its practical applications in robotics development, preparing you to test and validate software efficiently using simulation.

## Setting up Isaac Sim Environment[#](#setting-up-isaac-sim-environment "Link to this heading")

In this section, we will set up the Isaac Sim environment to test the image segmentation package using simulated data. The sample environment includes people and the Nova Carter robot, a wheeled autonomous mobile robot (AMR) equipped with a camera. This camera will capture images from the robotâs perspective, which will then be processed for segmentation.

**In this section, weâll:**

- Enable the **ROS 2 Bridge** for communication between Isaac Sim and the Isaac ROS image segmentation package.
- Load the **Isaac ROS sample scene**, which includes the Carter robot, people and other objects for testing.

### Enable ROS 2 Bridge[#](#enable-ros-2-bridge "Link to this heading")

1. To enable communication between Isaac Sim and ROS 2, follow the steps on the [**ROS and ROS 2 Installation page**](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_ros.html).

   - For this module, we focus on running ROS without a system-level install.
   - Use the instructions under **ROS 2 > Humble > Linux** as this is the ROS version currently supported by NVIDIA Isaac ROS.
2. Open a **terminal** and set up your environment by entering the following commands:

```
export isaac\_sim\_package\_path=$HOME/.local/share/ov/pkg/isaac-sim-4.2.0
export RMW\_IMPLEMENTATION=rmw\_fastrtps\_cpp
# Can only be set once per terminal.
# Setting this command multiple times will append the internal library path again potentially leading to conflicts
export LD\_LIBRARY\_PATH=$LD\_LIBRARY\_PATH:$isaac\_sim\_package\_path/exts/omni.isaac.ros2\_bridge/humble/lib
# Run Isaac Sim
$isaac\_sim\_package\_path/isaac-sim.sh
```

Once entered, the Isaac Sim application will launch. A smaller window might pop up asking if you would like to **Force Quit** or **Wait** - click on Wait. Wait for the **Isaac Sim App is loaded** message in the **terminal**.

### Load the Sample Scene[#](#load-the-sample-scene "Link to this heading")

In Isaac Sim, using the top navbar, navigate to **Isaac Examples > ROS2 > Isaac ROS > Sample Scene**.

4. Select this option to **load** the sample environment.
5. Wait for the scene to load completely. This can take about 30 seconds.

### Explore the Scene[#](#explore-the-scene "Link to this heading")

- After loading, you can move around in the scene using your mouse or keyboard.
- Observe objects such as people and a forklift within the environment.
- The Carter robot is also present in this scene with its mounted camera, which will capture images for segmentation.

---

At this point, you have successfully set up Isaac Sim with ROS 2 enabled and loaded a sample scene containing a robot and objects for testing. In the next section, we will run the image segmentation package using this simulated environment as input data instead of pre-recorded data (rosbags).

## SIL for Image Segmentation[#](#sil-for-image-segmentation "Link to this heading")

In this section, weâll run the sample scene in Isaac Sim and observe how ROS topics are communicated between the simulated environment and the image segmentation package. Weâll then execute the **PeopleSemSegNet** model to perform segmentation on images captured by the robotâs camera in simulation and visualize the results using a ROS debugging tool.

This demonstrates Software-in-the-Loop (SIL) in action, where software is tested using simulated data.

**In this section, weâll:**

- List active ROS topics being communicated from Isaac Sim.
- Start the image segmentation package using a ROS 2 launch file.
- Visualize segmentation results using **rqt\_image\_view**.
- Test segmentation by interacting with the simulated environment.

### List ROS Topics[#](#list-ros-topics "Link to this heading")

1. Ensure **Isaac Sim** is running with the **sample scene loaded** (as set up in the previous section).
2. Open a **terminal** and launch the **Isaac ROS development container**.

   - We learned how to do this in Module 6, Section 2, âUsing Isaac ROS Development Containerâ in this module.
3. Once youâre inside the Isaac ROS container, and before starting the simulation, **enter the following command** to list active ROS topics:

```
ros2 topic list
```

- You should see only a few default topics at this point since the simulation is paused.

4. Press **Play** in the Isaac Sim window to start the simulation.
5. Run the **ros2 topic list** command again. This time, you should see additional topics such as **/front\_stereo\_camera/left/image\_rect\_color**, which correspond to data streams from the robotâs camera.

### Run the Image Segmentation Package[#](#run-the-image-segmentation-package "Link to this heading")

6. In the same terminal, use the following command to **launch** the image segmentation package:

```
ros2 launch isaac\_ros\_unet isaac\_ros\_unet\_tensor\_rt\_isaac\_sim.launch.py engine\_file\_path:=${ISAAC\_ROS\_WS}/isaac\_ros\_assets/models/peoplesemsegnet/deployable\_quantized\_vanilla\_unet\_v2.0/1/model.plan input\_binding\_names:=['input\_1:0']
```

- This command starts processing images from Isaac Sim using the **PeopleSemSegNet** model.
- After a few seconds, you should see messages like â**Node was started**â, indicating that all required nodes are running successfully.

### Visualize Segmentation Results[#](#visualize-segmentation-results "Link to this heading")

7. Open a second **terminal** and run the following command to **enter the Isaac ROS container** and start **rqt\_image\_view**, a tool for visualizing ROS topic data:

```
cd ${ISAAC\_ROS\_WS}/src/isaac\_ros\_common && ./scripts/run\_dev.sh && ros2 run rqt\_image\_view rqt\_image\_view
```

8. Once **rqt\_image\_view** opens, select a **topic** to visualize:

   - Start with the input image topic (e.g., **/front\_stereo\_camera/left/image\_rect\_color**) to see what the robotâs camera captures.
   - Switch to the segmentation output topic to view results where people are highlighted with a red segmentation mask.

### Test Segmentation in Simulation[#](#test-segmentation-in-simulation "Link to this heading")

9. In Isaac Sim, move one of the simulated people to a new location while keeping them visible from the robotâs camera.
10. Observe how their position updates in real time within **rqt\_image\_view**, confirming that segmentation continues to work dynamically.
11. Stop the simulation by pressing **Stop** in Isaac Sim and note that no new data appears in **rqt\_image\_view** since image streams stop when simulation is paused.
12. Restart the simulation by pressing **Play** and repeat this experiment to explore further.

---

By completing these steps, you have successfully tested image segmentation using simulated data from Isaac Sim. The **PeopleSemSegNet** model processed images from the robotâs camera, segmented people in real-time, and output results as ROS topics, which were visualized using **rqt\_image\_view**. This demonstrates how SIL enables software testing in dynamic, controlled environments without requiring physical hardware.

## Review[#](#review "Link to this heading")

In this module, we demonstrated how to use the Isaac ROS image segmentation package with a simulated environment in Isaac Sim, showcasing Software-in-the-Loop (SIL) in action. This module built upon the foundational work from earlier modules by transitioning from pre-recorded data (rosbags) to real-time image data generated within the simulation.

In this module:

1. **Set Up the Simulation Environment:** We loaded a sample scene in Isaac Sim, featuring the Carter robot equipped with a camera. This camera captured images from the robotâs perspective, providing input for the segmentation process.
2. **Ran the Image Segmentation Package:** Using a ROS 2 launch file, we executed the PeopleSemSegNet model to process images from the simulated camera. The model performed semantic segmentation to identify and segment people in the scene.
3. **Visualized Results:** We used rqt\_image\_view, a popular ROS debugging tool, to visualize both the raw input images and the segmentation results. The tool displayed segmented areas where people were highlighted in red, demonstrating successful software validation.
4. **Dynamic Testing in Simulation:** By interacting with the simulation (e.g., moving objects like people), we observed how segmentation results updated dynamically in real-time. This validated the robustness of SIL for testing perception algorithms under controlled yet dynamic conditions.

## This module highlighted how SIL enables efficient and cost-effective testing of robotics software by leveraging high-fidelity simulations. By processing simulated data as if it were real-world input, we validated the functionality of the PeopleSemSegNet model and gained insights into its performance. This approach is applicable to various robotics tasks, making SIL an invaluable tool for iterative development and testing.[#](#this-module-highlighted-how-sil-enables-efficient-and-cost-effective-testing-of-robotics-software-by-leveraging-high-fidelity-simulations-by-processing-simulated-data-as-if-it-were-real-world-input-we-validated-the-functionality-of-the-peoplesemsegnet-model-and-gained-insights-into-its-performance-this-approach-is-applicable-to-various-robotics-tasks-making-sil-an-invaluable-tool-for-iterative-development-and-testing "Link to this heading")

### Quiz[#](#quiz "Link to this heading")

1. What is the primary advantage of using Software-in-the-Loop (SIL) for image segmentation testing?

   1. It allows testing software in a simulated environment before deploying on physical hardware.
   2. It eliminates the need for simulation tools like Isaac Sim.
   3. It ensures that no further testing is required on real robots.
   4. It only works with pre-recorded data and not live simulations.

Answer

**A**  
SIL enables developers to test and validate software in a simulated environment, such as Isaac Sim, reducing the need for physical prototyping and ensuring functionality before deployment.

2. What is the role of the ROS 2 bridge in SIL testing with Isaac Sim?

   1. It replaces the need for Python scripting in Isaac Sim.
   2. It generates synthetic datasets for training AI models.
   3. It facilitates communication between Isaac Sim and ROS-based systems.
   4. It directly controls physical robot hardware during testing.

Answer

**C**  
The ROS 2 bridge enables seamless communication between Isaac Sim and ROS-based systems, allowing software running in ROS to interact with simulated environments during SIL testing.

3. What does the PeopleSemSegNet model do during SIL testing?

   1. Detects objects and estimates their poses in 3D space.
   2. Segments people in images captured by the robotâs simulated camera.
   3. Generates synthetic data for AI training models.
   4. Reconstructs 3D maps of the robotâs environment.

Answer

**B**  
During SIL testing, the PeopleSemSegNet model processes images from the robotâs simulated camera to identify and segment people, enabling validation of its functionality in a virtual environment.

4. What happens when you pause the simulation in Isaac Sim during SIL testing?

   1. No new image data is sent to ROS topics, stopping segmentation updates.
   2. The segmentation process continues running without interruption.
   3. The robotâs camera automatically switches to real-world input data.
   4. The simulation resets all objects to their original positions.

Answer

**A**  
When the simulation is paused, no new image data is sent from Isaac Sim to ROS topics, halting updates to segmentation results until the simulation resumes.

On this page
