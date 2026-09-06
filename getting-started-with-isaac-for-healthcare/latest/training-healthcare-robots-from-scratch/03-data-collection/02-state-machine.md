# State Machines[#](#state-machines "Link to this heading")

## State Machines for Data Collection[#](#state-machines-for-data-collection "Link to this heading")

In known environments, where all relevant variables and conditions are controlled or fully specified, it becomes possible to program robotic systems for precise, deterministic behavior.

State machines in robotics model robot behavior as a set of discrete states with defined transitions, ensuring predictable and structured control of tasks.

By utilizing state machines in these environments, developers have complete information about the poses and positions of all objects present in the simulation. This comprehensive knowledge allows for the definition of exact trajectories for the robot, tailored to interact with specific target anatomies or to reach predetermined positions within the phantom frame, ensuring reliable and repeatable actions. This makes state machines a cheap and reliable source of syntethic data.

But the real world involves variable, dynamic environments. So to make our models more robust, we introduce randomziation into the simulation by varying aspects of the scene during training. Domain randomization allows the robotâs learning process to generalize across different cases and reducing the risk of overfitting to a single, static setup.

### State Machine Architecture[#](#state-machine-architecture "Link to this heading")

The scanning workflow is organized as a state machine with **five main states**:

1. **Setup**  
   Initial positioning of the robot arm.
2. **Approach**  
   Moving toward the organ surface.
3. **Contact**  
   Making initial contact with the organ.
4. **Scanning**  
   Performing the actual ultrasound scan.
5. **Done**  
   Completing the procedure.

---

### Control Modules[#](#control-modules "Link to this heading")

The state machine integrates **three specialized control modules** that operate simultaneously to control the pose of the robotâs end-effector. The three control modules each compute their contributions to the next desired end effector pose. The position and orientation of the end-effector are represented in a vector, that we refer to as action vector. During simulation the desired next cartesian end-effector pose is computed by the modules, and then passed to the action manager. The action manager itself is configured to compute the inverse kinematics for the robot in the scene based on the action vector. The inverse kinematics solver maps the desired end-effector pose to changes of the robotâs joints states. We can configure the type of solver and therefore the behavior of the robot, but donât go into more detail in this course. The code deep dive video further below will touch on these components.

#### Force Control Module[#](#force-control-module "Link to this heading")

This module prevents excessive force while maintaining a minimal distace from the scanning surface.
This is achieved using a Proportional-Integral-Derivative (PID) controller to maintain optimal contact force.

This module is active during the `CONTACT` and `SCANNING` states

#### Orientation Control Module[#](#orientation-control-module "Link to this heading")

This module maintains proper probe orientation throughout the procedure, keeping the probe pointing downward except during scanning.

#### Path Planning Module[#](#path-planning-module "Link to this heading")

This module manages the robotâs position and trajectory. It handles state transitions based on position thresholds, and controls both the scanning speed and pattern (**100 scan steps + 50 hold steps**).

---

### Code Deep Dive & Explanation[#](#code-deep-dive-explanation "Link to this heading")

A detailed walkthrough of the state machine implementation for data collection is provided below.
Find the referenced code in `i4h-workflows/workflows/robotic_ultrasound/scripts/simulation/environments/state_machine/`

In this video, we explore the state machine implementation and its control modules. The robot has five states, setup, approach, contact, scanning, done and three control modules that create the final desired actions for the robot. The modules are a path planning module, an orientation control module, and a force control module, each predicting a desired end-effector pose with respect to the tool center point. The video goes into the code for each module, and explains how they work together.

---

### Data Collection[#](#data-collection "Link to this heading")

Throughout the simulation we can save robot state and sensor information. These observations and actions can be used for imitation learning. Imitation learning is a technique where robots learn to perform tasks by observing and mimicking expert demonstrations instead of being explicitly programmed. In our case we can teach a robot to mimic the behavior of a state machine. The learnt policy is no longer limited to known environments with fully observable states, it can be deployed in the real world, where we have no implicit knowledge about objects in the scene.

#### Data Collection Mechanism[#](#data-collection-mechanism "Link to this heading")

The system uses a `DataCollectionManager` to gather comprehensive data at every step of the procedure. This enables robust dataset creation for downstream learning tasks.

#### Data Collected Per Step[#](#data-collected-per-step "Link to this heading")

At every step, we collect:

- ð¼ï¸ **RGB Images**: Captured from both room and wrist cameras
- ð **Depth Images**: Depth perception for each camera view
- ð·ï¸ **Semantic Segmentation Images**: (Optional) For pixel-level scene understanding
- ð§ **Robot Joint Velocities**: For motion analysis
- ð® **Actions**: Both relative and absolute actions taken by the robot
- ð¢ **Current State**: The active state in the state machine
- ðï¸ **Contact Forces**: Force feedback during interaction
- ð **Robot Observations**: Position and orientation data

All data is **stored in HDF5 format** following the [Robomimic](https://github.com/ARISE-Initiative/robomimic) dataset structure. This ensures compatibility with popular reinforcement learning frameworks.

Data is organized by episodes. An episode is one complete execution path through the state machine. In our case an episode therefore is one entire scanning procedure of the liver. Each episode is saved with a unique timestamps to prevent overwriting and facilitate easy retrieval.

---

### Code Instructions[#](#code-instructions "Link to this heading")

#### Synthetic Data Generation & Data Capture[#](#synthetic-data-generation-data-capture "Link to this heading")

State machines and teleoperation can serve us to collect expert demonstrations. We use these state machine to collect the datasets, and will stop the data collection after three episodes. Then, we copy the location of the saved dataset for the next task, validating and reviewing the dataset.

Run this command to perform the collection process.

```
python workflows/robotic\_ultrasound/scripts/simulation/environments/state\_machine/liver\_scan\_sm.py \
--enable\_camera \
--num\_episodes 3
```

**Expected Output:**
Look for the output folder in your terminal i.e.

```
[INFO]: Completed setting up the environment...
Dataset collector object
Storing trajectories in directory: /home/user/repos/github/i4h-workflows/data/hdf5/2025-07-29-13-46-Isaac-Teleop-Torso-FrankaUsRs-IK-RL-Rel-v0
Number of demos for collection : 3
Frequency for saving data to disk: 1
```

#### Prepare the Collected Dataset[#](#prepare-the-collected-dataset "Link to this heading")

Next, letâs convert the collected dataset to a Hugging Face [LeRobotDataset](https://github.com/huggingface/lerobot?tab=readme-ov-file#the-lerobotdataset-format) derived dataset, which is required for training and finetuning the VLA model. For GR00T N1, pass the datapath to your collected hdf5 dataset, e.g. `~/data/hdf5/2025-08-21-10-10-Isaac-Teleop-Torso-FrankaUsRs-IK-RL-Rel-v0` and run the conversion cell below. For more information on refer to the [Robot Data Conversion Guide](https://github.com/NVIDIA/Isaac-GR00T/blob/main/getting_started/LeRobot_compatible_data_schema.md).

```
export FILEPATH="~data/hdf5/2025-08-21-10-10-Isaac-Teleop-Torso-FrankaUsRs-IK-RL-Rel-v0"
```

```
cd "$I4H\_HOME/workflows/robotic\_ultrasound/scripts/training"
python convert\_hdf5\_to\_lerobot.py "$FILEPATH" --feature\_builder\_type gr00tn1 --include\_video --repo\_id gr00t\_ultrasound
```

Note

The resulting dataset is saved in `<user_dir>.cache/huggingface/lerobot/i4h/<repo_id>` by default.

- You can change the dataset name with `--repo_id new_name`, the location will be the same.
- `--include-video` is required for GR00T N1 finetuning.
- `--feature_builder_type gr00tn1` formats the data fields in the expected format for finetuning GR00T N1

To review the data, go ahead and open the folder. You can look through the data, meta, and videos subfolders to insepct the dataset.

We also uploaded the sample dataset we collected. You can download it from [here](#/static/gr00t_ultrasound.zip).

#### Process Termination[#](#process-termination "Link to this heading")

**Process Termination**: Use **Ctrl+C**, followed by running the script below to cleanly terminate all distributed processes.

```
./workflows/robotic\_ultrasound/reset.sh
```

On this page
