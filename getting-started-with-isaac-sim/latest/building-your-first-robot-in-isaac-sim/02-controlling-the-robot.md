# Controlling the Robot[#](#controlling-the-robot "Link to this heading")

## Overview[#](#overview "Link to this heading")

In this lesson, you will learn how to control your SimpleRobot using Isaac Simâs OmniGraph and prepare it to be controlled by keyboard inputs. Youâll set up a differential controller to manage wheel movement and explore the concept of articulations to ensure physics interactions.

By the end of this lesson, you will be able to control your robotâs movement dynamically and efficiently.

### Learning Objectives[#](#learning-objectives "Link to this heading")

- **Implement a differential controller** using OmniGraph to manage robot movement.
- **Configure articulations** for accurate physics interactions.
- **Integrate keyboard controls** to allow manual operation of the robot.
- **Analyze OmniGraph nodes** to understand their roles in controlling the robot.
- **Simulate robot movement** and troubleshoot any issues that arise.

## Differential Controller[#](#differential-controller "Link to this heading")

SimpleRobot is moving, but itâs a manual process. Letâs implement and configure a differential controller to manage your robotâs movement within Isaac Sim. This lesson will guide you through the setup of articulations, ensuring that physics interactions are accurately simulated. Youâll use OmniGraph to create a differential controller, configuring wheel radius and distance to optimize movement. Additionally, youâll explore the OmniGraph nodes that facilitate control, allowing you to adjust parameters for dynamic robot behavior.

By the end of this section, youâll have a fully functional control system that enables precise navigation of your robot in simulations.

Note

**In this module, we wonât cover OmniGraph in detail. However, if youâd like to learn more, refer to the [OmniGraph documentation](https://docs.omniverse.nvidia.com/isaacsim/latest/gui_tutorials/tutorial_gui_omnigraph.html).**

---

**Concept of Articulations**

Articulations allow physics to properly interact with the meshes and joints of the robot. This is crucial for simulating realistic movements and interactions.

---

### Setting Up the Controller[#](#setting-up-the-controller "Link to this heading")

The order of making sure the articulations are created first before creating the controller is very important. This ensures that the controller can properly interact with the articulated robot.

**Isaac Sim 4.2**

1. To add articulation to the robot, right-click on the **SimpleRobot** xform and select **Add > Physics > Articulation Root.**
2. In the menu bar, open Isaac Utils, select **Common Omnigraphs**, and choose **Differential Controller.**

**Isaac Sim 4.5**

1. To add articulation to the robot, right-click on the **SimpleRobot** xform and select **Add > Physics > Articulation Root.**
2. In the menu bar, open **Tools > Robotics > OmniGraph Controllers** and choose **Differential Controller.**

Weâll use OmniGraph, Omniverseâs visual programming framework, to control the robot. Robots can also be controlled with the Python APIs described in the Isaac Sim docs [here](https://docs.isaacsim.omniverse.nvidia.com/latest/core_api_tutorials/tutorial_core_adding_controller.html).

---

### Configuring the Differential Controller[#](#configuring-the-differential-controller "Link to this heading")

A new *Differential Controller* window will display.

3. Leave the path to **default** and add the **SimpleRobot** to the Robot Prim.
4. Set the **wheel radius** based on the diameter of the wheel (e.g., 0.75 diameter means 0.375 radius).
5. Set the **distance between wheels** to **1.5**.
6. Define specific joints we want the controller to control. Since we want the back wheels to drive the robot, place the names of those two joints in the appropriate fields.
7. Press **OK**.

---

### Understanding the OmniGraph[#](#understanding-the-omnigraph "Link to this heading")

See that there is a new **Graphs** folder in the *Stage* window. Inside is the **differential\_controller** OmniGraph.

8. Right-click on the **graph** and open it. There are four nodes inside the graph. Letâs look at each one to understand what it is doing:

   1. **On Playback Tick:** This node will execute on every frame, sending a signal to the following node(s) to provide a calculation for whatever it is set up to do.
   2. **Differential Controller:** This node calculates the velocity command for the robot based on the input values. The pins on the left allow for other nodes to connect calculated values, and the right is the calculated result after passing through the node.
   3. **Articulation Controller:** This node tells the robotâs joints to move forward or backward based on the calculated value from the Differential Controller.
   4. **MakeArray:** This node allows us to add as few or as many values as needed for the joint names

---

### Testing the Controller[#](#testing-the-controller "Link to this heading")

9. Press **play** and see that the robot is sitting still because the **Desired Linear Velocity** is set to **0** in the Differential Controller.
10. Open the **Differential Controller** and adjust the **Desired Linear Velocity** or **Angular Velocity** to see the robot move.

    - Keep the values low. Eg., **1** to move forward and **-1** to move backwards.

Note

**Note on Physics Materials:**  
As you drive the robot around, you may notice it bumps as if driving over something due to wheel slippage on the ground. This occurs because physics materials have not been set up yet; both wheels and ground share identical materials. This topic will be covered in a later module.

To avoid manually typing in those values, letâs set up our keyboard to control the robotâs movement in the next section.

## Configure Keyboard Inputs Using ActionGraph[#](#configure-keyboard-inputs-using-actiongraph "Link to this heading")

With our differential controller set up, we can enhance our robotâs control system by integrating keyboard inputs to manage its movement dynamically. This section will guide you through the process of starting with a prebuilt OmniGraph that includes keyboard control functionality. We will configure the differential controller to allow for manual operation of the robot using keys such as **W**, **A**, **S**, and **D**.

By setting up input nodes within the ActionGraph, weâll enable our robot to respond to keyboard commands, facilitating precise navigation and interaction within the simulation environment. By the end of this section, youâll have a robust control system that leverages keyboard inputs for intuitive robot operation.

---

### Adding Keyboard Control to the Robot[#](#adding-keyboard-control-to-the-robot "Link to this heading")

1. Delete the previously created simple **OmniGraph.** Weâll replace this with a new, prebuilt one that includes keyboard control.

**Isaac Sim 4.2**

2. Navigate to the **Isaac** menu, select **Common OmniGraphs**, and choose **Differential Controller.**

**Isaac Sim 4.5**

2. Navigate to the **Tools > Robotics > OmniGraph Controllers** menu, and choose **Differential Controller.**

---

### Configure the Differential Controller[#](#configure-the-differential-controller "Link to this heading")

3. Add the **SimpleRobot** to the Robot Prim.

   - This is crucial, as is the articulation root, and the differential controller will search for the joints there to provide velocity values to.
4. Set the **wheel radius** to **0.375** and the **distance between the wheels** to **1.5**.
5. Add the **rear\_right\_joint** and **rear\_left\_joint** to the controllable joints.
6. Set **Use Keyboard Control** to **true**.

---

### Exploring the New OmniGraph[#](#exploring-the-new-omnigraph "Link to this heading")

7. Right-click on the newly created **OmniGraph** and **open** it.

While there are many more nodes in this graph, the endpoints on the right are the same as previously covered. The new additions include:

- **Input Nodes:** Four input nodes on the left side, each set to listen for a press on the keyboard on either W, A, S, or D.

  - Each input node allows adding a key and a modifier key to listen for. When you press a key or set of keys, the data will be sent to the next nodes. This will give the different values that the controller will use.

---

### Simulating the Scene[#](#simulating-the-scene "Link to this heading")

8. Press **play** to start simulating the scene. Now, you can control the movement of the robot using the keyboard.

Note

You can adjust the value of how much a keyboard press adds to the linear and angular velocities by changing the **Constant Double** Nodes

**SAVE**

Go to **File > Save** to save your work!

## Review[#](#review "Link to this heading")

In this lesson, you successfully set up a differential controller using OmniGraph, allowing you to control your SimpleRobotâs movement. You configured articulations to ensure physics interactions and integrated keyboard controls for manual operation. By analyzing OmniGraph nodes, you gained insights into their roles in managing robot behavior.

### Learning Objectives[#](#id1 "Link to this heading")

- **Implemented a differential controller** to manage wheel movement.
- **Configured articulations** for realistic physics interactions.
- **Integrated keyboard controls** for manual robot operation.
- **Analyzed OmniGraph nodes** and their functions.
- **Simulated and troubleshot** robot movement.

In the next lesson, you will add sensors to your SimpleRobot, enabling it to interact with its environment more intelligently.

---

### Quiz[#](#quiz "Link to this heading")

1. What is the primary purpose of a differential controller in Isaac Sim?

   1. To adjust the visual appearance of the robot
   2. To simulate gravity on the robot
   3. To manage the robotâs wheel rotation and movement
   4. To control the camera movement in the simulation

Answer

**C**  
A differential controller is used to calculate and manage the velocity of the robotâs wheels, enabling controlled movement based on input values. It ensures that the robot moves in a coordinated manner by controlling wheel rotation.

2. Why is it important to configure articulations before setting up a controller in Isaac Sim?

   1. Articulations allow for manual control of the robot.
   2. Articulations ensure that physics interactions between joints and meshes are accurate.
   3. Articulations make the robot move faster.
   4. Articulations are only needed for visual effects.

Answer

**B**  
Articulations define how joints and meshes interact with physics, which is crucial for realistic simulations. Without proper articulation, the controller cannot accurately manage the robotâs movements.

3. How can you enable keyboard control of the robot using the keyboard in Isaac Sim?

   1. Set âUse Keyboard Controlâ to true in the Differential Controller
   2. Add a new collision mesh to the robot
   3. Increase the wheel radius for better control
   4. Enable âUse Keyboard Controlâ in the setting menu

Answer

**A**  
To enable manual control using the keyboard, you need to set âUse Keyboard Controlâ to true in the Differential Controller. This allows inputs from keys like W, A, S, and D to control the robotâs movement during simulation.

4. Which node in OmniGraph calculates velocity commands for the robot based on input values?

   1. On Playback Tick
   2. Articulation Controller
   3. Differential Controller
   4. MakeArray

Answer

**C**  
The Differential Controller node is responsible for calculating velocity commands based on inputs such as desired linear or angular velocity. It sends these commands to other nodes like the Articulation Controller to move the robot.

5. If your robot does not move after pressing play, what could be a possible reason?

   1. The Desired Linear Velocity is set to 0 in the Differential Controller
   2. The wheels do not have a collision mesh applied
   3. The articulation root was not added to SimpleRobot
   4. The ground plane was not created

Answer

**ALL**  
Each of these options could prevent the robot from moving:  
1.If the Desired Linear Velocity is set to 0, no forward motion will be applied to the wheels, causing the robot to remain stationary.  
2. If the wheels lack a collision mesh, they wonât interact with the environment, preventing movement.  
3. Without an articulation root, the controller cannot properly manage the robotâs joints, which would stop movement.  
4. Without a ground plane, the robot may fall indefinitely or fail to interact with its environment properly.

On this page
