# Tying It All Together[#](#tying-it-all-together "Link to this heading")

Letâs step back and look at the major steps for robot learning with Isaac Lab.

## Learning the Pipeline Flow[#](#learning-the-pipeline-flow "Link to this heading")

The robot learning pipeline flow can essentially be broken down into these seven steps:

1. You start with your assets in Isaac Sim. Isaac Sim provides the initial state from the physics simulation.
2. Isaac Lab processes this state from the simulator.
3. Noise is added to the state, which is crucial for sim-to-real scenarios.
4. The resulting observation is passed to the policy, which is the RL library you selected. Isaac Lab provides wrappers for external RL libraries and imitation learning libraries, so you can choose from various approaches for training your robots.
5. The policy generates actions.
6. This action returns to Isaac Sim for physics processing.
7. The cycle continues until task completion.

## Architecture of Isaac Lab[#](#architecture-of-isaac-lab "Link to this heading")

### Input[#](#input "Link to this heading")

To start working with Isaac Lab, the first thing you need is to have your assets ready. These assets include your robot, which is considered an asset itself, and other objects that will be part of your environment. For example, if youâre working on a pick-and-place task, youâll need the object to pick up and a surface to place it on. These are represented as USD files, which can be created in various ways.

You can design your assets or robots using Isaac Sim and export them as USD files. Alternatively, you can use custom software to design them and then convert them to USD using Isaac Sim converters. Isaac Sim supports several extensions like URDF and Mujoco, which can be converted to USD format.

Once you have your assets in USD format, you can bring them into Isaac Lab. Isaac Lab provides wrappers for MJCF (Mujoco) and URDF importers, allowing you to define your robot in these formats and load them as USD files directly in Isaac Lab. This process involves writing a configuration file that imports the robot file for use in Isaac Lab.

In some cases, you might want to modify these imported files. For instance, if you have a custom robot, you might want to add more physics properties or textures in Isaac Sim before exporting it again as a USD file. The output is simply a file with a specific name that Isaac Lab can understand for learning purposes.

---

### Configuration[#](#configuration "Link to this heading")

Once youâve prepared your assets, the next step is to write a configuration file. This file defines the properties of the assets needed to complete your task. In Isaac Lab, a scene is essentially a combination of all these assetsârobots, objects, sensors, and any other elements you need for your environment.

```
1ANYMAL\_C\_CFG = ArticulationCfg(
2 spawn=sim\_utils.UsdFileCfg(
3 usd\_path=f"{ISAACLAB\_NUCLEUS\_DIR}/Robots/ANYbotics/ANYmal-C/anymal\_c.usd",
4 # usd\_path=f"{ISAAC\_NUCLEUS\_DIR}/Robots/ANYbotics/anymal\_instanceable.usd",
5 activate\_contact\_sensors=True,
6 rigid\_props=sim\_utils.RigidBodyPropertiesCfg(
7 disable\_gravity=False,
8 retain\_accelerations=False,
9 linear\_damping=0.0,
10 angular\_damping=0.0,
11 max\_linear\_velocity=1000.0,
12 max\_angular\_velocity=1000.0,
13 max\_depenetration\_velocity=1.0,
14 ),
15 articulation\_props=sim\_utils.ArticulationRootPropertiesCfg(
16 enabled\_self\_collisions=True, solver\_position\_iteration\_count=4, solver\_velocity\_iteration\_count=0
17 ),
18 # collision\_props=sim\_utils.CollisionPropertiesCfg(contact\_offset=0.02, rest\_offset=0.0),
19 ),
20 init\_state=ArticulationCfg.InitialStateCfg(
21 pos=(0.0, 0.0, 0.6),
22 joint\_pos={
23 ".\*HAA": 0.0, # all HAA
24 ".\*F\_HFE": 0.4, # both front HFE
25 ".\*H\_HFE": -0.4, # both hind HFE
26 ".\*F\_KFE": -0.8, # both front KFE
27 ".\*H\_KFE": 0.8, # both hind KFE
28 },
29 ),
30 actuators={"legs": ANYDRIVE\_3\_LSTM\_ACTUATOR\_CFG},
31 soft\_joint\_pos\_limit\_factor=0.95,
32)
```

*An example of a configuration file and the corresponding scene.*

---

Isaac Lab provides configuration classes that allow you to define various types of assets in your scenes. While having knowledge of USD (Universal Scene Description) is beneficial for understanding the attributes available for different types of USD prims, itâs not always necessary for simpler tasks. For those, you can use âSimReadyâ assets provided by Isaac Lab, which are pre-configured and ready to use.

When you write a configuration file in Isaac Lab, it helps integrate different elements into your scene effectively. For example, if youâre training a robot like ANYmal to walk, your scene might include:

- **Ground Plane**: This is crucial to prevent the robot from falling indefinitely and to simulate a realistic ground.
- **Lighting**: Without proper lighting, the scene would be too dark to visualize effectively.
- **Contact Sensors**: These are essential for detecting when the robotâs feet touch the ground, which is vital for tasks involving movement.

The configuration file specifies initial states and properties such as whether gravity is enabled or how acceleration is managed. This setup allows Isaac Lab to understand and utilize your USD files effectively for training purposes.

By defining these elements in your configuration file, you set up an interactive scene in Isaac Lab tailored to your specific robotics task. This approach ensures that all necessary components are in place for successful task execution and learning.

---

### Define the Task Environment[#](#define-the-task-environment "Link to this heading")

After setting up your machine and assets, the next step is to define the task itself. This involves outlining key elements such as the reward function, states, and other necessary components. Isaac Lab follows a specific standard known as the Gymnasium API standard, which is widely used in the reinforcement learning community.

The Gymnasium API standard is crucial for registering environments in what is known as the Gymnasium registry. This registration process allows environments to be accessible and reusable across various learning algorithms and experiments. Essentially, it means that once you write an environment as a class, you can easily reuse it across different platforms by simply referring to its class name or a defined name associated with it. For example, a task might be named âIsaac-Franka-IK,â following a specific naming convention.

Registering your environment with the Gymnasium registry prevents the need to reinstantiate the class each time you want to use it, streamlining the process of switching between different tasks or experiments. This approach enhances efficiency and consistency in managing multiple environments within Isaac Lab.

### Wrap Environment[#](#wrap-environment "Link to this heading")

Once youâve defined your task, the next step is to wrap the environment. A wrapper environment in Isaac Lab is designed to modify or enhance the functionality of your environment without altering its core structure. This is particularly useful when you want to add additional features or adapt the environment to fit specific needs.

For instance, if you want to record video while training, you can use a video recording wrapper. Similarly, if youâre working with different reinforcement learning frameworks, you might need a wrapper that adjusts the input format to match the requirements of those frameworks. For example, some frameworks like Stable Baselines might require inputs in a specific format, such as PyTorch tensors, while others may have different requirements.

Isaac Lab provides several pre-built wrappers that support a variety of learning libraries. However, if youâre using a new or custom library, you might need to create your own wrapper. You can do this by following the existing examples provided for custom wrappers.

Wrappers also allow you to change the behavior of the environment dynamically. For example, if youâre training a robot like ANYmal to walk on different terrains, you might want to change the terrain order after certain training episodes or epochs. Additionally, you can modify reward functions for tasks like curriculum learning or impose time limits on tasks.

Overall, wrappers offer flexibility in adapting your environment to meet specific training requirements without needing to alter the underlying task structure. They enable you to tailor the environment according to your needs while maintaining consistency and reusability across different experiments and learning algorithms.

### Run Training[#](#run-training "Link to this heading")

Once youâve set up your simulation and wrapped your environment, the next step is to run the training. Isaac Lab offers various methods for running training tasks, whether youâre focusing on reinforcement learning or imitation learning.

Isaac Lab provides several algorithms to help you execute your tasks effectively. You can choose to implement your own library or task and run it using different computational setups. For instance, you can use a single GPU, such as an RTX 4090 desktop, for your training. Alternatively, if you require more computational power, you can opt for multi-GPU or multi-node training setups. Isaac Lab also supports cloud-based training, providing flexibility depending on your resources and needs.

After completing the training process, the next step is to test the policy youâve trained. Isaac Lab provides scripts that allow you to test and play back your trained policy within the environment it was developed in. This ensures that the policy performs as expected before deployment.

The typical outputs from a training session in Isaac Lab are files in `.pt` (PyTorch) and `.onnx` formats, which are used for deployment. Additionally, thereâs an option to optimize from `.pt` to `.jit`, enhancing performance for real-world applications.

Overall, running training in Isaac Lab involves following a structured process that includes setting up your environment, selecting appropriate algorithms, executing training sessions across various platforms, and testing the resulting policies. This approach ensures robust development and deployment of robotics tasks within Isaac Lab.

### Sim-to-Real Workflows[#](#sim-to-real-workflows "Link to this heading")

Transferring your robot learning policy from simulation to reality is no trivial process.

The sim-to-real workflow involves several key components that work together to translate simulated results into real-world actions. This process allows us to take a trained policy from simulation and deploy it on an actual robot. Hereâs how it typically unfolds.

#### Robots and Sensors[#](#robots-and-sensors "Link to this heading")

We start with our physical robot equipped with various sensors like lidars or cameras. These sensors are crucial for gathering data about the robotâs environment.

#### State Estimation[#](#state-estimation "Link to this heading")

The first step is to obtain the robotâs state. This can be challenging and often requires specialized tools:

Some robots, like ANYmal or Spot, come with custom state estimators.

For custom robots, you might use packages like Isaac Perceptor visual SLAM for camera-based state estimation or other Isaac ROS packages.

Other options include state estimation algorithms such as LIDAR-based packages for different sensing modalities.

#### Observation Extraction[#](#observation-extraction "Link to this heading")

Once we have the robotâs state, we need to extract the specific observations that match what we used during training. This is where the environment config from Isaac Lab comes in handy, as it provides information about the observations and actions used in training.

#### Model Inference[#](#model-inference "Link to this heading")

With the correct observations in hand, we pass them through our trained model. This model, typically in PyTorch or ONNX format, is the result of our simulation training in Isaac Lab.

#### Inference Runtime[#](#inference-runtime "Link to this heading")

To optimize performance, we can use specialized inference runtimes, like ONNX Runtime or TensorRT. These tools help wrap our model and perform faster inference.

#### Action Generation[#](#action-generation "Link to this heading")

The model outputs a commanded action, which is often a high-level control signal. For our example, it will specify desired joint positions.

#### Low-Level Control[#](#low-level-control "Link to this heading")

We then need a low-level action controller to translate the high-level commands into specific instructions for the robotâs actuators, such as PWM signals.

#### Execution and Iteration[#](#execution-and-iteration "Link to this heading")

Finally, we apply these actions to the robot, estimate the new state, and repeat the process, creating a continuous loop of observation, inference, and action.

### Practical Implementation[#](#practical-implementation "Link to this heading")

To implement this workflow, youâll need to write custom scripts for each component. While Isaac Lab doesnât provide dedicated sim-to-real scripts, it does offer:

- A trained policy (your model)
- The environment configuration

These serve as your starting points. You can look at public examples, like the [Spot robot implementation](https://developer.nvidia.com/blog/closing-the-sim-to-real-gap-training-spot-quadruped-locomotion-with-nvidia-isaac-lab/), to guide your own development.

### Applications[#](#applications "Link to this heading")

The sim-to-real approach has been successfully applied to various robots, including Boston Dynamicsâ Spot quadruped locomotion tasks.

These examples demonstrate the power of transferring simulated learning to real-world robotics applications.

Remember, the key to successful sim-to-real transfer is ensuring that your real-world state estimation and observation extraction closely match what was used in simulation. This alignment is crucial for the trained policy to perform effectively in the physical world.

On this page
