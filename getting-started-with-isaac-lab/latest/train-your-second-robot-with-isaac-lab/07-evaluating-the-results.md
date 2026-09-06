# Evaluating the Results[#](#evaluating-the-results "Link to this heading")

## Run the policy[#](#run-the-policy "Link to this heading")

Run the following command, notice how weâre using the **Play** version of the task we created earlier.

```
python scripts/skrl/play.py --task Template-Reach-Play-v0
```

Tip

For performance, you may want to even further limit the number of environments loaded during play. To control this, use the `--num_envs` parameter like this: `python scripts/skrl/play.py --task Template-Reach-Play-v0 --num_envs 100`

Hereâs what an example trial looks like. Did it do what we expected?

## The problem[#](#the-problem "Link to this heading")

Well, thereâs a problem - while our robot moves to the right **position** in space, the **orientation** of the robot isnât changing to meet the goal pose. How do we fix this?

If you want a challenge, consider trying to solve this on your own before seeing the solution below.

## Improving the rewards[#](#improving-the-rewards "Link to this heading")

Letâs add another reward for orientation.

First, letâs address the Reward manager by adding another Reward Term.

**Add the new RewTerm** to your `reach_env_cfg.py` file, under RewardsCfg.

```
1@configclass
2class RewardsCfg:
3 """Reward terms for the MDP."""
4
5 #
6 # ADD this code
7 #
8 end\_effector\_orientation\_tracking = RewTerm(
9 func=mdp.orientation\_command\_error,
10 weight=-0.1,
11 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "command\_name": "ee\_pose"},
12 )
13
14 # task terms
15 end\_effector\_position\_tracking = RewTerm(
16 func=mdp.position\_command\_error,
17 weight=-0.2,
18 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "command\_name": "ee\_pose"},
19 )
20 end\_effector\_position\_tracking\_fine\_grained = RewTerm(
21 func=mdp.position\_command\_error\_tanh,
22 weight=0.1,
23 params={"asset\_cfg": SceneEntityCfg("robot", body\_names=["ee\_link"]), "std": 0.1, "command\_name": "ee\_pose"},
24 )
25
26 # action penalty
27 action\_rate = RewTerm(func=mdp.action\_rate\_l2, weight=-0.0001)
28 joint\_vel = RewTerm(
```

Next weâll add the corresponding function that our **`func=mdp.orientation_command_error,`** argument is expecting. Remember, this is where the math happens.

# Adding an orientation reward[#](#adding-an-orientation-reward "Link to this heading")

This function computes the error between the desired end-effector orientation from the command, and the current position of the end-effector.

**Add this code** to your `Reach/tasks/manager_based/reach/mdp/rewards.py` file.

```
1def orientation\_command\_error(env: ManagerBasedRLEnv, command\_name: str, asset\_cfg: SceneEntityCfg) -> torch.Tensor:
2 """Penalize tracking orientation error using shortest path.
3
4 The function computes the orientation error between the desired orientation (from the command) and the
5 current orientation of the asset's body (in world frame). The orientation error is computed as the shortest
6 path between the desired and current orientations.
7 """
8 # extract the asset (to enable type hinting)
9 asset: RigidObject = env.scene[asset\_cfg.name]
10 command = env.command\_manager.get\_command(command\_name)
11 # obtain the desired and current orientations
12 des\_quat\_b = command[:, 3:7]
13 des\_quat\_w = quat\_mul(asset.data.root\_state\_w[:, 3:7], des\_quat\_b)
14 curr\_quat\_w = asset.data.body\_state\_w[:, asset\_cfg.body\_ids[0], 3:7] # type: ignore
15 return quat\_error\_magnitude(curr\_quat\_w, des\_quat\_w)
```

# Train and review the policy, again[#](#train-and-review-the-policy-again "Link to this heading")

Letâs evaluate how our new reward affects the policy by re-running the training, and reviewing the results.

As before, you can add the `--headless` argument to forego seeing Isaac Sim viewport and speed-up training, or not use the argument to watch the training live.

Running without `--headless` has debugging benefits of watching the robots as they learn. And especially when youâre starting out, it can be fun to watch the process evolve.

## Option 1: Train in Headless Mode[#](#option-1-train-in-headless-mode "Link to this heading")

**Run the following command:**

```
python scripts/skrl/train.py --task Template-Reach-v0 --headless
```

## Option 2: Train With Visualization[#](#option-2-train-with-visualization "Link to this heading")

**Run the following command:**

```
python scripts/skrl/train.py --task Template-Reach-v0
```

## Review results after training[#](#review-results-after-training "Link to this heading")

**Run the following command:**

```
python scripts/skrl/play.py --task Template-Reach-Play-v0
```

Note

If you have issues running the code, you can open the files provided with this module and either compare or copy them over your work to get to a known-good configuration.

# Reward Engineering[#](#reward-engineering "Link to this heading")

## How are reward functions determined?[#](#how-are-reward-functions-determined "Link to this heading")

At this point, you may be thinking: **how did we come up with these reward functions?** While we explained the function of each reward, where did the **idea** to define those particular rewards come from?

These rewards we wrote above are not the only solution for this problem, they are just one particular solution that works for this robot and this task.

Beyond finding rewards that can give optimal behavior, rewards can also be evaluated on how quickly they can train, and on the robustness of the resulting behavior.

How to design rewards for a given task is a huge topic, and can be a continual engineering task. This could be a whole module, and weâre really scratching the surface here to get started and show you some of whatâs possible!

## How can we make training faster?[#](#how-can-we-make-training-faster "Link to this heading")

We could pursue strategies like: optimizing colliders, meshes, making sure models are instanceable. Or, using more GPU resources, cloud resources, etc.

Note

Read about Simulation Performance tips for [Isaac Lab in the docs](https://isaac-sim.github.io/IsaacLab/main/source/how-to/simulation_performance.html).

# Training, Evaluating, and Iterating[#](#training-evaluating-and-iterating "Link to this heading")

## Overview[#](#overview "Link to this heading")

Now that everything is configured in our project, letâs do a quick test of our robot configuration, then begin training and evaluating our policy.

## Testing With zero\_agent and random\_agent[#](#testing-with-zero-agent-and-random-agent "Link to this heading")

Isaac Lab provides a few scripts to perform basic tests of our configuration. Running these can help isolate issues with our environment.

1. Run the following command:

```
python scripts/zero\_agent.py --task Template-Reach-v0 --num\_envs=10
```

- This will open an an environment where instances of our robot are loaded, but they wonât move. This is a useful initial test that our robot loads properly.

2. Run the following command:

```
python scripts/random\_agent.py --task Template-Reach-v0 --num\_envs=10
```

- This will add some noise to the articulation in the scene, letting us see that the joints are all moving. Itâs a simple sanity-check before we proceed to training.

For both commands, the **ânum\_envs** flag is used to override the configured number of parallel environments. Since weâre only doing a quick check, we can load the scene faster by reducing this number to 10.

The task name **Template-Reach-v0** was generated along with our project, and was registered with Isaac Lab during the install process. It can be changed later if you needed, and you can see where it was defined in `source/Reach/Reach/tasks/manager_based/reach/__init__.py`. We can also define more entry points here, such as the playback-focused configuration.

## Training[#](#training "Link to this heading")

We have a few more options for training.

Using the `--headless` argument will forego the Isaac Sim viewport and speed-up training.

Tip

Running *without* `--headless` has debugging benefits because you can watch the robots as they learn. And especially when youâre starting out, it can be fun to watch the process evolve.

### Option 1: Train in Headless Mode[#](#id1 "Link to this heading")

**Run the following command:**

```
python scripts/skrl/train.py --task Template-Reach-v0 --headless
```

### Option 2: Train With Visualization[#](#id2 "Link to this heading")

**Run the following command:**

```
python scripts/skrl/train.py --task Template-Reach-v0
```

Remember, this will take more computational resources to run this mode.

Note

If you have errors when running the code, you can open the files provided with this module and either compare or copy them over your work to get to a known-good configuration.

On this page
