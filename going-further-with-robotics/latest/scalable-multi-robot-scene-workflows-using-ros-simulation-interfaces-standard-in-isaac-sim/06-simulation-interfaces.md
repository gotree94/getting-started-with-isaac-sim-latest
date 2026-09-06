# Introducing Simulation Interfaces[#](#introducing-simulation-interfaces "Link to this heading")

## Overview[#](#overview "Link to this heading")

[Simulation Interfaces](https://github.com/ros-simulation/simulation_interfaces) is a standard set of ROS 2 interfaces for interacting with simulators.

These interfaces provide a consistent way to communicate with various simulation environments, enabling developers to write more portable and reusable code.

By defining common messages and services, the simulation\_interfaces package aims to reduce the effort required to integrate different simulators into a ROS 2 system, fostering greater interoperability within the robotics community.

The [Simulation Control extension](https://github.com/isaac-sim/IsaacSim/tree/main/source/extensions/isaacsim.ros2.sim_control) in Isaac Sim uses the ROS 2 Simulation Interfaces to control Isaac Sim functions. This extension is designed to be scalable, allowing multiple services and actions to run simultaneously with little performance overhead.

Features supported in Isaac Sim:

- The extension provides the following ROS 2 services:

  - `/get_simulator_features`: Lists the supported features in this Isaac Sim implementation
  - `/set_simulation_state`: Set simulation to specific state (stopped/playing/paused/quitting)
  - `/get_simulation_state`: Get current simulation state
  - `/get_entities`: Get list of all entities (prims) in the simulation
  - `/get_entity_info`: Get detailed information about a specific entity (currently returns OBJECT category type)
  - `/get_entity_state`: Get the pose, twist, and acceleration of a specific entity
  - `/get_entities_states`: Get the states (pose, twist, acceleration) of multiple entities with filtering
  - `/delete_entity`: Delete a specific entity (prim) from the simulation
  - `/spawn_entity`: Spawn a new entity into the simulation at a specified location
  - `/reset_simulation`: Reset the simulation environment to its initial state
  - `/set_entity_state`: Sets the state (pose, twist) of a specific entity in the simulation
  - `/step_simulation`: Step the simulation forward by a specific number of frames
  - `/load_world`: Load a world or environment file into the simulation
  - `/unload_world`: Unload the current world and create an empty stage
  - `/get_current_world`: Get information about the currently loaded world
  - `/get_available_worlds`: Get a list of available world files that can be loaded
- And the following ROS 2 actions:

  - `/simulate_steps`: Action for stepping the simulation with progress feedback

For more detailed information see the [Simulation Control extension tutorial](https://docs.isaacsim.omniverse.nvidia.com/latest/ros2_tutorials/tutorial_ros2_simulation_control.html).

Before proceeding, ensure that the `ROS_DOMAIN_ID` environment variable is set in your terminal.

```
export ROS\_DOMAIN\_ID=42 # Replace number with your own station number
```

### Nomenclature[#](#nomenclature "Link to this heading")

A âworldâ in Isaac Sim is the entire simulated environment, defined by a USD file, including static and dynamic elements, physics, lighting, and ROS integration.

Only one world can be loaded in at a time. In order to load a new world, the current world is automatically unloaded first.

An âentityâ is any individual, interactive object within that world, such as robots, props, sensors, or robot components (links and joints). Entities are represented as âprimsâ in the USD scene graph and their properties can be manipulated. An entity can be spawned from a USD file into the stage as a prim as well.

While trying out the following services, feel free to browse the corresponding interfaces definitions inside of `sim_control_script_and_carter_ws/simulation_interfaces/srv`, `sim_control_script_and_carter_wssimulation_interfaces/msg` and `sim_control_script_and_carter_ws/simulation_interfaces/action`.

### LoadWorld Service[#](#loadworld-service "Link to this heading")

1. In Isaac Sim, stop simulation if it is playing.
2. Open a new stage by going to **File > New**.
3. In a ROS-sourced terminal, load the empty warehouse scene into simulation with the simulation interface command below:

```
source ~/.bashrc
ros2 service call /load\_world simulation\_interfaces/srv/LoadWorld "{uri: '${ROSCON25\_ASSET\_PATH}Starting\_Point/Empty\_Warehouse\_Scene.usd'}"
```

This should load the empty warehouse in Isaac Sim!

### GetCurrentWorld Service[#](#getcurrentworld-service "Link to this heading")

1. Retrieve the name of the USD file currently loaded in simulation.

```
ros2 service call /get\_current\_world simulation\_interfaces/srv/GetCurrentWorld
```

2. Notice in the response, that the value returned has a URI corresponding to the USD file we just loaded.

### Setting Simulation States[#](#setting-simulation-states "Link to this heading")

By using a different `state` value, we can change the state of the simulation.

- 1 = playing
- 2 = paused
- 0 = stopped

1. To play simulation:

```
ros2 service call /set\_simulation\_state simulation\_interfaces/srv/SetSimulationState "{state: {state: 1}}" # 1=playing
```

2. To pause the simulation:

```
ros2 service call /set\_simulation\_state simulation\_interfaces/srv/SetSimulationState "{state: {state: 2}}" # 2=paused
```

3. To stop the simulation:

```
ros2 service call /set\_simulation\_state simulation\_interfaces/srv/SetSimulationState "{state: {state: 0}}" # 0=stopped
```

### Spawning Entities[#](#spawning-entities "Link to this heading")

1. For the purposes of this exercise, lets ensure simulation is first **playing** by using the command we just learned:

```
ros2 service call /set\_simulation\_state simulation\_interfaces/srv/SetSimulationState "{state: {state: 1}}" # 1=playing
```

2. Spawn a cube entity into the scene. `allow_renaming` is set to true so we can spawn as many cubes as we like, and a unique name for the new prim name will be automatically generated. Feel free to run the following command as many times as you would like.

```
ros2 service call /spawn\_entity simulation\_interfaces/srv/SpawnEntity "{name: '/my\_nvidia\_cube', allow\_renaming: true, uri: '${ROSCON25\_ASSET\_PATH}/nvidia\_cube/nvidia\_cube.usd', initial\_pose: {pose: {position: {x: 3.0, y: 2.0, z: 2.0}, orientation: {w: 1.0, x: 0.0, y: 0.0, z: 0.0}}}}"
```

Note

With multiple spawned entities, it is good practice to set a different spawn location each time to prevent undefined behaviour when simulation is stopped (and prims move back to their original location).

3. Next, letâs spawn a small robot named limo. This time we will add a namespace:

```
ros2 service call /spawn\_entity simulation\_interfaces/srv/SpawnEntity "{name: 'my\_cute\_limo', entity\_namespace: 'limo1', allow\_renaming: true, uri: '${ROSCON25\_ASSET\_PATH}/limo/limo\_ROS.usd', initial\_pose: {pose: {position: {x: 0.0, y: 1.0, z: 0.4}, orientation: {w: 1.0, x: 0.0, y: 0.0, z: 0.0}}}}"
```

You can also run the ros2 topic list command and verify that the **/limo1/cmd\_vel** topic is available.

Setting and Getting Entity States

1. For the purposes of this exercise, lets ensure simulation is first **playing**.
2. Get the state of the NVIDIA cube entity.

```
ros2 service call /get\_entity\_state simulation\_interfaces/srv/GetEntityState "{entity: '/my\_nvidia\_cube'}"
```

3. The output should be similar to the spawned entity we did in the last unit. This is a great way to get the position of something in the simulation.
4. Set the entity state of `my_nvidia_cube` to have a x-linear and z-angular velocity. This will move the cube when simulation plays.

```
ros2 service call /set\_entity\_state simulation\_interfaces/srv/SetEntityState "{
entity: '/my\_nvidia\_cube',
state: {
header: {frame\_id: 'world'},
pose: {
position: {x: 4.0, y: 2.0, z: 2.0},
orientation: {w: 1.0, x: 0.0, y: 0.0, z: 0.0}
},
twist: {
linear: {x: 1.0, y: 0.0, z: 0.0},
angular: {x: 0.0, y: 0.0, z: 1.5}
}
}
}"
```

5. If the simulation is not already playing, press Play (or run the âplayâ service call) to see the cube move.

ResetSimulation Service

When simulation is reset, entities spawned with simulation interfaces are automatically removed and the scene timeline is reset and played.

1. Reset the simulation by running the command below:

```
ros2 service call /reset\_simulation simulation\_interfaces/srv/ResetSimulation
```

2. Note how this reset is distinct in that itonly affected theentities spawned by simulation interfaces. For instance, try manually adding something else to the scene and reset again. Notice how the manually-added asset does not change.

Step Simulation

Simulation can be stepped manually using either SimulateSteps action or the StepSimulation service.

When running either interface ensure simulation is **Paused** first. The simulation will step for the provided number of frames before returning to a paused state.

You can verify using the frame count shown in the top left corner of the viewport once simulation is playing.

1. Ensure Isaac Sim simulation is paused.
2. Step simulation for exactly 120 frames using the action interface with feedback. `--feedback` adds messages about the completed and remaining steps to the command output.

```
ros2 action send\_goal /simulate\_steps simulation\_interfaces/action/SimulateSteps "{steps: 120}" --feedback
```

3. Feel free to run the above command multiple times with varying frame numbers.

UnloadWorld Service

4. Unload the current world by running the command below:

```
ros2 service call /unload\_world simulation\_interfaces/srv/UnloadWorld
```

On this page
