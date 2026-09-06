# Setting Up the Jetson Environment[#](#setting-up-the-jetson-environment "Link to this heading")

## Overview[#](#overview "Link to this heading")

The NVIDIA Jetson platform is optimized for edge AI applications by combining high performance with power efficiency. This allows complex AI algorithms to run directly on edge devices without relying on cloud computing.

In this module, we will prepare the hardware and software needed to set up your NVIDIA Jetson Orin Nano. Youâll need a workstation running NVIDIA Isaac Sim.

In this module, we will:

- **Jetson Hardware Specifications and Initial Setup:** First, set up your NVIDIA Jetson, power it up, and install the required Jetpack.
- **Configuring the Jetson Hardware Environment:** Understand the differences between various Jetson models and how to choose the right one for your project.
- **Initializing Isaac ROS on Jetson**: With your NVIDIA Jetson now operational, we will install all necessary tools. To simplify dependency management and guarantee smooth execution, we utilized the pre-configured Isaac ROS development container.

Letâs get started by examining how the Jetson platform can be used on your robotics projects and speed up with its advanced capabilities.

## Jetson Hardware Specifications and Initial Setup[#](#jetson-hardware-specifications-and-initial-setup "Link to this heading")

Welcome to the first section of this module! Here, weâll set up the hardware needed for our initial Hardware-in-the-Loop (HIL) configuration. This setup will ensure your NVIDIA Jetson Orin Nano (or another Jetson Orin model) is ready to handle real-world robotics tasks.

### What Youâll Need[#](#what-you-ll-need "Link to this heading")

- A workstation equipped with an NVIDIA RTX GPU and running Ubuntu 22.04.
- The latest version of [NVIDIA Isaac Sim](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html) installed on your workstation.
- An NVIDIA Jetson Orin Nano Developer Kit (or another Jetson Orin model).
- A router and Ethernet cables for a wired connection.

A wired connection between your workstation and Jetson is essential. Wi-Fi will not suffice due to the large amount of data exchanged during HIL testing.

### Steps to Get Started[#](#steps-to-get-started "Link to this heading")

1. **Prepare Your Workstation**: Ensure your workstation meets the system requirements for Isaac Sim, including an NVIDIA RTX GPU and Ubuntu 22.04.
2. **Set Up the Jetson Orin Nano**: Follow NVIDIAâs official instructions to power on your Jetson device for the first time and flash the latest version of **JetPack 6.1**.

   - Use a microSD card (64GB or larger) or an NVMe SSD for storage.
   - Insert the storage device, connect peripherals (keyboard, mouse, monitor), and power on the Jetson.
3. **Establish a Wired Connection**: Connect your workstation and Jetson through a reliable router using Ethernet cables.

---

**Resources:**  
If this is your first time setting up a Jetson device, refer to NVIDIAâs official guide:  
[NVIDIA Jetson Orin Nano Developer Kit Getting Started](https://developer.nvidia.com/embedded/learn/get-started-jetson-orin-nano-devkit)

By the end of this module, your hardware will be ready for configuring the development environment in the next steps. Letâs get started!

## Configuring the Jetson Hardware Environment[#](#configuring-the-jetson-hardware-environment "Link to this heading")

In this section, we will connect to your NVIDIA Jetson from your computer. Working with the terminal provides better control over your Jetson device while maintaining a clean environment and conserving resources.

### Opening the Terminal on Your Jetson[#](#opening-the-terminal-on-your-jetson "Link to this heading")

You can open the terminal using one of the following methods:

- **Using Keyboard Shortcut:** Press `Ctrl + Alt + T` simultaneously. The terminal will open instantly.
- **Using the Applications Menu:**

  - Click the âShow applicationsâ button in the bottom-left corner of the screen.
  - Type âTerminalâ in the search bar.
  - Click the âTerminalâ icon to open it.

### Connecting to Your Jetson Remotely[#](#connecting-to-your-jetson-remotely "Link to this heading")

To connect to your Jetson from your computer, follow these steps:

1. Open a terminal on your computer.
2. Use SSH to connect to your Jetson by typing:

```
ssh username@remote\_IP
```

Alternatively, use the hostname of your device:

```
ssh username@<hostname>.local
```

### Finding Your Jetsonâs IP Address[#](#finding-your-jetson-s-ip-address "Link to this heading")

Follow these steps to find your Jetsonâs IP address:

1. Open a terminal window on your Jetson.
2. Run the following command:

```
ip addr
```

3. Look for the `inet` address under `eth0` (wired connection). This is your Jetsonâs IP address.

Once you have your IP address, you no longer need a display or keyboard connected to your Jetson. You can work remotely from your computer.

### Installing Jetson-Stats (jtop)[#](#installing-jetson-stats-jtop "Link to this heading")

**Jetson-Stats (jtop)** is an essential tool for monitoring and managing NVIDIA Jetson devices. It provides real-time system performance metrics and helps optimize system resources during development.

### Features of jtop[#](#features-of-jtop "Link to this heading")

- **Real-Time System Monitoring:** Displays CPU/GPU usage, memory consumption, power usage, and temperature in real-time.
- **Interactive Interface:** A user-friendly command-line interface (CLI) similar to âhtop.â
- **Jetson-Specific Insights:** Provides unique data such as power modes, GPU utilization, and thermal warnings.
- **Process Management:** View and manage running processes directly within jtop.
- **Easy Installation and Updates:** Install via pip and keep it updated with NVIDIA JetPack releases.
- **Configuration Management:** Adjust system settings, manage power profiles, and view logs for fine-tuned control.
- **Python API Support:** Integrate monitoring into custom scripts using its Python API.

### Installing jtop[#](#installing-jtop "Link to this heading")

You can install jtop on your Jetson by running:

`sudo pip3 install -U jetson-stats`

If pip3 is not installed, first run:

`sudo apt install python3-pip`

If you see an error about the service not being active, run:

`sudo systemctl restart jtop.service`

If everything is installed correctly, reboot your board. After reconnecting via SSH, type:

`jtop`

`![detailed system performance dashboard][image4]`  
You will now see a detailed system performance dashboard like this!

With jtop installed and configured, you can monitor and optimize your Jetson device effectively for robotics tasks!

## Initializing Isaac ROS on Jetson[#](#initializing-isaac-ros-on-jetson "Link to this heading")

In this section, we will set up Isaac ROS on your NVIDIA Jetson Orin. If you followed the [Software-in-the-Loop (SIL) In Isaac Sim](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-OV-31+V1), many of these steps will feel familiar. However, instead of installing Isaac ROS on your desktop, we will now configure it on the Jetson Orin. Additionally, we will install Isaac ROS Jetson Stats to monitor the live status of your Jetson directly from ROS 2.

### Prepare the Environment on Your Jetson[#](#prepare-the-environment-on-your-jetson "Link to this heading")

### Access the Documentation[#](#access-the-documentation "Link to this heading")

1. Navigate to the [Isaac ROS Image Segmentation documentation](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_image_segmentation/index.html).
2. Open the â[Isaac ROS Unet Quickstart](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_image_segmentation/isaac_ros_unet/index.html#quickstart)â section for detailed setup instructions. These steps are also listed below for convenience.

### Set Up the Development Environment[#](#set-up-the-development-environment "Link to this heading")

1. In a terminal, follow Step 1 in â[Set Up Development Environment](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_image_segmentation/isaac_ros_unet/index.html#quickstart)â to configure your workspace.
2. Clone the `isaac_ros_common` repository into your workspace by running:

```
cd ${ISAAC\_ROS\_WS}/src && \
git clone -b release-3.2 https://github.com/NVIDIA-ISAAC-ROS/isaac\_ros\_common.git isaac\_ros\_common
```

3. Follow Step 3 to install dependencies for sensors if needed (optional).

### Download Quickstart Assets[#](#download-quickstart-assets "Link to this heading")

1. Follow the instructions under âDownload Quickstart Assetsâ in the documentation.
2. This includes downloading the PeopleSemSegNet model, which will be stored in the `isaac_ros_assets` folder within your workspace.

### Install Isaac ROS Jetson[#](#install-isaac-ros-jetson "Link to this heading")

### Access the Documentation[#](#id1 "Link to this heading")

1. Navigate to the [Isaac ROS Jetson](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_jetson/index.html) documentation.
2. Open the â[Isaac ROS Jetson Quickstart](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_jetson/isaac_ros_jetson_stats/index.html)â section and jump directly to Step 3 in the build section. The steps are also listed below.

### Install the Prebuilt Debian Package[#](#install-the-prebuilt-debian-package "Link to this heading")

In the terminal, run:

`sudo apt-get update`

When that is finished, run:

`sudo apt-get install -y ros-humble-isaac-ros-jetson-stats`

### Update jtop Inside the Docker Container[#](#update-jtop-inside-the-docker-container "Link to this heading")

`sudo pip3 install -U jetson-stats`

At this point, you have successfully installed and set up your Jetson Orin with Isaac ROS Unet and Isaac ROS Jetson. These steps ensure that you can use Isaac ROS to test and validate image segmentation software in subsequent sections.

### Launch the Isaac ROS Docker on Your Computer[#](#launch-the-isaac-ros-docker-on-your-computer "Link to this heading")

Note

Launching the container for the first time may up to an hour.

Unlike in the SIL module, we will now use a desktop container on your computer solely to visualize data. If this is your first time using it, follow Step 1; otherwise, skip directly to Step 2.

### Install rqt Robot Monitor[#](#install-rqt-robot-monitor "Link to this heading")

`sudo apt-get install ros-humble-rqt-robot-monitor`

---

By completing this section, you have prepared your Jetson Orin with Isaac ROS and are ready to begin testing and validating image segmentation tasks in subsequent sections!

## Review[#](#review "Link to this heading")

In this module, we set up our NVIDIA Jetson and ran the Isaac ROS Jetson package on it. Focus on how well to set up your board and understand the remote connection using a terminal.

### Key Takeaways[#](#key-takeaways "Link to this heading")

- **NVIDIA Jetson Orin setup**: We establish a connection between our Jetson device and the router, ensuring they are linked properly. Once connected, we access the Jetson remotely by utilizing its specific IP address or hostname, which allows us to manage and control remotely.
- **Remote communication and jtop**: This section details how to install jtop, a straightforward power monitor that features an API and can also function with ROS, allowing it to share your boardâs status.
- **Using the Development Container**: We set up the Isaac ROS container on our Jetson and installed all components necessary to run the demo.

---

### Quiz[#](#quiz "Link to this heading")

1. Why is a wired connection required between your workstation and the Jetson?

   1. To save power on the Jetson device
   2. To handle the large amount of data exchanged
   3. To enable Wi-Fi functionality on the Jetson
   4. To avoid using a router in the setup

Answer

**B**  
A wired connection is required because a significant amount of data is exchanged between the workstation and the Jetson during HIL testing. Wi-Fi connections are not reliable enough for this purpose.

2. What tool can you install to monitor your Jetsonâs performance in real time?

   1. htop
   2. topstats
   3. jetson-stats (jtop)
   4. perfmon

Answer

**C**  
Jetson-Stats (jtop) is a powerful tool for monitoring NVIDIA Jetson devices. It provides real-time metrics like CPU/GPU usage, memory consumption, and power usage, specifically tailored for Jetson systems.

3. What is one benefit of using SSH to connect to your Jetson remotely?

   1. It allows you to use Wi-Fi for HIL testing
   2. It eliminates the need for a router
   3. It lets you work without attaching a display or keyboard to the Jetson
   4. It automatically installs necessary software on your Jetson

Answer

**C**  
SSH enables remote access to your Jetson, allowing you to work on it without needing a dedicated display or keyboard. This makes your setup more efficient and reduces hardware requirements.

On this page
