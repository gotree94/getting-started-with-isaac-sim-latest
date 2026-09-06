# GR00T Fine-Tuning on Sim Data[#](#gr00t-fine-tuning-on-sim-data "Link to this heading")

In this lesson, weâll post-train a GR00T 1.7 policy directly on the teleoperated demonstrations converted from HDF5 to LeRobot format.

To do that, weâll:

- **Run** GR00T 1.7 post-training from a standalone Isaac-GR00T checkout.
- **Use** Arenaâs WBC modality config as the single source of truth for training and serving.
- **Match** the action horizon between training and evaluation.
- **Apply** the AGILE-specific recommendations that make the checkpoint work in closed-loop evaluation.

This page assumes you have a successful recording at `$DATASET_DIR/arena_g1_static_apple_dataset_recorded.hdf5` and have converted it to LeRobot format.

## Confirm Training Context[#](#confirm-training-context "Link to this heading")

We post-train the GR00T 1.7 policy on the task using the standalone Isaac-GR00T checkout referenced as `$ISAAC_GR00T_DIR`. This step runs outside the Arena container so GR00Tâs dependencies do not need to coexist with Arena and Isaac Sim dependencies.

The GR00T 1.7 policy has 3 billion parameters, so post-training requires substantial compute. The upstream static apple workflow uses a tested single-GPU configuration.

Training takes approximately 2-3 hours for 20,000 steps on a single NVIDIA RTX 6000 Ada GPU.

## Review Compute Requirements[#](#review-compute-requirements "Link to this heading")

- **GPUs:** NVIDIA GPU with at least 48 GB VRAM.
- **System RAM:** 128 GB or more recommended.

Tip

For faster training in the cloud, you can also use a H100 instance on NVIDIA Brev, with prerequisites installed for Isaac GR00T: [![ Click here to deploy.](https://brev-assets.s3.us-west-1.amazonaws.com/nv-lb-dark.svg)](https://brev.nvidia.com/launchable/deploy/now?launchableID=env-3DgCELkan85JSOjYWxb3UlB0f5v)

## Review Training Configuration[#](#review-training-configuration "Link to this heading")

| Setting | Value |
| --- | --- |
| Base model | GR00T-N1.7-3B, downloaded from Hugging Face on first run |
| Tuned modules | Visual backbone, projector, diffusion model |
| Frozen modules | LLM |
| Batch size | 12, adjusted based on GPU memory |
| Training steps | 20,000 |
| Action horizon | 40 |
| Embodiment tag | `new_embodiment`, resolved to `EmbodimentTag.NEW_EMBODIMENT` |

## Launch Post-Training[#](#launch-post-training "Link to this heading")

1. In a terminal outside the Arena container, navigate to your standalone Isaac GR00T repo.

   ```
   cd $ISAAC\_GR00T\_DIR # or use path directly if environment variable is not set
   ```
2. Because fine-tuning runs outside the Arena Docker container, set `DATASET_DIR` and `MODELS_DIR` to the host paths that correspond to the Docker mounts.

   ```
   export DATASET\_DIR=~/datasets/isaaclab\_arena/static\_apple\_tutorial
   export MODELS\_DIR=~/models/isaaclab\_arena/static\_apple\_tutorial
   ```
3. Run the post-training command.

   Ensure that `--modality-config-path` uses the absolute path to your Arena clone in order to register the WBC modality from Arenaâs source tree.

   ```
   uv run python -m torch.distributed.run --nproc\_per\_node=1 --standalone \
   gr00t/experiment/launch\_finetune.py \
   --base-model-path nvidia/GR00T-N1.7-3B \
   --dataset-path $DATASET\_DIR/arena\_g1\_static\_apple\_dataset\_recorded/lerobot \
   --output-dir $MODELS\_DIR/static\_apple\_n17\_finetune \
   --modality-config-path ~/IsaacLab-Arena/isaaclab\_arena\_gr00t/embodiments/g1/g1\_sim\_wbc\_data\_gr00t\_n\_1\_7\_config.py \
   --embodiment-tag new\_embodiment \
   --global-batch-size 12 \
   --max-steps 20000 \
   --num-gpus 1 \
   --save-steps 5000 \
   --save-total-limit 5 \
   --no-tune-llm \
   --tune-visual \
   --tune-projector \
   --tune-diffusion-model \
   --dataloader-num-workers 8 \
   --color-jitter-params brightness 0.3 contrast 0.4 saturation 0.5 hue 0.08
   ```

Note

The `--modality-config-path` argument points to Arenaâs `isaaclab_arena_gr00t/embodiments/g1/g1_sim_wbc_data_gr00t_n_1_7_config.py` so that `register_modality_config(...)` runs and `new_embodiment` resolves to the WBC modality layout: 5 state keys and 7 action keys. This is the same file the server consumes at evaluation time, so it is the single source of truth for the modality layout.

Caution

**Action horizon must match between training and serving.** `action_horizon` is baked into the diffusion head at training time and cannot be changed at inference. The Arena server YAML used in evaluation ships with `action_horizon: 40` to match the value trained here. If you want a different horizon, change both:

1. `delta_indices=list(range(N))` in `isaaclab_arena_gr00t/embodiments/g1/g1_sim_wbc_data_gr00t_n_1_7_config.py` for the action modality.
2. `action_horizon: N` and `action_chunk_length: N`, less than or equal to `action_horizon`, in `isaaclab_arena_gr00t/policy/config/g1_static_apple_gr00t_closedloop_config.yaml`.

If you have more powerful GPUs, see the [GR00T fine-tuning guidelines](https://github.com/NVIDIA/Isaac-GR00T#3-fine-tuning) for information on adjusting the training configuration to your hardware.

This workflow recommends fine-tuning the visual backbone, projector, and diffusion model for best results.

## Apply AGILE Apple-to-Plate Recommendations[#](#apply-agile-apple-to-plate-recommendations "Link to this heading")

The static apple-to-plate environment runs AGILE for the lower body and uses either PinkIK during recording or direct joint control during evaluation. These choices affect whether the fine-tuned policy works in the AGILE joint runtime.

1. **Record with AGILE.** Keep the default `--embodiment g1_wbc_agile_pink` during teleoperation. AGILE WBC is a single end-to-end velocity policy.
2. **Do not record with the joint embodiment.** Use `g1_wbc_agile_pink`, not `g1_wbc_agile_joint`. The recorder writes the joint-space output of PinkIK as `processed_actions`, which is what the policy needs to learn. Recording with `g1_wbc_agile_joint` would require the human teleoperator to drive 43 joint targets directly.
3. **Use Arenaâs `g1_sim_wbc_data_gr00t_n_1_7_config.py` for `--modality-config-path`.** This registers the modality with `NEW_EMBODIMENT`, uses a 40-step action horizon for 1.7, and matches the file the Arena server consumes at evaluation.
4. **Pick `action_horizon` deliberately.** The default value of 40 gives an 800 ms inference chunk at 50 Hz. This is a good default for static apple-to-plate episodes of approximately 600 steps and is the maximum supported by the released GR00T 1.7 base model. Lower values, such as 20, improve responsiveness at the cost of more frequent policy queries. You cannot go higher without retraining the base model. Keep the modality config and server YAML in sync.

If a resulting checkpoint behaves badly at evaluation, the most common causes are too few or low-quality demonstrations, a modality config or `action_horizon` mismatch between training and server YAML, or recording with the wrong embodiment.

## Key Takeaways[#](#key-takeaways "Link to this heading")

We post-trained GR00T 1.7 on static apple-to-plate demonstrations using the standalone Isaac-GR00T checkout. The resulting checkpoint is ready for closed-loop evaluation through Arenaâs remote-policy server-client architecture.

On this page
