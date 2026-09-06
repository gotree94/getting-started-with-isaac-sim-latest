# Sim Evaluation[#](#sim-evaluation "Link to this heading")

In this lesson, weâll run the fine-tuned GR00T 1.7 policy in closed loop and evaluate it in the Isaac Lab-Arena Unitree G1 static apple-to-plate task.

To do that, weâll:

- **Start** the GR00T policy server from the standalone Isaac-GR00T checkout.
- **Run** Isaac Lab-Arena as a client that queries the server over ZeroMQ.
- **Evaluate** the policy in a single environment and optional parallel environments.
- **Interpret** success-rate metrics and common server-client failure modes.

This lesson assumes you completed [GR00T Fine-Tuning on Sim Data](groot-fine-tuning-sim.html).

## Start the GR00T Policy Server[#](#start-the-gr00t-policy-server "Link to this heading")

The server runs GR00Tâs stack `run_gr00t_server.py` from the standalone Isaac-GR00T 1.7 checkout. We will start it before launching the client. Run the server outside Docker in the standalone Isaac-GR00T virtual environment created in the simulation overview.

These steps assume you completed [GR00T Fine-Tuning on Sim Data](groot-fine-tuning-sim.html) and still have the standalone Isaac-GR00T environment available.

1. Continue in the standalone Isaac-GR00T terminal used for fine-tuning.

   If you opened a new terminal, go back to the Isaac-GR00T directory:

   ```
   cd $ISAAC\_GR00T\_DIR
   ```

Important

From previous steps, you should already be on the Isaac-GR00T commit from [Setup: Isaac Lab-Arena](sim-setup-isaac-lab-arena.html).

But if you changed branches or pulled new changes during fine-tuning, restore the validated commit before starting evaluation:

```
cd $ISAAC\_GR00T\_DIR
git checkout 4b1dca9d88d2a0b9ea5a65aa61c82ff89f5c4f0e
```

2. Start the GR00T policy server.

   Replace `~/IsaacLab-Arena` with the path to your Arena repo if cloned somewhere else. Replace `${MODEL_PATH}` with the fine-tuned checkpoint directory from training.

Download Pre-trained Model

Use these commands to download the released [simulation model](../resources/models-and-datasets.html#simulation-workflow), [`nvidia/GN1x-Tuned-Arena-G1-Static-PickNPlace`](https://huggingface.co/nvidia/GN1x-Tuned-Arena-G1-Static-PickNPlace), if you want to skip policy post-training. Run them outside Docker in the standalone Isaac-GR00T virtual environment before starting the server.

```
export MODELS\_DIR=~/models/isaaclab\_arena/static\_apple\_tutorial
export MODEL\_PATH=$MODELS\_DIR/gn1x\_tuned\_static\_apple
mkdir -p "$MODEL\_PATH"
hf download \
nvidia/GN1x-Tuned-Arena-G1-Static-PickNPlace \
--repo-type model \
--local-dir $MODEL\_PATH
```

If you trained your own checkpoint in [GR00T Fine-Tuning on Sim Data](groot-fine-tuning-sim.html), set `MODEL_PATH` to that trainer output instead, such as `$MODELS_DIR/static_apple_n17_finetune/checkpoint-20000`.

```
uv run python gr00t/eval/run\_gr00t\_server.py \
--modality-config-path ~/IsaacLab-Arena/isaaclab\_arena\_gr00t/embodiments/g1/g1\_sim\_wbc\_data\_gr00t\_n\_1\_7\_config.py \
--model-path ${MODEL\_PATH} \
--embodiment-tag NEW\_EMBODIMENT \
--device cuda \
--host 0.0.0.0 \
--port 5555
```

3. Once running, the server prints `Server Ready and listening on 0.0.0.0:5555` to the terminal. This means it is ready for clients.

## Run Single Environment Evaluation[#](#run-single-environment-evaluation "Link to this heading")

With the server running, launch the Arena client. The client side does not need GR00T dependencies, because it communicates to the server over ZeroMQ using the standard Base Arena container. `Gr00tRemoteClosedloopPolicy` is Arenaâs client wrapper around the remote GR00T server.

1. Use the existing Arena container terminal from earlier simulation lessons, or start a new one from your Isaac Lab-Arena checkout if needed.

   ```
   ./docker/run\_docker.sh
   ```
2. Confirm the dataset and models environment variables are still set.

   If youâre in a new container shell, restore them:

   ```
   export DATASET\_DIR=/datasets/isaaclab\_arena/static\_apple\_tutorial
   export MODELS\_DIR=/models/isaaclab\_arena/static\_apple\_tutorial
   ```
3. Get the IP address of the host running the server, or `localhost` if it is the same machine.

Caution

Before running, make sure the `model_path` entry in `isaaclab_arena_gr00t/policy/config/g1_static_apple_gr00t_closedloop_config.yaml` points to a checkpoint directory you are serving, such as `/models/isaaclab_arena/static_apple_tutorial/gn1x_tuned_static_apple` for the Hugging Face checkpoint or `/models/isaaclab_arena/static_apple_tutorial/static_apple_n17_finetune/checkpoint-20000` for a locally trained checkpoint.

This path must match the `--model-path` value passed to `run_gr00t_server.py`.

4. Run the policy in a single environment with visualization through the GUI. If not using `localhost`, make sure to replace `--remote_host localhost` with the IP address of the host running the server.

   ```
   /isaac-sim/python.sh isaaclab\_arena/evaluation/policy\_runner.py \
   --viz kit \
   --policy\_type isaaclab\_arena\_gr00t.policy.gr00t\_remote\_closedloop\_policy.Gr00tRemoteClosedloopPolicy \
   --policy\_config\_yaml\_path isaaclab\_arena\_gr00t/policy/config/g1\_static\_apple\_gr00t\_closedloop\_config.yaml \
   --remote\_host localhost --remote\_port 5555 \
   --num\_steps 600 \
   --enable\_cameras \
   galileo\_g1\_static\_pick\_and\_place \
   --object apple\_01\_objaverse\_robolab \
   --destination clay\_plates\_hot3d\_robolab \
   --embodiment g1\_wbc\_agile\_joint
   ```

Tip

Timeout tuning is important here - we used 6 seconds to allow the robot to retry once or twice, but not to spend too much time if an episode is failing.

Note

The `--num_steps` value is 600 rather than 1500 because the static apple-to-plate episode has no walking phase and runs for roughly half as long as the loco-manipulation variant.

The 600-step command is intended as a quick test.

To estimate success rate more reliably, evaluate complete episodes instead of relying on one short rollout:

- Use `--num_episodes 100` for a quick estimate.
- Use `--num_episodes 1000` for a stronger estimate.

If you prefer `--num_steps`, this taskâs 6-second timeout comes from `episode_length_s=6.0` in `galileo_g1_static_pick_and_place_environment.py`. At 50 Hz control, that is about 300 environment steps per episode, so 100 episodes is roughly `--num_steps 30000` and 1000 episodes is roughly `--num_steps 300000`.

At the end of evaluation, the console should show similar metrics:

```
[Rank 0/1] Metrics: {'success\_rate': 1.0, 'object\_moved\_rate': 1.0, 'num\_episodes': 1}
```

These metrics are computed over the entire evaluation process and depend on policy quality, dataset quality, and the number of evaluation steps.

## Run Parallel Environments Evaluation[#](#run-parallel-environments-evaluation "Link to this heading")

Parallel evaluation is also supported by the policy runner. The command below assumes the GR00T policy server is still running.

1. Test the policy in 5 parallel environments with visualization through the GUI.

- If not using `localhost`, make sure to replace `--remote_host localhost` with the IP address of the host running the server

```
/isaac-sim/python.sh isaaclab\_arena/evaluation/policy\_runner.py \
--viz kit \
--policy\_type isaaclab\_arena\_gr00t.policy.gr00t\_remote\_closedloop\_policy.Gr00tRemoteClosedloopPolicy \
--policy\_config\_yaml\_path isaaclab\_arena\_gr00t/policy/config/g1\_static\_apple\_gr00t\_closedloop\_config.yaml \
--remote\_host localhost \
--remote\_port 5555 \
--num\_steps 600 \
--num\_envs 5 \
--enable\_cameras \
galileo\_g1\_static\_pick\_and\_place \
--object apple\_01\_objaverse\_robolab \
--destination clay\_plates\_hot3d\_robolab \
--embodiment g1\_wbc\_agile\_joint
```

Note

With the server-client architecture, the policy device is a server-side concern. The server places the policy on its own GPU through the `--device` flag passed to `run_gr00t_server.py`. The clientâs `--device` flag controls Arenaâs physics backend, not the policy.

During evaluation, the console should indicate which environments terminated and which truncated. `terminated` means the task-specific success condition fired or the six-second episode length was exceeded. `truncated` means a timeout occurred, if timeouts are enabled, such as the maximum episode length being exceeded.

```
Resetting policy for terminated env\_ids: tensor([3], device='cuda:0') and truncated env\_ids: tensor([], device='cuda:0', dtype=torch.int64)
```

At the end of evaluation, the console should show metrics similar to:

```
[Rank 0/1] Metrics: {'success\_rate': 1.0, 'num\_episodes': 5}
```

The success rate may not be 1.0 when more trials are evaluated. The number of episodes is higher than single-environment evaluation because of parallelization.

## Review Evaluation Details[#](#review-evaluation-details "Link to this heading")

Closed-loop policy inference uses the `g1_wbc_agile_joint` embodiment, which is different from `g1_wbc_agile_pink` used during teleoperation recording. During teleoperation, the upper body is controlled through target end-effector poses realized by PinkIK, and the lower body is controlled through AGILE WBC. The GR00T 1.7 policy trains on upper-body joint positions and lower-body WBC policy inputs, so evaluation uses the joint-control twin.

The evaluation commands above do not pass `--device`, so Arena defaults to its built-in physics backend. If your dataset was recorded on GPU physics, prefer `--device cuda` for both single and parallel runs to keep evaluation physics aligned with training. If it was recorded on CPU physics, add `--device cpu` for per-episode reproducibility.

The same-shelf placement makes the static variant slightly easier than the loco-manipulation apple-to-plate task: the destination plate is always within armâs reach, so the policy never has to recover from a mistimed approach, and there are no intermediate locomotion phases that can drift off-course. The success criterion is the same contact-sensor termination used by the loco-manipulation variant: `force_threshold=0.5 N` and `velocity_threshold=0.1 m/s`, filtered to contacts with the `--destination` asset.

## Debugging Common Server-Client Failure Modes[#](#debugging-common-server-client-failure-modes "Link to this heading")

- `ValueError: Invalid action shape, expected: 23, received: 50.` means the client embodiment expects a 23-D PinkIK action, but the server is returning a 43-DoF joint chunk. Make sure the client uses `--embodiment g1_wbc_agile_joint`, not `g1_wbc_agile_pink`.
- `ModuleNotFoundError` on the client side means the clientâs `--policy_type` is wrong. Use `isaaclab_arena_gr00t.policy.gr00t_remote_closedloop_policy.Gr00tRemoteClosedloopPolicy` with `--policy_config_yaml_path isaaclab_arena_gr00t/policy/config/g1_static_apple_gr00t_closedloop_config.yaml`.
- Action shape mismatch on the server, such as `Action key 'left_arm''s horizon must be 40. Got 50`, means the action modality registered at training time disagrees with the modality loaded by the server. Re-fine-tune at the same horizon or update the `--modality-config-path` passed to `run_gr00t_server.py` to match the checkpoint.

## Key Takeaways[#](#key-takeaways "Link to this heading")

Simulation Workflow Complete

We evaluated the fine-tuned GR00T 1.7 policy through Arenaâs server-client architecture. This completes the simulation workflow for the static apple-to-plate task.

On this page
