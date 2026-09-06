# Tiled Rendering[#](#tiled-rendering "Link to this heading")

Lastly, letâs expand on tiled rendering, which is our method for handling complex visual input efficiently and enabling faster training.

Tiled rendering APIs provide a vectorized interface for collecting data from camera sensors. This is useful for reinforcement learning environments requiring vision in the loop. Tiled rendering works by concatenating camera outputs from multiple cameras and rendering one single large image instead of multiple smaller images that would have been produced by each individual camera. For example, if you have 5,000 environments, rather than rendering each image one after the other, we put all of them in a tile and render them at once. This reduces the amount of time required for rendering and provides a more efficient API for working with vision data.

In the example above, the robot is trying to manipulate a cube to a specified target location. On the left, you have different visual representations of what the robot is seeing.

We collect data from multiple camera sensors simultaneously. We take the visual input, concentrate the output from multiple cameras, and then use GPU acceleration to enable faster robot training. Isaac Lab provides tiled rendering APIs for RGB, depth, along with other annotators through the TiledCamera class.

We have examples that use tiled rendering for both Cartpole and ShadowHand robots and applications of tiled rendering for various tasks within the Isaac Lab environment.

Tip

Learn more: [Tiled Rendering in Isaac Lab Documentation](https://isaac-sim.github.io/IsaacLab/main/source/overview/core-concepts/sensors/camera.html)
