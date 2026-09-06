# Sim Data Export: HDF5 to LeRobot[#](#sim-data-export-hdf5-to-lerobot "Link to this heading")

In this lesson, weâll convert the teleoperated HDF5 demonstrations from the static apple-to-plate task into LeRobot format for GR00T 1.7 post-training.

To do that, weâll:

- **Set** the dataset directory inside the Arena container.
- **Verify** the HDF5 conversion configuration.
- **Convert** the recorded HDF5 dataset to LeRobot format.
- **Identify** the resulting LeRobot dataset artifacts.

## Convert to LeRobot Format[#](#convert-to-lerobot-format "Link to this heading")

GR00T 1.7 consumes datasets in LeRobot format. The conversion runs inside the standard Base Arena container.

1. Continue in the Arena container terminal from the last module.

   Command for reference, if you need to re-attach or launch container.

   ```
   ./docker/run\_docker.sh
   ```
2. Confirm `DATASET_DIR` is still set to `/datasets/isaaclab_arena/static_apple_tutorial`

   ```
   echo $DATASET\_DIR
   ```

   If itâs not set, reset it:

   ```
   export DATASET\_DIR=/datasets/isaaclab\_arena/static\_apple\_tutorial
   ```

Tip

At this point, you can either choose to use a dataset you recorded yourself, or use ours.

Use these commands below to download the released [simulation dataset](../resources/models-and-datasets.html#simulation-workflow) if you want to skip teleoperation.

3. Download our pre-recorded dataset, [`nvidia/Arena-G1-Static-PickNPlace-Task`](https://huggingface.co/datasets/nvidia/Arena-G1-Static-PickNPlace-Task), from Hugging Face. Run these commands where `DATASET_DIR` points to the target directory.

- If inside Docker, use `/datasets/...`. Hugging Face CLI is already installed.
- If outside Docker, use the matching host path. The Hugging Face CLI from `huggingface_hub` must be installed in that environment.

  ```
  hf download \
  nvidia/Arena-G1-Static-PickNPlace-Task \
  arena\_g1\_static\_apple\_dataset\_recorded\_200\_demos.hdf5 \
  --repo-type dataset \
  --local-dir $DATASET\_DIR
  mv "$DATASET\_DIR/arena\_g1\_static\_apple\_dataset\_recorded\_200\_demos.hdf5" \
  "$DATASET\_DIR/arena\_g1\_static\_apple\_dataset\_recorded.hdf5"
  ```

The rename lets the default `g1_static_apple_config.yaml` use the released HDF5 without changing `hdf5_name`.

Caution

`isaaclab_arena_gr00t/lerobot/convert_hdf5_to_lerobot.py` expects each episode to include ego RGB under `observations/camera_obs/robot_head_cam_rgb`; see `pov_cam_name_sim` in the conversion config. Before bulk collection, run the conversion once on a short recording to confirm the layout matches.

4. Edit `isaaclab_arena_gr00t/lerobot/config/g1_static_apple_config.yaml` so that:

- `hdf5_name` matches your recorded file - `arena_g1_static_apple_dataset_recorded.hdf5` in this example.
- `data_root` matches `$DATASET_DIR`

5. Still inside the container, convert the HDF5 dataset to LeRobot format.

   ```
   python isaaclab\_arena\_gr00t/lerobot/convert\_hdf5\_to\_lerobot.py \
   --yaml\_file isaaclab\_arena\_gr00t/lerobot/config/g1\_static\_apple\_config.yaml
   ```

This creates a folder at `$DATASET_DIR/arena_g1_static_apple_dataset_recorded/lerobot` containing parquet files with states and actions, MP4 camera recordings, and dataset metadata.

Tip

One option for sharing or post-training on cloud infrastructure, is to upload the LeRobot folder to Hugging Face Hub. Authenticate with `hf auth login` first, then replace `<your-username>` with your Hugging Face username or organization. You can upload all checkpoints, or just the latest one.

```
hf upload \
<your-username>/my\_apple\_sim\_datasets \
$DATASET\_DIR/arena\_g1\_static\_apple\_dataset\_recorded/lerobot \
. \
--repo-type dataset
```

## Review Conversion Configuration[#](#review-conversion-configuration "Link to this heading")

The converter is controlled by `isaaclab_arena_gr00t/lerobot/config/g1_static_apple_config.yaml`.

Below is an example file:

Configuration File: `g1_static_apple_config.yaml`

```
# Input/Output paths
data\_root: /datasets/isaaclab\_arena/static\_apple\_tutorial
hdf5\_name: "arena\_g1\_static\_apple\_dataset\_recorded.hdf5"
# Task description
language\_instruction: "move the apple to the plate"
task\_index: 3
# Data field mappings
state\_name\_sim: "robot\_joint\_pos"
action\_name\_sim: "processed\_actions"
pov\_cam\_name\_sim: "robot\_head\_cam\_rgb"
# Output configuration
fps: 50
chunks\_size: 1000
```

The main differences from the loco-manipulation box config, `g1_locomanip_config.yaml`, are the `data_root` and `hdf5_name` values pointing at the static apple-to-plate dataset and the `language_instruction` for the static apple-to-plate task. The 43-DoF action layout, embodiment tag, modality template, and joint-space configurations are shared with the loco-manipulation variant. The static workflow does not need its own GR00T embodiment config because the upper-body action channels and observation modalities are identical; only the recorded body channel stays at zero throughout each demo.

Note

The recorderâs `processed_actions` field already contains the 43-DoF joint-space targets that PinkIK produced during teleoperation. That is why this workflow records with `g1_wbc_agile_pink` and evaluates with `g1_wbc_agile_joint`: the policy never sees the end-effector pose targets PinkIK consumed. It only sees the joint targets PinkIK produced.

## Key Takeaways[#](#key-takeaways "Link to this heading")

We converted the recorded static apple-to-plate HDF5 demonstrations into LeRobot format. The resulting dataset is ready for GR00T 1.7 post-training in the standalone Isaac-GR00T checkout.

On this page
