# Teleoperation Data Collection Guide[#](#teleoperation-data-collection-guide "Link to this heading")

Collect high-quality seed demonstrations for robust training. Use Isaac Lab Teleop or the Unitree G1 extended reality (XR) teleoperation workflow through Meta Quest 3 or PICO 4 Ultra for data collection.

## Protocol[#](#protocol "Link to this heading")

Tip

Teleoperation Tips
Follow these guidelines for consistent, high-quality demonstrations:

- **Warm-up:** Perform five practice runs to get used to teleoperation latency.
- **Smoothness:** Move consistently and avoid jerky motions. Jerky seeds lead to poor synthetic augmentations.
- **Body motion:** Keep the robot torso and body fixed during demonstrations. For this task, only the left hand should move and perform the manipulation.
- **Object and scene variation:** For the current static-apple simulation workflow, the environment randomizes the apple XY position at reset and keeps the plate fixed. For real-robot or intentionally broader datasets, vary the apple and plate position and orientation between episodes while keeping both objects reachable from a standing, no-locomotion pose.
- **Grasp approach:** Favor side approaches so the camera can clearly see the hand and apple. Use a bottle-holding-style hand pose rather than covering the object from above.
- **Recovery examples:** Keep the baseline dataset focused on clean successes. Include failed-grasp recovery examples only when you intentionally want a broader dataset, and keep them limited so they donât dominate the training signal.
- **Fixed variables:** Keep apple type, plate type, table height, lighting, and camera setup fixed for the baseline dataset. Change these variables only when you intentionally want a broader generalization dataset.
- **Camera field of view:** Keep the right arm mostly outside the camera field of view. Right-hand fingers can appear occasionally because the right hand may enter view during deployment.
- **Success criteria:** Save clean runs with no unnecessary collisions. Use `--num_success_steps 10` when collecting data to record additional post-success steps.
- **Completion behavior:** After the apple reaches the plate, move the left hand out of view and hold it still for two to three seconds. In the simulation recorder, the success condition saves the episode and resets automatically.
- **Trajectory length:** Aim for demonstrations around 200â400 timesteps. Demonstrations that are too long slow down data generation, and demonstrations that are too short often become jerky.
- **Replay validation:** Validate collected demonstrations by replaying camera recordings and checking frame quality, trajectory smoothness, and overall task quality.

**Target:** Collect at least 200 clean successful demonstrations manually. Additional high-quality demonstrations can broaden the dataset when time permits.

## Example Trajectory Pattern[#](#example-trajectory-pattern "Link to this heading")

Each demonstration follows this general sequence:

1. **Camera preparation:** Move the right arm mostly outside the robot camera field of view to reduce visual clutter and self-occlusion.
2. **Object approach:** Use the left arm to approach the apple smoothly from the side, primarily along a horizontal path.
3. **Grasp execution:** Close the gripper or fingers with a bottle-holding-style grasp so the hand and apple remain visible.
4. **Lift motion:** Lift straight upward before translating toward the plate. Avoid backtracking along the approach trajectory.
5. **Placement:** Lower the object to slightly above the plate, pause briefly in a stable pose, and release cleanly so the object drops onto the plate.
6. **Completion:** Move the left hand out of view and hold it still for two to three seconds before saving the episode or waiting for automatic success termination.

Backtracking introduces trajectory ambiguity and makes it harder for GR00T to separate approach and retreat motions during training.

On this page
