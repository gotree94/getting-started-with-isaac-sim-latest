# Scene and Simulation Setup[#](#scene-and-simulation-setup "Link to this heading")

In this lesson, weâll bootstrap Isaac Lab, load the Franka cube task scene, and configure Newton as the physics engine. By the end youâll have a live environment stepping in simulation with the robot holding its default pose.

In this lesson, we will:

- **Bootstrap** an interactive notebook with `AppLauncher` and relate it to the scriptsâ `launch_simulation` lifecycle.
- **Inspect** how the task scene assembles a Franka, a cube, a table, and a ground plane.
- **Configure** the three-layer Newton simulation stack.
- **Build** the environment and step it with zero actions.

## Part 1: Initial Setup and Imports[#](#part-1-initial-setup-and-imports "Link to this heading")

For an interactive notebook, `AppLauncher` starts the application and enables the Viser web visualizer before the environment is constructed. The canonical external-project scripts use Isaac Lab 3.0âs `launch_simulation` context manager instead; this lets them resolve the task configuration and selected backends before starting the runtime.

```
from isaaclab.app import AppLauncher
app\_launcher = AppLauncher({"visualizer": ["viser"], "visualizer\_max\_worlds": 4})
simulation\_app = app\_launcher.app
import gymnasium as gym
import torch
import isaaclab\_tasks # noqa: F401
import franka\_cube.tasks # noqa: F401
from franka\_cube.tasks.direct.franka\_cube.franka\_cube\_env import FrankaCubeEnv
from franka\_cube.tasks.direct.franka\_cube.franka\_cube\_env\_cfg import FrankaCubeEnvCfg
```

Important

The runtime must be active before constructing or stepping the environment. In the notebook, create `AppLauncher` before the environment. In `random_agent.py`, `train.py`, and `play.py`, keep environment creation inside `with launch_simulation(env_cfg, args_cli):`.

The notebook version also defines display helpers (for example `display_active_viewer`) that embed the live Viser viewer inside Jupyter. Those are display conveniences and are not required to run the environment.

## Part 2: Defining the Scene[#](#part-2-defining-the-scene "Link to this heading")

The `FrankaCubeEnv` already implements the scene used by the task: a fixed-base Franka, a rigid cube, a SeattleLab table, and a shifted ground plane below the table. The scene is assembled in `_setup_scene`, which registers the Newton contact callback, spawns the robot and cube, adds the table and ground, clones the per-environment copies, and adds a dome light.

```
import isaaclab.sim as sim\_utils
from isaaclab.assets import Articulation, RigidObject
from isaaclab.sim.spawners.from\_files import GroundPlaneCfg, spawn\_ground\_plane
from isaaclab.utils.assets import ISAAC\_NUCLEUS\_DIR
def \_setup\_scene(self):
self.\_register\_newton\_contact\_callback()
self.robot = Articulation(self.cfg.robot\_cfg)
self.cube = RigidObject(self.cfg.cube)
spawn\_ground\_plane(prim\_path="/World/ground", cfg=GroundPlaneCfg(), translation=(0.0, 0.0, -1.05))
table\_cfg = sim\_utils.UsdFileCfg(usd\_path=f"{ISAAC\_NUCLEUS\_DIR}/Props/Mounts/SeattleLabTable/table\_instanceable.usd")
table\_cfg.func(
"/World/envs/env\_.\*/Table",
table\_cfg,
translation=(0.5, 0.0, 0.0),
orientation=(0.0, 0.0, 0.70711, 0.70711),
)
self.scene.clone\_environments(copy\_from\_source=False)
if self.device == "cpu":
self.scene.filter\_collisions(global\_prim\_paths=[])
self.scene.articulations["robot"] = self.robot
self.scene.rigid\_objects["cube"] = self.cube
light\_cfg = sim\_utils.DomeLightCfg(intensity=2000.0, color=(0.75, 0.75, 0.75))
light\_cfg.func("/World/Light", light\_cfg)
```

The call to `clone_environments` is what makes Isaac Lab fast: it replicates the single scene into many parallel environments on the GPU, which is essential for RL where we train across hundreds or thousands of environments at once.

## Part 3: Setting Up the Simulation[#](#part-3-setting-up-the-simulation "Link to this heading")

The key to running Isaac Lab with Newton is a **three-layer physics configuration**: `MJWarpSolverCfg` (the solver itself), wrapped by `NewtonCfg` (the physics engine), wrapped by `SimulationCfg` (top-level simulation parameters).

| Parameter | Value | Description |
| --- | --- | --- |
| `solver` | `"newton"` | Uses the Newton contact solver |
| `integrator` | `"implicitfast"` | Integration method (`"euler"`, `"rk4"`, `"implicit"`, `"implicitfast"`) |
| `njmax` | `2000` | Maximum number of constraints per world |
| `nconmax` | `1000` | Maximum number of contact points per world |
| `impratio` | `100.0` | Frictional-to-normal constraint impedance ratio |
| `cone` | `"elliptic"` | Contact friction cone (`"pyramidal"` or `"elliptic"`) |
| `iterations` | `20` | Number of solver iterations |
| `ls_iterations` | `100` | Number of line-search iterations |
| `ccd_iterations` | `80` | Extra continuous-collision passes for difficult contacts |
| `ls_parallel` | `True` | Enable parallel line search in MuJoCo |
| `use_mujoco_contacts` | `False` | Keep Newtonâs global contact defaults in control |

```
import isaaclab.sim as sim\_utils
from isaaclab\_newton.physics import MJWarpSolverCfg, NewtonCfg
from isaaclab.sim import SimulationCfg
notebook\_env\_cfg.decimation = 2
notebook\_env\_cfg.solver\_cfg = MJWarpSolverCfg(
solver="newton",
integrator="implicitfast",
njmax=2000,
nconmax=1000,
impratio=100.0,
cone="elliptic",
update\_data\_interval=2,
iterations=20,
ls\_iterations=100,
ccd\_iterations=80,
ls\_parallel=True,
use\_mujoco\_contacts=False,
)
notebook\_env\_cfg.newton\_cfg = NewtonCfg(
solver\_cfg=notebook\_env\_cfg.solver\_cfg,
num\_substeps=5,
debug\_mode=False,
)
notebook\_env\_cfg.sim = SimulationCfg(
dt=1 / 120,
render\_interval=notebook\_env\_cfg.decimation,
physics=notebook\_env\_cfg.newton\_cfg,
physics\_material=sim\_utils.RigidBodyMaterialCfg(
friction\_combine\_mode="multiply",
restitution\_combine\_mode="multiply",
static\_friction=1.0,
dynamic\_friction=1.0,
restitution=0.0,
),
)
```

Notice how the same solver ideas from *Newton Fundamentals* (integrator, iterations, cone type, contact limits) reappear here, just wrapped in Isaac Labâs configuration objects.

## Quick Test: Step the Environment[#](#quick-test-step-the-environment "Link to this heading")

With the configuration in place, we build the environment through the gym API and run it with zero actions so the robot holds its default pose. Building the environment takes a few minutes the first time while kernels compile.

```
env\_cfg = FrankaCubeEnvCfg()
env\_cfg.scene.num\_envs = 32
env = gym.make("Template-Franka-Cube-Direct-v0", cfg=env\_cfg)
obs, info = env.reset()
# Run with zero actions so the robot holds its default pose
for i in range(1000):
with torch.inference\_mode():
actions = torch.zeros(
(env.unwrapped.num\_envs, env.unwrapped.cfg.action\_space),
device=env.unwrapped.device,
)
obs, reward, terminated, truncated, info = env.step(actions)
print("Done! The scene is at rest with the robot in its default pose.")
```

## Running It End to End[#](#running-it-end-to-end "Link to this heading")

The canonical, runnable version of everything above lives in the `franka_cube` extension. Its scripts use `launch_simulation` to own startup and shutdown. To watch the untrained scene step with a random agent, run this from a JupyterLab terminal:

```
python scripts/random\_agent.py \
--task Template-Franka-Cube-Direct-v0 --num\_envs 32 --viz kit
```

For a bounded headless smoke test, replace `--viz kit` with `--viz none --max_steps 200`.

## Key Takeaways[#](#key-takeaways "Link to this heading")

You bootstrapped the notebook with `AppLauncher`, related that flow to the scriptsâ `launch_simulation` context, saw how the Franka cube scene is assembled and cloned, and configured Newton through the three-layer `MJWarpSolverCfg` â `NewtonCfg` â `SimulationCfg` stack. With a live environment stepping, weâre ready to define what the agent actually senses, does, and is rewarded for.

On this page
