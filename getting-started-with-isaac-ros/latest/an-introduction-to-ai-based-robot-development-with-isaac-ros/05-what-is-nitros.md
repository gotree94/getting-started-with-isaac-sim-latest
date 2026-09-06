# NITROS[#](#nitros "Link to this heading")

## What Is NITROS?[#](#what-is-nitros "Link to this heading")

NVIDIA Isaac Transport for ROS (NITROS) is the implementation of two hardware-acceleration features introduced with ROS 2 Humble-type adaptation and type negotiation.

Type adaptation enables ROS nodes to work in a data format optimized for specific hardware accelerators. The adapted type is used by processing graphs to eliminate memory copies between the CPU and the memory accelerator.

Through type negotiation, different ROS nodes in a processing graph can advertise their supported types and the ROS framework can choose data formats, resulting in ideal performance.

### Purpose and Problem Solving[#](#purpose-and-problem-solving "Link to this heading")

Most middleware frameworks, including ROS, typically work with CPU-based messages. This becomes problematic when working with hardware accelerators like GPUs, VICs, or PVAs. Without NITROS, data processed on these accelerators would need to be copied back to CPU memory before being sent to the next node, causing inefficiencies.

![../_images/nitrosgif.gif](../_images/nitrosgif.gif)

NVIDIA Isaac Transport for ROS package for hardware-acceleration friendly movement of messages.[#](#id1 "Link to this image")

NITROS addresses a significant limitation in traditional ROS communication. Letâs talk about how.

### How NITROS Works[#](#how-nitros-works "Link to this heading")

NITROS introduces a more efficient way of handling data. It allows sending handles between nodes instead of full data copies.

- If the receiving node understands NITROS, it can use the GPU handle directly, eliminating memory copies
- For nodes that donât support NITROS, the framework automatically converts the message to a standard ROS format

This approach makes NITROS both optimal when possible and compatible when necessary.

### NITROS Technologies[#](#nitros-technologies "Link to this heading")

NVIDIA offers three NITROS-related technologies: CUDA with NITROS, NITROS Bridge, and PyNITROS.

#### [CUDA With NITROS](https://nvidia-isaac-ros.github.io/concepts/nitros/cuda_with_nitros.html)[#](#cuda-with-nitros "Link to this heading")

- Allows developers to write their own ROS nodes that can send and receive GPU buffers
- Compatible with other NITROS nodes developed by NVIDIA

#### [NITROS Bridge](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_nitros/isaac_ros_nitros_bridge/index.html)[#](#nitros-bridge "Link to this heading")

- Designed for inter-process communication
- Initially introduced to work with ROS 1 users who hadnât migrated to ROS 2
- Uses a form of CUDA IPC (Inter-Process Communication)

#### [PyNITROS](https://nvidia-isaac-ros.github.io/concepts/nitros/pynitros/index.html)[#](#pynitros "Link to this heading")

- Supports Python users
- Allows sending raw PyTorch buffers to C++ nodes without memory copies

### Benefits of NITROS[#](#benefits-of-nitros "Link to this heading")

NITROS represents a significant improvement in ROS 2 performance for NVIDIA hardware, allowing developers to leverage GPU acceleration more efficiently in their robotics applications. By leveraging NITROS, youâll be able to:

- Reduce unnecessary memory copies between CPU and GPU
- Improve GPU utilization by avoiding synchronization bottlenecks
- Enable faster processing of large data structures like point clouds or 4K images
- Maintain compatibility with existing ROS tools and nodes

On this page
