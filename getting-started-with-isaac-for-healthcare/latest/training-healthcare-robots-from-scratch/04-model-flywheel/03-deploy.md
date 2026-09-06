# Rollout a VLA Model in Simulation[#](#rollout-a-vla-model-in-simulation "Link to this heading")

**Policy rollout** means executing the modelâs learned policy within a controlled, virtual setting. Letâs explore a rollout for our Vision-Language-Action (VLA) model in a simulation environment.

During rollout:

- The VLA model **receives visual observations** and **language instructions** from the simulator. In our case we continously prompt the model to âperform a liver scanâ.
- It **predicts actions** based on these inputs.
- The predicted actions are **applied to the simulated agent or robot**.

Rolling out policies enables **safe, scalable testing** of policies. It allows to **evaluate performance**, **identify failure modes**, and **refine behaviors** before deploying the model in real-world scenarios.

To rollout the model we will start three processes:

1. **Inference Server** - Downloads a pretrained model and launches an inference server on a websocket
2. **Simulation Environment** - Launches the simulation environment, which publishes observations and subscribes to predicted actions from the inference server. The Isaac Sim window loads our environment, and the robot now moves based on the predictions from the VLA model
3. **Ultrasound Simulation** - Launches ultrasound simulation
4. **Visualization** - Visualizes the camera data and ultrasound simulation data that is passed on the DDS bus. This tool allows streaming and visualizing data out of Isaac Sim. It can visualize the simulated sensor data from Isaac Sim and from external simulation tools like the ultrasound simulation

---

## Rollout: Policy-Based Control With GR00T N1[#](#rollout-policy-based-control-with-gr00t-n1 "Link to this heading")

The full rollout-command includes the ultrasound simulation and visualization GUI again. Note that we now pass a specific `--ckpt_path`. If you trained your own model with the command from last module, substitute your checkpoint folder here to rollout your own model. Otherwise, you can point to the cache folder, and use the model that has been trained on ~200 episodes.

**Command Arguments:**

- `--policy gr00tn1`: Specifies the policy type to use (GR00T N1 model). This will also trigger downloading a pre-trained model if it is not already in our cache folder.
- `--chunk_length 16`: Sets the sequence length for processing temporal data chunks. This means the model predicts the next 16 actions, and waits until the robot has reached the final pose, before running inference again. This parameter can be changed in `SinglePandaUSDataConfig`. This action horizon is an experimental tradeoff between realistic execution plans and effiecient computation. In our case 16 is long enough to capture useful behavior windows, but not so long that computation and planning become wasteful.
- `--enable_cameras`: Enables camera sensors in the simulation environment. This is required, since we need to pass visual information between the VLA model inference server and our simulation application.
- `--ckpt_path`: Path to the specific model checkpoint to load for inference. Try using your own!

---

### Run the Rollout Command[#](#run-the-rollout-command "Link to this heading")

First, letâs set an environment variable for convenience.

```
export CKPT\_PATH="<user\_dir>.cache/i4h-assets/8c0bf782eab2f44f1cc82da60eb10f6be8f941406d291b7fbfbdb53c05b3d149/Policies/LiverScan/GR00TN1\_Cosmos\_Rel"
```

Next, letâs perform the rollout and test the completely automated, robotic ultrasound!
We use a subshell to launch our application, combining four child tasks, in an isolated environment. The `wait` guarantees all parallel tasks finish cleanly before the subshell exits.

```
conda activate robotic\_ultrasound
(
python -m policy\_runner.run\_policy \
--policy gr00tn1 \
--chunk\_length 16 \
--ckpt\_path $CKPT\_PATH &
python -m simulation.environments.sim\_with\_dds \
--enable\_cameras &
python -m simulation.examples.ultrasound\_raytracing &
python -m utils.visualization &
wait
)
```

---

### Process Termination[#](#process-termination "Link to this heading")

**Process Termination**: Use **Ctrl+C** followed by the script below to cleanly terminate all distributed processes.

```
./workflows/robotic\_ultrasound/reset.sh
```

### Videos[#](#videos "Link to this heading")

#### Model Rollout[#](#model-rollout "Link to this heading")

In this video, we rollout our finetuned GR00T N1 model. Finally, we can test how well the model is performing on some new randomly sampled scene configurations.
The scene randomization will place the phantom in random poses on the table within some bounds. The robot is now fully controlled by GR00T N1, a vision language action model, that is repeatedly asked to perform a liver scan.

Note

You can also launch the applications individually to see their terminal output, or want to adjust some of their behavior.

Important

Troubleshooting: In case you run into a numpy error with the simulation environment, try downgrading numpy: `pip install numpy==1.26.4`

Important

Now that weâre done with the course, if you set `PYTHONPATH` in the earlier section of the course, you may want to remove that from your `.bashrc` file so as to not conflict with other projects.

#### Code Deep Dive Model Training and Rollout[#](#code-deep-dive-model-training-and-rollout "Link to this heading")

In this video, we dive into the code for model training and rollout. We discuss the training script and its configuration file. Then we discuss how the two applications, `run_policy` and `sim_with_dds` communicate through the data distribution service to exchange scene data and robot states. We take a closer look at the policy runner, which hosts the trained GR00T N1 model, consuming camera data and robot states to predict the robots next actions. Finally we walk through the sim\_with\_dds.py script to understand how the DDS communication works, and when the policy runner is queried to predict new actions for the robot.

On this page
