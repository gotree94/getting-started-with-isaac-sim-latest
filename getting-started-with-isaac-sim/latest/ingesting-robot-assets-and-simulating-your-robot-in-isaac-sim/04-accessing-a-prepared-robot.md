# Accessing a Prepared Robot[#](#accessing-a-prepared-robot "Link to this heading")

In this lesson, weâll conclude the module by exploring one of the pre-configured robots that ships with Isaac Sim. Youâll learn how to import these existing robot assets into your Isaac Sim scene, review its structure and components, and compare it to the Carter robot we worked with earlier. By the end of this lesson, youâll be familiar with the ready-to-use features that you can leverage to develop your robotics tasks in future modules.

## Learning Objectives[#](#learning-objectives "Link to this heading")

1. **Import Nova Carter** into Isaac Sim to prepare it for simulation.
2. **Examine Nova Carterâs structure**, including its wheels, chassis, and sensor suite.
3. **Compare Nova Carter to the manually configured Carter** robot to highlight its advanced features.
4. **Identify the sensors included in Nova Carter** and their roles in robotics applications.
5. **Prepare for future tasks** by reviewing how Nova Carter can be used for advanced simulations like synthetic data generation (SDG).

## Introduction to Nova Carter[#](#introduction-to-nova-carter "Link to this heading")

In this section, weâll import the Nova Carter, a pre-configured and ready-to-use robot, into Isaac Sim. Unlike the Carter robot we imported earlier using the URDF Importer, Nova Carter is a pre-baked asset with complete materials, physics properties, and sensors. This makes it an excellent starting point for more advanced simulations. By the end of this section, youâll know how to set up a new stage, import existing Isaac Sim robotics assets, and understand its capabilities.

### What Is Nova Carter?[#](#what-is-nova-carter "Link to this heading")

- Nova Carter is a robotics development platform designed for simulation and real-world applications. It includes advanced sensors such as stereo cameras, fisheye cameras, 2D lidars, and a 3D lidar.
- Using Nova Carter allows us to skip the manual setup of sensors and physics properties, enabling us to focus on higher-level tasks like navigation or perception.
- This robot is also used as a reference platform for Isaac AMR (Autonomous Mobile Robots) and Isaac ROS software, making it ideal for learning about robotics in simulation.

### Set Up a New Stage[#](#set-up-a-new-stage "Link to this heading")

Letâs start fresh by creating a new stage:

1. Navigate to **File > New** to clear the current stage.

**Isaac Sim 4.2**

**Add a Flat Grid as the Environment**

3. Go to **Create > Isaac > Environments > FlatGrid**.

   - The flat grid provides a simple ground plane for your robot to move on.
4. In the *Stage* window, locate the **environment light object** and toggle it **off** by clicking the **eye** icon next to it.

   - This reduces brightness and makes it easier to focus on the robot.

**Import Nova Carter**

5. Navigate to **Create > Isaac > Robots > Wheeled Robots > NVIDIA > Nova Carter**.

   - Once selected, Nova Carter will be added to your stage.

Note

If this is your first time importing Nova Carter, it may take a few minutes to load due to its complexity.

**Explore Other Robot Options**  
While in the same menu **Isaac > Robots > Wheeled Robots**, you may notice other options like **Carter\_v1**.

- Carter\_v1 is the finished version of the URDF-based Carter we worked with earlier. It includes full materials and physics properties pre-configured for you.
- Feel free to import Carter\_v1 if youâd like to explore it further.

For now, weâll focus on Nova Carter as our primary robot.

**What Makes Nova Carter Special?**

- Nova Carter is a complete robotics development platform with advanced features:

  - **Sensors:** Includes stereo cameras, fisheye cameras, IMUs (Inertial Measurement Units), 2D Lidars, and a 3D Lidar for comprehensive perception capabilities.
  - **Physics Properties:** Pre-configured with realistic materials and dynamics for accurate simulation.
  - **ROS Integration:** Designed for use with both ROS1 and ROS2, making it suitable for real-world robotics applications.
- These features make Nova Carter an excellent tool for learning about autonomous mobile robots (AMRs) in simulation.

**Validate Import**

6. Once imported, take a moment to explore Nova Carter in the *Stage* window:

   - Expand its hierarchy to see all its components (e.g., sensors, wheels).
   - Notice how everything is already set upâthereâs no need to manually add sensors or configure physics properties like we did with the original Carter.

**Isaac Sim 4.5**

**Add a Flat Grid as the Environment**

3. Go to **Create > Environments > FlatGrid**.

   - The flat grid provides a simple ground plane for your robot to move on.
4. In the *Stage* window, locate the **environment light object** and toggle it **off** by clicking the **eye** icon next to it.

   - This reduces brightness and makes it easier to focus on the robot.

**Import Nova Carter**

5. Navigate to **Create > Robots > Nova Carter with Sensors**.

   - Once selected, Nova Carter will be added to your stage.

Note

If this is your first time importing Nova Carter, it may take a few minutes to load due to its complexity.

**Explore Other Robot Options**  
In the bottom left of the **Isaac Sim Assets (Beta)** panel, you can search for existing robot assets like **Carter\_v1**.

- Type **carter** in the search bar and click on Carter\_v1. Load this as reference into the stage to understand the asset in detail.
- **Carter\_v1** is the finished version of the URDF-based Carter we worked with earlier. It includes full materials and physics properties pre-configured for you.
- Feel free to import Carter\_v1 if youâd like to explore it further.

For now, weâll focus on Nova Carter as our primary robot.

**What Makes Nova Carter Special?**

- Nova Carter is a complete robotics development platform with advanced features:

  - **Sensors:** Includes stereo cameras, fisheye cameras, IMUs (Inertial Measurement Units), 2D Lidars, and a 3D Lidar for comprehensive perception capabilities.
  - **Physics Properties:** Pre-configured with realistic materials and dynamics for accurate simulation.
  - **ROS Integration:** Designed for use with both ROS1 and ROS2, making it suitable for real-world robotics applications.
- These features make Nova Carter an excellent tool for learning about autonomous mobile robots (AMRs) in simulation.

**Validate Import**

6. Once imported, take a moment to explore Nova Carter in the *Stage* window:

   - Expand its hierarchy to see all its components (e.g., sensors, wheels).
   - Notice how everything is already set upâthereâs no need to manually add sensors or configure physics properties like we did with the original Carter.

---

### Key Takeaways[#](#key-takeaways "Link to this heading")

- Set up a new stage with a flat grid environment.
- Imported Nova Carter into Isaac Sim as our primary robot for future tasks.
- Learned about Nova Carterâs features and why it can be used for robotics development.

In the next section, weâll dive deeper into exploring the robot asset by testing its sensors and mobility in simulation!

## Reviewing the Nova Carter[#](#reviewing-the-nova-carter "Link to this heading")

In this section, weâll take a closer look at the robot asset after importing it into Isaac Sim. Weâre using the Nova Carter robot in this example, but you should spend some time examining the other robotic assets that Isaac Sim provides. By reviewing its components and sensors, weâll gain a deeper understanding of each robotâs capabilities and how it differs from the Carter robot we imported earlier.

### Overview of Nova Carter[#](#overview-of-nova-carter "Link to this heading")

- Nova Carter is a next-generation Autonomous Mobile Robot (AMR) platform powered by NVIDIAâs Jetson AGX Orin architecture. Itâs designed to accelerate robotics development, testing, and deployment.
- Unlike the Carter robot we imported using the URDF Importer, Nova Carter comes fully pre-configured with advanced sensors, materials, and physics properties, making it ready to use out of the box.
- This robot is ideal for tasks like 3D mapping, navigation, and perception-based AI development.

### Explore the Robotâs Structure[#](#explore-the-robot-s-structure "Link to this heading")

1. Start by navigating around Nova Carter in the *Stage* window to get a sense of its design.

Just like the original Carter robot:

- It has two drivable wheels at the front that are actuated for movement.

  - The two pivot (or caster) wheels at the back rotate passively to follow the robotâs motion.

These wheels provide stability and enable smooth navigation in various environments.

### Expand the Chassis Link Xform[#](#expand-the-chassis-link-xform "Link to this heading")

2. In the *Stage* window, expand **chassis\_link** under Nova Carter to explore its components.

   - Youâll notice that Nova Carter includes an array of sensors that are already set up and ready for use.

### Review Nova Carterâs Sensors[#](#review-nova-carter-s-sensors "Link to this heading")

Nova Carter is equipped with a comprehensive sensor suite designed for high-resolution perception and navigation:

**Stereo Cameras**

- Four Hawk stereo cameras are positioned at the front, left, right, and back of the robot.
- These cameras provide depth perception and are ideal for tasks like obstacle detection and 3D mapping.

**2D Lidars**

- A front-facing and rear-facing 2D Lidar are included for detecting objects in a 2D plane around the robot.
- These sensors are useful for tasks like localization and basic obstacle avoidance.

**3D Lidar**

- Positioned at the top of Nova Carter is an XT-32 3D Lidar.
- This sensor provides detailed 360-degree environmental scanning, enabling advanced navigation and mapping capabilities.

These sensors work together to give Nova Carter a complete understanding of its surroundings.

### Why These Sensors Matter[#](#why-these-sensors-matter "Link to this heading")

The combination of stereo cameras and Lidars makes Nova Carter highly versatile:

- Stereo cameras offer rich visual data for AI-based perception tasks like object recognition or semantic segmentation.

  - Lidars provide precise distance measurements, which are critical for navigation in complex environments.

With these sensors, Nova Carter can handle both indoor and outdoor applications, from warehouse logistics to autonomous vehicles.

### Compare With Carter[#](#compare-with-carter "Link to this heading")

Reflect on how Nova Carter differs from the original URDF-imported Carter:

- The original Carter required manual setup of sensors and physics properties.

  - Nova Carter comes fully equipped with pre-configured sensors, making it easier to jump straight into higher-level tasks like navigation or synthetic data generation (SDG) which is the subject of the next module.

---

### Next Steps[#](#next-steps "Link to this heading")

- Review the [wide range of robots](https://docs.isaacsim.omniverse.nvidia.com/latest/assets/usd_assets_robots.html) that Isaac Sim supports and provides for robotics simulations. Take some time to open a few up in Isaac Sim and examine its configuration.

With Nova Carter imported and reviewed, youâre now ready to move on to more advanced topics in robotics simulation. In the next module, weâll put these assets to use by diving into Synthetic Data Generation (SDG)âa powerful tool for creating realistic training datasets using robotic sensors.

## Review[#](#review "Link to this heading")

In this module, we explored the foundational steps for importing and simulating robots in Isaac Sim. We began by learning how to work with URDF files, using the URDF Importer to bring in a URDF asset, the Carter robot, into the simulation environment. Next, we prepared a realistic stage, reviewed Carterâs joints and components, and created a differential controller to drive the robot. We then enhanced Carter by adding sensors like an RGB camera and lidar, tested their functionality, and created an interactive environment with obstacles. Finally, we showed the OpenUSD-based robotics assets that come with Isaac Sim. We used the Nova Carter asset to show a fully pre-configured robot with advanced features and sensors, ready for more complex robotics tasks.

In the next module, weâll use these assets to dive deeper into advanced simulations and applications like synthetic data generation (SDG).

---

### Quiz[#](#quiz "Link to this heading")

1. What is one key advantage of using one of Isaac Simâs robot assets, compared to creating one from scratch?

   1. It has fewer sensors, making it easier to configure
   2. It requires manual setup for all physics properties
   3. It is fully pre-configured with advanced sensors and materials
   4. It cannot be used for navigation tasks

Answer

**C**  
Nova Carter, and several of the other assets that ship with Isaac Sim, is a fully pre-configured robot that includes advanced sensors, materials, and physics properties, so you can start developing your tasks and simulations faster.

2. Which of the following sensors is NOT included in Nova Carter?

   1. Stereo cameras
   2. 2D Lidars
   3. Thermal cameras
   4. 3D Lidar

Answer

**C**  
Nova Carter includes stereo cameras, 2D Lidars, and a 3D Lidar for comprehensive environmental perception. However, it does not include thermal cameras as part of its sensor suite.

3. What makes Nova Carter particularly suited for advanced robotics tasks?

   1. Its simple design with minimal components
   2. Its comprehensive sensor suite and pre-configured physics properties
   3. Its lack of pre-baked materials, allowing full customization
   4. Its compatibility only with basic simulations

Answer

**B**  
Nova Carterâs advanced features, including a comprehensive sensor suite (stereo cameras, 2D Lidars, 3D Lidar) and pre-configured physics properties, make it ideal for complex robotics tasks like navigation and synthetic data generation.

On this page
