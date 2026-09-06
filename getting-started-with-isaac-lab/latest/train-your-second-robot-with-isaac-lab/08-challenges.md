# Optional Challenges[#](#optional-challenges "Link to this heading")

Are you eager to push your skills further? Try completing these challenges, or just take some time to ponder them before moving on! Share your progress or questions on the [NVIDIA Omniverse Discord](https://discord.com/invite/nvidiaomniverse), specifically in this [channel](https://discord.com/channels/827959428476174346/1387135971920838736). Use **#rl-challenge**.

## Challenge 1[#](#challenge-1 "Link to this heading")

To take this training further, letâs imagine your team has tasked you with lifting an object off of the table, such as the Dextra cube asset provided in the Isaac Lab Nucleus server, using the robot we configured in this module. How would you accomplish this?

- What observations might be needed?
- How would you design the rewards?
- Explore if there are existing Isaac Lab examples in the repo you could use as reference

## Challenge 2[#](#challenge-2 "Link to this heading")

Letâs imagine youâve designed this task, but we need to instead adapt it to a different robot such as a humanoid. For example, look at Pollen Robotics new humanoid, [Reachy 2](https://github.com/pollen-robotics/reachy2_mujoco). How would we train a Reach task, using one arm of Reachy? Below are a set of rough steps and ideas to get you started.

- Convert the MuJoCo file provided in the repo to USD. See this [tutorial](https://docs.isaacsim.omniverse.nvidia.com/latest/importer_exporter/ext_isaacsim_asset_importer_urdf.html) for help.

  - Make sure there is only one Articulation Root present in the converted file
- Tune the joints for the arm
- Test in Isaac Sim
- Create an Isaac Lab configuration, using the base Reach task, where only the actuators for one arm are configured
- Train the task, are the rewards

On this page
