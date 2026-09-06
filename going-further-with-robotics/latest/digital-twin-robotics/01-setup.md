# Setup[#](#setup "Link to this heading")

## Prerequisites[#](#prerequisites "Link to this heading")

### Hardware Requirements[#](#hardware-requirements "Link to this heading")

Please refer to the [Isaac Sim hardware requirements](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html).

### Software Requirements[#](#software-requirements "Link to this heading")

- Ubuntu 22.04
- ROS 2 Humble - install instructions [here](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)
- Download and install Isaac Sim 5.0, 5.1, or build the [open-source repository](https://github.com/isaac-sim/IsaacSim).

  - This course assumes itâs located at `~/isaacsim`. If itâs somewhere else on your machine, just adapt these paths.

#### Isaac Sim ROS Workspaces[#](#isaac-sim-ros-workspaces "Link to this heading")

Download and install the [Isaac Sim ROS Workspaces project](https://github.com/isaac-sim/IsaacSim-ros_workspaces). This course assumes this repo has been cloned into `~/IsaacSim-ros_workspaces`.

Steps to configure [Isaac Sim ROS Workspaces are here](https://docs.isaacsim.omniverse.nvidia.com/5.0.0/installation/install_ros.html#setting-up-workspaces).

#### PyTorch[#](#pytorch "Link to this heading")

Install the correct version of PyTorch for your respective OS and CUDA version
- Run `nvidia-smi` to determine your CUDA version
- Use the selector tool at https://pytorch.org/ to identify the correct version of PyTorch to install based on OS and CUDA version, then run that command.
- Example:
`sh     # For CUDA 12.8:      pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128`

### Gathering Course Assets[#](#gathering-course-assets "Link to this heading")

Download the course assets [here](https://developer.nvidia.com/downloads/Omniverse/learning/Courses/GoingFurtherWithRobotics/sil_digital_twin.zip).

Important

Throughout this course, when launching Isaac Sim, do not source the system ROS in that terminal.

On this page
