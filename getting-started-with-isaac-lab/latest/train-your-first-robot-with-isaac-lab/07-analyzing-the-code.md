# Analyzing the Code[#](#analyzing-the-code "Link to this heading")

Letâs analyze this code to connect the idea of the MDP framework to Isaac Labâs Manager-based workflow, along with some of the math that aids our training process. Each one of these major ideas or âManagersâ is defined by a Python `@configclass.`

Open the following Python file, and letâs take a closer look at how the MDP elements are defined in code: **source/Cartpole/Cartpole/tasks/manager\_based/cartpole/cartpole\_env\_cfg.py**

## Termination[#](#termination "Link to this heading")

When does a training episode end? The carts terminate their training episode when they get too far away from where they started, or after a timeout. At some point, the results from this episode are so far off itâs best to move on.

```
1@configclass
2class TerminationsCfg:
3 """Termination terms for the MDP."""
4
5 # (1) Time out
6 time\_out = DoneTerm(func=mdp.time\_out, time\_out=True)
7 # (2) Cart out of bounds
8 cart\_out\_of\_bounds = DoneTerm(
9 func=mdp.joint\_pos\_out\_of\_manual\_limit,
10 params={"asset\_cfg": SceneEntityCfg("robot", joint\_names=["slider\_to\_cart"]), "bounds": (-3.0, 3.0)},
11 )
```

## Action[#](#action "Link to this heading")

The cart can apply an effort to move the cart left or right.

```
1@configclass
2class ActionsCfg:
3 """Action specifications for the MDP."""
4
5 joint\_effort = mdp.JointEffortActionCfg(asset\_name="robot", joint\_names=["slider\_to\_cart"], scale=100.0)
```

## Observations[#](#observations "Link to this heading")

We observe both the position and velocity of the cart.

```
1@configclass
2class ObservationsCfg:
3 """Observation specifications for the MDP."""
4
5 @configclass
6 class PolicyCfg(ObsGroup):
7 """Observations for policy group."""
8
9 # observation terms (order preserved)
10 joint\_pos\_rel = ObsTerm(func=mdp.joint\_pos\_rel)
11 joint\_vel\_rel = ObsTerm(func=mdp.joint\_vel\_rel)
```

## Rewards[#](#rewards "Link to this heading")

We reward several things, with different weights. Before you read on, take a second and think about how you might describe balancing with the cartpole in physics terms. Itâs okay if youâre not sure, weâll explain it all below.

Hereâs what rewards worked for this task:

- Reward the robot for maintaining the training. Balancing is a *continuous* task, which has no definite end like dropping a ball in a bucket would.
- Penalize strongly for terminating. If the cart flies off the screen, thatâs bad.
- Reward for keeping the pole upright, meaning staying close to the target position of â0.0â for this particular mechanism.
- Reward a lower cart velocity. In other words, encourage slow movements to balance.
- Reward for lower pole velocity.

```
1@configclass
2class RewardsCfg:
3 """Reward terms for the MDP."""
4
5
6 # (1) Constant running reward
7 alive = RewTerm(func=mdp.is\_alive, weight=1.0)
8 # (2) Failure penalty
9 terminating = RewTerm(func=mdp.is\_terminated, weight=-2.0)
10 # (3) Primary task: keep pole upright
11 pole\_pos = RewTerm(
12 func=mdp.joint\_pos\_target\_l2,
13 weight=-1.0,
14 params={"asset\_cfg": SceneEntityCfg("robot", joint\_names=["cart\_to\_pole"]), "target": 0.0},
15 )
16 # (4) Shaping tasks: lower cart velocity
17 cart\_vel = RewTerm(
18 func=mdp.joint\_vel\_l1,
19 weight=-0.01,
20 params={"asset\_cfg": SceneEntityCfg("robot", joint\_names=["slider\_to\_cart"])},
21 )
22 # (5) Shaping tasks: lower pole angular velocity
23 pole\_vel = RewTerm(
24 func=mdp.joint\_vel\_l1,
25 weight=-0.005,
26 params={"asset\_cfg": SceneEntityCfg("robot", joint\_names=["cart\_to\_pole"])},
27 )
28
```

Note that in this âManager workflowâ weâre using, the function that actually calculates the reward is passed into the `func` parameter. See `mdp/rewards.py` or read on to learn more about that function.

Letâs look at that reward function for `joint_position`. Critically, this function doesnât just calculate the reward for one environment, but for *all* the environments! Remember, we are actually training multiple cartpoles at the same time for accelerated, parallel training, leveraging [PyTorch tensors](https://docs.pytorch.org/tutorials/beginner/introyt/tensors_deeper_tutorial.html).

The steps inside this function are:

- Get the Articulation from the scene. An articulation is the collection of physics joints that define the cartpole mechanism.
- Wrap the joint positions to always be in terms of -pi to pi radians.
- Using the distance formula (joint\_pos - target)^2, return the sum of all elements in the input tensor, a kind of data container that can hold values in one or more dimensions.

Note

If you looked closely, you mightâve noticed multiple reward functions, but only one is explicitly defined in `rewards.py`. Why?

Thatâs because Isaac Lab provides some common reward functions for us, so we donât have to redefine them across projects. These come from the `mdp` package. See a full list of available functions [here](https://isaac-sim.github.io/IsaacLab/main/source/api/lab/isaaclab.envs.mdp.html#module-isaaclab.envs.mdp).

```
1def joint\_pos\_target\_l2(env: ManagerBasedRLEnv, target: float, asset\_cfg: SceneEntityCfg) -> torch.Tensor:
2 """Penalize joint position deviation from a target value."""
3 # extract the used quantities (to enable type-hinting)
4 asset: Articulation = env.scene[asset\_cfg.name]
5 # wrap the joint positions to (-pi, pi)
6 joint\_pos = wrap\_to\_pi(asset.data.joint\_pos[:, asset\_cfg.joint\_ids])
7 # compute the reward
8 return torch.sum(torch.square(joint\_pos - target), dim=1)
```

## Scene and Environment Configuration[#](#scene-and-environment-configuration "Link to this heading")

Weâve looked at the major components in isolation - the managers, and underlying math of the reward function. Now letâs look at how it all gets tied together into a training scene.

First, thereâs a Scene Config.

Here we see how the training environment is set up, from ground plane, to robot, to the dome light. Isaac Lab lets us customize the training environment itself, so we donât have to put lights or other elements directly into our robotâs USD file that are only needed for this training. If we needed other props for training, such as objects to grasp, we could add them in a similar way here.

```
1@configclass
2class CartpoleSceneCfg(InteractiveSceneCfg):
3 """Configuration for a cart-pole scene."""
4
5 # ground plane
6 ground = AssetBaseCfg(
7 prim\_path="/World/ground",
8 spawn=sim\_utils.GroundPlaneCfg(size=(100.0, 100.0)),
9 )
10
11 # robot
12 robot: ArticulationCfg = CARTPOLE\_CFG.replace(prim\_path="{ENV\_REGEX\_NS}/Robot")
13
14 # lights
15 dome\_light = AssetBaseCfg(
16 prim\_path="/World/DomeLight",
17 spawn=sim\_utils.DomeLightCfg(color=(0.9, 0.9, 0.9), intensity=500.0),
18 )
```

And now, finally, this is where everything comes together, in the Environment Configuration.

For all the managers defined above, this is where they are instantiated. We also configure the simulator, decimation, time settings, and episode length. The important part here is noting how Isaac Lab is controlling some of these aspects of Isaac Sim to perform our training.

```
1##
2# Environment configuration
3##
4
5@configclass
6class CartpoleEnvCfg(ManagerBasedRLEnvCfg):
7 # Scene settings
8 scene: CartpoleSceneCfg = CartpoleSceneCfg(num\_envs=4096, env\_spacing=4.0)
9 # Basic settings
10 observations: ObservationsCfg = ObservationsCfg()
11 actions: ActionsCfg = ActionsCfg()
12 events: EventCfg = EventCfg()
13 # MDP settings
14 rewards: RewardsCfg = RewardsCfg()
15 terminations: TerminationsCfg = TerminationsCfg()
16
17 # Post initialization
18 def \_\_post\_init\_\_(self) -> None:
19 """Post initialization."""
20 # general settings
21 self.decimation = 2
22 self.episode\_length\_s = 5
23 # viewer settings
24 self.viewer.eye = (8.0, 0.0, 5.0)
25 # simulation settings
26 self.sim.dt = 1 / 120
27 self.sim.render\_interval = self.decimation
```

And because Isaac Lab is controlling the simulator, we have a special ability to âstepâ the simulation through time. Instead of running freely, we can pause, do some work, then execute a certain amount of time, and repeat.

Okay, now are you ready to see our trained policy in action? Letâs try it out!

On this page
