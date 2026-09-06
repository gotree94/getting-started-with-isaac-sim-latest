# Training and Playback[#](#training-and-playback "Link to this heading")

Weâve seen every piece of the pipeline. Now letâs put it together: first run a full environment loop with random actions and collect statistics, then load a policy trained with PPO and watch the difference. Finally, weâll cover the commands that train and play back policies from a terminal.

In this lesson, we will:

- **Run** a full vectorized environment loop and interpret its reward statistics.
- **Contrast** random behavior with a trained policy.
- **Load and play back** a trained PPO checkpoint.
- **Train** your own policy with the provided RSL-RL scripts.

## Part 5: Putting It All Together[#](#part-5-putting-it-all-together "Link to this heading")

We build the environment, then step it for 1000 steps with **random** actions across 32 parallel environments, tracking the mean reward and how many episodes reset.

```
import gymnasium as gym
import torch
from franka\_cube.tasks.direct.franka\_cube.franka\_cube\_env\_cfg import FrankaCubeEnvCfg
env\_cfg = FrankaCubeEnvCfg()
env\_cfg.scene.num\_envs = 32
env = gym.make("Template-Franka-Cube-Direct-v0", cfg=env\_cfg)
obs, info = env.reset()
total\_rewards = []
num\_resets = 0
for i in range(1000):
with torch.inference\_mode():
actions = 2 \* torch.rand(
(env.unwrapped.num\_envs, env.unwrapped.cfg.action\_space),
device=env.unwrapped.device,
) - 1
obs, reward, terminated, truncated, info = env.step(actions)
total\_rewards.append(reward.mean().item())
num\_resets += (terminated | truncated).sum().item()
avg\_reward = sum(total\_rewards) / len(total\_rewards)
print(f"Full environment loop: 1000 steps x {env.unwrapped.num\_envs} envs")
print(f" Mean reward per step: {avg\_reward:.4f}")
print(f" Total environment resets: {int(num\_resets)}")
```

With random actions the robot flails and the cube falls off frequently, so the mean reward stays low and dominated by the always-on reaching term. A trained RL policy, by contrast, learns to coordinate seven arm actions and one coupled gripper action to reach, grasp, and lift.

## Part 6: Playing a Trained Policy[#](#part-6-playing-a-trained-policy "Link to this heading")

So far weâve used only random actions. Now letâs load a policy trained with PPO (Proximal Policy Optimization) and see what a trained agent looks like. The policy is a small MLP (256 â 128 â 64) that maps the 41-dimensional observation to 8-dimensional actions. It was trained with RSL-RL on the reach-grasp-lift reward from the previous lesson.

Use a checkpoint produced by the training workflow under `logs/rsl_rl/franka_cube/`. Loading it involves wrapping the environment for RSL-RL and restoring the actor weights:

```
import importlib.metadata as metadata
import os
from rsl\_rl.runners import OnPolicyRunner
from isaaclab\_rl.rsl\_rl import RslRlVecEnvWrapper, handle\_deprecated\_rsl\_rl\_cfg
from isaaclab\_tasks.utils import get\_checkpoint\_path
from franka\_cube.tasks.direct.franka\_cube.agents.rsl\_rl\_ppo\_cfg import PPORunnerCfg
from franka\_cube.tasks.direct.franka\_cube.franka\_cube\_env\_cfg import FrankaCubeEnvCfg
env\_cfg = FrankaCubeEnvCfg()
env\_cfg.scene.num\_envs = 32
env = gym.make("Template-Franka-Cube-Direct-v0", cfg=env\_cfg)
installed\_version = metadata.version("rsl-rl-lib")
agent\_cfg = handle\_deprecated\_rsl\_rl\_cfg(PPORunnerCfg(), installed\_version)
agent\_cfg.device = str(env.unwrapped.device)
env\_wrapped = RslRlVecEnvWrapper(env, clip\_actions=agent\_cfg.clip\_actions)
runner = OnPolicyRunner(env\_wrapped, agent\_cfg.to\_dict(), log\_dir=None, device=agent\_cfg.device)
log\_root\_path = os.path.abspath(os.path.join("logs", "rsl\_rl", agent\_cfg.experiment\_name))
checkpoint\_path = get\_checkpoint\_path(log\_root\_path, agent\_cfg.load\_run, agent\_cfg.load\_checkpoint)
runner.load(checkpoint\_path)
policy = runner.get\_inference\_policy(device=env.unwrapped.device)
```

Note

The checkpoint must be produced by the current RSL-RL training script. The runner and checkpoint schema must match; legacy RSL-RL 3.x checkpoints are not loaded by this canonical RSL-RL 5.x workflow.

With the policy loaded, the playback loop feeds observations to the policy instead of sampling random actions:

```
obs = env\_wrapped.get\_observations()
for i in range(1000):
with torch.inference\_mode():
actions = policy(obs)
obs, \_, \_, \_ = env\_wrapped.step(actions)
print("The robot should reach for the cube, close around it, and lift it.")
print("Compare this to the random flailing from earlier!")
```

Watching the trained policy after the random baseline is the payoff of the whole module: the same environment, the same physics, but a policy that has learned to coordinate the arm and gripper into a clean reach-grasp-lift.

## Running Training and Playback From a Shell[#](#running-training-and-playback-from-a-shell "Link to this heading")

The canonical, runnable path uses the provided RSL-RL scripts from a terminal. The commands differ depending on where you run them: on the Isaac Launchable, call Isaac Labâs Python through its wrapper (`isaaclab.sh -p`) and stream the UI with `--livestream 2`; locally, use the `python` interpreter that has Isaac Lab installed.

### Training[#](#training "Link to this heading")

First, train your own policy from scratch. The provided configuration runs for 3000 iterations and saves a checkpoint every 50 iterations. Training is compute-intensive and takes time depending on your GPU.

Train headless for maximum throughput:

Isaac Launchable

```
cd /workspace/franka\_cube
/workspace/isaaclab/isaaclab.sh -p scripts/rsl\_rl/train.py \
--task=Template-Franka-Cube-Direct-v0 \
--num\_envs=4096 \
--viz none
```

Local Isaac Lab

```
cd franka\_cube
python scripts/rsl\_rl/train.py \
--task=Template-Franka-Cube-Direct-v0 \
--num\_envs=4096 \
--viz none
```

To watch a smaller training run:

Isaac Launchable

```
cd /workspace/franka\_cube
/workspace/isaaclab/isaaclab.sh -p scripts/rsl\_rl/train.py \
--task=Template-Franka-Cube-Direct-v0 \
--num\_envs=32 \
--livestream 2 --viz kit
```

Local Isaac Lab

```
cd franka\_cube
python scripts/rsl\_rl/train.py \
--task=Template-Franka-Cube-Direct-v0 \
--num\_envs=32 \
--viz kit
```

### Playback[#](#playback "Link to this heading")

Once training finishes, play the policy back with the UI. The commands below pass the bundled `checkpoint/model_399.pt` explicitly, so `play.py` runs that final checkpoint instead of selecting a checkpoint automatically.

Isaac Launchable

```
cd /workspace/franka\_cube
/workspace/isaaclab/isaaclab.sh -p scripts/rsl\_rl/play.py \
--task=Template-Franka-Cube-Direct-v0 \
--num\_envs=16 \
--livestream 2 --viz kit \
--checkpoint /workspace/franka\_cube/checkpoint/model\_399.pt
```

Local Isaac Lab

```
cd franka\_cube
python scripts/rsl\_rl/play.py \
--task=Template-Franka-Cube-Direct-v0 \
--num\_envs=16 \
--viz kit \
--checkpoint checkpoint/model\_399.pt
```

Tip

Train headless with a large `--num_envs` (for example 4096) for throughput, and only attach the viewer (`--viz kit`, plus `--livestream 2` on the Isaac Launchable) when you play a policy back. Rendering every environment during training wastes GPU cycles you want spent on learning.

The final pretrained checkpoint is bundled at `franka_cube/checkpoint/model_399.pt`. Checkpoints from your own training runs are written under `franka_cube/logs/rsl_rl/franka_cube/`. Pass `--load_run` or `--checkpoint` to select a specific policy.

## Key Takeaways[#](#key-takeaways "Link to this heading")

You ran a full vectorized environment loop, measured random-action performance, and then loaded a trained PPO policy that reaches, grasps, and lifts the cube, a stark contrast to random flailing. You also learned the shell commands to train and play back policies. Youâve now gone from raw Newton concepts all the way to a trained robot-learning policy running on Newton physics inside Isaac Lab.

## Go Further With Reinforcement Learning[#](#go-further-with-reinforcement-learning "Link to this heading")

This module focused on running Newton physics inside an Isaac Lab RL task. To build deeper intuition for reinforcement learning itself, from the Markov decision process and reward design to training and evaluating policies, work through these companion courses:

- [Train Your First Robot in Isaac Lab](https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-lab/latest/train-your-first-robot-with-isaac-lab/index.html) â walks through a complete RL workflow end to end using the cartpole, covering task design, running training, and playing back the policy.
- [Train Your Second Robot in Isaac Lab](https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-lab/latest/train-your-second-robot-with-isaac-lab/index.html) â builds on the first with a UR10 reach task, including robot configuration, manager setup, and custom reward functions.

On this page
