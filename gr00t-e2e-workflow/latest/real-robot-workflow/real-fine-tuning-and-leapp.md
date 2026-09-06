# Fine-Tuning[#](#fine-tuning "Link to this heading")

In this lesson, weâll fine-tune GR00T 1.7 on the converted LeRobot dataset and prepare artifacts for policy export and deployment.

To do that, weâll:

- **Validate** dataset metadata and modality configuration before launch.
- **Fine-tune** GR00T 1.7 on the real-world LeRobot dataset.
- **Locate** the resulting checkpoint for downstream LEAPP export.

## Fine-Tune GR00T 1.7 on Real Data[#](#fine-tune-gr00t-1-7-on-real-data "Link to this heading")

Run this tutorial on an x86\_64 workstation with an L40-class GPU or better (40+ GB VRAM).

Use the [`nvidia-isaac/gr00t-leapp-export`](https://github.com/nvidia-isaac/gr00t-leapp-export/tree/gr00t_workflow_0.1) repository and the `gr00t_workflow_0.1` tag for Unitree G1 fine-tuning and downstream export compatibility.

Tip

If you want to skip fine-tuning, use the provided [real robot model](../resources/models-and-datasets.html#real-robot-workflow), [`nvidia/GR00T-N1.7-ApplePnP-V1`](https://huggingface.co/nvidia/GR00T-N1.7-ApplePnP-V1).

1. Clone and install `gr00t-leapp-export`:

   ```
   git clone --branch gr00t\_workflow\_0.1 --recurse-submodules https://github.com/nvidia-isaac/gr00t-leapp-export.git
   cd gr00t-leapp-export
   uv sync --python 3.10
   ```
2. Accept model access terms for [`nvidia/GR00T-N1.7-3B`](https://huggingface.co/nvidia/GR00T-N1.7-3B) and [`nvidia/Cosmos-Reason2-2B`](https://huggingface.co/nvidia/Cosmos-Reason2-2B), then authenticate:

   ```
   uv run hf auth login
   ```

   Note

   `<dataset-dir>` refers to the converter output directory. With default conversion settings, this is `${ISAAC_ROS_WS}/recordings/lerobot_output`.

### Configuration[#](#configuration "Link to this heading")

| Parameter | Description | Value |
| --- | --- | --- |
| `--base-model-path` | Pretrained GR00T weights | `nvidia/GR00T-N1.7-3B` |
| `--dataset-path` | Path to real-world LeRobot dataset | `<dataset-dir>` |
| `--embodiment-tag` | Robot embodiment identifier | `NEW_EMBODIMENT` |
| `--max-steps` | Total training steps | `10000` |
| `--save-steps` | Checkpoint frequency | `2000` |
| `--global-batch-size` | Effective batch size | `32` |

### Validate the Dataset[#](#validate-the-dataset "Link to this heading")

1. Before training, validate `<dataset-dir>/meta/info.json`:

   - `fps` matches the recorder `sync_rate` (30 Hz by default).
   - `total_episodes` and `total_frames` reflect the expected recording volume.

   Note

   For the apple-to-plate task, collect at least 200 episodes before fine-tuning.

### Modality Config[#](#modality-config "Link to this heading")

For G1 datasets, the converter writes a default modality config file:

```
<dataset-dir>/new\_embodiment\_config\_defaults.py
```

Use this file directly in the fine-tuning command.

It includes:

- Seven G1 `state` keys from `left_leg` through `right_hand`.
- `RELATIVE` action representation for arms.
- `ABSOLUTE` action representation for hands, waist, and optional locomotion or effort keys.
- The model-default 16-step action prediction horizon.
- Per-body-part `effort_<group>` action keys only when the recorder observed non-zero feed-forward torques.

Note

For the default apple-to-plate dataset, no additional modality edits are required.

### Launch Training[#](#launch-training "Link to this heading")

1. Run fine-tuning from the root of `gr00t-leapp-export`:

   ```
   CUDA\_HOME=/usr/local/cuda \
   CUDA\_VISIBLE\_DEVICES=0 \
   PYTORCH\_CUDA\_ALLOC\_CONF=expandable\_segments:True \
   uv run python gr00t/experiment/launch\_finetune.py \
   --base-model-path nvidia/GR00T-N1.7-3B \
   --dataset-path <dataset-dir> \
   --embodiment-tag NEW\_EMBODIMENT \
   --modality-config-path <dataset-dir>/new\_embodiment\_config\_defaults.py \
   --num-gpus 1 \
   --output-dir <output-dir> \
   --max-steps 10000 \
   --save-steps 2000 \
   --global-batch-size 32 \
   --dataloader-num-workers 4
   ```

The training script saves checkpoints to `<output-dir>/checkpoint-<step>/`.

The `--max-steps`, `--save-steps`, and `--global-batch-size` values are starting points. Tune them for dataset size and available hardware.

### Hardware Requirement[#](#hardware-requirement "Link to this heading")

Note

Fine-tuning GR00T requires at least 40 GB of VRAM (for example, L40, A100, H100, RTX 6000 Ada, or RTX PRO 6000 Blackwell). Refer to the [Hardware Recommendation](https://github.com/nvidia-isaac/gr00t-leapp-export/blob/gr00t_workflow_0.1/getting_started/hardware_recommendation.md) page for full requirements.

See also

Refer to the following resources for additional detail:

- [Fine-tune on a New Embodiment](https://github.com/nvidia-isaac/gr00t-leapp-export/blob/gr00t_workflow_0.1/getting_started/finetune_new_embodiment.md)
- [Modality Configuration](https://github.com/nvidia-isaac/gr00t-leapp-export/blob/gr00t_workflow_0.1/getting_started/data_config.md)
- [Hardware Recommendation](https://github.com/nvidia-isaac/gr00t-leapp-export/blob/gr00t_workflow_0.1/getting_started/hardware_recommendation.md)

## Key Takeaways[#](#key-takeaways "Link to this heading")

You fine-tuned GR00T 1.7 on real-world demonstrations and produced checkpoints ready for LEAPP export.

On this page
