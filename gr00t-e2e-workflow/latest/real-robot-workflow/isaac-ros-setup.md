# Isaac ROS Setup on Thor[#](#isaac-ros-setup-on-thor "Link to this heading")

Set up the Isaac ROS development environment on the computer connected to the Unitree G1.

This setup provides the `isaac-ros` CLI, the ROS 2 workspace, Isaac ROS source repositories, the containerized Isaac ROS environment, RealSense support, and the package installation path used by the real robot workflow.

Source Documentation

The steps in this section summarize the Isaac ROS setup pages used by the G1 teleoperation and deployment package references. For advanced setup options, reference the official documentation:

- [Isaac ROS Getting Started](https://nvidia-isaac-ros.github.io/getting_started/index.html)
- [Isaac ROS RealSense Setup](https://nvidia-isaac-ros.github.io/getting_started/sensors/realsense_setup.html)
- [Unitree G1 Teleop Bringup](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_physical_ai/isaac_ros_unitree_g1_teleop_bringup/index.html)
- [Unitree G1 GR00T Deploy](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_physical_ai/isaac_ros_unitree_g1_gr00t/index.html)

## Initialize the Compute Platform[#](#initialize-the-compute-platform "Link to this heading")

Configure your Jetson AGX Thor for the real robot workflow.

1. Complete the [Jetson AGX Thor Quick Start Guide](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/quick_start.html). Return here after completing the Quick Start Guide.
2. Install the JetPack components from the [Jetson AGX Thor JetPack setup guide](https://docs.nvidia.com/jetson/agx-thor-devkit/user-guide/latest/setup_jetpack.html#install-the-whole-jetpack-components). Return here after completing the JetPack setup guide.
3. Verify the JetPack release:

   ```
   cat /etc/nv\_tegra\_release
   ```

   Confirm the output includes `R38 (release), REVISION: 4.0`.
4. Set the Thor power mode to `MAXN`. Refer to the [power mode controls guide](https://docs.nvidia.com/jetson/archives/r38.4/DeveloperGuide/SD/PlatformPowerAndPerformance/JetsonThor.html#power-mode-controls) for more details.

   ```
   sudo /usr/sbin/nvpmodel -m 0
   ```

## Create the Isaac ROS Workspace[#](#create-the-isaac-ros-workspace "Link to this heading")

1. Create a directory for the Isaac ROS workspace.

   ```
   mkdir -p "$HOME/workspaces/isaac\_ros-dev/src"
   ```
2. Add the workspace environment variable:

   ```
   echo "export ISAAC\_ROS\_WS=\"\${ISAAC\_ROS\_WS:-$HOME/workspaces/isaac\_ros-dev/}\"" >> ~/.bashrc
   ```
3. Reload your environment:

   ```
   source ~/.bashrc
   ```
4. Clone the required Isaac ROS source repositories:

   ```
   cd ${ISAAC\_ROS\_WS}/src
   git clone https://github.com/NVIDIA-ISAAC-ROS/isaac\_ros\_physical\_ai.git
   git clone https://github.com/NVIDIA-ISAAC-ROS/isaac\_ros\_robots.git
   git clone https://github.com/NVIDIA-ISAAC-ROS/isaac\_ros\_data\_tools.git
   ```

## Configure CloudXR Firewall Ports[#](#configure-cloudxr-firewall-ports "Link to this heading")

CloudXR requires certain network ports to be open.

Depending on your firewall configuration, you may need to open them manually.
For Quest and PICO headsets (WebXR Client), at the minimum, the CloudXR runtime and WebSocket Secure proxy ports must be open.

If `ufw` is enabled, run the following commands:

1. Open the following ports:

   ```
   sudo ufw allow 47998/udp
   sudo ufw allow 49100,48322/tcp
   ```
2. If you run the WebXR client from source, also allow the web server ports:

   ```
   sudo ufw allow 8080,8443/tcp
   ```

## Install and Initialize the Isaac ROS CLI[#](#install-and-initialize-the-isaac-ros-cli "Link to this heading")

These instructions are based on the Docker workflow from Isaac ROS docs. For baremetal or virtual environment workflows, refer to the [official Isaac ROS documentation](https://nvidia-isaac-ros.github.io/getting_started/index.html#initialize-isaac-ros-cli).

1. Set the host locale to UTF-8:

   ```
   locale # check for UTF-8
   sudo apt update && sudo apt install locales
   sudo locale-gen en\_US en\_US.UTF-8
   sudo update-locale LC\_ALL=en\_US.UTF-8 LANG=en\_US.UTF-8
   export LANG=en\_US.UTF-8
   locale # verify settings
   ```
2. Install Apt repository dependencies:

   ```
   sudo apt update && sudo apt install curl gnupg
   sudo apt install software-properties-common
   sudo add-apt-repository universe
   ```
3. Source the NVIDIA Isaac ROS Apt Repository for Jetson AGX Thor.

   ```
   k="/usr/share/keyrings/nvidia-isaac-ros.gpg"
   curl -fsSL https://isaac.download.nvidia.com/isaac-ros/repos.key | sudo gpg --dearmor \
   | sudo tee -a $k > /dev/null
   f="/etc/apt/sources.list.d/nvidia-isaac-ros.list"
   sudo touch $f
   s="deb [signed-by=$k] https://isaac.download.nvidia.com/isaac-ros/release-4.5 noble-jetpack main"
   grep -qxF "$s" $f || echo "$s" | sudo tee -a $f
   sudo apt-get update
   ```
4. Install the Isaac ROS CLI:

   ```
   sudo apt-get install isaac-ros-cli
   ```
5. Configure Docker to use the NVIDIA runtime by default. This command updates `/etc/docker/daemon.json` with the NVIDIA container runtime settings:

   ```
   sudo nvidia-ctk runtime configure --runtime=docker --set-as-default
   ```
6. Optionally, confirm by reviewing the file:

   ```
   cat /etc/docker/daemon.json
   ```

   Expected output:

   ```
   {
   "runtimes": {
   "nvidia": {
   "args": [],
   "path": "nvidia-container-runtime"
   }
   },
   "default-runtime": "nvidia"
   }
   ```
7. Add your username to the docker group to avoid using `sudo` with Docker commands.

   ```
   sudo usermod -aG docker $USER
   newgrp docker
   ```
8. Restart Docker so the runtime configuration takes effect:

   ```
   sudo systemctl daemon-reload && sudo systemctl restart docker
   ```
9. Verify Docker and the NVIDIA runtime. After running these commands, confirm that:

   - Docker lists available runtime entries
   - `hello-world` exits successfully
   - The GPU runtime check prints `NVIDIA runtime OK`

   ```
   docker info | grep -E "Runtimes|Default Runtime"
   docker run --rm hello-world
   docker run --rm --gpus all ubuntu:24.04 bash -lc 'echo "NVIDIA runtime OK"'
   ```

Tip

If `nvidia` does not appear as the default runtime, return to the Docker setup steps and correct the runtime configuration before continuing. If you update `/etc/docker/daemon.json`, restart Docker again so the change takes effect.

10. Verify the GPU is accessible from the container:

```
docker run --rm --gpus all ubuntu:24.04 nvidia-smi
```

Expected Output

Expected output is similar to the following:

```
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.00 Driver Version: 580.00 CUDA Version: 13.0 |
+-----------------------------------------+------------------------+----------------------+
| GPU Name Persistence-M | Bus-Id Disp.A | Volatile Uncorr. ECC |
| Fan Temp Perf Pwr:Usage/Cap | Memory-Usage | GPU-Util Compute M. |
| | | MIG M. |
|=========================================+========================+======================|
| 0 NVIDIA Thor On | 00000000:01:00.0 Off | N/A |
| N/A 37C N/A 5W / N/A | Not Supported | 2% Default |
| | | Disabled |
+-----------------------------------------+------------------------+----------------------+
+-----------------------------------------------------------------------------------------+
| Processes: |
| GPU GI CI PID Type Process name GPU Memory |
| ID ID Usage |
|=========================================================================================|
| No running processes found |
+-----------------------------------------------------------------------------------------+
```

This check verifies that the NVIDIA runtime setup is active for containers. If this fails, complete the Jetson AGX Thor Docker setup guide before continuing, even if Docker is already running.

11. Use Docker mode for this workflow:

```
sudo isaac-ros init docker
```

12. Enable real-time scheduling support for Docker:

```
echo '--ulimit rtprio=99' > ~/.isaac\_ros\_dev-dockerargs
```

This allows the ROS 2 controller manager to run on a real-time thread.

## Configure RealSense Support[#](#configure-realsense-support "Link to this heading")

This workflow uses the Intel RealSense camera mounted in the robotâs head. Make sure to connect the camera according to the [connection setup](real-overview.html#unitree-g1-hardware-overview).

1. Start with the RealSense camera unplugged. Add RealSense udev rules on the host:

   ```
   wget https://raw.githubusercontent.com/realsenseai/librealsense/v2.56.3/config/99-realsense-libusb.rules && \
   sudo mv 99-realsense-libusb.rules /etc/udev/rules.d/ && \
   sudo udevadm control --reload-rules && sudo udevadm trigger && echo "Successfully added udev rules"
   ```

   Verify that the command output includes `Successfully added udev rules`.

   Now connect the RealSense camera. If you have a Thor backpack, plug the RealSense directly into Thor. If you have an external Thor, you need a USB extension cable to connect the RealSense to Thor. Refer to the photo of the desired configuration below.
2. Configure the Isaac ROS Docker image to include the Physical AI workflow and RealSense support:

   ```
   mkdir -p ~/.config/isaac-ros-cli && tee ~/.config/isaac-ros-cli/config.yaml << 'EOF'
   docker:
   image:
   additional\_image\_keys:
   - gr00t\_workflow
   - realsense
   EOF
   ```

   This sets up the Isaac ROS CLI to use two Docker layers:

   - The `realsense` Docker layer adds the drivers needed for the RealSense camera.
   - The `gr00t_workflow` Docker layer adds all ROS packages required for this workflow.
3. Build and activate the Isaac ROS environment with RealSense support:

   ```
   isaac-ros activate --build-local
   ```
4. Verify camera detection. This command returns information about all connected RealSense cameras.

   ```
   rs-enumerate-devices
   ```
5. You can also use the `realsense-viewer` tool to verify the camera is detected. The `realsense-viewer` tool requires a graphical environment. To use it, connect the host to a monitor or use a remote desktop connection.

   ```
   realsense-viewer
   ```

   If the RealSense camera is not detected, refer to the [Troubleshooting Guide](../troubleshooting.html) for hardware setup checks before continuing.

## What Happens Next[#](#what-happens-next "Link to this heading")

After this setup, continue to [G1 Introduction and Safety](g1-introduction-and-safety.html). The Isaac ROS source repositories are in `${ISAAC_ROS_WS}/src`. The `gr00t_workflow` Docker layer includes the workflow ROS packages used in later lessons:

- `ros-$ROS_DISTRO-isaac-ros-unitree-g1-teleop-bringup`
- `ros-$ROS_DISTRO-isaac-ros-unitree-g1-recorder`
- `ros-$ROS_DISTRO-isaac-ros-unitree-g1-gr00t`

On this page
