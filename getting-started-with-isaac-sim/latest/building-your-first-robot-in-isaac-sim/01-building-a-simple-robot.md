# Building a Simple Robot[#](#building-a-simple-robot "Link to this heading")

In this first lesson, you will learn how to build a simple robot using Isaac Sim. You will navigate the interface, create and configure basic components like the chassis and wheels, and set up physics to simulate realistic movements. By the end of this lesson, you will have a foundational understanding of constructing a robot model that can interact with its environment.

## Learning Objectives[#](#learning-objectives "Link to this heading")

In this lesson, we will:

- Navigate the Isaac Sim interface to effectively manage simulations.
- Create a visual mesh and enable physics for basic shapes.
- Configure hierarchical structures to organize robot components.
- Apply revolute joints to enable wheel movement.
- Simulate the robotâs movement by adding drive forces.

## Navigating the Isaac Sim Interface[#](#navigating-the-isaac-sim-interface "Link to this heading")

Weâll begin by guiding you through launching Isaac Sim and exploring its user interface, including key components such as panels, context menus, and toolbars. Youâll learn how to navigate the viewport and understand the default scene setup with prims like World and defaultLight. Additionally, youâll explore the *Create* menu to add new assets and access Isaac examples, which demonstrate the capabilities of Isaac Sim.

By the end of this lesson, you will be equipped to efficiently manage simulations and prepare for building your first robot model in subsequent lessons.

---

Tip

We recommend using Isaac Sim 4.5.0 for this module, however instructions are also provided for 4.2.0 when there are discrepancies, and the current videos use 4.2.0 for reference.

Before getting started, make sure you have [installed Isaac Sim](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/install_workstation.html) on a Linux workstation. If you do not already have Isaac Sim installed, follow the link above for details. We recommend using Linux, to participate in the ROS 2 sections of this module.

### Starting Isaac Sim[#](#starting-isaac-sim "Link to this heading")

1. Start by locating the Isaac Sim folder in a terminal. For example:

```
cd ~/isaac-sim
```

2. Run

```
./isaac-sim.selector.sh
```

3. For this lesson, ensure that the ROS Bridge extensions are **not enabled**.

   - This will be covered in a later section when we dive into accessing data.
4. Click **Start**.

---

### Framework of the UI[#](#framework-of-the-ui "Link to this heading")

The Isaac Sim interface is composed of several key components:

- **Panels:** These are customizable and can be resized, docked, undocked, added, or removed. Key panels include the Stage, Properties, and Viewport.

  - **Context Menu**: Right-clicking in the viewport or stage provides access to various actions and tools.
  - **Toolbar:** Located at the top, it offers quick access to common functions such as creating new objects, running simulations, and accessing the extension manager.

---

### Default Prims in the Scene[#](#default-prims-in-the-scene "Link to this heading")

Upon launching Isaac Sim, the default scene already includes several prims such as the **World** and **defaultLight**, which you can see in the *Stage* panel.

Note

Isaac Sim uses the OpenUSD (Universal Scene Description) file framework. If youâre unfamiliar with OpenUSD, you can learn about core concepts, like prims, stages, and xforms, in our [Learn OpenUSD](https://docs.nvidia.com/learn-openusd/latest/index.html) curriculum.

---

### Create Menu[#](#create-menu "Link to this heading")

This menu allows us to add new prims and assets to the scene. It includes options for creating basic shapes (e.g., cubes, spheres), importing robots, and setting up environments like the flat grid.

---

### Isaac Examples[#](#isaac-examples "Link to this heading")

The *Examples* menu has a collection of samples that show how Isaac Sim works.

- These samples include features like using ROS/ROS 2, manipulating objects, and scenes with many robots.

---

### Navigating the Viewport[#](#navigating-the-viewport "Link to this heading")

- **Movement**: Hold the right mouse button and use the WASD keys to move the camera forward, backward, left, and right in the viewport.

  - Hold the right mouse button and use the Q and E keys to move the camera up and down.
- **Rotation**: Hold the right mouse button and drag to rotate the camera view.
- **Zoom**: Use the mouse wheel alone or hold alt and the right mouse button to zoom in and out of the scene.
- **Panning**: Hold the middle mouse button and drag to pan the camera view horizontally and vertically.

---

By understanding these components and how to navigate the Isaac Sim interface, you will be able to effectively create and manage simulations.

## Building a Simple Robot[#](#id1 "Link to this heading")

Now that we can confidently navigate the Isaac Sim interface, letâs construct a basic robot model within Isaac Sim. This section will guide you through creating a visual mesh for the robotâs chassis and adding essential components like wheels and joints. Youâll learn how to enable physics to simulate realistic movements and interactions, ensuring your robot can navigate its environment effectively.

By the end of this section, youâll have a functional robot model ready for further enhancements and control mechanisms in subsequent lessons.

---

### Creating a Visual Mesh[#](#creating-a-visual-mesh "Link to this heading")

Start by creating a cube in the scene.

1. Select **Create > Mesh > Cube** to create a cube in your scene.

Note

The cube created is a visual mesh, which is what we see in the viewport. However, this cube is not yet defined as a physics object.

---

### Enabling Physics in the Scene[#](#enabling-physics-in-the-scene "Link to this heading")

2. Press the **Play** button to simulate physics in the scene.

   - Observe that nothing happens. This is because the cube is not yet a physics object and has no colliders.
3. To enable physics in the scene, go to **Create > Physics > Physics Scene**.

   - This provides mechanics such as gravity and other needed forces for simulations.
4. Look at the default properties of the physics scene. See that gravity is set to Earth Gravity, and in Isaac Sim, the up/down axis is in Z.

   - Refer to the axis indicator in the bottom left of the viewport for orientation.

---

### Adding Physics to the Cube[#](#adding-physics-to-the-cube "Link to this heading")

5. Press **Play** again, and still, nothing happens.

   - This is because the scene understands that there is physics in the scene, but the cube is still not a physics object.
6. To fix this, right-click on the **cube** in the *Stage* window and select **Add > Physics > Rigid Body with Colliders Preset**.

   - The difference between the visual mesh and the collision mesh: The visual mesh is what we see in the viewport, while the collision mesh provides the way that the object interacts with other objects and how other objects react with it.
7. Open the **Show** icon, then select **Show by Type > Physics > Colliders > Selected**.

   - Now, we can see the green mesh showing us the collision mesh on the cube.

---

### Simulating Physics With a Ground Plane[#](#simulating-physics-with-a-ground-plane "Link to this heading")

8. Select **Play** to see what happens.

   - The cube falls indefinitely because there is no ground plane to stop it.
   - To prevent the cube from falling indefinitely, we need to add a ground plane. This is an infinitely extended plane that prevents all physics objects from going underneath it.
9. Add a ground plane through **Create > Physics > Ground** plane.

   - Notice that the visual mesh has an end, but the collision mesh continues infinitely.
10. Expand the **GroundFloor** xform to find a **CollisionMesh** and the **CollisionPlane**.
11. Move the **cube** to be above the ground plane. Remember that the default unit in Isaac Sim is meters (m), so raise the cube up to 1 meter.
12. Final Simulation: Press **Play** again.

    - Notice how the cube stops falling when it hits the ground plane. This is the interaction we would expect in a physics simulation.

---

### Additional Notes[#](#additional-notes "Link to this heading")

13. Try changing the gravity direction in the physics scene properties to see how it affects the simulation.

Note

When importing assets into Isaac Sim, different importers will bring in different sets of data. For example, URDF importers can bring in defined physics data, while Isaac Sim importers will only bring in visual data. This is important to keep in mind when working with various assets in Isaac Sim.

---

**SAVE**

Go to **File > Save** to save your work!

## Adding the Four Wheels[#](#adding-the-four-wheels "Link to this heading")

Moving on, letâs enhance our Simple Robot by attaching wheels and configuring them for movement. Youâll start by preparing the chassis and understanding the importance of hierarchies in organizing robot components. Next, youâll create and position the wheels, ensuring they are correctly aligned and attached to the robotâs body. Youâll also add physics properties to the wheels, allowing them to interact with the environment. Finally, youâll configure revolute joints for rotational movement and apply drive forces to simulate wheel propulsion.

By the end of this section, your robot will be equipped with functional wheels, ready for dynamic movement in future simulations.

---

### Preparing the Chassis[#](#preparing-the-chassis "Link to this heading")

1. Ensure the cube is at the world origin (**0, 0, 0**). This cube will become the main chassis of our robot.
2. Scale the cube to **2, 1, 0.5**. The 2 in the X dimension allows for the front and back wheels.

Understanding the importance of hierarchies in building complex models will help to organize objects, and make transformations and modifications easier.

---

### Creating the Robot Xform and Adding the Chassis[#](#creating-the-robot-xform-and-adding-the-chassis "Link to this heading")

3. Create an xform by right-clicking in the *Stage* panel and selecting **Create > Xform**. This will serve as the parent for our robot.
4. Double-click the new **xform** and rename it to **SimpleRobot**.
5. Add the chassis (the cube) to the **SimpleRobot** xform by dragging it to the **SimpleRobot** xform in the *Stage*.
6. With the **SimpleRobot** xform selected, find the *Transform* properties in the *Properties* tab.
7. Raise the **SimpleRobot** up by **1** in the Z-direction.

   - Observe how the chassis moves up with the xform. This is because the translations are applying to every prim within that **SimpleRobot** xform, which serves as a container.
8. Set the height value on the body to **0** to correct this.

---

### Child-Parent Relationships[#](#child-parent-relationships "Link to this heading")

As noted in the previous step, the SimpleRobot xform is a container. It creates a child-parent relationship in the stage. Identify the importance of child-parent relationships in hierarchies. This relationship allows for easier management and transformation of objects within the hierarchy.

---

### Creating and Positioning the Wheels[#](#creating-and-positioning-the-wheels "Link to this heading")

9. In the *Stage*, right-click on **SimpleRobot** and select **Create > Mesh > Cylinder** to create a wheel.
10. Under the transform properties, rotate it **90** degrees in the X dimension and scale it to **0.75, 0.75, 0.25**.
11. Translate the wheel to **0.5, 0.75, 0**. This positions the wheel relative to the world axis and the body of the robot.
12. Rename the cylinder to **Front\_Left\_Wheel** by right-clicking it in the *Stage* panel and selecting **Rename**.
13. Duplicate **Front\_Left\_Wheel** to create the other three wheels. You can do this by right-clicking and selecting **Duplicate**, or by pressing **Ctrl+D** on your keyboard with the prim selected.
14. Rename each wheel relative to its position (**Front\_Right\_Wheel**, **Rear\_Left\_Wheel**, **Rear\_Right\_Wheel**).

Make sure all wheels are children of the SimpleRobot xform.

---

### Adding Physics to the Wheels and Simulating[#](#adding-physics-to-the-wheels-and-simulating "Link to this heading")

15. Select all the wheels, right-click, and under **Add**, select **Rigid Body with Collision Preset**.

    - With the wheels selected, see that the collision meshes are now showing.
16. Press **Play** and observe how the wheels also fall to the ground due to gravity.

**SAVE**

Go to **File > Save** to save your work!

## Preparing the Joints[#](#preparing-the-joints "Link to this heading")

With our wheels set up, we can focus on enhancing the SimpleRobot by configuring joints that enable wheel movement. This section will guide you through selecting and setting up revolute joints, which allow for rotational movement ideal for wheels. Youâll learn how to configure these joints correctly by adjusting axes and rotations to ensure they align with the wheelsâ orientation. Additionally, youâll create angular drives for the rear wheels to simulate propulsion, setting parameters like velocity and damping for stable control.

By the end of this section, your robot will have fully functional joints, ready to move dynamically in simulations.

---

### Creating Revolute Joints[#](#creating-revolute-joints "Link to this heading")

1. Select a **wheel**. Observe that it is the Y-axis that we want to place the joint on.

   - Revolute joints allow for rotational movement around a single axis, which is ideal for wheels.
2. To create a revolute joint, select the parent body **Cube** first, then, while holding **Ctrl** select the child prim, (**Front\_Left\_Wheel**). Right-click and select **Create > Physics > Joint > Revolute joint**.

   - Holding **Ctrl** will allow you to select both at the same time.
   - Remember to select the **Cube** first and then the **wheel** to allow the joint to set itself up correctly. The order establishes how they move in relation to each other, but it can also be changed later.

---

### Configuring the Revolute Joint[#](#configuring-the-revolute-joint "Link to this heading")

Note that the default values are incorrect. The default axis is set to X, but we need to change it to Y.

3. Change the joint axis to **Y**. Observe that the visualization is now pointing up.

   - We need to manually set the **local rotation 0** of the joint to match the orientation of the prim.
4. Set the local rotation 0 to **0, 0, 0**.

   - See that the revolute joint now aligns with the orientation of the wheel. Zoom into the joint and notice that the red X arrows are aligned properly, but the blue Z arrows are not.
5. Set the Local Rotation 1 value to **-90, 0, 0** to correct the mismatch.
6. Deselect and reselect the **joint** to see the update.

   - Make sure all the lines are along their correct orientation.
   - We can ignore the arrowâs pointing direction.
7. Rename the RevoluteJoint to match the name of the wheel they are connected to, **Front\_Left\_Joint**.

---

### Creating the Remaining Joints[#](#creating-the-remaining-joints "Link to this heading")

Create the next joints one at a time.

8. Select the body first, then the next wheel. Create the new joint using the same parameters as the first one.
9. When finished, move the robot down to the ground plane.

---

### Adding a Drive Force to the Rear Wheels[#](#adding-a-drive-force-to-the-rear-wheels "Link to this heading")

Weâll add a drive force to only the rear wheels since the rear wheels are the two that are driving the robot.

10. Right-click on the **joint** of the back wheel and select **Add > Physics > Angular Drive**.
11. Set the damping for the drive to **10,000**.

    - A large damping value of 10,000 for the rear wheels is chosen to achieve precise velocity control, reduce oscillations, and ensure stability.
12. Set the target velocity to **50**.Because this is an angular drive, the units for velocity are degrees / second.
13. Repeat for the other rear wheel.

---

### Simulating the Robot[#](#simulating-the-robot "Link to this heading")

14. Press **Play** to see the robot move forward.

**SAVE**

Go to **File > Save** to save your work!

### Challenge[#](#challenge "Link to this heading")

How would you prepare the robot to turn? Try setting a positive value to one wheel and a negative value to the other.

TROUBLESHOOTING

If there are issues, check that the wheels are lower than the body and that the joints are set up correctly. If not, it will drag the robot. Confirm that the jointsâ Body 0 and Body 1 values arenât mixed up. When debugging, double check all the parameters to ensure correct values. One value mistake may cause strange results. Finally, it may be helpful to disable joints one-by-one to narrow down the issue.

## Review[#](#review "Link to this heading")

In this lesson, you have successfully built a simple robot in Isaac Sim. You navigated the interface, created a visual mesh for the chassis, and enabled physics to simulate realistic interactions. You also learned to configure hierarchies and apply revolute joints for wheel movement, culminating in a functional robot model.

### Learning Objectives[#](#id2 "Link to this heading")

- **Navigation of the Isaac Sim** interface and becoming familiar with panels and tools.
- **Created a visual mesh** and added physics properties to simulate interactions.
- **Configured hierarchical structures** within your robot model.
- **Applied revolute joints**, allowing for rotational wheel movement.
- **Simulated the robotâs movement** by adding drive forces to the rear wheels.

In the next lesson, youâll explore preparing and controlling the robot using the keyboard and further enhance its functionality.

---

### Quiz[#](#quiz "Link to this heading")

1. Which of the following actions allows you to move the camera forward in the Isaac Sim viewport?

   1. Hold the right mouse button and drag
   2. Use the WASD keys while holding the right mouse button
   3. Use the Q and E keys while holding the left mouse button
   4. Press the Up Key on the keyboard

Answer

**B**  
In Isaac Sim, holding the right mouse button and using the WASD keys allows you to move the camera forward, backward, left, and right in the viewport. This is essential for navigating around your simulation environment.

2. What must be added to a cube in Isaac Sim to enable it to interact with other objects in a physics simulation?

   1. A visual mesh
   2. A collision mesh
   3. A texture
   4. A light source

Answer

**B**  
A collision mesh defines how an object interacts with other objects in a simulation. While a visual mesh shows what we see in the viewport, it is the collision mesh that allows objects to physically interact within a scene.

3. Why is it important to use hierarchies when building a robot in Isaac Sim?

   1. It ensures all components are visible in the viewport.
   2. It automatically applies physics to all child objects.
   3. It reduces simulation time.
   4. It helps organize components and simplifies transformations.

Answer

**D**  
Hierarchies are crucial for organizing robot components in Isaac Sim because they allow for easier management of complex models. By grouping related parts under a parent object, transformations like scaling or moving can be applied more efficiently.

4. What is the primary function of a revolute joint when applied to a robotâs wheels in Isaac Sim?

   1. To allow the wheels to rotate around a fixed point
   2. To move the wheels up and down
   3. To lock the wheels in place
   4. To change the wheelâs shape during simulation

Answer

**A**  
A revolute joint allows for rotational movement around a single axis, which is essential for enabling wheel movement in simulations. This type of joint is commonly used to simulate the rotation of wheels on vehicles or robots.

5. To simulate forward movement of a robot with rear-wheel drive, what needs to be configured on the rear wheels?

   1. Increase gravity on rear wheels
   2. Change wheel scale to increase friction
   3. Remove collision meshes from front wheels
   4. Add an angular drive with velocity control

Answer

**D**
To simulate wheel propulsion, an angular drive must be added to the rear wheels, which controls their rotational velocity. This enables forward or backward movement by applying forces that simulate real-world driving mechanics.

On this page
