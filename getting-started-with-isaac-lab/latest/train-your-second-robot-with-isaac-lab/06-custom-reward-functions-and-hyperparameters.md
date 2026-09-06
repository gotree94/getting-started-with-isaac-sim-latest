# Custom Reward Functions[#](#custom-reward-functions "Link to this heading")

In this lesson weâll add the underlying math functions that determine rewards for our policy. Our first approach will combine two forms of rewards for positional error (how far is the robot from a goal position).

## Defining custom reward functions[#](#defining-custom-reward-functions "Link to this heading")

In the **rewards** manager config file from earlier, we referenced a few MDP functions that donât exist yet. As the last step to setting up our task, letâs define those functions now. As mentioned before, weâll put these in an `mdp` folder for organization.

1. Open the following Python file: `source/Reach/Reach/tasks/manager_based/reach/mdp/rewards.py`
2. Delete the contents of this file, and **replace with the following** imports necessary for our next lesson.

```
1# Copyright (c) 2022-2025, The Isaac Lab Project Developers.
2# All rights reserved.
3#
4# SPDX-License-Identifier: BSD-3-Clause
5
6from \_\_future\_\_ import annotations
7
8import torch
9from typing import TYPE\_CHECKING
10
11from isaaclab.managers import SceneEntityCfg
12from isaaclab.utils.math import combine\_frame\_transforms
13
14from isaaclab.assets import RigidObject
15from isaaclab.managers import SceneEntityCfg
16from isaaclab.utils.math import combine\_frame\_transforms, quat\_error\_magnitude, quat\_mul
17
18
19if TYPE\_CHECKING:
20 from isaaclab.envs import ManagerBasedRLEnv
```

In the next module, weâll define new reward functions in this file.

Note

While knowing PyTorch, Linear Algebra, and Trigonometry will be key for your RL learning journey, donât worry if this is your first experience with these functions. Weâll walk through the âwhyâ behind the math.

## Position Command Error[#](#position-command-error "Link to this heading")

This function computes the position error between the desired position (from the command) and the current position of the assetâs body (in world frame). The position error is computed as the L2-norm of the difference between the desired and current positions.

**Whatâs an L2-norm?**  
The L2 norm, also known as the Euclidean norm, is a way to measure the length or magnitude of a vector in space.

**How does this function interact with the managers, and our scene?**  
The environment is passed in - this includes all the robots on the stage, hence the pytorch operations. This is where some of the **massively parallel nature of training is realized**!

We also referenced this function with one of our Reward Terms in the Reward Manager. Basically here we are saying, hereâs how to calculate that term, which gets summed into a final reward.

**Add this code** to your `Reach/tasks/manager_based/reach/mdp/rewards.py` file.

```
1def position\_command\_error(env: ManagerBasedRLEnv, command\_name: str, asset\_cfg: SceneEntityCfg) -> torch.Tensor:
2 """Penalize tracking of the position error using L2-norm.
3
4 The function computes the position error between the desired position (from the command) and the
5 current position of the asset's body (in world frame). The position error is computed as the L2-norm
6 of the difference between the desired and current positions.
7 """
8 # extract the asset (to enable type hinting)
9 asset: RigidObject = env.scene[asset\_cfg.name]
10 command = env.command\_manager.get\_command(command\_name)
11 # obtain the desired and current positions
12 des\_pos\_b = command[:, :3]
13 des\_pos\_w, \_ = combine\_frame\_transforms(asset.data.root\_state\_w[:, :3], asset.data.root\_state\_w[:, 3:7], des\_pos\_b)
14 curr\_pos\_w = asset.data.body\_state\_w[:, asset\_cfg.body\_ids[0], :3] # type: ignore
15 return torch.norm(curr\_pos\_w - des\_pos\_w, dim=1)
```

## Position Command Error Tanh[#](#position-command-error-tanh "Link to this heading")

This function computes the position error between the desired position from the command, and the current position of the assetâs body in world frame, and maps it with a tanh kernel.

**Why do we have a second Position Command reward term?**  
As this positional error gets closer to zero, the tanh function produces larger gradients compared to a linear error term. This amplifies weight updates for small mistakes, accelerating convergence towards the goal we want. It also limits the outputs between -1 and 1.

**Add this code** to your `Reach/tasks/manager_based/reach/mdp/rewards.py` file.

```
1def position\_command\_error\_tanh(
2 env: ManagerBasedRLEnv, std: float, command\_name: str, asset\_cfg: SceneEntityCfg
3) -> torch.Tensor:
4 """Reward tracking of the position using the tanh kernel.
5
6 The function computes the position error between the desired position (from the command) and the
7 current position of the asset's body (in world frame) and maps it with a tanh kernel.
8 """
9 # extract the asset (to enable type hinting)
10 asset: RigidObject = env.scene[asset\_cfg.name]
11 command = env.command\_manager.get\_command(command\_name)
12 # obtain the desired and current positions
13 des\_pos\_b = command[:, :3]
14 des\_pos\_w, \_ = combine\_frame\_transforms(asset.data.root\_state\_w[:, :3], asset.data.root\_state\_w[:, 3:7], des\_pos\_b)
15 curr\_pos\_w = asset.data.body\_state\_w[:, asset\_cfg.body\_ids[0], :3] # type: ignore
16 distance = torch.norm(curr\_pos\_w - des\_pos\_w, dim=1)
17 return 1 - torch.tanh(distance / std)
```

## Completed rewards file[#](#completed-rewards-file "Link to this heading")

Click to reveal the completed Python file `rewards.py`

```
1# Copyright (c) 2022-2025, The Isaac Lab Project Developers.
2# All rights reserved.
3#
4# SPDX-License-Identifier: BSD-3-Clause
5
6from \_\_future\_\_ import annotations
7
8import torch
9from typing import TYPE\_CHECKING
10
11from isaaclab.managers import SceneEntityCfg
12from isaaclab.utils.math import combine\_frame\_transforms
13
14from isaaclab.assets import RigidObject
15from isaaclab.managers import SceneEntityCfg
16from isaaclab.utils.math import combine\_frame\_transforms, quat\_error\_magnitude, quat\_mul
17
18if TYPE\_CHECKING:
19 from isaaclab.envs import ManagerBasedRLEnv
20
21def position\_command\_error(env: ManagerBasedRLEnv, command\_name: str, asset\_cfg: SceneEntityCfg) -> torch.Tensor:
22 """Penalize tracking of the position error using L2-norm.
23
24 The function computes the position error between the desired position (from the command) and the
25 current position of the asset's body (in world frame). The position error is computed as the L2-norm
26 of the difference between the desired and current positions.
27 """
28 # extract the asset (to enable type hinting)
29 asset: RigidObject = env.scene[asset\_cfg.name]
30 command = env.command\_manager.get\_command(command\_name)
31 # obtain the desired and current positions
32 des\_pos\_b = command[:, :3]
33 des\_pos\_w, \_ = combine\_frame\_transforms(asset.data.root\_state\_w[:, :3], asset.data.root\_state\_w[:, 3:7], des\_pos\_b)
34 curr\_pos\_w = asset.data.body\_state\_w[:, asset\_cfg.body\_ids[0], :3] # type: ignore
35 return torch.norm(curr\_pos\_w - des\_pos\_w, dim=1)
36
37def position\_command\_error\_tanh(
38 env: ManagerBasedRLEnv, std: float, command\_name: str, asset\_cfg: SceneEntityCfg
39) -> torch.Tensor:
40 """Reward tracking of the position using the tanh kernel.
41
42 The function computes the position error between the desired position (from the command) and the
43 current position of the asset's body (in world frame) and maps it with a tanh kernel.
44 """
45 # extract the asset (to enable type hinting)
46 asset: RigidObject = env.scene[asset\_cfg.name]
47 command = env.command\_manager.get\_command(command\_name)
48 # obtain the desired and current positions
49 des\_pos\_b = command[:, :3]
50 des\_pos\_w, \_ = combine\_frame\_transforms(asset.data.root\_state\_w[:, :3], asset.data.root\_state\_w[:, 3:7], des\_pos\_b)
51 curr\_pos\_w = asset.data.body\_state\_w[:, asset\_cfg.body\_ids[0], :3] # type: ignore
52 distance = torch.norm(curr\_pos\_w - des\_pos\_w, dim=1)
53 return 1 - torch.tanh(distance / std)
54
```

# Configuring Hyperparameters[#](#configuring-hyperparameters "Link to this heading")

## Settings and hyperparameters for PPO[#](#settings-and-hyperparameters-for-ppo "Link to this heading")

Lastly, letâs **replace the code** in `source/Reach/Reach/tasks/manager_based/reach/agents/skrl_ppo_cfg.yaml`.

The is a configuration file that defines the settings and hyperparameters for training our RL agents using the Proximal Policy Optimization (PPO) algorithm with the SKRL library.

This file is essential for customizing how PPO operates within Isaac Lab. While we wonât go into detail on these configurations, links are provided in the file below for further learning.

Read about the [intuition behind PPO](https://huggingface.co/blog/deep-rl-ppo#the-intuition-behind-ppo).

```
seed: 42
# Models are instantiated using skrl's model instantiator utility
# https://skrl.readthedocs.io/en/latest/api/utils/model\_instantiators.html
models:
separate: False
policy: # see gaussian\_model parameters
class: GaussianMixin
clip\_actions: False
clip\_log\_std: True
min\_log\_std: -20.0
max\_log\_std: 2.0
initial\_log\_std: 0.0
network:
- name: net
input: STATES
layers: [64, 64]
activations: elu
output: ACTIONS
value: # see deterministic\_model parameters
class: DeterministicMixin
clip\_actions: False
network:
- name: net
input: STATES
layers: [64, 64]
activations: elu
output: ONE
# Rollout memory
# https://skrl.readthedocs.io/en/latest/api/memories/random.html
memory:
class: RandomMemory
memory\_size: -1 # automatically determined (same as agent:rollouts)
# PPO agent configuration (field names are from PPO\_DEFAULT\_CONFIG)
# https://skrl.readthedocs.io/en/latest/api/agents/ppo.html
agent:
class: PPO
rollouts: 24
learning\_epochs: 5
mini\_batches: 4
discount\_factor: 0.99
lambda: 0.95
learning\_rate: 1.0e-03
learning\_rate\_scheduler: KLAdaptiveLR
learning\_rate\_scheduler\_kwargs:
kl\_threshold: 0.01
state\_preprocessor: RunningStandardScaler
state\_preprocessor\_kwargs: null
value\_preprocessor: RunningStandardScaler
value\_preprocessor\_kwargs: null
random\_timesteps: 0
learning\_starts: 0
grad\_norm\_clip: 1.0
ratio\_clip: 0.2
value\_clip: 0.2
clip\_predicted\_values: True
entropy\_loss\_scale: 0.01
value\_loss\_scale: 1.0
kl\_threshold: 0.0
rewards\_shaper\_scale: 1.0
time\_limit\_bootstrap: False
# logging and checkpoint
experiment:
directory: "reach\_ur10"
experiment\_name: ""
write\_interval: auto
checkpoint\_interval: auto
# Sequential trainer
# https://skrl.readthedocs.io/en/latest/api/trainers/sequential.html
trainer:
class: SequentialTrainer
timesteps: 24000
environment\_info: log
```

On this page
