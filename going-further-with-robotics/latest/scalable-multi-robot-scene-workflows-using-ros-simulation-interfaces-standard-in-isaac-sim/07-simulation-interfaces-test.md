# Simulation Interfaces[#](#simulation-interfaces "Link to this heading")

## Simulation Interfaces Test Script[#](#simulation-interfaces-test-script "Link to this heading")

In this module, we will analyze a script that leverages service interfaces to orchestrate a multi-robot workflow. We will walk through the code in detail, uncommenting sections as we go, then finally run it.

### Setup[#](#setup "Link to this heading")

1. In Isaac Sim, open the warehouse test scene from the course assets folder: `Starting_Point/warehouse_test_scene.usd`
2. In your code-editor, open the script in `/sim_control_script_and_carter_ws/learning_simulation_control/workshop_learning_script.py`

## The carter1\_sequence[#](#the-carter1-sequence "Link to this heading")

We are now working on the **carter1\_sequence** function on our workshop script.

This sequence includes the following steps:

1. Drive the Nav2-controlled Carter to the table near a cube.
2. Spawn and position a Limo pusher if needed.
3. Limo ânudgesâ the cube off the table.
4. Reset and randomize the cube location, repeat the routine again.

Letâs take a closer look at the code together. Search for the function `carter1_sequence`

The robot is initially placed at `[-4, -4, 0]` on the warehouse map:

```
1# Set default initial pose if not provided
2if initial\_pose is None:
3 initial\_pose = [(-4.0, -4.0, 0.0), yaw\_to\_quaternion(0.0)]
```

The drop off zone is located at `[-3.5, -4, 0]`, like you have seen in the Isaac Sim scene. We also set up the prim paths for the table and limo robot. Note the namespace for the limo robot. One limo robot is setup for each carter sequence.

```
1 # dropOff\_pose position
2 # Format: [(x, y, z), quaternion\_tuple]
3 carter1\_dropOff\_pose = [(-3.5, -4.0, 0.0), yaw\_to\_quaternion(-1.5708)]
4
5 demo\_table\_path = "/World/Demo\_table\_1/thor\_table"
6 demo\_cube\_path = "/World/Demo\_table\_1/nvidia\_cube"
7
8 limo\_namespace = f"{robot\_name}\_limo"
9 limo\_name = f"/World/{limo\_namespace}"
```

We are now initializing the main object of this workshop, the **TestContext,** that will be analyzed in detail after the carter1\_sequence initialization.

```
1test\_robot\_context = TestContext(robot\_name, initial\_pose)
```

This section initializes the robot context and reads the table position.

```
1# Grab the table position
2success, table\_state = await test\_robot\_context.get\_entity\_state(demo\_table\_path)
3if not success:
4 print(f"{robot\_name}: Failed to get table state: {table\_state}")
5 return f"{robot\_name} failed: Could not get table state"
6print(f"{robot\_name}: Table at {table\_state.pose.position.x:.2f}, {table\_state.pose.position.y:.2f}")
7
8table\_x = table\_state.pose.position.x
9table\_y = table\_state.pose.position.y
10table\_z = table\_state.pose.position.z
11
12limo\_rest\_quat\_theta = yaw\_to\_quaternion(0.0)
13limo\_rest\_pose = [(table\_x-0.3, table\_y-0.5, table\_z+0.15), limo\_rest\_quat\_theta]
```

Find the code under **WORKSHOP 01** and uncomment that section.

## The TestContext class[#](#the-testcontext-class "Link to this heading")

Letâs analyze another key component of this script, the TestContext class.

**TestContext** is a small ROS 2 helper class that wraps the simulation service clients (get/set entity state, spawn, play/pause sim) and exposes convenient async methods that return (success, payload\_or\_error).

The clients are created in (e.g., âget\_entity\_stateâ, âspawn\_entityâ, âset\_simulation\_stateâ, etc.). Below you can see the list of all services this node uses to spawn, and control the simulation state.

```
1self.get\_entity\_service = self.node.create\_client(GetEntityState, "get\_entity\_state")
2self.set\_entity\_service = self.node.create\_client(SetEntityState, "set\_entity\_state")
3self.spawn\_entity\_service = self.node.create\_client(SpawnEntity, "spawn\_entity")
4self.set\_simulation\_state\_service = self.node.create\_client(SetSimulationState, "set\_simulation\_state")
5self.reset\_simulation\_service = self.node.create\_client(ResetSimulation, "reset\_simulation")
6self.get\_entity\_info\_service = self.node.create\_client(GetEntityInfo, "get\_entity\_info")
7self.publish\_cmd\_vel = None # to be set when the robot is spawned
```

Find the code under **WORKSHOP TC-01** and uncomment that section.

### The get\_entity\_info method[#](#the-get-entity-info-method "Link to this heading")

Queries metadata about an entity via the GetEntityInfo service. This metadata could be:

1. Does the entity exist?
2. What type is it? Note, in Isaac Sim 5.1 we only return CATEGORY\_OBJECT so far.

   Returns (True, info) on success or (False, error\_message) on failure.

   Internally: builds a GetEntityInfo.Request, calls the async client, spins until the future completes, and checks **Result.RESULT\_OK.**

Tip

To learn more about the unique simulation interface Result, see the msg type [here](https://github.com/ros-simulation/simulation_interfaces/blob/main/msg/Result.msg).

```
1req = GetEntityInfo.Request()
2req.entity = entity\_path
3future = self.get\_entity\_info\_service.call\_async(req)
4
5while not future.done():
6 rclpy.spin\_once(self.node, timeout\_sec=0.1)
7 await asyncio.sleep(0.01)
8
9if future.result() is not None:
10 result = future.result()
11 if result.result.result == Result.RESULT\_OK:
12 return True, result.info
13 else:
14 error\_msg = result.result.error\_message or f"Failed to get entity info (code: {result.result.result})"
15 print(f"Error getting entity info for {entity\_path}: {error\_msg}")
16 return False, error\_msg
```

Find the code under **WORKSHOP TC-02** and uncomment that section.

### The get\_entity\_state method[#](#the-get-entity-state-method "Link to this heading")

Reads the current EntityState (pose + twist) for the given path via GetEntityState. Returns (True, state) or (False, error\_message)

```
1req = GetEntityState.Request()
2req.entity = entity\_path
3future = self.get\_entity\_service.call\_async(req)
4
5while not future.done():
6 rclpy.spin\_once(self.node, timeout\_sec=0.1)
7 await asyncio.sleep(0.01)
8
9if future.result() is not None:
10 result = future.result()
11 if result.result.result == Result.RESULT\_OK:
12 return True, result.state
13 else:
14 error\_msg = result.result.error\_message or f"Failed to get entity state (code: {result.result.result})"
15 print(f"Error getting entity state for {entity\_path}: {error\_msg}")
16 return False, error\_msg
```

Find the code under **WORKSHOP TC-03** and uncomment that section.

### The set\_simulation\_state method[#](#the-set-simulation-state-method "Link to this heading")

Using the SetSimulationState service, this method switches the simulation between states, such as

- SimulationState.STATE\_PLAYING
- SimulationState.STATE\_STOPPED

  Returns (True, None) on success or (False, error\_message) on failure.

```
1req = SetSimulationState.Request()
2req.state.state = state
3future = self.set\_simulation\_state\_service.call\_async(req)
4
5while not future.done():
6 rclpy.spin\_once(self.node, timeout\_sec=0.1)
7 await asyncio.sleep(0.01)
8
9if future.result() is not None:
10 result = future.result()
11 if result.result.result == Result.RESULT\_OK:
12 return True, None
13 else:
14 error\_msg = result.result.error\_message or f"Failed to set simulation state (code: {result.result.result})"
15 print(f"Error setting simulation state: {error\_msg}")
16 return False, error\_msg
```

Find the code under **WORKSHOP TC-04** and uncomment that section.

### The spawn\_entity method[#](#the-spawn-entity-method "Link to this heading")

Spawns a new entity from a fully-formed SpawnEntity.Request.
Returns (True, full\_response, result\_code) on success, or (False, error\_message, result\_code) on failure. (Convenience builder below: create\_spawn\_entity\_request.)

```
1future = self.spawn\_entity\_service.call\_async(spawn\_request)
2
3while not future.done():
4 rclpy.spin\_once(self.node, timeout\_sec=0.1)
5 await asyncio.sleep(0.01)
6
7result = future.result()
8if result:
9 if result.result.result == Result.RESULT\_OK:
10 print(f"Successfully spawned entity: {spawn\_request.name}")
11 return True, result, result.result.result
12 else:
13 error\_msg = result.result.error\_message or f"Failed to spawn entity (code: {result.result.result})"
14 print(f"Error spawning entity {spawn\_request.name}: {error\_msg}")
15 return False, error\_msg, result.result.result
```

Find the code under **WORKSHOP TC-05** and uncomment that section.

### The create\_spawn\_entity\_request method[#](#the-create-spawn-entity-request-method "Link to this heading")

Convenience builder that returns a correctly structured SpawnEntity.Request (name, USD URI, PoseStamped with frame, position, quaternion, optional namespace). Handy to avoid boilerplate and to keep pose fields as plain tuples.

```
1spawn\_request.name = name
2spawn\_request.uri = uri
3spawn\_request.allow\_renaming = allow\_renaming
4
5# Create pose stamped
6spawn\_request.initial\_pose = PoseStamped()
7spawn\_request.initial\_pose.header.frame\_id = frame\_id
8spawn\_request.initial\_pose.pose.position.x = float(position[0])
9spawn\_request.initial\_pose.pose.position.y = float(position[1])
10spawn\_request.initial\_pose.pose.position.z = float(position[2])
11spawn\_request.initial\_pose.pose.orientation.w = float(orientation[0])
12spawn\_request.initial\_pose.pose.orientation.x = float(orientation[1])
13spawn\_request.initial\_pose.pose.orientation.y = float(orientation[2])
14spawn\_request.initial\_pose.pose.orientation.z = float(orientation[3])
15
16# Set namespace if provided
17if entity\_namespace:
18 spawn\_request.entity\_namespace = entity\_namespace
```

Find the code under **WORKSHOP TC-06** and uncomment that section.

### The set\_entity\_state method[#](#the-set-entity-state-method "Link to this heading")

Writes an entityâs pose and (optionally) a linear/angular velocity using SetEntityState.
You can either pass a ready EntityState message or let the method build one from tuples.
Returns (True, None) on success or (False, error\_message)

```
1spawn\_request.name = name
2spawn\_request.uri = uri
3spawn\_request.allow\_renaming = allow\_renaming
4
5# Create pose stamped
6spawn\_request.initial\_pose = PoseStamped()
7spawn\_request.initial\_pose.header.frame\_id = frame\_id
8spawn\_request.initial\_pose.pose.position.x = float(position[0])
9spawn\_request.initial\_pose.pose.position.y = float(position[1])
10spawn\_request.initial\_pose.pose.position.z = float(position[2])
11spawn\_request.initial\_pose.pose.orientation.w = float(orientation[0])
12spawn\_request.initial\_pose.pose.orientation.x = float(orientation[1])
13spawn\_request.initial\_pose.pose.orientation.y = float(orientation[2])
14spawn\_request.initial\_pose.pose.orientation.z = float(orientation[3])
15
16# Set namespace if provided
17if entity\_namespace:
18 spawn\_request.entity\_namespace = entity\_namespace
```

Find the code under **WORKSHOP TC-07** and uncomment that section.

## Implementing the robot sequence[#](#implementing-the-robot-sequence "Link to this heading")

Now we are inside the main, looping function for the carter1 sequence simulation. The routine runs **two full trials** to demonstrate repeatability and reset logic.

### Overview[#](#overview "Link to this heading")

This code details how to fetch and monitor the cubeâs pose, compute navigation waypoints, control the Limo robot to push the cube, reset both entities, and randomize cube position for iterative tabletop trials. If this fails, the sequence aborts with a message.

### Navigation waypoint[#](#navigation-waypoint "Link to this heading")

Compute a navigation waypoint aligned with the table/cube and send the goal to the navigation planner.

```
1# Check entity state
2success, cube\_state = await test\_robot\_context.get\_entity\_state(f"{demo\_cube\_path}")
3if not success:
4 print(f"{robot\_name}: Failed to get cube state: {cube\_state}")
5 return f"{robot\_name} failed: Could not get cube state"
6
7print(f"{robot\_name}: Cube at {cube\_state.pose.position.x:.2f}, {cube\_state.pose.position.y:.2f}")
8
9cube\_x = cube\_state.pose.position.x
10cube\_y = cube\_state.pose.position.y
11cube\_z = cube\_state.pose.position.z
12nav\_x = cube\_x - 0.15
13nav\_y = table\_y - 1.05
14nav\_z = 0.0
15
16nav\_pose =[(nav\_x, nav\_y, nav\_z), yaw\_to\_quaternion(1.5708)]
```

Find the code under **WORKSHOP 02** and uncomment that section.

Start slightly behind the cube; push straight toward the table edge.

```
1limo\_start\_x = cube\_x
2limo\_start\_y = cube\_y + 0.25
3limo\_start\_z = table\_z + 0.15
4limo\_initial\_pose = [(limo\_start\_x, limo\_start\_y, limo\_start\_z), yaw\_to\_quaternion(-1.5708)]
5
6limo\_goal\_x = cube\_x
7limo\_goal\_y = table\_y - 0.82
8limo\_goal\_z = limo\_start\_z
9limo\_goal\_pose = [(limo\_goal\_x, limo\_goal\_y, limo\_goal\_z), yaw\_to\_quaternion(-1.5708)]
10
```

Ensure the Limo exists, place it, command velocity to push, monitor the cube, stop, reset, and randomize for the subsequent trial.

- Ensure Limo exists; spawn if missing (shows how to use create\_spawn\_entity\_request):

```
1# Check does limo exist?
2success, limo\_error = await test\_robot\_context.get\_entity\_info(limo\_name)
3if not success:
4 print(f"{robot\_name}: {limo\_error}")
5 print(f"{robot\_name}: Spawning limo")
6
7 # Spawn limo
8 success, spawn\_result, spawn\_result\_code = await test\_robot\_context.spawn\_entity(
9 test\_robot\_context.create\_spawn\_entity\_request(
10 name=limo\_name,
11 uri=os.path.join(ROSCON25\_ASSET\_PATH, "limo/limo\_ROS.usd"),
12 position=limo\_rest\_pose[0],
13 orientation=limo\_rest\_pose[1],
14 allow\_renaming=False,
15 entity\_namespace=limo\_namespace
16 )
17 )
```

- Place the Limo at the initial pose (service-level teleport vs. nav)â

```
1# move the limo to the limo initial pose
2success, error\_msg = await test\_robot\_context.set\_entity\_state(
3 f"{limo\_name}/chassis\_link",
4 position=limo\_initial\_pose[0],
5 orientation=limo\_initial\_pose[1]
6)
```

- Push: publish a short burst of cmd\_vel in the Limo namespace.
- Create the publisher once (lazy): {limo\_namespace}/cmd\_vel.

  - Send three quick messages at ~20 Hz with linear.x = 0.2.

```
1# Send cmd\_vel to limo
2cmd\_vel = Twist()
3cmd\_vel.linear.x = 0.4
4if test\_robot\_context.publish\_cmd\_vel is None:
5# Instantly create a publisher for limo's namespace and publish cmd\_vel
6 test\_robot\_context.publish\_cmd\_vel = test\_robot\_context.node.create\_publisher(
7 Twist, f"/{limo\_namespace}/cmd\_vel", 10
8 )
9
10for i in range(3):
11 test\_robot\_context.publish\_cmd\_vel.publish(cmd\_vel)
12 await asyncio.sleep(0.05)
```

- Monitor the cube until either:

  - it falls off (z < 0.5), or
  - it reaches the goal region near (limo\_goal\_x, limo\_goal\_y) (tight XY threshold)
  - A 60-iteration cap prevents infinite loops.

```
1# Wait until cube reaches end of table
2for i in range(60): #set a max number of iterations:
3success, cube\_state = await test\_robot\_context.get\_entity\_state(f"{demo\_cube\_path}")
4if success:
5 # If cube is at same position as carter robot with a +/- 0.25 margin or cube is below 0.5 meters, break
6 if (cube\_state.pose.position.z < 0.5) or (abs(cube\_state.pose.position.x - limo\_goal\_x) < 0.05 and abs(cube\_state.pose.position.y - limo\_goal\_y) < 0.05):
7 print(f"{robot\_name}: Cube at {cube\_state.pose.position.x:.2f}, {cube\_state.pose.position.y:.2f}, {cube\_state.pose.position.z:.2f}")
8 print(f"{robot\_name}: Cube reached goal position or dropped off the table")
9 break
10
11 else:
12 print(f"{robot\_name}: Cube at {cube\_state.pose.position.x:.2f}, {cube\_state.pose.position.y:.2f}, {cube\_state.pose.position.z:.2f}")
13 await asyncio.sleep(0.1)
14
15else:
16 print(f"{robot\_name}: Failed to get cube state: {cube\_state}")
17 break
```

- Stop the Limo (send zeros a few times) and reset the Limo to a ârestâ staging pose behind the table (service-level set).

```
1# Set robot velocity to 0
2cmd\_vel = Twist()
3cmd\_vel.linear.x = 0.0
4cmd\_vel.angular.z = 0.0
5
6for i in range(3):
7 test\_robot\_context.publish\_cmd\_vel.publish(cmd\_vel)
8 await asyncio.sleep(0.1)
9
10# wait for block to fall off the table
11for i in range(10):
12 success, cube\_state = await test\_robot\_context.get\_entity\_state(f"{demo\_cube\_path}")
13 if success:
14 if cube\_state.pose.position.z < 0.5:
15 print(f"{robot\_name}: Cube at {cube\_state.pose.position.x:.2f}, {cube\_state.pose.position.y:.2f}")
16 break
17 await asyncio.sleep(0.2)
18
19# Set limo to rest pose
20rest\_position = limo\_rest\_pose[0] # (x, y, z)
21rest\_orientation = limo\_rest\_pose[1] # (w, x, y, z)
22success, error\_msg = await test\_robot\_context.set\_entity\_state(
23 f"{limo\_name}/chassis\_link",
24 position=rest\_position,
25 orientation=rest\_orientation
26)
27if not success:
28 print(f"{robot\_name}: Failed to set limo to rest pose: {error\_msg}")
29print(f"{robot\_name}: Limo set to rest pose")
30
```

- Carter drop-off move: navigate Carter to carter1\_dropOff\_pose and wait for completion

```
1# Move to third position
2test\_robot\_context.send\_nav\_goal(carter1\_dropOff\_pose[0], carter1\_dropOff\_pose[1])
3result = await test\_robot\_context.wait\_for\_nav\_complete()
```

- Randomize the cube for the next trial: sample a position on the tabletop (radius 0.3 around the table center) and teleport the cube there via set\_entity\_state.

```
1# Spawn a random position on the table
2random\_cube\_position = get\_random\_position(
3 (table\_state.pose.position.x, table\_state.pose.position.y, table\_state.pose.position.z),
4 radius=0.3,
5 theta=0.0
6)
7
8# Move cube to the random position by setting the entity state
9success, error\_msg = await test\_robot\_context.set\_entity\_state(
10 f"{demo\_cube\_path}",
11 position=random\_cube\_position[0],
12 orientation=random\_cube\_position[1]
13)
14if not success:
15 print(f"{robot\_name}: Failed to set cube to random position: {error\_msg}")
16print(f"{robot\_name}: Cube set to random position")
17
18test\_robot\_context.destroy()
```

Find the code under **WORKSHOP 03** and uncomment that section

## Spawn the World in Isaac Sim[#](#spawn-the-world-in-isaac-sim "Link to this heading")

```
1req = LoadWorld.Request()
2req.uri = os.path.join(ROSCON25\_ASSET\_PATH, "Starting\_Point/Empty\_Warehouse\_Scene.usd")
3future = load\_world\_client.call\_async(req)
4rclpy.spin\_until\_future\_complete(node, future)
5
6if future.result() and future.result().result.result == Result.RESULT\_OK:
7 print("World loaded successfully")
8else:
9 print("Failed to load world")
```

Find the code under **WORKSHOP 04** and uncomment that section.

This section builds a fresh SpawnEntity.Request with:

- full path: `/World/Demo_table_1/thor_table`,
- frame\_id : world
- position: (-4.72, 0.688, 1.19)
- quaternion: identity
- allow\_renaming=False

  Calls spawn + checks result

```
1table\_req = SpawnEntity.Request()
2table\_req.name = "/World/Demo\_table\_1/thor\_table"
3table\_req.uri = os.path.join(ROSCON25\_ASSET\_PATH, "thor\_table/thor\_table.usd")
4table\_req.allow\_renaming = False
5table\_req.initial\_pose = PoseStamped()
6table\_req.initial\_pose.header.frame\_id = "world"
7table\_req.initial\_pose.pose.position.x = float(-4.72)
8table\_req.initial\_pose.pose.position.y = float(0.688)
9table\_req.initial\_pose.pose.position.z = float(1.19)
10table\_req.initial\_pose.pose.orientation.w = float(1.0)
11table\_req.initial\_pose.pose.orientation.x = float(0.0)
12table\_req.initial\_pose.pose.orientation.y = float(0.0)
13table\_req.initial\_pose.pose.orientation.z = float(0.0)
14future = spawn\_entity\_client.call\_async(table\_req)
15rclpy.spin\_until\_future\_complete(node, future)
16
17if future.result() and future.result().result.result == Result.RESULT\_OK:
18 print("Table spawned successfully")
19else:
20 print("Failed to spawn table")
```

Find the code **WORKSHOP 05** and uncomment.
This section spawns the nvidia cube at `/World/Demo_table_1/nvidia_cube` with:

- full path: `/World/Demo_table_1/nvidia_cube`,
- frame\_id : world
- Position (partially reused): (**-4.72+0.15**, 0.688, **1.29**)
- Quaternion (reused)
- allow\_renaming=**True** (because we can spawn multiple cubes without having to worry about naming manually)

The spawn pose is set in world coordinates, and the result is confirmed and printed.

```
1table\_req.name = "/World/Demo\_table\_1/nvidia\_cube"
2table\_req.uri = os.path.join(ROSCON25\_ASSET\_PATH, "nvidia\_cube/nvidia\_cube.usd")
3table\_req.allow\_renaming = True
4table\_req.initial\_pose.header.frame\_id = "world"
5table\_req.initial\_pose.pose.position.x += 0.15
6table\_req.initial\_pose.pose.position.z = float(1.29)
7future = spawn\_entity\_client.call\_async(table\_req)
8rclpy.spin\_until\_future\_complete(node, future)
9
10if future.result() and future.result().result.result == Result.RESULT\_OK:
11 print("Cube spawned successfully")
12else:
13 print("Failed to spawn cube")
```

Find the code **WORKSHOP 06** and uncomment.

This section spawns Nova Carter at `/World/nova_carter_ROS_1` with:

- entity\_namespace=âcarter1â
- full path: `/World/nova_carter_ROS_1`,
- frame\_id : world
- Position: (-4.0, -4.0, 0.0)
- Quaternion: yaw of +90Â° using yaw\_to\_quaternion(1.5708).
- allow\_renaming=False (because we only intend to one Nova Carter spawned at this time)
  The spawn pose is set in world coordinates, and the result is confirmed and printed.

```
1carter1\_req = SpawnEntity.Request()
2carter1\_req.name = "/World/nova\_carter\_ROS\_1"
3carter1\_req.uri = os.path.join(ROSCON25\_ASSET\_PATH, "Starting\_Point/nova\_carter\_ROS.usd")
4carter1\_req.entity\_namespace = "carter1"
5carter1\_req.allow\_renaming = False
6carter1\_req.initial\_pose = PoseStamped()
7carter1\_req.initial\_pose.header.frame\_id = "world"
8carter1\_req.initial\_pose.pose.position.x = float(-4.0)
9carter1\_req.initial\_pose.pose.position.y = float(-4.0)
10carter1\_req.initial\_pose.pose.position.z = float(0.0)
11quat = yaw\_to\_quaternion(1.5708)
12carter1\_req.initial\_pose.pose.orientation.w = float(quat[0])
13carter1\_req.initial\_pose.pose.orientation.x = float(quat[1])
14carter1\_req.initial\_pose.pose.orientation.y = float(quat[2])
15carter1\_req.initial\_pose.pose.orientation.z = float(quat[3])
16future = spawn\_entity\_client.call\_async(carter1\_req)
17rclpy.spin\_until\_future\_complete(node, future)
18
19if future.result() and future.result().result.result == Result.RESULT\_OK:
20 print("Carter1 spawned successfully")
21else:
22 print("Failed to spawn Carter1")
```

Find the code **WORKSHOP 07** and uncomment.

Now, in this section, we will set the simulation state to SimulationState.STATE\_PLAYING, spin ROS functions, and introduce a small delay to let simulation physics stacks settle.

```
1req = SetSimulationState.Request()
2req.state.state = SimulationState.STATE\_PLAYING
3future = set\_state\_client.call\_async(req)
4rclpy.spin\_until\_future\_complete(node, future)
5
6if future.result() and future.result().result.result == Result.RESULT\_OK:
7 print("Simulation playing successfully")
8else:
9 print("Failed to play simulation")
```

Find the code **WORKSHOP 08** and uncomment.

When we stop the simulation, we set the state to SimulationState.STATE\_STOPPED, spin ROS functions, and introduce a small delay to let simulation settle. This is essentially a clean pause before teardown.

```
1req = SetSimulationState.Request()
2req.state.state = SimulationState.STATE\_STOPPED
3future = set\_state\_client.call\_async(req)
4rclpy.spin\_until\_future\_complete(node, future)
5
6if future.result() and future.result().result.result == Result.RESULT\_OK:
7 print("Simulation is now stopped")
8else:
9 print("Failed to stop simulation")
```

Find the code **WORKSHOP 09** and uncomment.

After that, we send a UnloadWorld.Request(), spin and wait for Isaac Sim to unload the world.

```
1req = UnloadWorld.Request()
2future = unload\_world\_client.call\_async(req)
3rclpy.spin\_until\_future\_complete(node, future)
4
5if future.result() and future.result().result.result == Result.RESULT\_OK:
6 print("World unloaded successfully")
7else:
8 print("Failed to unload world")
```

Find the code **WORKSHOP 10** and uncomment.

### Testing the Script[#](#testing-the-script "Link to this heading")

Now that weâve analyzed the code in our script, letâs try it out.

Follow the instructions below to run the Nav2 stack:

#### Running the Nav Stack With the Test Script[#](#running-the-nav-stack-with-the-test-script "Link to this heading")

1. Open a new terminal and source your ROS workspace:

```
source sim\_control\_script\_and\_carter\_ws/ros\_ws/install/setup.bash
```

Ensure that the `ROS_DOMAIN_ID` environment variable is set.

```
export ROS\_DOMAIN\_ID=42 # Replace number with your own station number
```

2. Start **Nav2** for multi robot simulation for both Nova Carters by running the following command:

```
ros2 launch carter\_navigation multiple\_robot\_carter\_navigation\_warehouse.launch.py
```

3. From a ROS-sourced terminal set your `ROS_DOMAIN_ID` and run the script:

```
export ROS\_DOMAIN\_ID=42 # Replace number with your own station number
# cd into the course materials folder
python3 sim\_control\_script\_and\_carter\_ws/learning\_simulation\_control/workshop\_learning\_script.py
```

Tip

If you need, the full output script from this module is found in the course materials under`sim_control_script_and_carter_ws/learning_simulation_control/workshop_learning_script_final.py`.

You may also run a similar command as above to run this script here:

```
export ROS\_DOMAIN\_ID=42 # Replace number with your own station number
# cd into the course materials folder
python3 sim\_control\_script\_and\_carter\_ws/learning\_simulation\_control/workshop\_learning\_script\_final.py
```

Tip

The backup robot file is located in the course assets under `/Backup/nova_carter_ROS.usd`.

If you need to use the backup robot USD file, copy and replace it into the Starting Point folder at: `Starting_Point/nova_carter_ROS.usd`.

Tip

If the Nav stack seems stuck, simply stop both the Nav2 stack and the current script command (CTRL+C) and re-run.

On this page
