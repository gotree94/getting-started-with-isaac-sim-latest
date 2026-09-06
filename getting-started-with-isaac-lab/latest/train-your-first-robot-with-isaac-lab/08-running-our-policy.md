# Running our Policy[#](#running-our-policy "Link to this heading")

Now that weâve trained, we can run the simulation to validate our training. If you remember the command we used to run the `train.py` script from before, weâll simply change the file weâre running from **`train.py`** to **`play.py`**

```
python scripts/skrl/play.py --task=Template-Cartpole-v0
```

Note

We can pass other parameters to this command, such as `--num_envs` to configure the number of environment copies that will be on the stage. If your computer has trouble running all 4096 environments, using a smaller number such as the command below should help.

```
python scripts/skrl/play.py --task=Template-Cartpole-v0 --num\_envs=10
```

## Consider the following[#](#consider-the-following "Link to this heading")

- What happens if you change the rewards?
- Could you make the cartpole balance better than it does currently? How might you do that?
- What happens if you change the mass or length of the pole? What would need to change to achieve the same performance?

Tip

If youâve studied RL before, you might be wondering where the hyperparameters are defined for this project.

To view and edit these, see the following file in your project. For each section in the file, docs are linked for the SKRL library to explain the parameters. `source/Cartpole/Cartpole/tasks/manager_based/cartpole/agents/skrl_ppo_cfg.yaml`

On this page
