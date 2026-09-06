# Isaac ROS[#](#isaac-ros "Link to this heading")

## What Is Isaac ROS?[#](#what-is-isaac-ros "Link to this heading")

Now we know what ROS is, but what is Isaac ROS?

NVIDIA Isaacâ¢ ROS (Robot Operating System) is a collection of NVIDIAÂ® CUDAÂ®-accelerated computing packages and AI models designed to streamline and expedite the development of advanced AI robotics applications.

Letâs explore the key aspects of Isaac ROS:

### Purpose and Components[#](#purpose-and-components "Link to this heading")

Isaac ROS provides a toolkit of packages that integrate NVIDIAâs hardware acceleration capabilities with the ROS 2 framework. These packages cover a wide range of robotics functionalities, including:

- Localization and mapping (cuVSLAM)
- 3D scene reconstruction (nvBlox)
- Trajectory planning (cuMotion)
- Pose estimation and tracking (FoundationPose)

### Integration With ROS 2[#](#integration-with-ros-2 "Link to this heading")

Isaac ROS packages are fully compliant with ROS 2, allowing users to easily incorporate them into their existing ROS applications. This compatibility ensures that developers can take advantage of NVIDIAâs acceleration technologies without having to abandon their ROS-based workflows.

### Reference Implementation[#](#reference-implementation "Link to this heading")

An important aspect of Isaac ROS is that it serves as a reference implementation. While the packages are designed for use within the ROS 2 framework, NVIDIA also intends for them to be examples that developers can study, dissect, and potentially adapt to their own frameworks if theyâre not using ROS.

We provide reference workflows for [manipulation](https://developer.nvidia.com/isaac/manipulator) and [mobility](https://developer.nvidia.com/isaac/perceptor). These are essentially end-to-end solutions built using Isaac ROS packages and open-source ROS packages. They serve as starting points or examples for users to build upon or customize for their specific needs.

### Leveraging NVIDIA Technologies[#](#leveraging-nvidia-technologies "Link to this heading")

Isaac ROS packages make use of various NVIDIA technologies, such as:

- TensorRT
- Libargus
- Other NVIDIA-specific tools and libraries

By integrating these technologies, Isaac ROS abstracts away much of the complexity, allowing roboticists to leverage NVIDIAâs hardware acceleration without needing to become experts in these underlying technologies.

By providing these accelerated ROS 2 packages, we aim to enable more intelligent and capable robotic systems, leveraging hardware acceleration to push the boundaries of whatâs possible in robotics development and help roboticists everywhere.

On this page
