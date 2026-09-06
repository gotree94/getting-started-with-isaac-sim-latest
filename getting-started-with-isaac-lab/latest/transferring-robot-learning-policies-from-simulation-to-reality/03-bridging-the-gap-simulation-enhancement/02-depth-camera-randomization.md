# Depth Camera Randomization[#](#depth-camera-randomization "Link to this heading")

![A comparison of a simulated depth camera output, and the output of a real depth camera.](../../_images/camera-noise-realsense.png)

Simulation vs RealSense
A side-by-side image showing the differences between a simulated enviroment and the environment captured through a RealSense camera.[#](#id1 "Link to this image")

When working with depth cameras like RealSense, we need to account for their characteristic noise patterns. The real cameras show significant differences from perfect simulation data:

- Edge artifacts create holes due to stereo matching failures
- Areas where depth values canât be calculated
- Non-uniform noise patterns across the image

To make simulations more realistic, we add:

- Uniform noise across depth values
- Strategic data gaps to mimic real sensor behavior
- Blob-like missing data patterns

Tip

Learn More: [Learning a State Representation and Navigation in Cluttered and Dynamic Environments](https://arxiv.org/pdf/2103.04351)
