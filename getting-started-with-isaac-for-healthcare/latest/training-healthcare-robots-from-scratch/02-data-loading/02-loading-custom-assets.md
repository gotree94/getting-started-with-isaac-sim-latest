# Loading Custom Assets in Isaac Sim[#](#loading-custom-assets-in-isaac-sim "Link to this heading")

Building from the setup we did in the last module, letâs open Isaac Sim and get started.

## Launch Isaac Sim[#](#launch-isaac-sim "Link to this heading")

1. Open a new terminal.
2. Activate your environment and launch Isaac Sim.

```
conda activate robotic\_ultrasound
isaacsim
```

In this video, we activate our `robotic_ultrasound` environment and launch Isaac Sim.

Note

The first time you launch Isaac Sim, you may need to accept the EULA. Watch for the progress bar at the bottom right as the shader cache warms up. On the first launch this can take up to 15 minutes.

## Determine Location of Pre-Downloaded Assets[#](#determine-location-of-pre-downloaded-assets "Link to this heading")

When you install Isaac for Healthcare, a number of assets will be pre-downloaded for you, making it easy to get started.
These assets include USD files like the modified Franka robot arm with the ultrasound transducer end-effector, and also our phantom model.
The folder also includes model checkpoints that we will use later.
Letâs locate the USD files by finding the local asset path. Weâll make use of a small helper function from the Isaac for Healthcare repo.

1. Open a new terminal tab or window.
2. Activate your environment.

```
conda activate robotic\_ultrasound
```

3. Navigate to the i4h repo. You may need to adjust this command to match where it was cloned earlier:

```
cd $I4H\_HOME
```

4. Run the following command to find the location of the pre-downloaded assets.

```
python -c "from i4h\_asset\_helper import get\_i4h\_local\_asset\_path; print(get\_i4h\_local\_asset\_path())"
```

5. Weâll use this path in the next section.

Expected output will be similar to the following:

```
/home/ubuntu/.cache/i4h-assets/868d63778d896f27cf90b6603de3a0dc40c60feecf7de2db993c8e50894028d9
```

Note

The directory provided by the last command is where our custom assets (robot and phantom models) are stored.

---

## Load Assets in Isaac Sim[#](#load-assets-in-isaac-sim "Link to this heading")

1. Go back to Isaac Sim.
2. Locate the *Content panel* at the bottom of the Isaac Sim UI.
3. Navigate to the asset path you found in the previous step. You can copy and paste the output from above.
4. Locate the robot and phantom USD files in this directory.

   - The robotâs relative location with respect to the cache folder is:

     ```
     Robots/Franka/Collected\_panda\_assembly/panda\_assembly.usda
     ```
5. Drag both assets into the *Stage* panel to load them as payloads into the stage.

In this video, we find the location of the pre-downloaded assets, and load the USDA file of our modified robotic arm.

---

## Explore the Viewport[#](#explore-the-viewport "Link to this heading")

1. Try moving, rotating, and scaling the models in the *Viewport*.
2. Practice moving in the viewport, referring to the [viewport controls](https://docs.isaacsim.omniverse.nvidia.com/4.5.0/gui/reference_keyboard_shortcuts.html#viewport-controls)

In this video, we summarize viewport manipulation options.

---

## Explore the Customized Franka[#](#explore-the-customized-franka "Link to this heading")

Explore the *Stage* panel, expanding the stage tree to see the USD hierarchy. Refer to the [stage overview](https://docs.omniverse.nvidia.com/extensions/latest/ext_core/ext_stage.html#stage)
If you are familiar with the Franka robot arm, you will notice that we have replaced the gripper end-effector with a custom tool.

The new end-effector is placed at the prim `/World/panda_assembly/panda_hand/HD3C3_Endeffector`. We also added a `/World/panda_assembly/TCP` prim which will be referenced later as the tool-center-point of this end-effector.

The prim allows us to later solve inverse-kinematics with respect to this point of the end-effector. Note that it is fixed to its parent prim through a fixed joint.

In this video, we navigate through our assets in the stage view, to learn about the custom end-effector of our assembly.

---

## Explore the Physics Inspector[#](#explore-the-physics-inspector "Link to this heading")

- Use the [physics inspector](https://docs.isaacsim.omniverse.nvidia.com/4.5.0/physics/joint_inspector.html#physics-inspector) to view and edit properties of the loaded assets
- Use the Perspective tab to access [simulated sensors](https://docs.isaacsim.omniverse.nvidia.com/4.5.0/sensors/isaacsim_sensors_camera.html) like the wrist cameras

Example of using the physics inspector:

In this video, we use the physics inspector to verify the robotâs joints behavior, by driving each joint within itâs joint limits.

---

## Cameras[#](#cameras "Link to this heading")

Example of camera usage:

In this video, we explore camera simulations within Isaac Sim. Our assembly contains a wrist-mounted camera. Isaac Sim can access this camera and you can observe the scene through its lens. Itâs also possible to switch between, RGB, depth, and other modalities.

---

## Add the Robot to a New Stage[#](#add-the-robot-to-a-new-stage "Link to this heading")

1. Go to **File > New Stage**
2. Create a new scene from **Create > Environments > Flat Grid**
3. Inside the *Content* panel, navigate to the **cache** folder.
4. Add the robot as a payload to your stage by dragging it onto the *Stage* panel.
5. Select the robot in the *Stage* panel.
6. Now in the *Property* panel, change its base translation settings to **(0,0,0)**.

## Add the Phantom model[#](#add-the-phantom-model "Link to this heading")

1. Go back to the *Content* panel, and locate the phantom model.
2. Add the phantom as a payload to your stage by dragging it onto the *Stage* panel.
3. Select the phantom prim in the *Stage* panel.
4. In the *Property* panel under *Rigid Body*, deselect **Kinematic Enabled**.
5. Click **Play** and notice how the phantom falls to the ground plane, and the robot moves to its home pose.

## Drive Joints With the Physics Inspector[#](#drive-joints-with-the-physics-inspector "Link to this heading")

1. Open the Physics Inspector by going to **Tools > Utilities > Physics Inspector**.
2. Click and drag on the axis positions to drive the joints of the robot, and move the phantom.
3. When finished exploring, you can save this scene or close it. This was just a demonstration which we wonât need again.

## Creating Your Own Scene[#](#creating-your-own-scene "Link to this heading")

In this video, we combine the learnings of this section to create a new scene, load the modified robot, phantom and table assets, and assemble them into an ultrasound scanning station.

Then we drive the robot via the physics inspector tool, observe the scene through the wrist-mounted camera, and visualize the collision meshes and physics behavior.

---

# Summary[#](#summary "Link to this heading")

You have now successfully:

- Launched Isaac Sim
- Located your custom assets
- Loaded a robot and phantom model
- Analyzed how the scene was constructed
- Experimented with movement inside the scene

This process introduces you to basic Isaac Sim features and working with USD files, which are foundational for more advanced workflows. The workflow shown above is useful to check if your simulation assets are ready for advanced workflows. Come back to Isaac Sim and its asset tools to:

- Change physics-related properties of your assets
- Bring a new robot into your scene
- Visualize your application

On this page
