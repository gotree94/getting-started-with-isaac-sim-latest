# World Models[#](#world-models "Link to this heading")

Another interesting topic with real-to-sim is the use of world models. **World models** (as pioneered by David Ha) are neural networks that learn a representation of the scene and its temporal evolution. The resulting latent representation is compact, meaning that the information is compressed to a low-dimensional vector/tensor that captures all the important info about a scene.

Most often, world models are trained in a specific domain. However, we can also combine multiple domains by training on real-world and sim data, creating unified understanding of both domains.

This unified representation serves as a common language between the two domains, making it easier for the robot to transfer learned behaviors from simulation to reality.

Once the world model is trained, we can develop a reinforcement learning policy that operates directly on this latent representation. This technique has proven effective in practical applications, such as enabling quadruped robots to perform obstacle avoidance using depth images as input.

The key advantage of this approach is that it creates a shared understanding between simulation and reality, allowing robots to learn complex behaviors that transfer more effectively to the real world. By training on both domains simultaneously, the world model learns to focus on the features that are consistent across both environments, creating a more robust and generalizable system.

Tip

Learn more: [World Models by David Ha, Jurgen Schmidhuber](https://arxiv.org/pdf/1803.10122)
