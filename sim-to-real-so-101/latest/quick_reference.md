# Quick Reference[#](#quick-reference "Link to this heading")

Quick commands for common tasks. For detailed explanations, see [Calibrating the SO-101](07-calibrating-so101.html) and [Operating the SO-101](08-operating-so101.html).

## Simulation (teleop and eval) â Docker[#](#simulation-teleop-and-eval-docker "Link to this heading")

Launch the Isaac Sim container for sim teleop and sim policy evaluation:

```
cd ~/Sim-to-Real-SO-101-Workshop
xhost +
docker run --name teleop -it --privileged --gpus all -e "ACCEPT\_EULA=Y" --rm --network=host \
-e "PRIVACY\_CONSENT=Y" \
-e DISPLAY \
-v /dev:/dev \
-v /run/udev:/run/udev:ro \
-v $HOME/.Xauthority:/root/.Xauthority \
-v ~/docker/isaac-sim/cache/kit:/isaac-sim/kit/cache:rw \
-v ~/docker/isaac-sim/cache/ov:/root/.cache/ov:rw \
-v ~/docker/isaac-sim/cache/pip:/root/.cache/pip:rw \
-v ~/docker/isaac-sim/cache/glcache:/root/.cache/nvidia/GLCache:rw \
-v ~/docker/isaac-sim/cache/computecache:/root/.nv/ComputeCache:rw \
-v ~/docker/isaac-sim/logs:/root/.nvidia-omniverse/logs:rw \
-v ~/docker/isaac-sim/data:/root/.local/share/ov/data:rw \
-v ~/docker/isaac-sim/documents:/root/Documents:rw \
-v ~/.cache/huggingface/lerobot/calibration:/root/.cache/huggingface/lerobot/calibration \
-v ./docker/env:/root/env \
-v $(pwd)/source:/workspace/Sim-to-Real-SO-101-Workshop/source \
-v $(pwd)/outputs:/workspace/Sim-to-Real-SO-101-Workshop/outputs \
-v $(pwd)/datasets:/workspace/Sim-to-Real-SO-101-Workshop/datasets \
-v $(pwd)/docker/real/scripts:/workspace/Sim-to-Real-SO-101-Workshop/docker/real/scripts \
teleop-docker:latest
```

Run this container for the client/server GR00T inference workflow.

```
cd ~/Sim-to-Real-SO-101-Workshop
xhost +
docker run -it --rm --name real-robot --network host --privileged --gpus all \
-e DISPLAY \
-v /dev:/dev \
-v /run/udev:/run/udev:ro \
-v $HOME/.Xauthority:/root/.Xauthority \
-v /tmp/.X11-unix:/tmp/.X11-unix \
-v ~/.cache/huggingface/lerobot/calibration:/root/.cache/huggingface/lerobot/calibration \
-v ./docker/env:/root/env \
-v ~/models:/workspace/models \
-v $(pwd)/docker/real/scripts:/Isaac-GR00T/gr00t/eval/real\_robot/SO100 \
real-robot \
/bin/bash
```

## Find Robot Ports[#](#find-robot-ports "Link to this heading")

Inside the `teleop-docker` container:

```
lerobot-find-port
```

When prompted, **disconnect** USB cable and **press Enter**. The tool reports the port (e.g., `/dev/ttyACM0`).

You can either write these down to use for future commands, or assign them to environment variables in your terminal.

```
# Save to environment variables
setenv ROBOT\_PORT=/dev/ttyACM0
setenv TELEOP\_PORT=/dev/ttyACM1
# Set robot IDs (based on your station label)
setenv ROBOT\_ID=orange\_robot
setenv TELEOP\_ID=orange\_teleop
```

## Find Cameras[#](#find-cameras "Link to this heading")

Inside the `teleop-docker` container:

```
lerobot-find-cameras opencv
```

Review captured images in `./output/captured_images` to identify gripper vs. external camera indices.

Similar to the robot ports, you can save these to environment variables in your terminal or enter them manually into commands.

```
# Save to environment variables
setenv CAMERA\_GRIPPER=0
setenv CAMERA\_EXTERNAL=2
```

## Calibrate Leader Arm (Teleop)[#](#calibrate-leader-arm-teleop "Link to this heading")

Inside `teleop-docker` container:

```
lerobot-calibrate \
--teleop.type=so101\_leader \
--teleop.port=$TELEOP\_PORT \
--teleop.id=$TELEOP\_ID
```

Follow prompts to move joints to middle-of-range, then through full range of motion.

## Calibrate Follower Arm (Robot)[#](#calibrate-follower-arm-robot "Link to this heading")

Inside `teleop-docker` container:

```
lerobot-calibrate \
--robot.type=so101\_follower \
--robot.port=$ROBOT\_PORT \
--robot.id=$ROBOT\_ID
```

## Teleoperation of Real Robot[#](#teleoperation-of-real-robot "Link to this heading")

Inside `teleop-docker` container:

```
lerobot-teleoperate \
--robot.type=so101\_follower \
--robot.port=$ROBOT\_PORT \
--robot.id=$ROBOT\_ID \
--teleop.type=so101\_leader \
--teleop.port=$TELEOP\_PORT \
--teleop.id=$TELEOP\_ID
```

## Common Issues[#](#common-issues "Link to this heading")

See [Troubleshooting Guide](troubleshooting.html) for detailed solutions.

| Symptom | Likely Cause |
| --- | --- |
| All motors missing | Power not connected |
| One motor missing | Loose motor cable, or just needs restart |
| `Torque_Enable` error | Power cycle robot |
| Camera index changed | Re-run `lerobot-find-cameras` |
| Port not found | Check USB, run `lerobot-find-port` |

On this page
