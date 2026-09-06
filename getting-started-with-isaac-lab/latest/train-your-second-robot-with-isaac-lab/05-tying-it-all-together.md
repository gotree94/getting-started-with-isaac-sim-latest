# Tying it all together[#](#tying-it-all-together "Link to this heading")

Now that our managers and scene are defined through classes, thereâs one more step: instantiate these classes and set them up in a Manager Based Environment Configuration. Weâll do that together next.

After this, weâre ready to start training!

## Instantiating managers[#](#instantiating-managers "Link to this heading")

Notice the lines such as `observations = ObservationsCfg()` are where we actually make an instance of the managers defined above.

We also set up key simulation parameters, including:

- the **number of environments** (copies of the training setup on the stage - remember the fleet of robots we saw before - how many are there?)
- the **physical spacing** between those environments
- **length of training episodes** (remember our MDP timeout termination condition)

  - A training episode is a single trial in which a robot interacts with a simulated environmentâstarting from an initial state, taking actions based on its policy, receiving observations and rewards, and continuing until it reaches a termination condition (like falling over or exceeding time limits), after which the environment resets and a new episode begins

There are more settings below, which weâll ignore for now, but you can read more [here](https://isaac-sim.github.io/IsaacLab/main/source/api/lab/isaaclab.sim.html#isaaclab.sim.SimulationCfg).

**Replace this class** in your `reach_env_cfg.py` file.

```
1@configclass
2class ReachEnvCfg(ManagerBasedRLEnvCfg):
3 """Configuration for the reach end-effector pose tracking environment."""
4
5 # Scene settings - how many robots, how far apart?
6 scene = ReachSceneCfg(num\_envs=2000, env\_spacing=2.5)
7 # Basic settings
8 observations = ObservationsCfg()
9 actions = ActionsCfg()
10 commands: CommandsCfg = CommandsCfg()
11 # MDP settings
12 rewards = RewardsCfg()
13 terminations = TerminationsCfg()
14 events = EventCfg()
15 curriculum = CurriculumCfg()
16
17 def \_\_post\_init\_\_(self):
18 """Post initialization."""
19 # general settings
20 self.decimation = 2
21 self.sim.render\_interval = self.decimation
22 self.episode\_length\_s = 3.0
23 self.viewer.eye = (3.5, 3.5, 3.5)
24 # simulation settings
25 self.sim.dt = 1.0 / 60.0
```

## Configuration for play[#](#configuration-for-play "Link to this heading")

During playback or the visualization of our results, we may want different environmental settings than we used at training.

For example, we may want less environment copies, or to remove randomization added to make our training more robust.

**Add the following class** below to create a custom environment configuration for playback.

```
1@configclass
2class ReachEnvCfg\_PLAY(ReachEnvCfg):
3 def \_\_post\_init\_\_(self):
4 # post init of parent
5 super().\_\_post\_init\_\_()
6 # make a smaller scene for play
7 self.scene.num\_envs = 50
8 self.scene.env\_spacing = 2.5
9 # disable randomization for play
10 self.observations.policy.enable\_corruption = False
```

## Register the entry point[#](#register-the-entry-point "Link to this heading")

Now to be able to reference this subclassed version of our environment, we need to add it to the `source/Reach/Reach/tasks/manager_based/reach/__init__.py` file. Note how the second `kwarg` references the class we made above.

**Add the following code** to the bottom of this file `source/Reach/Reach/tasks/manager_based/reach/__init__.py`, to register `ReachEnvCfg_PLAY` class as an additional entry point.

```
1gym.register(
2 id="Template-Reach-Play-v0",
3 entry\_point="isaaclab.envs:ManagerBasedRLEnv",
4 disable\_env\_checker=True,
5 kwargs={
6 "env\_cfg\_entry\_point": f"{\_\_name\_\_}.reach\_env\_cfg:ReachEnvCfg\_PLAY",
7 "skrl\_cfg\_entry\_point": f"{agents.\_\_name\_\_}:skrl\_ppo\_cfg.yaml",
8 },
9)
```

Weâll show how to invoke this later!

## Complete environment configuration[#](#complete-environment-configuration "Link to this heading")

Click to reveal the completed Python file `reach_env_cfg.py`

```
1# Copyright (c) 2022-2025, The Isaac Lab Project Developers.
2# All rights reserved.
3#
4# SPDX-License-Identifier: BSD-3-Clause
5
6import math
7import carb
8
9NUCLEUS\_ASSET\_ROOT\_DIR = carb.settings.get\_settings().get("/persistent/isaac/asset\_root/cloud")
10"""Path to the root directory on the Nucleus Server."""
11
12NVIDIA\_NUCLEUS\_DIR = f"{NUCLEUS\_ASSET\_ROOT\_DIR}/NVIDIA"
13"""Path to the root directory on the NVIDIA Nucleus Server."""
14
15ISAAC\_NUCLEUS\_DIR = f"{NUCLEUS\_ASSET\_ROOT\_DIR}/Isaac"
16"""Path to the ``Isaac`` directory on the NVIDIA Nucleus Server."""
17
18import isaaclab.sim as sim\_utils
19from isaaclab.assets import AssetBaseCfg
20from isaaclab.envs import ManagerBasedRLEnvCfg
21from isaaclab.managers import ActionTermCfg as ActionTerm
22from isaaclab.managers import CurriculumTermCfg as CurrTerm
23from isaaclab.managers import EventTermCfg as EventTerm
24from isaaclab.managers import ObservationGroupCfg as ObsGroup
25from isaaclab.managers import ObservationTermCfg as ObsTerm
26from isaaclab.managers import RewardTermCfg as RewTerm
27from isaaclab.managers import SceneEntityCfg
28from isaaclab.managers import TerminationTermCfg as DoneTerm
29from isaaclab.scene import InteractiveSceneCfg
30from isaaclab.utils import configclass
31from isaaclab.utils.noise import AdditiveUniformNoiseCfg as Unoise
32from isaaclab.sim.spawners.from\_files.from\_files\_cfg import GroundPlaneCfg
33
34from . import mdp
35
36##
37# Pre-defined configs
38##
39
40from .ur\_gripper import UR\_GRIPPER\_CFG # isort:skip
41
42##
43# Scene definition
44##
45
46@configclass
47class ReachSceneCfg(InteractiveSceneCfg):
48 """Configuration for a scene."""
49
50 # world
51 ground = AssetBaseCfg(
52 prim\_path="/World/ground",
53 spawn=sim\_utils.GroundPlaneCfg(),
54 init\_state=AssetBaseCfg.InitialStateCfg(pos=(0.0, 0.0, -1.05)),
55 )
56
57 # robot
58 robot = UR\_GRIPPER\_CFG.replace(prim\_path="{ENV\_REGEX\_NS}/Robot")
59
60 # lights
61 dome\_light = AssetBaseCfg(
62 prim\_path="/World/DomeLight",
63 spawn=sim\_utils.DomeLightCfg(color=(0.9, 0.9, 0.9), intensity=5000.0),
64 )
65
66 table = AssetBaseCfg(
67 prim\_path="{ENV\_REGEX\_NS}/Table",
68 spawn=sim\_utils.UsdFileCfg(
69 usd\_path=f"{ISAAC\_NUCLEUS\_DIR}/Props/Mounts/SeattleLabTable/table\_instanceable.usd",
70 ),
71 init\_state=AssetBaseCfg.InitialStateCfg(pos=(0.55, 0.0, 0.0), rot=(0.70711, 0.0, 0.0, 0.70711)),
72 )
73
74 # plane
75 plane = AssetBaseCfg(
76 prim\_path="/World/GroundPlane",
77 init\_state=AssetBaseCfg.InitialStateCfg(pos=[0, 0, -1.05]),
78 spawn=GroundPlaneCfg(),
79 )
80
81##
82# MDP settings
83##
84
85@configclass
86class ActionsCfg:
87 """Action specifications for the MDP."""
88
89 arm\_action: ActionTerm = mdp.JointPositionActionCfg(
90 asset\_name="robot",
91 joint\_names=["shoulder\_pan\_joint", "shoulder\_lift\_joint", "elbow\_joint", "wrist\_1\_joint", "wrist\_2\_joint", "wrist\_3\_joint"],
92 scale=.5,
93 use\_default\_offset=True,
94 debug\_vis=True
95 )
96
97@configclass
98class CommandsCfg:
99 """Command terms for the MDP."""
100
101 ee\_pose = mdp.UniformPoseCommandCfg(
102 asset\_name="robot",
103 body\_name="ee\_link", # This is the body in the USD file
104 resampling\_time\_range=(4.0, 4.0),
105 debug\_vis=True,
106 # These are essentially ranges of poses that can be commanded for the end of the robot during training
107 ranges=mdp.UniformPoseCommandCfg.Ranges(
108 pos\_x=(0.35, 0.65),
109 pos\_y=(-0.2, 0.2),
110 pos\_z=(0.15, 0.5),
111 roll=(0.0, 0.0),
112 pitch=(math.pi / 2, math.pi / 2),
113 yaw=(-3.14, 3.14),
114 ),
115 )
116
117@configclass
118class ObservationsCfg:
119 """Observation specifications for the MDP."""
120
121 @configclass
122 class PolicyCfg(ObsGroup):
123 """Observations for policy group."""
124
125 # observation terms (order preserved)
126 joint\_pos = ObsTerm(func=mdp.joint\_pos\_rel, noise=Unoise(n\_min=-0.01, n\_max=0.01))
127 joint\_vel = ObsTerm(func=mdp.joint\_vel\_rel, noise=Unoise(n\_min=-0.01, n\_max=0.01))
128 pose\_command = ObsTerm(func=mdp.generated\_commands, params={"command\_name": "ee\_pose"})
129 actions = ObsTerm(func=mdp.last\_action)
130
131 def \_\_post\_init\_\_(self):
132 self.enable\_corruption = True
133 self.concatenate\_terms = True
134
135 # observation groups
136 policy: PolicyCfg = PolicyCfg()
137
138@configclass
139class EventCfg:
140 """Configuration for events."""
141
142 reset\_robot\_joints = EventTerm(
143 func=mdp.reset\_joints\_by\_scale,
144 mode="reset",
145 params={
146 "position\_range": (0.75, 1.25),
147 "velocity\_range": (0.0, 0.0),
148 },
149 )
150
151@configclass
152class RewardsCfg:
153 """Reward terms for the MDP."""
154
155 # task terms
156 end\_effector\_position\_tracking = RewTerm(
157 func=mdp.position\_command\_error,
158 weight=-0.2,
159 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "command\_name": "ee\_pose"},
160 )
161 end\_effector\_position\_tracking\_fine\_grained = RewTerm(
162 func=mdp.position\_command\_error\_tanh,
163 weight=0.1,
164 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "std": 0.1, "command\_name": "ee\_pose"},
165 )
166
167 # action penalty
168 action\_rate = RewTerm(func=mdp.action\_rate\_l2, weight=-0.0001)
169 joint\_vel = RewTerm(
170 func=mdp.joint\_vel\_l2,
171 weight=-0.0001,
172 params={"asset\_cfg": SceneEntityCfg("robot")},
173 )
174
175@configclass
176class TerminationsCfg:
177 """Termination terms for the MDP."""
178
179 time\_out = DoneTerm(func=mdp.time\_out, time\_out=True)
180
181@configclass
182class CurriculumCfg:
183 """Curriculum terms for the MDP."""
184
185 action\_rate = CurrTerm(
186 func=mdp.modify\_reward\_weight, params={"term\_name": "action\_rate", "weight": -0.005, "num\_steps": 4500}
187 )
188
189 joint\_vel = CurrTerm(
190 func=mdp.modify\_reward\_weight, params={"term\_name": "joint\_vel", "weight": -0.001, "num\_steps": 4500}
191 )
192
193##
194# Environment configuration
195##
196
197@configclass
198class ReachEnvCfg(ManagerBasedRLEnvCfg):
199 """Configuration for the reach end-effector pose tracking environment."""
200
201 # Scene settings - how many robots, how far apart?
202 scene = ReachSceneCfg(num\_envs=2000, env\_spacing=2.5)
203 # Basic settings
204 observations = ObservationsCfg()
205 actions = ActionsCfg()
206 commands: CommandsCfg = CommandsCfg()
207 # MDP settings
208 rewards = RewardsCfg()
209 terminations = TerminationsCfg()
210 events = EventCfg()
211 curriculum = CurriculumCfg()
212
213 def \_\_post\_init\_\_(self):
214 """Post initialization."""
215 # general settings
216 self.decimation = 2
217 self.sim.render\_interval = self.decimation
218 self.episode\_length\_s = 3.0
219 self.viewer.eye = (3.5, 3.5, 3.5)
220 # simulation settings
221 self.sim.dt = 1.0 / 60.0
222
223@configclass
224class ReachEnvCfg\_PLAY(ReachEnvCfg):
225 def \_\_post\_init\_\_(self):
226 # post init of parent
227 super().\_\_post\_init\_\_()
228 # make a smaller scene for play
229 self.scene.num\_envs = 50
230 self.scene.env\_spacing = 2.5
231 # disable randomization for play
232 self.observations.policy.enable\_corruption = False
```

On this page
