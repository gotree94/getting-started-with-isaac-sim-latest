# Troubleshooting[#](#troubleshooting "Link to this heading")

Use this page when hardware setup, camera access, image streaming, or compute-unit performance issues block the Unitree G1 workflow.

Important

Stop the robot before troubleshooting hardware, cables, network connections, or camera access. Follow manufacturer safety procedures first.

## Hardware Setup Reference[#](#hardware-setup-reference "Link to this heading")

Use the Isaac hardware setup troubleshooting guide for the source troubleshooting reference:

[Open Isaac Hardware Setup Troubleshooting](https://nvidia-isaac-ros.github.io/troubleshooting/hardware_setup.html)

## RealSense Camera Not Found[#](#realsense-camera-not-found "Link to this heading")

### Symptom[#](#symptom "Link to this heading")

Use this section when no RealSense camera is detected and one of these conditions occurs:

- `rs-enumerate-devices` fails without `sudo`, but succeeds with `sudo rs-enumerate-devices`.
- `ros2 launch realsense2_camera rs_launch.py` reports `failed to set power state` or `The requested device ... is NOT found`.
- `realsense-viewer` doesnât detect any RealSense camera.

### Solution 1: Check RealSense Versions[#](#solution-1-check-realsense-versions "Link to this heading")

Follow the RealSense setup instructions and confirm the installed versions for `librealsense`, `realsense2_camera`, and camera firmware.

Run the RealSense ROS node inside the Isaac ROS environment:

```
ros2 launch realsense2\_camera rs\_launch.py
```

Verify that the output reports the expected RealSense ROS and LibRealSense versions.

Check the camera firmware version:

```
rs-enumerate-devices
```

To update camera firmware:

1. Download the recommended D400 firmware binary from the [Intel RealSense firmware releases](https://dev.realsenseai.com/docs/firmware-releases-d400).
2. Extract the binary from the downloaded `.zip` file.
3. Run the firmware update command, replacing `<binary_filename>` with the downloaded binary name:

   ```
   rs-fw-update -f <binary\_filename>
   ```

### Solution 2: Install RealSense Udev Rules[#](#solution-2-install-realsense-udev-rules "Link to this heading")

Verify that `99-realsense-libusb.rules` exists in `/etc/udev/rules.d/`.

If it doesnât exist, run these commands on the host machine before activating the Isaac ROS environment:

```
wget https://raw.githubusercontent.com/IntelRealSense/librealsense/v2.56.3/config/99-realsense-libusb.rules && \
sudo mv 99-realsense-libusb.rules /etc/udev/rules.d/ && \
sudo udevadm control --reload-rules && sudo udevadm trigger && echo "Successfully added udev rules"
```

Confirm that the output includes `Successfully added udev rules`.

## Isaac Teleop UI Partially Disappears After Certificate Acceptance[#](#isaac-teleop-ui-partially-disappears-after-certificate-acceptance "Link to this heading")

### Symptom[#](#id1 "Link to this heading")

After accepting the CloudXR certificate in the headset browser, part of the Isaac Teleop web client UI disappears or fails to render.

### Solution[#](#solution "Link to this heading")

Update the headset OS and native browser, then reopen the Isaac Teleop web client and repeat the certificate acceptance step.

For PICO headsets: software version 5.15.5 was tested with this workflow.

## MuJoCo Teleop Interferes With Real Robot Teleop[#](#mujoco-teleop-interferes-with-real-robot-teleop "Link to this heading")

### Symptom[#](#id2 "Link to this heading")

When starting real robot teleop, a new MuJoCo window opens instead and the simulated robot falls because there is no virtual gantry.

### Cause[#](#cause "Link to this heading")

The MuJoCo teleop terminal or a background MuJoCo process is still running.

### Solution[#](#id3 "Link to this heading")

Close the MuJoCo teleop window and stop the MuJoCo teleop terminal before starting real robot teleop. If the window is closed but the issue continues, stop any background MuJoCo processes and launch real robot teleop again.

## Input Images Must Have an Even Height and Width[#](#input-images-must-have-an-even-height-and-width "Link to this heading")

### Symptom[#](#id4 "Link to this heading")

Isaac ROS nodes terminate when given images with odd width or height. Terminal logs can include:

```
[NitrosImage]: [convert\_to\_custom] Image width/height must be even for creation of gxf::VideoBuffer
terminate called after throwing an instance of 'std::runtime\_error'
what(): [convert\_to\_custom] Odd Image width or height.
```

### Solution[#](#id5 "Link to this heading")

Replace the input image source with one that produces images with even width and height.

## RealSense Does Not Stream IR Stereo Images[#](#realsense-does-not-stream-ir-stereo-images "Link to this heading")

### Symptom[#](#id6 "Link to this heading")

Inside the Isaac ROS environment, `realsense-viewer` doesnât show IR images, but depth images stream. Outside the Isaac ROS environment, no metadata containing projector status is attached to the IR frames.

### Solution[#](#id7 "Link to this heading")

1. Download and install the `dkms` package for Kernel 5.15 from the [librealsense2-dkms release](https://github.com/mengyui/librealsense2-dkms/releases/tag/initial-support-for-kernel-5.15).
2. Download `librealsense2-dkms-dkms_1.3.14_amd64.deb`.
3. Install the package from the download directory:

   ```
   sudo apt install ./librealsense2-dkms-dkms\_1.3.14\_amd64.deb
   ```

Build `librealsense` inside the Isaac ROS environment without CUDA:

```
git clone https://github.com/JetsonHacksNano/installLibrealsense
cd installLibrealsense
./installLibrealsense.sh
./buildLibrealsense.sh --no\_cuda
```

## RealSense Error: Failed to Resolve the Request[#](#realsense-error-failed-to-resolve-the-request "Link to this heading")

### Symptom[#](#id8 "Link to this heading")

Any RealSense tutorial launches, but no images stream. Terminal logs include `Failed to resolve the request`.

### Solution[#](#id9 "Link to this heading")

Confirm that the camera uses the correct firmware. Use the RealSense version and firmware checks in [RealSense Camera Not Found](#realsense-camera-not-found).

## RealSense Incompatible QoS Policy Error[#](#realsense-incompatible-qos-policy-error "Link to this heading")

### Symptom[#](#id10 "Link to this heading")

A RealSense output topic isnât subscribed when a RealSense tutorial launches. Terminal logs report an incompatible QoS policy, such as `RELIABILITY_QOS_POLICY`.

### Solution[#](#id11 "Link to this heading")

Set the QoS policy in the RealSense configuration file used by the launch graph so the RealSense publisher is compatible with the subscribing Isaac ROS node.

For the relevant RealSense image QoS setting, such as `depth_qos` or `color_qos`, use `SYSTEM_DEFAULT`.

## Intel RealSense Camera Accidentally Enables Laser Emitter[#](#intel-realsense-camera-accidentally-enables-laser-emitter "Link to this heading")

### Symptom[#](#id12 "Link to this heading")

The Intel RealSense laser emitter turns on even though `emitter_enabled` is set to `0`.

### Solution[#](#id13 "Link to this heading")

Run this command at runtime:

```
ros2 param set /camera/camera depth\_module.emitter\_enabled 0
```

## ROS\_DOMAIN\_ID Crosstalk[#](#ros-domain-id-crosstalk "Link to this heading")

### Symptom[#](#id14 "Link to this heading")

Use this section when multiple robots, Thor systems, or ROS 2 groups are on the same network and you see unexpected ROS traffic:

- `ros2 topic list` shows topics from another robot or workstation.
- Nodes connect to the wrong robot, camera, recorder, or deployment stack.
- Teleop, recording, or deployment behavior is unexpected or changes when another ROS 2 system starts.

### Cause[#](#id15 "Link to this heading")

ROS 2 uses DDS discovery. When multicast is supported on the network, ROS 2 systems on the same `ROS_DOMAIN_ID` can discover each other across that network. This can cause crosstalk when multiple robots or ROS 2 workflows run in the same lab.

For background, see the ROS 2 Humble documentation for [`ROS_DOMAIN_ID`](https://docs.ros.org/en/humble/Concepts/Intermediate/About-Domain-ID.html).

### Solution[#](#id16 "Link to this heading")

1. Check the active domain ID. The default domain ID is `0`.

   ```
   echo "${ROS\_DOMAIN\_ID:-0}"
   ```
2. Assign a unique domain ID before launching nodes:

   ```
   export ROS\_DOMAIN\_ID=12
   ```
3. Confirm that only the expected nodes and topics are visible:

   ```
   ros2 node list
   ros2 topic list
   ```

Restart any launch files that were started with the wrong domain ID.

## Intel RealSense D455 Infra Camera Capped at 15fps[#](#intel-realsense-d455-infra-camera-capped-at-15fps "Link to this heading")

### Symptom[#](#id17 "Link to this heading")

The Intel RealSense D455 infra camera is capped at 15fps even though itâs specified to run at 90fps.

### Solution[#](#id18 "Link to this heading")

The initial frame rate can be capped around 15fps due to a known RealSense ROS issue. Enable auto exposure:

```
ros2 param set /camera/camera depth\_module.enable\_auto\_exposure true
```

## System Throttled Due to Over-Current[#](#system-throttled-due-to-over-current "Link to this heading")

### Symptom[#](#id19 "Link to this heading")

A display attached to the compute unit reports `System throttled due to over-current`.

### Solution[#](#id20 "Link to this heading")

This warning indicates hardware throttling due to over-current. It can reduce performance and cause jitter or non-deterministic behavior in the robotics pipeline.

Reduce system load, such as lowering image resolutions or frame rates.

To disable over-current throttling for the current boot, run:

```
sudo su
source <(awk '/^function config\_hwmon \*\(\)/ {flag=1} flag; /^}/ && flag {flag=0}' /etc/systemd/nvpower.sh)
config\_hwmon ina3221 curr4\_crit 81900 VDD\_GPU\_SOC
```

This setting doesnât persist across reboots.

Check how many times the system has throttled due to over-current since the last boot:

```
cat "$(find /sys/devices -name oc3\_event\_cnt -print -quit)"
```

If the command returns a non-zero value, the system has throttled due to over-current. The value indicates the number of throttle events.

Warning

Disabling system over-current limits can allow the system to overheat. Hardware should thermal throttle, but testing without limits can affect silicon health. Use this only when you need to find appropriate limits for the workload.

## G1 Workflow Checks[#](#g1-workflow-checks "Link to this heading")

Before changing course workflow commands, verify these G1-specific basics:

- Confirm the G1 and NVIDIA Thor are powered on and connected through the required USB and direct Ethernet cables.
- Confirm cable routing doesnât interfere with the robotâs motion envelope.
- Confirm the RealSense camera connection is visible to the system.
- Confirm the Thor and G1 network interfaces are on the expected network.
- Confirm the robot is in a safe state before restarting teleoperation, recording, or deployment services.

On this page
