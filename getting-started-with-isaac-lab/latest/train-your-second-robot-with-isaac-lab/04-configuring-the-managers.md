# Configuring the managers[#](#configuring-the-managers "Link to this heading")

Going back to the Markov Decision Process framework, letâs apply it to the problem at hand.

## Inspecting the code[#](#inspecting-the-code "Link to this heading")

1. Open the file: `/Reach/tasks/manager_based/reach/reach_env_cfg.py`

   - This is where weâll configure all the various managers for our task. First, letâs set up our environment with the robot, a ground plane, and a light.

There are two types of functions weâll engage with:

**Built-in MDP functions**

- These come with Isaac Lab and cover common parameters needed, such as `mdp.joint_pos_rel`
- Learn more about the built in MDP functions for creating Observation Terms in the docs [here](https://isaac-sim.github.io/IsaacLab/main/source/api/lab/isaaclab.envs.mdp.html).

**Custom functions**

- When a built-in function doesnât exist, we write one. Itâs a common practice in Isaac Lab manager workflows to create an `mdp` folder to house the functions.

Letâs work on our main class where we define all the managers, then weâll come back and fill in the custom MDP functions.

## Actions[#](#actions "Link to this heading")

These define what the agent can do. In our situation, itâs moving all 6 revolute joints of the robot. Weâll be leveraging the built in `JointPositionActionCfg` class. The joint names are taken from our robotâs joints in the USD file. We donât have to provide prim paths for these, theyâll be located for us.

Tip

Joint names can also be defined using regular expressions. So if your robot had joints named similarly like: joint\_1, joint\_2, etc, you could simply use `joint_.*` to select them all. Here weâre using explicit names for clarity.

**Replace this class** in your `reach_env_cfg.py` file.

```
1@configclass
2class ActionsCfg:
3 """Action specifications for the MDP."""
4
5 arm\_action: ActionTerm = mdp.JointPositionActionCfg(
6 asset\_name="robot",
7 joint\_names=["shoulder\_pan\_joint", "shoulder\_lift\_joint", "elbow\_joint", "wrist\_1\_joint", "wrist\_2\_joint", "wrist\_3\_joint"],
8 scale=1,
9 use\_default\_offset=True,
10 debug\_vis=True
11 )
```

## Commands[#](#commands "Link to this heading")

This sounds a lot like actions, and itâs related. But these are higher-level task specifications, of what to achieve, rather than *how* to achieve it (actions). Commands are the goal, actions are the means to the goal.

**Add this class** to your `reach_env_cfg.py` file.

```
1@configclass
2class CommandsCfg:
3 """Command terms for the MDP."""
4
5 ee\_pose = mdp.UniformPoseCommandCfg(
6 asset\_name="robot",
7 body\_name="ee\_link", # This is the body in the USD file
8 resampling\_time\_range=(4.0, 4.0),
9 debug\_vis=True,
10# These are essentially ranges of poses that can be commanded for the end of the robot during training
11 ranges=mdp.UniformPoseCommandCfg.Ranges(
12 pos\_x=(0.35, 0.65),
13 pos\_y=(-0.2, 0.2),
14 pos\_z=(0.15, 0.5),
15 roll=(0.0, 0.0),
16 pitch=(math.pi / 2, math.pi / 2),
17 yaw=(-3.14, 3.14),
18 ),
19 )
```

## Observations[#](#observations "Link to this heading")

These are measurements to take from the environment that are needed to evaluate our task. In this case itâs:

- Where the end effector of the robot is
- What the positions of the joints are
- Where the end effector of the robot is
- What the velocities of the joints are.

With these observations, we can evaluate the smoothness of the motion and if the robot is close to its goal position.

Observations can be grouped together, and in this case we simply have observations relevant for the policy.

Finally, the `self.enable_corruption = True` line allows observations to be âcorruptedâ by noise. In the code below, the noise is added as a parameter to the `joint_pos` and `joint_vel` observation terms. This noise helps simulate real-world sensor noise, improve policy robustness, and prevent overfitting to clean data.

**Replace this class** in your `reach_env_cfg.py` file.

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
10 joint\_pos = ObsTerm(func=mdp.joint\_pos\_rel, noise=Unoise(n\_min=-0.01, n\_max=0.01))
11 joint\_vel = ObsTerm(func=mdp.joint\_vel\_rel, noise=Unoise(n\_min=-0.01, n\_max=0.01))
12 pose\_command = ObsTerm(func=mdp.generated\_commands, params={"command\_name": "ee\_pose"})
13 actions = ObsTerm(func=mdp.last\_action)
14
15 def \_\_post\_init\_\_(self):
16 self.enable\_corruption = True
17 self.concatenate\_terms = True
18
19 # observation groups
20 policy: PolicyCfg = PolicyCfg()
21
```

## Terminations[#](#terminations "Link to this heading")

What defines done for a training episode? Is it success, or maybe we know a situation where we want to abort to avoid wasting time? Weâll use a simple timeout here to stop our task after a certain amount of time. The actual *value* for this duration will be provided by the episode length set later.

**Replace this class** in your `reach_env_cfg.py` file.

```
1@configclass
2class TerminationsCfg:
3 """Termination terms for the MDP."""
4
5 time\_out = DoneTerm(func=mdp.time\_out, time\_out=True)
```

### Consider the Following[#](#consider-the-following "Link to this heading")

If our task were more complicated, what kind of terminations might you use for efficient training? Examples: we may consider certain poses to be a termination condition, or collisions with other objects, or too high of a velocity.

## Events[#](#events "Link to this heading")

For our project, weâll only handle the âresetâ event. A reset event happens when the training event ends. By configuring this EventTerm, we call a function to reset the joints with a bit of randomness.

More specifically, in this case weâre using the built-in `mdp.reset_joints_by_scale` [function](https://isaac-sim.github.io/IsaacLab/main/source/api/lab/isaaclab.envs.mdp.html#isaaclab.envs.mdp.events.reset_joints_by_scale), which resets the robot joints by scaling the default position and velocity by the given ranges.

**Replace this class** in your `reach_env_cfg.py` file.

```
1@configclass
2class EventCfg:
3 """Configuration for events."""
4
5 reset\_robot\_joints = EventTerm(
6 func=mdp.reset\_joints\_by\_scale,
7 mode="reset",
8 params={
9 "position\_range": (0.75, 1.25),
10 "velocity\_range": (0.0, 0.0),
11 },
12 )
```

### Consider the Following[#](#id1 "Link to this heading")

Remember when we talked about how difficult this kind of training would be with a physical robot? Consider now how these few lines of code allow you to simply reset the robot, and the environment.

## Reward[#](#reward "Link to this heading")

This is one of the key aspects of our challenge. How do we define our reward function? In fact we have several reward functions to help achieve this task.

Thereâs a lot of code in this class, so letâs break it down.

1. Track end-effector position - where is the end of the robot?
2. Track end-effector position, fine-grained
3. Penalize action rate
4. Penalize joint velocity

**Replace this class** in your `reach_env_cfg.py` file.

```
1@configclass
2class RewardsCfg:
3 """Reward terms for the MDP."""
4
5 # task terms
6 end\_effector\_position\_tracking = RewTerm(
7 func=mdp.position\_command\_error,
8 weight=-0.2,
9 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "command\_name": "ee\_pose"},
10 )
11 end\_effector\_position\_tracking\_fine\_grained = RewTerm(
12 func=mdp.position\_command\_error\_tanh,
13 weight=0.1,
14 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "std": 0.1, "command\_name": "ee\_pose"},
15 )
16
17 # action penalty
18 action\_rate = RewTerm(func=mdp.action\_rate\_l2, weight=-0.0001)
19 joint\_vel = RewTerm(
20 func=mdp.joint\_vel\_l2,
21 weight=-0.0001,
22 params={"asset\_cfg": SceneEntityCfg("robot")},
23 )
```

Note that some of the functions, such as `mdp.orientation_command_error` are not built-in functions, so weâll need to define those soon.

Also keep in mind that Isaac Lab will handle calculating the rewards for a given state, based on this sort of configuration data we provide.

## Curriculum[#](#curriculum "Link to this heading")

These provide us ways to further configure more detailed training instructions, known as a curriculum.

**Add this class** to your `reach_env_cfg.py` file.

```
1@configclass
2class CurriculumCfg:
3 """Curriculum terms for the MDP."""
4
5 action\_rate = CurrTerm(
6 func=mdp.modify\_reward\_weight, params={"term\_name": "action\_rate", "weight": -0.005, "num\_steps": 4500}
7 )
8
9 joint\_vel = CurrTerm(
10 func=mdp.modify\_reward\_weight, params={"term\_name": "joint\_vel", "weight": -0.001, "num\_steps": 4500}
11 )
```

On this page
