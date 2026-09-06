# Models and Datasets[#](#models-and-datasets "Link to this heading")

Use these Hugging Face assets when you want to start from NVIDIA-provided data or checkpoints instead of collecting every demonstration and training every model from scratch.

## Simulation Workflow[#](#simulation-workflow "Link to this heading")

| Asset | Hugging Face Link | Use It When |
| --- | --- | --- |
| Simulation dataset | [`nvidia/Arena-G1-Static-PickNPlace-Task`](https://huggingface.co/datasets/nvidia/Arena-G1-Static-PickNPlace-Task) | You want to skip simulation teleoperation data collection and start from a provided HDF5 dataset. |
| Model trained on simulation dataset | [`nvidia/GN1x-Tuned-Arena-G1-Static-PickNPlace`](https://huggingface.co/nvidia/GN1x-Tuned-Arena-G1-Static-PickNPlace) | You want to skip simulation post-training and evaluate a provided GR00T checkpoint in Isaac Lab-Arena. |

## Real Robot Workflow[#](#real-robot-workflow "Link to this heading")

| Asset | Hugging Face Link | Use It When |
| --- | --- | --- |
| Real robot dataset | [`nvidia/GR00T-N1.7-AppleToPlate`](https://huggingface.co/datasets/nvidia/GR00T-N1.7-AppleToPlate) | You want to inspect or train from NVIDIA-provided Unitree G1 apple-to-plate demonstrations in LeRobot format. |
| Model trained on real dataset | [`nvidia/GR00T-N1.7-ApplePnP-V1`](https://huggingface.co/nvidia/GR00T-N1.7-ApplePnP-V1) | You want to start from a provided real-robot apple pick-and-place model instead of fine-tuning one yourself. |

## Format Notes[#](#format-notes "Link to this heading")

- The simulation dataset starts from HDF5 recordings and is converted to LeRobot format inside the simulation workflow.
- The real robot dataset is published in LeRobot format for the Unitree G1 apple-to-plate task.
- The model assets are intended as starting points or skip paths. Match the model, dataset, embodiment, and deployment configuration before running a policy on hardware.

On this page
