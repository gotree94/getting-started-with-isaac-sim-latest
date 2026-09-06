# Set Up The Lab[#](#set-up-the-lab "Link to this heading")

## Set Up[#](#set-up "Link to this heading")

### Overview[#](#overview "Link to this heading")

In this module, we will launch and configure Isaac Sim to communicate with ROS 2, enabling seamless data exchange between the simulation environment and your ROS nodes.

By the end of this module, you will have a fully operational Isaac Sim environment integrated with ROS 2, ready for robotics development and testing.

### Installing Isaac Sim[#](#installing-isaac-sim "Link to this heading")

This course assumes youâve pre-installed Isaac Sim 5.1 in `~/isaacsim`. Itâs fine to install it somewhere else, just note commands in this course referencing that folder and modify them accordingly.

If you havenât installed Isaac Sim yet, please follow the official instructions [here](https://docs.isaacsim.omniverse.nvidia.com/5.1.0/installation/index.html).

### Gathering Course Assets[#](#gathering-course-assets "Link to this heading")

1. Download the [course assets here](https://developer.nvidia.com/downloads/Omniverse/learning/Courses/GoingFurtherWithRobotics/sim_interfaces_assets.zip).
2. Download the [example script and ROS workspace for carter navigation here](https://developer.nvidia.com/downloads/Omniverse/learning/Courses/GoingFurtherWithRobotics/sim_interfaces_example.zip).

This includes an example script we will use later in the course.

### Set Environment Variables[#](#set-environment-variables "Link to this heading")

Weâll use these environment variables throughout the course.

You may need to adjust these paths depending on where the course assets and ROS workspace are saved. Please confirm these file paths and run these in terminals used for the course, or add to your .bashrc file.

```
# FastDDS profile file path
export FASTRTPS\_DEFAULT\_PROFILES\_FILE=/workspaces/sim\_control\_script\_and\_carter\_ws/ros\_ws/fastdds.xml
# ROS workspace path
export ISAACSIM\_ROS\_WS=/workspaces/sim\_control\_script\_and\_carter\_ws/ros\_ws
# Course assets path
export ROSCON25\_ASSET\_PATH=/home/ubuntu/Downloads/sim\_interfaces\_assets
```

### Launching Isaac Sim With ROS 2 and Sim Control Extension[#](#launching-isaac-sim-with-ros-2-and-sim-control-extension "Link to this heading")

To begin, we need to set up the Isaac Sim environment to publish robot and environment data to ROS nodes as well as enable the simulation control services extension.

1. Open a new terminal.
2. Navigate to the Isaac Sim 5.1 folder:

```
cd ~/isaacsim
```

3. Run the following commands in the terminal:

```
export ROS\_DOMAIN\_ID=<YOUR\_ID> # Replace <YOUR\_ID> with your own domain ID
./isaac-sim.sh --/isaac/startup/ros\_sim\_control\_extension=True
```

Important

Setting a consistent ROS\_DOMAIN\_ID for all of your terminals is a best-practice to avoid cross-talk with other ROS domains.

4. Wait for Isaac Sim to fully load.

   - Ensure that no errors appear in the terminal before proceeding.
   - It is okay to move on if some warnings appear
5. Note the output of the **ROS Bridge** will show which distro was loaded:  
   `[[ext: isaacsim.ros2.bridge-4.12.4] startup`  
   `Attempting to load system rclpy`  
   `Could not import system rclpy: No module named 'rclpy'`  
   `Attempting to load internal rclpy for ROS Distro: humble`  
   `rclpy loaded`
6. Note this line in the terminal output, a few lines above the âapp readyâ message. This indicates the **ROS Sim Control extension** was loaded properly:  
   `[ext: isaacsim.ros2.sim_control-1.3.2] startup`

This will automatically launch Isaac Sim with the ROS 2 bridge as well as the Simulation Control extension enabled.

### Start a ROS 2 Terminal[#](#start-a-ros-2-terminal "Link to this heading")

#### Understanding the Integration[#](#understanding-the-integration "Link to this heading")

Isaac Sim acts as a simulation platform that can interact with ROS 2 through its built-in tools and extensions. In this step, we will ensure that the simulation environment is configured correctly to publish data such as sensor readings, odometry, and robot states to ROS topics.

### Verify ROS is Sourced[#](#verify-ros-is-sourced "Link to this heading")

We will need several terminal windows to complete this lab. For each that we open, confirm that your terminals are properly sourced for ROS 2:

1. Run the following command:

```
echo $ROS\_DISTRO
```

2. If the output does not display humble, re-run the sourcing command:

```
source /opt/ros/humble/setup.bash
export ROS\_DOMAIN\_ID=<YOUR\_ID> # Replace <YOUR\_ID> with your own domain ID
```

Warning

Do not source ROS 2 in the Isaac Sim terminal as that will cause a Python version mismatch.

Note

Note that Isaac Sim requires Python 3.11 and so the ROS 2 Bridge and sim control extensions use Python 3.11. Meanwhile, the external terminals will be using 3.12.

All communication between Isaac Sim and ROS 2 nodes are handled via ROS 2 topics/services/actions so we can avoid python version mismatch.

By completing this setup, you are laying the foundation for subsequent modules where we will create Action Graphs, configure sensors, and enable advanced robotics functionalities.

On this page
