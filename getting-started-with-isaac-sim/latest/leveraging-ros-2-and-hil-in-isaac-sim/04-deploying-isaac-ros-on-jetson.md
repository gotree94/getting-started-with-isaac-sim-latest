# Deploying Isaac ROS on Jetson[#](#deploying-isaac-ros-on-jetson "Link to this heading")

## Overview[#](#overview "Link to this heading")

In this module, we will begin our **Hardware-in-the-Loop (HIL)** demonstration. With the NVIDIA Jetson environment fully configured and operational, itâs time to integrate Isaac Sim and Isaac ROS to test and evaluate the Jetson Orinâs performance in real-world scenarios.

**What Youâll Do in This Module:**

- Use **Isaac Sim** to emulate sensors equivalent to those on a real robot.
- Shift computational loads to the NVIDIA Jetson Orin for HIL testing.
- Implement the same image segmentation configuration used in the SIL module.
- Evaluate the performance of the **PeopleSemSegNet** model on the Jetson Orin.

By the end of this module, you will be able to:

1. Use **Isaac ROS** with Isaac Sim to enable HIL testing.
2. Run an image segmentation package on the Jetson Orin using simulated camera data.
3. Monitor system performance with **jtop** and analyze diagnostic outputs.
4. Visualize segmentation results and evaluate software performance on the Jetson.

This module solidifies your understanding of HIL testing and its practical applications in robotics, preparing you to efficiently test and validate robotics software using simulation and hardware integration. Letâs get started!

## Setting Up Isaac Sim Environment[#](#setting-up-isaac-sim-environment "Link to this heading")

In this section, we will set up the Isaac Sim environment to test the image segmentation package using simulated data. The sample environment includes people and the Nova Carter robot, a wheeled autonomous mobile robot (AMR) equipped with a camera. This camera will capture images from the robotâs perspective, which will then be processed for segmentation.

![../_images/isaac-sim-sil-hil.png](../_images/isaac-sim-sil-hil.png)

Isaac Sim Environment[#](#id2 "Link to this image")

### What Youâll Do in This Section[#](#what-you-ll-do-in-this-section "Link to this heading")

- Enable the ROS 2 Bridge for communication between Isaac Sim and the Isaac ROS image segmentation package.
- Load the Isaac ROS sample scene, which includes the Carter robot, people, and other objects for testing.

### Enable ROS 2 Bridge[#](#enable-ros-2-bridge "Link to this heading")

To enable communication between Isaac Sim and ROS 2, follow these steps:

1. Refer to the instructions on the â[ROS and ROS 2 Installation](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_ros.html)â page.
2. For this module, we focus on running ROS without a system-level install.
3. Use the instructions under âROS 2 > Humble > Linux,â as this is the ROS version currently supported by NVIDIA Isaac ROS.

### Set Up Your Environment[#](#set-up-your-environment "Link to this heading")

**Isaac Sim 4.2**

Open a terminal and enter the following commands:

```
export isaac\_sim\_package\_path=$HOME/.local/share/ov/pkg/isaac-sim-4.2.0
export RMW\_IMPLEMENTATION=rmw\_fastrtps\_cpp
# Can only be set once per terminal.
# Setting this command multiple times will append the internal library path again potentially leading to conflicts
export LD\_LIBRARY\_PATH=$LD\_LIBRARY\_PATH:$isaac\_sim\_package\_path/exts/omni.isaac.ros2\_bridge/humble/lib
# Run Isaac Sim
$isaac\_sim\_package\_path/isaac-sim.sh
```

**Isaac Sim 4.5**

Open a terminal and enter the following commands:

```
export
isaac\_sim\_package\_path=$HOME/isaacsim
export RMW\_IMPLEMENTATION=rmw\_fastrtps\_cpp
# Can only be set once per terminal.
# Setting this command multiple times will append the internal library path again potentially leading to conflicts
export
LD\_LIBRARY\_PATH=$LD\_LIBRARY\_PATH:$isaac\_sim\_package\_path/exts/isaacsim.ros2.bridge/humble/lib
# Run Isaac Sim
$isaac\_sim\_package\_path/isaac-sim.sh
```

Once entered, the Isaac Sim application will launch. A smaller window might pop up asking if you would like to âForce Quitâ or âWaitâ - click on **Wait**. Wait for the âIsaac Sim App is loadedâ message in the terminal.

### Load the Sample Scene[#](#load-the-sample-scene "Link to this heading")

In the Isaac Sim GUI, follow these steps:

1. Navigate to

   - Isaac Sim 4.2.0: **Isaac Examples > ROS2 > Isaac ROS > Sample Scene**.
   - Isaac Sim 4.5.0: **Robotics Examples > ROS2 > Isaac ROS > Sample Scene**
2. Select this option to load the sample environment.
3. Wait approximately 30 seconds for the scene to load completely.

### Explore the Scene[#](#explore-the-scene "Link to this heading")

After loading, you can move around in the scene using your mouse or keyboard. Observe objects such as:

- People and a forklift within the environment.
- The Carter robot with its mounted camera, which will capture images for segmentation.

At this point, you have successfully set up Isaac Sim with ROS 2 enabled and loaded a sample scene containing a robot and objects for testing!

## HIL and Analyzing Results on the Jetson Platform[#](#hil-and-analyzing-results-on-the-jetson-platform "Link to this heading")

In this section, we replicate the steps from the SIL module to execute the **PeopleSemSegNet** model for segmenting images captured by the robotâs camera in simulation. This time, however, Isaac ROS is running on your NVIDIA Jetson, showcasing **Hardware-in-the-Loop (HIL)** in action. While running Isaac ROS on the Jetson, we will also observe GPU utilization increasing as the system processes data.

### What Youâll Do in This Section[#](#id1 "Link to this heading")

- Check active ROS topics being communicated from Isaac Sim to the Jetson.
- Start the image segmentation package using a ROS 2 launch file.
- Visualize segmentation results using `rqt_image_view`.
- Test segmentation by interacting with the simulated environment.

### List ROS Topics[#](#list-ros-topics "Link to this heading")

Note

On the main computer shown here, we are running Isaac Sim, but the terminal on top is remotely connected to the Jetson Orin Nano.

1. Ensure Isaac Sim is running with the sample scene loaded.
2. Ensure your NVIDIA Jetson is running and you are remotely connected to it..
3. Once inside the Isaac ROS container, and before starting the simulation, enter the following command to list active ROS topics:

```
ros2 topic list
```

4. You should see only a few default topics since the simulation is paused.
5. Press **Play** in the Isaac Sim window to start the simulation.
6. Run the `ros2 topic list` command again. This time, you should see additional topics such as `/front_stereo_camera/left/image_rect_color`, which correspond to data streams from the robotâs camera.

### Run the Image Segmentation Package[#](#run-the-image-segmentation-package "Link to this heading")

1. In the same terminal, use this command to launch the image segmentation package:

```
ros2 launch isaac\_ros\_unet isaac\_ros\_unet\_tensor\_rt\_isaac\_sim.launch.py engine\_file\_path:=${ISAAC\_ROS\_WS}/isaac\_ros\_assets/models/peoplesemsegnet/deployable\_quantized\_vanilla\_unet\_onnx\_v2.0/1/model.plan input\_binding\_names:=['input\_1:0']
```

2. This command starts processing images from Isaac Sim using the PeopleSemSegNet model.
3. After a few seconds, you should see messages like âNode was started,â indicating that all required nodes are running successfully.

### Run the Isaac ROS Jetson Launcher[#](#run-the-isaac-ros-jetson-launcher "Link to this heading")

1. Open a second terminal on your desktop and remotely connect to your Jetson Orin:

```
ssh username@.local
```

2. Run this command to execute the Isaac ROS Jetson launcher:

```
cd ${ISAAC\_ROS\_WS}/src/isaac\_ros\_common && ./scripts/run\_dev.sh
```

3. From inside the container, run:

```
ros2 launch isaac\_ros\_jetson\_stats jtop.launch.py
```

### Visualize Segmentation Results[#](#visualize-segmentation-results "Link to this heading")

1. In the terminal running the Isaac ROS container on your desktop, run this command to start `rqt`:

```
rqt
```

2. Once `rqt` opens, navigate to:

   - **Plugins > Robot Tools > Diagnostics Viewer:**

![rqt Diagnostics Viewer][image12]

- You will see diagnostics from your Jetson under âjtop.â

  - **Plugins > Visualization > Image View:**

![rqt imageviewer][image13]

- A new window will open.

![no topic chosen][image14]

- Select a topic to visualize:

  - Start with input image topics like `/front_stereo_camera/left/image_rect_color` to see what the robotâs camera captures.

    - Switch to segmentation output topics to view results where people are highlighted with a red segmentation mask.

### Test Segmentation in Simulation[#](#test-segmentation-in-simulation "Link to this heading")

![final result][image15]

1. In Isaac Sim, select one of the simulated people with your mouse and manually move them to a new location while keeping them visible from the robotâs camera.
2. Observe how their position updates in real-time within `rqt_image_view`, confirming that segmentation continues to work dynamically.
3. Observe the GPU usage rising on the NVIDIA Jetson from the `rqt` diagnostic view.
4. Stop the simulation by pressing **Stop** in Isaac Sim and note that no new data appears in `rqt_image_view` since image streams stop when simulation is paused.
5. Restart the simulation by pressing **Play** and repeat this experiment to explore further.

---

::{card}  
By completing these steps, you have successfully tested image segmentation using simulated data from Isaac Sim working Hardware in the Loop (HIL). The PeopleSemSegNet model processed images from the robotâs camera, segmented people in real-time, and output results as ROS topics, which were visualized using `rqt_image_view`.

Review

In this module, we demonstrated how to run the Isaac ROS Image Segmentation package on a Jetson Orin. We performed segmentation on a simulated camera stream from Isaac Sim running on separate computer, and showed how the two systems communicate via ROS. This showcased the power of **Hardware-in-the-Loop (HIL)** testing by building upon the foundational concepts from earlier SIL modules.

What We Accomplished in This Module

- **Loaded a sample scene in Isaac Sim** featuring the Carter robot equipped with a camera, capturing images from the robotâs perspective to serve as input for the segmentation process.
- **Used a ROS 2 launch file to execute the PeopleSemSegNet model**, processing images from the simulated camera to perform semantic segmentation and identify people in the scene.
- **Utilized rqt**, a popular ROS debugging tool, to visualize diagnostic messages and image data, observing raw input images and segmentation results where people were highlighted in red.
- **Interacted with the simulation by moving objects** (e.g., people) and observed real-time updates in segmentation results, demonstrating dynamic performance.

Key Takeaways

This module highlighted how HIL testing bridges simulation and real-world applications by processing simulated data as if it were real-world input. By using Isaac Sim to emulate sensor data and deploying it on Jetson Orin, we validated the functionality of the **PeopleSemSegNet** model under realistic conditions.

Quiz

1. What is the main purpose of using Isaac Sim in Hardware-in-the-Loop (HIL) testing?

   1. To simulate sensors and provide input for hardware testing
   2. To replace the need for real hardware
   3. To visualize only the robotâs movements
   4. To eliminate the need for software validation

Answer

**A**  
Isaac Sim is used in HIL testing to simulate sensor data and provide realistic inputs to test hardware, such as the Jetson Orin. This allows developers to validate software functionality without relying on physical sensors.

2. How did dynamic testing in simulation demonstrate the PeopleSemSegNet modelâs performance?

   1. By running the model without any input data
   2. By testing it with physical sensors instead of simulated ones
   3. By showing real-time updates as objects moved in the scene
   4. By visualizing static images only

Answer

**C**  
Dynamic testing involved interacting with the simulation, such as moving objects like people, and observing how segmentation results updated in real time. This demonstrated the modelâs ability to handle dynamic environments effectively.

3. What was a key benefit of running HIL tests on the Jetson Orin?

   1. It eliminated the need for simulation tools like Isaac Sim
   2. It replaced all software testing with hardware-only tests
   3. It validated hardware performance while running the software on simulated camera input
   4. It required no prior SIL testing

Answer

**C**  
HIL testing on the Jetson Orin allowed us to validate software performance by processing simulated sensor inputs as if they were real-world data. This approach ensures robust testing before deploying robotics applications in actual environments.

### Leveraging ROS 2 and Hardware-in-the-Loop in Isaac Sim[#](#leveraging-ros-2-and-hardware-in-the-loop-in-isaac-sim "Link to this heading")

This module has introduced you to the foundational concepts and practical applications of Hardware-in-the-Loop (HIL) testing for robotics development using NVIDIA Isaac Sim and ROS 2 on the NVIDIA Jetson platform. You have learned how HIL bridges the gap between simulation-based testing and real-world deployment by integrating simulated environments with physical hardware.

#### Learning Objectives[#](#learning-objectives "Link to this heading")

- **Explored HIL Concepts:** Learned how HIL enhances development by validating software performance on actual hardware while simulating environmental interactions.
- **Configured Jetson Environment:** Set up and configured the NVIDIA Jetson Orin for HIL testing, ensuring efficient communication between the Jetson and simulated environments.
- **Integrated Isaac ROS:** Used Isaac ROS to run image segmentation packages, leveraging the PeopleSemSegNet model to process simulated camera data in real-time.
- **Visualized Results:** Utilized tools like `rqt_image_view` to visualize segmentation results and monitor system performance using `jtop`.
- **Applied HIL in Practical Scenarios:** Dynamically tested robotics software in simulated environments, observing real-time updates and optimizing performance based on feedback.

Congratulations! You have successfully completed this module, mastering the skills needed to integrate simulation with physical hardware for efficient robotics development. This achievement marks a significant milestone in your learning journey, preparing you for more advanced applications in robotics development.

On this page
