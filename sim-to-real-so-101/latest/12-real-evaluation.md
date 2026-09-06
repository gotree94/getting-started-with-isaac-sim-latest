# Real Evaluation[#](#real-evaluation "Link to this heading")

What Do I Need for This Module?

Hands-on. Youâll need the calibrated SO-101 robot, both cameras, the assembled workspace, and the `real-robot` container.

In this session, youâll run policy evaluation on the physical SO-101 robot using the same GR00T-based setup you used in simulation.

The client is now the real robot instead of the simulator!

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this session, youâll be able to:

- **Run** policy evaluation on the real robot using the GR00T server + client (Docker) setup
- **Observe** the sim-to-real gap firsthand
- **Stop and restart** the evaluation safely

## What Policy Are We Running?[#](#what-policy-are-we-running "Link to this heading")

We use the same policy you evaluated in simulation. The exact `MODEL` (checkpoint path) is set in the commands below.

## Workspace Prep[#](#workspace-prep "Link to this heading")

Before running real-robot evaluation:

1. **Place** 1-3 vials on the mat and keep the rack in its reference location.
2. **Ensure** both cameras have a clear view of the workspace.
3. **Turn on** the light and set brightness (see [Set Up the Light](05-building-workspace.html#set-up-the-light)).

## Running Policy Evaluation on the Real Robot[#](#running-policy-evaluation-on-the-real-robot "Link to this heading")

Throughout this course, when we run evaluations there will be two terminals involved:

1. The host terminal, where we start the GR00T container and policy server
2. The client terminal, where we run the evaluation rollout and actually control the robot

For sim, the client is our simulator. For the real robot, our client is the robot itself.

### Terminal 1 (`real-robot` container) â Start the GR00T policy server[#](#terminal-1-real-robot-container-start-the-gr00t-policy-server "Link to this heading")

1. **Locate** the terminal already running the `real-robot` container.

If you canât find it, click here to see the command to run the container.

If you donât have the `real-robot` container terminal open, **open** a new terminal window (**CTRL+ALT+T**), and
run the docker `real-robot` container using:

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

2. Inside this container, **run** the following. This is where we choose which model to evaluate.

```
export MODEL=aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left/checkpoint-10000
```

3. **Run** the policy server with that model.

```
python Isaac-GR00T/gr00t/eval/run\_gr00t\_server.py \
--model-path /workspace/models/$MODEL
```

### Terminal 2 (`real-robot` container) â Evaluation rollout[#](#terminal-2-real-robot-container-evaluation-rollout "Link to this heading")

Open a second terminal. You will attach to the same `real-robot` container and run the robot client. This step assumes your robot has been calibrated already (likely you already did this).

1. Attach a second terminal to the `real-robot` container.

```
docker exec -it real-robot /bin/bash
```

2. Once inside the container, **run** the evaluation script:

```
python Isaac-GR00T/gr00t/eval/real\_robot/SO100/so101\_eval.py \
--robot.type=so101\_follower \
--robot.port="$ROBOT\_PORT" \
--robot.id="$ROBOT\_ID" \
--robot.cameras="{
wrist: {type: opencv, index\_or\_path: $CAMERA\_GRIPPER, width: 640, height: 480, fps: 30},
front: {type: opencv, index\_or\_path: $CAMERA\_EXTERNAL, width: 640, height: 480, fps: 30}
}" \
--policy\_host=localhost \
--policy\_port=5555 \
--lang\_instruction="Pick up the vial and place it in the yellow rack" \
--rerun True
```

Note

The `--rerun` flag is optional.

It adds Rerun into the loop for debugging, so you can see joint actions and the camera feeds while the policy is running. This lets you confirm the camera views are reasonable and the assignments are correct.

### Watching the Evaluation[#](#watching-the-evaluation "Link to this heading")

Watch the robot and the terminal during execution. The policy will run until you stop it or it completes the evaluation. Watch closely but stay clear; note any unexpected behavior and be ready to intervene.

**To stop the robot:** Press **CTRL+C** in Terminal 2 (robot client). The policy server in Terminal 1 keeps running.

**To run again:** Simply run the command again `python Isaac-GR00T/gr00t/eval/real_robot/SO100/so101_eval.py ...` in Terminal 2

**To switch model or fully restart:**

1. **Stop** both terminalsâ commands (**CTRL+C**)
2. **Set** `MODEL` environment variable to the model you want to evaluate
3. **Restart** the commands for each terminal (model server, robot client)

Note

- At evaluation start, the robot will slowly rise to its initial pose, then enter into inference mode.
- At robot stop (CTRL+C), it will slowly drive itself back to its home pose.

Tip

Keep the policy server running between evaluation attempts. Only restart it if you want to load a different model checkpoint.

## Common Failure Modes[#](#common-failure-modes "Link to this heading")

When observing real evaluation runs, notice how perception and actuation differ from simulation. The same policy may miss grasps, overshoot, or behave differently under real lighting and dynamics. These differences are the sim-to-real gap youâll address with the strategies in the modules that follow.

## Key Takeaways[#](#key-takeaways "Link to this heading")

- Real robot evaluation uses the same GR00T server + client architecture as sim evaluation; only the client (robot vs. simulator) changes
- The gap between sim and real performance is often visible immediatelyâperception and actuation both matter
- Safe shutdown is CTRL+C in the robot client terminal first

## Whatâs Next?[#](#what-s-next "Link to this heading")

Continue with [Strategy 2: Co-Training With Real Data](13-strategy2-cotraining.html), where youâll deploy policies trained on mixed simulation and real data to the physical robot.

On this page
