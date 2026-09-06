# ROS Workspace Setup[#](#ros-workspace-setup "Link to this heading")

## Overview[#](#overview "Link to this heading")

In this module, we will set up our ROS workspaces that are required to run our autonomous software stacks.

### Installing the nova\_carter\_description package[#](#installing-the-nova-carter-description-package "Link to this heading")

The nova\_carter\_description package contains all the TF configurations and robot description details (URDF files) for Nova Carter. These instructionsâadapted for Isaac Sim 4.5 and Isaac ROS 3.2âensure that your environment is properly configured for integrating the robotâs description into your ROS workspace.

1. Set Up Locale for UTF-8 Support

```
locale # check for UTF-8
sudo apt update && sudo apt install locales
sudo locale-gen en\_US en\_US.UTF-8
sudo update-locale LC\_ALL=en\_US.UTF-8 LANG=en\_US.UTF-8
export LANG=en\_US.UTF-8
locale # verify settings
```

2. Install Required Dependencies

```
sudo apt update && sudo apt install gnupg wget
sudo apt install software-properties-common
sudo add-apt-repository universe
```

3. Register NVIDIAâs GPG Key and Repository

   - Choose one of the following options based on your location:

**For the US CDN:**

```
wget -qO - https://isaac.download.nvidia.com/isaac-ros/repos.key | sudo apt-key add -grep -qxF "deb https://isaac.download.nvidia.com/isaac-ros/release-3 $(lsb\_release -cs) release-3.0" /etc/apt/sources.list || \echo "deb https://isaac.download.nvidia.com/isaac-ros/release-3 $(lsb\_release -cs) release-3.0" | sudo tee -a /etc/apt/sources.listsudo apt-get update
```

**For the China CDN:**

```
wget -qO - https://isaac.download.nvidia.cn/isaac-ros/repos.key | sudo apt-key add -grep -qxF "deb https://isaac.download.nvidia.cn/isaac-ros/release-3 $(lsb\_release -cs) release-3.0" /etc/apt/sources.list || \echo "deb https://isaac.download.nvidia.cn/isaac-ros/release-3 $(lsb\_release -cs) release-3.0" | sudo tee -a /etc/apt/sources.listsudo apt-get update
```

4. Install the **nova\_carter\_description** package

   - Finally, install the package with:

```
sudo apt install ros-humble-nova-carter-description
```

Now our ROS workspace has the necessary robot description files to support subsequent modules

#### **Installing the ROS workspace**[#](#installing-the-ros-workspace "Link to this heading")

Letâs configure and build your ROS workspace to ensure it is ready for integrating Isaac ROS packages and running simulation components. We will verify that your terminal is properly sourced, update package dependencies, compile the workspace, and source the built setup file.

1. Open a new terminal and run:

```
source /opt/ros/humble/setup.bash
```

2. Run the following commands to initialize and update `rosdep`:

```
rosdep init
rosdep update
```

3. Navigate to your ROS workspace directory, `sim_control_script_and_carter_ws/ros_ws`, and install the required dependencies from the workspace source:

```
cd sim\_control\_script\_and\_carter\_ws/ros\_ws
rosdep install --from-paths src --ignore-src -r -y
```

5. Build your workspace using `colcon`:

```
colcon build --symlink-install
```

6. After the build completes, source the generated setup file to overlay the new packages into your current shell session:

```
source sim\_control\_script\_and\_carter\_ws/install/setup.bash
```

## Review[#](#review "Link to this heading")

You now have a workspace that is ready to run all the required packages. Our ROS workspace is fully configured and ready to support the necessary packages for our simulation environment. Weâre now prepared to move forward into more advanced modules.

We prepared the simulation environment by installing the nova\_carter\_description package and configuring the ROS workspace. These steps ensured that all necessary robot descriptions, TF configurations, and dependencies are in place for seamless integration with Isaac Sim. With this foundation, weâre ready to move forward into navigation.

On this page
