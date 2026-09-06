# Foundations of Isaac Sim Scripting With Python[#](#foundations-of-isaac-sim-scripting-with-python "Link to this heading")

## Module Overview[#](#module-overview "Link to this heading")

In this module, we will explore the Python scripting capabilities of Isaac Sim, building on the visual scripting concepts introduced earlier. While the GUI provides a user-friendly interface for basic tasks, Python scripting offers greater flexibility and control for creating complex simulations and automating repetitive tasks.

We will focus on an interactive scripting tool called **Script Editor**. Script Editor is a built-in Python editor within Isaac Simâs GUI for writing and running scripts directly in the simulation environment.

Additionally, we will cover:

- **USD APIs**: Low-level APIs for precise scene manipulation.
- **Isaac Sim Core APIs**: High-level robotics-specific APIs that simplify common tasks like adding objects or configuring robots.

This foundation in Python scripting will enable you to customize simulations, automate workflows, and create more advanced robotics applications in Isaac Sim.  
For additional details, refer to the [Interactive Scripting Documentation](https://docs.omniverse.nvidia.com/isaacsim/latest/gui_tutorials/tutorial_gui_interactive_scripting.html).

## Exploring the Script Editor[#](#exploring-the-script-editor "Link to this heading")

In this section, we will explore the Script Editor, a built-in Python scripting tool within Isaac Sim. The Script Editor allows you to write and execute Python code directly in the simulation environment, providing a powerful way to interact with and control your simulation.

### Open the Script Editor[#](#open-the-script-editor "Link to this heading")

1. In the Isaac Sim Menu Bar, click on **Window > Script Editor**.

A new window will appear. You can dock this window anywhere in the interface for convenience.

### Familiarize Yourself With the Script Editor Interface[#](#familiarize-yourself-with-the-script-editor-interface "Link to this heading")

2. Observe the main code editing area where you can write Python scripts.
3. Locate the `Run` button at the top of the editor. This button allows you to execute your code:

   - Click **Run** or press **Ctrl+Enter** to execute an entire script.
   - Select a portion of your code and click **Run Selected** to execute only that part.

### Create Multiple Tabs[#](#create-multiple-tabs "Link to this heading")

4. Go to the **Tab Menu** within the Script Editor.
5. Click on **Tab > Add Tab** to open a new tab.
6. Repeat this process to create additional tabs as needed.

Each tab can hold a separate script, but all tabs share the same environment.

### Understand the Shared Environment[#](#understand-the-shared-environment "Link to this heading")

7. Write a simple Python command in one tab, such as defining a variable:

`my_variable = "Hello, Isaac Sim!"`

8. Switch to another tab and try accessing **my\_variable**. You will see that it is available across all tabs.

This shared environment allows you to use variables and imported libraries seamlessly between tabs, making it easier to work on interconnected scripts.

Note

Another method of development in Isaac Sim is using the [Isaac Sim VS Code](https://marketplace.visualstudio.com/items?itemName=NVIDIA.isaacsim-vscode-edition) extension. We donât cover it in this module, but you can find information at the link provided.

---

### Why Use the Script Editor?[#](#why-use-the-script-editor "Link to this heading")

The Script Editor is an essential tool because it provides:

- A user-friendly interface for writing and testing Python code without needing external editors.
- Real-time interaction with your simulation environment.
- The ability to experiment with Python APIs that correspond to GUI actions, enabling deeper customization of your simulation.

For more details on using the Script Editor, refer to the [Interactive Scripting Documentation](https://docs.omniverse.nvidia.com/isaacsim/latest/gui_tutorials/tutorial_gui_interactive_scripting.html).

## Working With USD APIs[#](#working-with-usd-apis "Link to this heading")

In this section, weâll use USD APIs to create and manipulate objects in Isaac Sim. Understanding USD APIs is essential for advanced scripting in Isaac Sim, as it allows precise control over objects, physics, and scene properties.

### Prepare a Fresh Stage[#](#prepare-a-fresh-stage "Link to this heading")

1. Open **Isaac Sim** and create a new, empty stage.

   - Ensure no other objects or scripts are loaded into the stage.
2. Open the **Script Editor** from the Menu Bar by navigating to **Window > Script Editor**.

### Write the USD API Script[#](#write-the-usd-api-script "Link to this heading")

3. In the *Script Editor*, **paste** the following code to set up:

   - physics properties
   - a ground plane
   - a dynamic cube

```
1from pxr import UsdPhysics, PhysxSchema, Gf, PhysicsSchemaTools, UsdGeom
2
3import omni
4
5stage = omni.usd.get\_context().get\_stage()
6
7# Setting up Physics Scene
8gravity = 9.8
9scene = UsdPhysics.Scene.Define(stage, "/World/physics")
10scene.CreateGravityDirectionAttr().Set(Gf.Vec3f(0.0, 0.0, -1.0))
11scene.CreateGravityMagnitudeAttr().Set(gravity)
12PhysxSchema.PhysxSceneAPI.Apply(stage.GetPrimAtPath("/World/physics"))
13physxSceneAPI = PhysxSchema.PhysxSceneAPI.Get(stage, "/World/physics")
14physxSceneAPI.CreateEnableCCDAttr(True)
15physxSceneAPI.CreateEnableStabilizationAttr(True)
16physxSceneAPI.CreateEnableGPUDynamicsAttr(False)
17physxSceneAPI.CreateBroadphaseTypeAttr("MBP")
18physxSceneAPI.CreateSolverTypeAttr("TGS")
19
20# Setting up Ground Plane
21PhysicsSchemaTools.addGroundPlane(stage, "/World/groundPlane", "Z", 15, Gf.Vec3f(0,0,0), Gf.Vec3f(0.7))
22
23# Adding a Cube
24path = "/World/Cube"
25cubeGeom = UsdGeom.Cube.Define(stage, path)
26cubePrim = stage.GetPrimAtPath(path)
27size = 0.5
28offset = Gf.Vec3f(0.5,0.2,1.0)
29cubeGeom.CreateSizeAttr(size)
30cubeGeom.AddTranslateOp().Set(offset)
31
32# Attach Rigid Body and Collision Preset
33rigid\_api = UsdPhysics.RigidBodyAPI.Apply(cubePrim)
34rigid\_api.CreateRigidBodyEnabledAttr(True)
35UsdPhysics.CollisionAPI.Apply(cubePrim)
```

This script performs the following:

- Sets up a physics scene with gravity.

  - Creates a ground plane for objects to interact with.
  - Adds a cube to the scene with size and position attributes.
  - Attaches rigid body and collision properties to make the cube dynamic.

### Run the Script[#](#run-the-script "Link to this heading")

4. Click the **Run** button in the *Script Editor* or press **Ctrl+Enter** to execute the script.
5. Observe that a ground plane and a cube are added to your stage.

### Simulate the Scene[#](#simulate-the-scene "Link to this heading")

6. Press the **Play** button in Isaac Sim to start the simulation.
7. Watch as the cube falls onto the ground plane due to gravity.

Important

Only run this script once on an empty stage to avoid creating duplicate objects or conflicting physics contexts. If you encounter any errors during execution, ensure that your stage is fresh and that no conflicting scripts are running.

---

### Why Use USD APIs?[#](#why-use-usd-apis "Link to this heading")

USD APIs provide fine-grained control over scene creation and object manipulation:

- You can define custom physics properties and behaviors.
- Objects can be programmatically added or modified with precision.
- It allows for scalable and reusable scripting workflows in Isaac Sim.

For more details on using USD APIs in Isaac Sim, refer to [Omniverse and USD Documentation](https://docs.isaacsim.omniverse.nvidia.com/latest/omniverse_usd/index.html).

In the next section, we will explore Isaac Sim Core APIs for high-level robotics-specific tasks.

## Using Isaac Sim Core APIs[#](#using-isaac-sim-core-apis "Link to this heading")

Note

This module is using Isaac Sim 4.2.0. When future version are released, the API could change.

In this section, we will explore Isaac Sim Core APIs, which provide a simplified way to perform common robotics simulation tasks. Unlike the more detailed USD APIs, Core APIs abstract away many of the default parameter settings, making them easier to use while still offering powerful functionality. These APIs are specifically designed for robotics applications, allowing you to quickly set up environments, add objects, and configure physics properties.

### Prepare a Fresh Stage[#](#id1 "Link to this heading")

1. Open **Isaac Sim**

   - **Create** a new stage from **File > New From Stage Template > Empty.**
   - When prompted to save the current stage, select **Donât Save.**
2. Open the **Script Editor** from the *Menu Bar* by navigating to **Window > Script Editor**.

### Write the Isaac Sim Core API Script[#](#write-the-isaac-sim-core-api-script "Link to this heading")

3. In the *Script Editor*, **paste** the following script to set up a ground plane and add a dynamic cube:

```
1import numpy as np
2from omni.isaac.core.objects import DynamicCuboid
3from omni.isaac.core.objects.ground\_plane import GroundPlane
4from omni.isaac.core.physics\_context import PhysicsContext
5
6PhysicsContext()
7GroundPlane(prim\_path="/World/groundPlane", size=10, color=np.array([0.5, 0.5, 0.5]))
8DynamicCuboid(prim\_path="/World/cube",
9 position=np.array([-.5, -.2, 1.0]),
10 scale=np.array([.5, .5, .5]),
11 color=np.array([.2, .3, 0.]))
```

This script performs the following tasks:

- Sets up a Physics Context: Initializes physics for the simulation.

  - Adds a Ground Plane: Creates a flat surface for objects to interact with.
  - Adds a Dynamic Cube: Creates a cube with physics properties (e.g., gravity and collision) and positions it above the ground.

### Run the Script[#](#id2 "Link to this heading")

4. Click the **Run** button in the *Script Editor* or press **Ctrl+Enter** to execute the script.
5. Observe that a ground plane and a cube are added to your stage.

### Simulate the Scene[#](#id3 "Link to this heading")

6. Press the **Play** button in Isaac Sim to start the simulation.
7. Watch as the cube falls onto the ground plane due to gravity.

Important

Only run this script once on an empty stage to avoid creating duplicate objects or conflicting physics contexts.  
If you encounter any errors during execution, ensure that your stage is fresh and that no conflicting scripts are running.  
To do this, click **File > New From Stage Template > Empty** to create a new stage, click **Donât Save** when prompted to save the current stage.

---

### Why Use Isaac Sim Core APIs?[#](#why-use-isaac-sim-core-apis "Link to this heading")

Isaac Sim Core APIs simplify common robotics simulation tasks by:

- Abstracting away complex USD API details.
- Providing concise and readable code for quick prototyping.
- Offering high-level functions tailored for robotics applications.

However, for more advanced or customized tasks, you can always use USD APIs for precise control over your simulation. For more details on using Core APIs in Isaac Sim, refer to [Core API Tutorials](https://docs.omniverse.nvidia.com/isaacsim/latest/core_api_tutorials/index.html).

## Review[#](#review "Link to this heading")

In this module, we explored the foundations of Python scripting in Isaac Sim, focusing on tools and APIs that enable programmatic control over simulations. These tools provide flexibility for creating, customizing, and automating robotics simulations.

In this module:

- **Script Editor**: A built-in Python environment for writing and executing scripts directly in the Isaac Sim GUI, featuring a shared environment for seamless interaction across multiple tabs.
- **USD APIs**: Low-level APIs for precise scene manipulation, offering powerful but complex control over objects and physics properties.
- **Isaac Sim Core APIs**: High-level robotics-specific APIs that simplify common tasks like adding objects and configuring physics, making scripting more accessible for beginners.

By combining these tools, you now have a strong foundation for scripting in Isaac Sim. You can choose between the simplicity of Core APIs or the precision of USD APIs to suit your project needs as you continue to develop custom simulations and robotics applications.

---

### Quiz[#](#quiz "Link to this heading")

1. What is the purpose of the Script Editor in Isaac Sim?

   1. To write and execute Python scripts directly in the Isaac Sim GUI.
   2. To replace visual scripting tools like OmniGraph.
   3. To generate 3D assets for simulations.
   4. To configure physical hardware for robotics testing.

Answer

**A**  
The Script Editor is a built-in Python environment in Isaac Sim that allows users to write and execute scripts directly within the GUI, enabling programmatic control of simulations.

2. How do Isaac Sim Core APIs differ from USD APIs?

   1. Core APIs are more complex and detailed than USD APIs.
   2. Core APIs are only used for visual scripting with OmniGraph.
   3. Core APIs eliminate the need for physics simulation in Isaac Sim.
   4. Core APIs simplify common robotics tasks by abstracting default parameter settings.

Answer

**D**  
Isaac Sim Core APIs are high-level robotics-specific tools that simplify common tasks like adding objects or configuring physics, making them more accessible compared to the detailed and versatile USD APIs.

3. What is a key feature of USD APIs in Isaac Sim?

   1. They are exclusively used for testing ROS-based systems.
   2. They provide low-level control over scene creation and object manipulation.
   3. They replace the need for Core APIs entirely.
   4. They are only used for creating visual effects in simulations.

Answer

**B**  
USD (Universal Scene Description) APIs offer precise, low-level control over scene creation, object manipulation, and physics properties, making them powerful but more complex tools for advanced scripting tasks.

On this page
