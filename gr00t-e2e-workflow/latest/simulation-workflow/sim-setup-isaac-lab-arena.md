# Setup: Isaac Lab-Arena[#](#setup-isaac-lab-arena "Link to this heading")

In this lesson, weâll install Isaac Lab-Arena and validate the Unitree G1 static apple-to-plate environment used by this simulation workflow.

To do that, weâll:

- **Install** Isaac Lab-Arena from source and initialize required submodules.
- **Prepare** shared data and model directories for the simulation workflow.
- **Run** automated tests that verify the scene, task, and termination logic.
- **Configure** a standalone Isaac-GR00T checkout for post-training and evaluation.

## Setup Isaac Lab-Arena[#](#id1 "Link to this heading")

Isaac Lab-Arena runs on Isaac Sim `6.0.0` and Isaac Lab `3.0.0`. The Docker build installs these dependencies automatically.

1. Clone Isaac Lab-Arena to the release branch, and initialize its submodules.

This tutorial assumes you cloned Isaac Lab-Arena to `~/IsaacLab-Arena`, but you can clone it somewhere else if you like.

```
cd ~/
git clone --branch release/0.2.1 --recurse-submodules git@github.com:isaac-sim/IsaacLab-Arena.git
```

The recursive submodule step is required because Arena depends on pinned external repositories, including Isaac Lab.

Isaac Lab-Arena installs from source inside its Docker container.

2. Change directory to the cloned Isaac Lab-Arena repository.

   ```
   cd IsaacLab-Arena
   ```
3. Create host directories for datasets, models, and evaluation output before starting the container.

By default, the Docker run script mounts `$HOME/datasets` to `/datasets`, `$HOME/models` to `/models`, and `$HOME/eval` to `/eval` when those host directories exist.

However if you want to specify different directories, skip this step and use the `-d`, `-m`, and `-e` flags to specify directories when starting the container in the next step. (d for datasets, m for models, e for evaluation)

```
mkdir -p $HOME/datasets
mkdir -p $HOME/models
mkdir -p $HOME/eval
```

4. Start the base Isaac Lab-Arena Docker container:

   ```
   ./docker/run\_docker.sh
   ```

Why not use the -g flag?

This simulation workflow uses a separate standalone Isaac-GR00T checkout for post-training and evaluation, so the base container is the default path. For reference, there is a `-g` flag available to use GR00T dependencies inside the container, but we wonât use that here.

5. Optionally, verify the Isaac Lab-Arena installation inside the container.

Optional verification

The full verification suite can take a significant amount of time: approximately 20-30 minutes on a performant workstation.

Later in this lesson, weâll also run a focused static apple-to-plate test to validate the course environment directly.

```
pytest -sv -m "with\_cameras and not with\_subprocess" isaaclab\_arena/tests/
pytest -sv -m "not with\_cameras and not with\_subprocess" isaaclab\_arena/tests/
pytest -sv -m with\_subprocess isaaclab\_arena/tests/
```

6. Inside the container, create the folders for data and models and assign environment variables to point to them. This will make future commands easier to write.

   ```
   export DATASET\_DIR=/datasets/isaaclab\_arena/static\_apple\_tutorial
   mkdir -p $DATASET\_DIR
   export MODELS\_DIR=/models/isaaclab\_arena/static\_apple\_tutorial
   mkdir -p $MODELS\_DIR
   ```

## Validate the Environment With Automated Tests[#](#validate-the-environment-with-automated-tests "Link to this heading")

A dedicated pytest module covers the static apple-to-plate environment. It asserts two conditions:

- The task does not terminate when the apple is at its initial pose.
- The success termination fires after the apple is teleported above the plate and allowed to settle.

The tests run headlessly (no GUI) with cameras enabled. This is the fastest way to confirm the scene, task, and termination logic are wired correctly without requiring teleoperation hardware.

### (Optional) Run the Automated Tests[#](#optional-run-the-automated-tests "Link to this heading")

7. Inside the Isaac Lab-Arena container, run the automated environment tests. They take approximately 2 minutes to run in total.

   ```
   python -m pytest isaaclab\_arena/tests/test\_g1\_static\_pick\_and\_place.py -v
   ```
8. Confirm that both tests pass. Example terminal output below:

`=========== 2 passed, 3488 warnings in 95.54s (0:01:35) ===========`

Note

If you see the apple fall through the shelf on the first execution, simply re-run the command once.

Hereâs why:

**First-run asset cache:** The Objaverse apple USD streams from an S3 staging bucket and PhysX re-cooks its collision mesh at the baked-in `0.01x` scale.

On the first execution, the colliders may land a frame after the first physics step, which can cause the apple to tunnel through the shelf surface on the first load.

Subsequent runs read the cached USD from `/tmp/Assets/` and spawn correctly.

## Setup Isaac GR00T (Outside the Container)[#](#setup-isaac-gr00t-outside-the-container "Link to this heading")

9. Open a new terminal.
10. Outside the container in this new terminal, set an environment variable for where we will clone GR00T. You can change this if you like - weâll reuse it for convenience.

    ```
    export ISAAC\_GR00T\_DIR=$HOME/Isaac-GR00T
    ```
11. Clone the Isaac-GR00T repo for post-training and evaluation. Weâll checkout the commit this workflow was validated against.

    ```
    git clone https://github.com/NVIDIA/Isaac-GR00T.git $ISAAC\_GR00T\_DIR
    cd $ISAAC\_GR00T\_DIR
    git checkout 4b1dca9d88d2a0b9ea5a65aa61c82ff89f5c4f0e
    ```
12. Create a new uv-managed virtual environment (venv). This venv is separate from Arenaâs container.

    ```
    uv sync
    ```

Fine-tuning and the policy server both run from this standalone checkout. This way you can update to newer GR00T releases without rebuilding Arenaâs GR00T-flavored container or changing `submodules/Isaac-GR00T`.

## Key Takeaways[#](#key-takeaways "Link to this heading")

We installed Isaac Lab-Arena, prepared shared data and model directories, configured the standalone Isaac-GR00T checkout, and validated that the static apple-to-plate task loads correctly. Next, weâll review the environment code before collecting teleoperation data.

On this page
