# LEAPP Export[#](#leapp-export "Link to this heading")

This lesson explains how to export the fine-tuned policy into a deployable LEAPP bundle.

Exporting a policy with LEAPP enables deployment from pure C++ without any Python at runtime. The export also adds metadata that automatically connects the policy to the required sensor inputs and command outputs, so no additional code is required.

Run this lesson on an x86\_64 workstation. LEAPP export for GR00T is not supported on Jetson AGX Thor.

## Prerequisites[#](#prerequisites "Link to this heading")

1. If not already completed in fine-tuning, clone and set up the export repository:

   ```
   git clone --branch gr00t\_workflow\_0.1 --recurse-submodules https://github.com/nvidia-isaac/gr00t-leapp-export.git
   cd gr00t-leapp-export
   uv sync --python 3.10
   ```

## Run Export[#](#run-export "Link to this heading")

Important

For G1 fine-tunes, always pass `--joint_config export/data/g1_joints.json`.
Without this argument, export uses placeholder joint names and deployment joint mapping can fail or produce incorrect actions.

1. Run the export from the `gr00t-leapp-export` repository:

   ```
   cd gr00t-leapp-export
   uv run python export/export\_with\_leapp.py \
   --model\_path <checkpoint-dir> \
   --embodiment\_tag new\_embodiment \
   --dataset\_path <lerobot-dataset-dir> \
   --joint\_config export/data/g1\_joints.json \
   --output\_name <export-name>
   ```

   You can set the arguments as follows:

   - `--model_path`: Path to `checkpoint-NNNN/` from fine-tuning.
   - `--embodiment_tag`: Always `new_embodiment` since the G1 is a new
     embodiment that is not supported by GR00T out of the box.
   - `--dataset_path`: Path to the LeRobot dataset you used for fine-tuning.
   - `--joint_config`: Path to the joint configuration of the G1 embodiment.
   - `--output_name`: Directory name for exported LEAPP bundle.

Tracing typically takes 5 to 15 minutes on a workstation GPU.
Successful completion ends with `Export completed: <export-name>`.

## Exported LEAPP Outputs[#](#exported-leapp-outputs "Link to this heading")

After export, the LEAPP bundle contains the following files:

- `<export-name>.yaml` â YAML file containing all policy metadata
- `<export-name>.png` â Network graph visualization of the policy
- `log.txt` â Logs from the LEAPP export

The bundle also includes the following ONNX files containing the policy weights:

- `backbone.onnx` and `backbone.onnx.data`
- `action_head.onnx` and `action_head.onnx.data`
- `preprocess_state.onnx`
- `preprocess_video.onnx`
- `decode_action.onnx`

The deploy stack consumes all of these files to run the policy and connect it to the correct sensor inputs and hardware outputs.

On this page
