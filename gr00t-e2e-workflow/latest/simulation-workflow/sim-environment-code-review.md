# Sim Environment Code Review[#](#sim-environment-code-review "Link to this heading")

In this lesson, weâll review the code that defines and registers the Unitree G1 static apple-to-plate environment in Isaac Lab-Arena.

- **Identify** the environment registration entry point for `galileo_g1_static_pick_and_place`.
- **Trace** how the background, apple, plate, embodiment, and teleoperation device are assembled.
- **Explain** why teleoperation records with `g1_wbc_agile_pink` and evaluation runs with `g1_wbc_agile_joint`.
- **Review** the task success logic used by the pick-and-place environment.

Tip

This section is theory-only. Prefer to skip to hands-on activities? [Move on to Sim Teleop and Whole-Body Control](sim-teleop-and-wbc.html).

Return here afterwards to help you understand the code that defines and registers the environment.

## Review the Environment[#](#review-the-environment "Link to this heading")

Letâs take a look at the code used to define and register this environment in Isaac Lab-Arena.

The static apple-to-plate workflow ships its own `GalileoG1StaticPickAndPlaceEnvironment` registered under `galileo_g1_static_pick_and_place`. It reuses the `galileo_locomanip` background USD environment and the same OpenXR retargeter as the loco-manipulation apple-to-plate environment.

The static task defaults to the `g1_wbc_agile_pink` embodiment, which uses AGILEâs end-to-end velocity policy, instead of `g1_wbc_pink`, which uses the HOMIE stand/walk pair.

The current source implementation keeps the apple and destination plate fixed for deterministic demonstrations, adds an invisible shelf support patch, locks the waist by default, applies tuned finger friction, and deactivates background boxes that would clutter the task workspace.

Why AGILE? (click to expand)

The static task never walks, so AGILEâs single-policy backend fits the no-locomotion task better. The apple and destination plate are placed on the same shelf so the robot never needs to drive its base. WBC holds the standing pose.

Recording vs. Evaluation Embodiment (click to expand)

Teleoperation uses the default `g1_wbc_agile_pink` embodiment, which uses PinkIK plus AGILE.

Closed-loop policy evaluation uses `g1_wbc_agile_joint`, which uses direct joint control plus AGILE.

Both share the same AGILE lower-body backend. The `_joint` twin bypasses PinkIK at inference because the policy trains on the joint-space targets that PinkIK produced during recording.

## Inspect the Environment Implementation[#](#inspect-the-environment-implementation "Link to this heading")

The environment registers a single-shelf pick-and-place scene with the G1, an apple, a clay plate, and an invisible support patch under the shelf workspace.

Starting with snippets, letâs analyze the code and build up to the complete environment registration.

## How the Environment Is Built[#](#how-the-environment-is-built "Link to this heading")

### Tuned Constants[#](#tuned-constants "Link to this heading")

The environment starts with tuned constants for shelf height, object placement, asset scale, shelf support, finger friction, and background prim cleanup.

[Source: tuned constants in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L44-L87)

```
1SHELF\_SURFACE\_Z = -0.030
2SHELF\_AIRGAP = 0.005
3SHELF\_SUPPORT\_PATCH\_SIZE = (0.8, 1.5, 0.04)
4SHELF\_SUPPORT\_PATCH\_CENTER = (0.62, 0.0, SHELF\_SURFACE\_Z - SHELF\_SUPPORT\_PATCH\_SIZE[2] / 2.0)
5
6PICK\_UP\_OBJECT\_SPAWN\_XY = (0.5785, 0.27)
7DESTINATION\_SPAWN\_XY = (0.5785, 0.06)
8APPLE\_SPAWN\_XY\_RANGE\_M = 0.0
9
10\_USD\_ORIGIN\_ABOVE\_BOTTOM\_M: dict[str, float] = {
11 "apple\_01\_objaverse\_robolab": 0.0171,
12 "clay\_plates\_hot3d\_robolab": 0.0,
13}
14
15\_TUNED\_SCALES: dict[str, tuple[float, float, float]] = {
16 TUNED\_PICK\_UP\_OBJECT\_NAME: (0.009, 0.009, 0.009),
17 TUNED\_DESTINATION\_NAME: (0.5, 0.5, 0.5),
18}
```

`APPLE_SPAWN_XY_RANGE_M` is currently `0.0`, so the apple spawn stays deterministic. The plate also remains fixed so the place target stays consistent across episodes.

### Asset and Device Registry[#](#asset-and-device-registry "Link to this heading")

The environment loads the background, pick-up object, destination, embodiment, and optional teleoperation device through Arenaâs registries.

The invisible shelf support is defined inline as a small `Object` spawner because it is specific to this static apple workspace.

[Source: asset setup in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L174-L218)

```
1class StaticShelfSupport(Object):
2 def \_\_init\_\_(self):
3 self.spawner\_cfg = sim\_utils.CuboidCfg(
4 size=SHELF\_SUPPORT\_PATCH\_SIZE,
5 collision\_props=sim\_utils.CollisionPropertiesCfg(contact\_offset=0.005),
6 visible=False,
7 )
8 super().\_\_init\_\_(
9 name="static\_pick\_place\_shelf\_support",
10 prim\_path="{ENV\_REGEX\_NS}/static\_pick\_place\_shelf\_support",
11 object\_type=ObjectType.SPAWNER,
12 initial\_pose=Pose(
13 position\_xyz=SHELF\_SUPPORT\_PATCH\_CENTER,
14 rotation\_xyzw=(0.0, 0.0, 0.0, 1.0),
15 ),
16 tags=["background", "procedural"],
17 )
18
19background = self.asset\_registry.get\_asset\_by\_name("galileo\_locomanip")()
20shelf\_support = StaticShelfSupport()
21pick\_up\_object = self.asset\_registry.get\_asset\_by\_name(args\_cli.object)(scale=\_asset\_scale(args\_cli.object))
22destination = self.asset\_registry.get\_asset\_by\_name(args\_cli.destination)(
23 scale=\_asset\_scale(args\_cli.destination)
24)
25embodiment = self.asset\_registry.get\_asset\_by\_name(args\_cli.embodiment)(
26 enable\_cameras=args\_cli.enable\_cameras,
27 lock\_waist=args\_cli.lock\_waist,
28)
29embodiment.set\_finger\_contact\_friction(
30 material\_path=G1\_STATIC\_FINGER\_FRICTION\_MATERIAL\_PATH,
31 static\_friction=G1\_STATIC\_FINGER\_STATIC\_FRICTION,
32 dynamic\_friction=G1\_STATIC\_FINGER\_DYNAMIC\_FRICTION,
33 prim\_name\_markers=G1\_STATIC\_FINGER\_PRIM\_NAME\_MARKERS,
34)
```

The static workflow shares `galileo_locomanip` with the loco-manipulation variant because the lighting, shelf geometry, and 23-D action layout are already tuned. The invisible shelf support patch gives the task objects a clean collision surface on the shelf workspace. The default `g1_wbc_agile_pink` embodiment swaps HOMIEâs stand/walk pair for AGILEâs single end-to-end velocity policy. The `g1_wbc_pink` embodiment remains available as an override. The current source locks the waist by default for this upper-body-only task and applies tuned finger friction to improve grasp behavior.

### Object Placement[#](#object-placement "Link to this heading")

[Source: object placement in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L220-L255)

```
1embodiment.set\_initial\_pose(
2 Pose(position\_xyz=(0.25, 0.08, 0.0), rotation\_xyzw=(0.0, 0.0, 0.0, 1.0))
3)
4embodiment.set\_joint\_initial\_pos(G1\_STATIC\_OPEN\_ARM\_JOINT\_POS)
5pick\_up\_object.set\_initial\_pose(
6 PoseRange(
7 position\_xyz\_min=(
8 pick\_up\_object\_x - APPLE\_SPAWN\_XY\_RANGE\_M,
9 pick\_up\_object\_y - APPLE\_SPAWN\_XY\_RANGE\_M,
10 pick\_up\_object\_z,
11 ),
12 position\_xyz\_max=(
13 pick\_up\_object\_x + APPLE\_SPAWN\_XY\_RANGE\_M,
14 pick\_up\_object\_y + APPLE\_SPAWN\_XY\_RANGE\_M,
15 pick\_up\_object\_z,
16 ),
17 rpy\_min=(0.0, 0.0, 0.0),
18 rpy\_max=(0.0, 0.0, 0.0),
19 )
20)
21destination.set\_initial\_pose(
22 Pose(position\_xyz=(destination\_x, destination\_y, \_shelf\_spawn\_z(args\_cli.destination)),
23 rotation\_xyzw=(0.0, 0.0, 0.0, 1.0))
24)
```

The robot pose is tuned for the same-shelf static task: slightly forward toward the table while preserving the lateral offset that keeps both arms usable. The controller dynamically lifts the pelvis at runtime, so the initial `z=0.0` pose is intentional. The apple still uses `PoseRange`, but its current range is zero for deterministic demonstrations. The plate stays fixed and within armâs reach.

### Scene Composition[#](#scene-composition "Link to this heading")

[Source: scene composition in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L276)

```
1scene = Scene(assets=[background, shelf\_support, pick\_up\_object, destination])
```

The static environment uses one shelf-anchored background, an invisible shelf support patch, the pick-up object, and the destination. No second table is needed because the plate sits on the same shelf as the apple.

### Environment Configuration Callback[#](#environment-configuration-callback "Link to this heading")

The source implementation deactivates selected background boxes and forces a camera rerender after reset.

[Source: environment configuration callback in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L259-L274)

```
1def env\_cfg\_callback(env\_cfg):
2 from isaaclab.managers import EventTermCfg
3
4 env\_cfg.events.deactivate\_static\_pick\_place\_background\_prims = EventTermCfg(
5 func=\_deactivate\_background\_prims,
6 mode="prestartup",
7 params={"prim\_relative\_paths": \_BACKGROUND\_PRIMS\_TO\_DEACTIVATE},
8 )
9 env\_cfg.num\_rerenders\_on\_reset = 1
10 return env\_cfg
```

The background deactivation removes clutter from the apple-to-plate workspace. The rerender prevents the first policy query after reset from seeing the previous episodeâs final camera frame.

### Pick-and-Place Task[#](#pick-and-place-task "Link to this heading")

[Source: task setup in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L257-L290)

```
1task\_description = args\_cli.task\_description
2
3task = PickAndPlaceTask(
4 pick\_up\_object=pick\_up\_object,
5 destination\_location=destination,
6 background\_scene=background,
7 episode\_length\_s=6.0,
8 task\_description=task\_description,
9 force\_threshold=0.5,
10 velocity\_threshold=0.1,
11)
```

The static environment uses `PickAndPlaceTask` directly. The task wires the apple, plate, background, six-second timeout, task description, and standard pick-and-place termination logic together. The CLI default for `--task_description` is `move the apple to the plate`. If you change `--object` or `--destination`, pass a matching `--task_description` explicitly. The `force_threshold` and `velocity_threshold` values mirror the loco-manipulation environment so success metrics are comparable.

### Isaac Lab-Arena Environment[#](#isaac-lab-arena-environment "Link to this heading")

[Source: environment assembly in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L276-L293)

```
1isaaclab\_arena\_environment = IsaacLabArenaEnvironment(
2 name=self.name,
3 embodiment=embodiment,
4 scene=scene,
5 task=task,
6 teleop\_device=teleop\_device,
7 env\_cfg\_callback=env\_cfg\_callback,
8)
```

This assembles the scene, embodiment, task, optional teleoperation device, and environment configuration callback into a runnable environment.

### Reviewing the Complete Registration Pattern[#](#reviewing-the-complete-registration-pattern "Link to this heading")

Now letâs look at the complete registration pattern, trimmed to the source sections that matter most for this workflow. Helper functions such as `_asset_scale()`, `_shelf_spawn_z()`, `_deactivate_background_prims()`, and the full `env_cfg_callback()` body are summarized above.

Static Apple-to-Plate Environment Definition

[Source: full environment definition in `galileo_g1_static_pick_and_place_environment.py`](https://github.com/isaac-sim/IsaacLab-Arena/blob/release/0.2.1/isaaclab_arena_environments/galileo_g1_static_pick_and_place_environment.py#L148-L328)

```
1from isaaclab\_arena\_environments.example\_environment\_base import ExampleEnvironmentBase
2
3SHELF\_SURFACE\_Z = -0.030
4SHELF\_AIRGAP = 0.005
5SHELF\_SUPPORT\_PATCH\_SIZE = (0.8, 1.5, 0.04)
6SHELF\_SUPPORT\_PATCH\_CENTER = (0.62, 0.0, SHELF\_SURFACE\_Z - SHELF\_SUPPORT\_PATCH\_SIZE[2] / 2.0)
7PICK\_UP\_OBJECT\_SPAWN\_XY = (0.5785, 0.27)
8DESTINATION\_SPAWN\_XY = (0.5785, 0.06)
9APPLE\_SPAWN\_XY\_RANGE\_M = 0.0
10
11\_USD\_ORIGIN\_ABOVE\_BOTTOM\_M = {
12 "apple\_01\_objaverse\_robolab": 0.0171,
13 "clay\_plates\_hot3d\_robolab": 0.0,
14}
15
16TUNED\_PICK\_UP\_OBJECT\_NAME = "apple\_01\_objaverse\_robolab"
17TUNED\_DESTINATION\_NAME = "clay\_plates\_hot3d\_robolab"
18
19
20class GalileoG1StaticPickAndPlaceEnvironment(ExampleEnvironmentBase):
21
22 name: str = "galileo\_g1\_static\_pick\_and\_place"
23
24 def get\_env(self, args\_cli):
25 from isaaclab import sim as sim\_utils
26
27 from isaaclab\_arena.assets.object import Object
28 from isaaclab\_arena.assets.object\_base import ObjectType
29 from isaaclab\_arena.environments.isaaclab\_arena\_environment import IsaacLabArenaEnvironment
30 from isaaclab\_arena.scene.scene import Scene
31 from isaaclab\_arena.tasks.pick\_and\_place\_task import PickAndPlaceTask
32 from isaaclab\_arena.utils.pose import Pose, PoseRange
33
34 background = self.asset\_registry.get\_asset\_by\_name("galileo\_locomanip")()
35
36 class StaticShelfSupport(Object):
37 def \_\_init\_\_(self):
38 self.spawner\_cfg = sim\_utils.CuboidCfg(
39 size=SHELF\_SUPPORT\_PATCH\_SIZE,
40 collision\_props=sim\_utils.CollisionPropertiesCfg(contact\_offset=0.005),
41 visible=False,
42 )
43 super().\_\_init\_\_(
44 name="static\_pick\_place\_shelf\_support",
45 prim\_path="{ENV\_REGEX\_NS}/static\_pick\_place\_shelf\_support",
46 object\_type=ObjectType.SPAWNER,
47 initial\_pose=Pose(
48 position\_xyz=SHELF\_SUPPORT\_PATCH\_CENTER,
49 rotation\_xyzw=(0.0, 0.0, 0.0, 1.0),
50 ),
51 tags=["background", "procedural"],
52 )
53
54 shelf\_support = StaticShelfSupport()
55 pick\_up\_object = self.asset\_registry.get\_asset\_by\_name(args\_cli.object)(scale=\_asset\_scale(args\_cli.object))
56 destination = self.asset\_registry.get\_asset\_by\_name(args\_cli.destination)(scale=\_asset\_scale(args\_cli.destination))
57 embodiment = self.asset\_registry.get\_asset\_by\_name(args\_cli.embodiment)(
58 enable\_cameras=args\_cli.enable\_cameras,
59 lock\_waist=args\_cli.lock\_waist,
60 )
61 embodiment.set\_finger\_contact\_friction(
62 material\_path=G1\_STATIC\_FINGER\_FRICTION\_MATERIAL\_PATH,
63 static\_friction=G1\_STATIC\_FINGER\_STATIC\_FRICTION,
64 dynamic\_friction=G1\_STATIC\_FINGER\_DYNAMIC\_FRICTION,
65 prim\_name\_markers=G1\_STATIC\_FINGER\_PRIM\_NAME\_MARKERS,
66 )
67
68 teleop\_device = (
69 self.device\_registry.get\_device\_by\_name(args\_cli.teleop\_device)()
70 if args\_cli.teleop\_device is not None else None
71 )
72
73 embodiment.set\_initial\_pose(
74 Pose(position\_xyz=(0.25, 0.08, 0.0), rotation\_xyzw=(0.0, 0.0, 0.0, 1.0))
75 )
76 embodiment.set\_joint\_initial\_pos(G1\_STATIC\_OPEN\_ARM\_JOINT\_POS)
77 pick\_up\_object\_x, pick\_up\_object\_y = PICK\_UP\_OBJECT\_SPAWN\_XY
78 destination\_x, destination\_y = DESTINATION\_SPAWN\_XY
79 pick\_up\_object\_z = \_shelf\_spawn\_z(args\_cli.object)
80 pick\_up\_object.set\_initial\_pose(
81 PoseRange(
82 position\_xyz\_min=(
83 pick\_up\_object\_x - APPLE\_SPAWN\_XY\_RANGE\_M,
84 pick\_up\_object\_y - APPLE\_SPAWN\_XY\_RANGE\_M,
85 pick\_up\_object\_z,
86 ),
87 position\_xyz\_max=(
88 pick\_up\_object\_x + APPLE\_SPAWN\_XY\_RANGE\_M,
89 pick\_up\_object\_y + APPLE\_SPAWN\_XY\_RANGE\_M,
90 pick\_up\_object\_z,
91 ),
92 rpy\_min=(0.0, 0.0, 0.0),
93 rpy\_max=(0.0, 0.0, 0.0),
94 )
95 )
96 destination.set\_initial\_pose(
97 Pose(position\_xyz=(destination\_x, destination\_y, \_shelf\_spawn\_z(args\_cli.destination)),
98 rotation\_xyzw=(0.0, 0.0, 0.0, 1.0))
99 )
100
101 task\_description = args\_cli.task\_description
102 # env\_cfg\_callback deactivates cluttering background prims and forces one camera rerender on reset.
103 scene = Scene(assets=[background, shelf\_support, pick\_up\_object, destination])
104 return IsaacLabArenaEnvironment(
105 name=self.name,
106 embodiment=embodiment,
107 scene=scene,
108 task=PickAndPlaceTask(
109 pick\_up\_object=pick\_up\_object,
110 destination\_location=destination,
111 background\_scene=background,
112 episode\_length\_s=6.0,
113 task\_description=task\_description,
114 force\_threshold=0.5,
115 velocity\_threshold=0.1,
116 ),
117 teleop\_device=teleop\_device,
118 env\_cfg\_callback=env\_cfg\_callback,
119 )
```

## Key Takeaways[#](#key-takeaways "Link to this heading")

We reviewed how Isaac Lab-Arena registers the static apple-to-plate environment, places the robot and task objects, keeps the current apple and plate poses deterministic, adds shelf support, locks the waist by default, applies tuned finger friction, chooses the AGILE-based embodiment, and wires success conditions through `PickAndPlaceTask`.

On this page
