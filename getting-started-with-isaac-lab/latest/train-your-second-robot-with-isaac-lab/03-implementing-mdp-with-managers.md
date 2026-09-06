# Manager Configuration[#](#manager-configuration "Link to this heading")

## Overview[#](#overview "Link to this heading")

Now itâs time to implement our task code. This is where we take our idea of what the robot is going to be taught, and describe it in terms of the Markov Decision Process framework, and the math to calculate those actions, observations, and rewards.

This is where weâll dive deeper on Isaac Lab, and how it enables reinforcement learning for projects like ours.

Letâs keep going!

Tip

If you havenât already, we recommend taking our [first module](../train-your-first-robot-with-isaac-lab/index.html) on Isaac Lab, then coming back to this section.

## Implementing MDP With Managers[#](#implementing-mdp-with-managers "Link to this heading")

### Task design workflows[#](#task-design-workflows "Link to this heading")

The manager-based workflow is one of two task design workflows in Isaac Lab. Both the **manager** and **direct** workflow have different strengths.

The manager-based workflow is a bit more of a time investment to set up compared to the direct workflow, but it pays dividends in terms of re-use. Tasks can be easily broken down and reused across different projects, and the separation of components reduces the chance of errors in component interactions. Different team members can work on separate subtasks, making it ideal for highly collaborative projects.

The direct workflow has several benefits. Itâs easy to learn and implement. A single class handles the entire environment, which is suitable for complex logic that canât be easily split into components. This approach also allows for code optimization through techniques like JIT tracing. Having everything in a single script can make the code more error-prone due to its complexity. Itâs also less reusable since the task is often defined specifically for a particular scenario.

Ultimately, the choice between direct and manager-based workflows depends on your project needs, team structure, and familiarity with the system. Both approaches have their merits, and you can always explore the other option as you become more comfortable with Isaac Lab.

| Workflow Type |  |
| --- | --- |
| **Direct Workflow** | Gives you direct, detailed control by writing all environment logic in one script. |
|  | Simple to learn and quick to set up. |
|  | Good for complex tasks that are hard to split into parts. |
|  | Familiar to users of Isaac Gym, which used this style. |
| **Manager-based Workflow** | Highly modular and scalableâideal for teams and flexible projects. |
|  | Breaks down environment logic (actions, rewards, resets, etc.) into separate, reusable manager classes. |
|  | Handles much of the setup for you, reducing manual coding. |
|  | Easier to debug and less prone to logic errors. |
|  | Supports collaboration and faster prototyping after the initial setup. |
|  | Recommended for new Isaac Lab users. |

Learn more about these two task design workflows [in the Isaac Lab docs.](https://isaac-sim.github.io/IsaacLab/main/source/overview/core-concepts/task_workflows.html)

### Using the manager-based workflow[#](#using-the-manager-based-workflow "Link to this heading")

In Isaac Labâs **manager-based workflow**, there are a number of classes to represent the core parts of Markov Decision Process, as we covered in the first module. Remember, this is our key framework for designing the reinforcement learning task.

- Rewards
- Actions
- Observations
- Curriculum
- Events

Think of these as collaborative entities that will work together to complete our training. Each manager will be represented in code by a class in Python.

After we implement these classes, denoted with the `@configclass` decorator, weâll compose them into an environment configuration where Isaac Lab will internally handle how these managers interact.

We **define the managers**, then **Isaac Lab coordinates them.**

This means you can focus on defining the individual modules and managers - these building blocks - then let Isaac Lab handle more of the behind-the-scenes orchestration. Isaac Labâs design also encourages re-use of these building blocks, especially with the manager-based workflow.

Note

The following code is based on the [reach](https://github.com/isaac-sim/IsaacLab/blob/main/source/isaaclab_tasks/isaaclab_tasks/manager_based/manipulation/reach/reach_env_cfg.py) task that ships as an example with Isaac Lab. You may notice other examples in the Isaac Lab simply subclass the base ReachEnvCfg and replace parameters to [adapt to a particular robot](https://github.com/isaac-sim/IsaacLab/blob/main/source/isaaclab_tasks/isaaclab_tasks/manager_based/manipulation/reach/config/ur_10/joint_pos_env_cfg.py).

Note

Why arenât we subclassing the ReachEnvCfg class in this module?
Weâre showing the code this way for legibility, so you can see the complete manager definitions in one file. However, it would be good re-use practice to subclass the original reach task and override parameters as needed.

Tip

`@configclass` is a convenient way to store data in classes. Read more [here](https://configclasses.readthedocs.io/en/latest/guide/).

On this page
