# Data Export: MCAP to LeRobot[#](#data-export-mcap-to-lerobot "Link to this heading")

In this lesson, weâll convert recorded MCAP sessions into a LeRobot dataset for GR00T fine-tuning.

To do that, weâll:

- **Install** the MCAP-to-LeRobot converter on the host.
- **Convert** one or more recording sessions into a single LeRobot dataset.
- **Verify** that output paths and dataset metadata are valid for training.

## Install the Converter[#](#install-the-converter "Link to this heading")

Note

The converter is pure Python and does not require a GPU or a ROS installation. It can run on either an x86\_64 workstation or Jetson AGX Thor.

The MCAP-to-LeRobot converter does not require a ROS installation. You can run it either inside the Isaac ROS container or directly on the host.

Tip

If you want to skip data collection and train from precollected data, start from the provided [real robot dataset](../resources/models-and-datasets.html#real-robot-workflow), [`nvidia/GR00T-N1.7-AppleToPlate`](https://huggingface.co/datasets/nvidia/GR00T-N1.7-AppleToPlate), which is already published in LeRobot format.

The asset flow is:

```
dataset -> training -> checkpoint
dataset + checkpoint -> LEAPP export -> model (ONNX)
```

```
hf download \
nvidia/GR00T-N1.7-AppleToPlate \
--repo-type dataset \
--local-dir ${ISAAC\_ROS\_WS}/recordings/lerobot\_output
```

## Install the Converter With uv[#](#install-the-converter-with-uv "Link to this heading")

The `isaac_ros_data_tools` repository is cloned during [Isaac ROS Setup on Thor](isaac-ros-setup.html).

Note

If you run the converter on an x86 workstation instead of Thor, run the clone step from [Isaac ROS Setup on Thor](isaac-ros-setup.html) in your workstation workspace before continuing.

1. Install the converter:

   ```
   cd ${ISAAC\_ROS\_WS}/src/isaac\_ros\_data\_tools/isaac\_ros\_mcap\_lerobot\_converter
   curl -LsSf https://astral.sh/uv/install.sh | sh
   uv venv --python 3.12 .venv
   source .venv/bin/activate
   uv pip install -e .
   ```

## Convert a Recording Session[#](#convert-a-recording-session "Link to this heading")

1. Run the following script to convert the rosbags of your recording sessions.
   Replace `<session_name>` with the name of your recording session.

   To combine multiple recording sessions, pass multiple `--rosbags-dir`
   arguments to convert all sessions into a single LeRobot dataset. Episodes
   are numbered sequentially across sessions in the order listed.

   ```
   mcap-to-lerobot \
   --rosbags-dir ${ISAAC\_ROS\_WS}/recordings/<session\_name> \
   --output-dir ${ISAAC\_ROS\_WS}/recordings/lerobot\_output \
   --task "move the apple to the plate" \
   --fps 30 \
   --robot-type unitree\_g1
   ```

   Tip

   `mcap-to-lerobot` fails if the directory specified by `--output-dir` already exists.

   In that case, remove the existing output directory first:

   ```
   rm -r ${ISAAC\_ROS\_WS}/recordings/lerobot\_output
   ```

   See also

   Refer to the [isaac\_ros\_mcap\_lerobot\_converter reference](https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_data_tools/isaac_ros_mcap_lerobot_converter/index.html) for full CLI details and `--fps`/`sync_rate` guidance.

## Validate Output for Fine-Tuning[#](#validate-output-for-fine-tuning "Link to this heading")

1. Check the dataset directory and metadata before training:

   ```
   ls ${ISAAC\_ROS\_WS}/recordings/lerobot\_output
   ```
2. Confirm the output is ready:

   - Output directory contains four folders: `data/`, `meta/`, `videos/`, and `images/`.
   - Output directory contains `new_embodiment_config_defaults.py` for GR00T fine-tuning.
   - `data/`, `meta/`, and `videos/` contain data.
   - `images/` exists but is empty.
   - Episode count aligns with source sessions.
   - `fps` in metadata matches the recorder `sync_rate` (30 Hz by default).

## Key Takeaways[#](#key-takeaways "Link to this heading")

You converted MCAP sessions into a LeRobot dataset and prepared it for GR00T fine-tuning. The next step is policy fine-tuning on this converted dataset.

On this page
