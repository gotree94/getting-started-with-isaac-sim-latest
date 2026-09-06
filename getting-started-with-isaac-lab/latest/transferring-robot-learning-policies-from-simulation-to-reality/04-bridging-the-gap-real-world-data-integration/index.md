# Bridging the Gap: Real-World Data Integration[#](#bridging-the-gap-real-world-data-integration "Link to this heading")

We just discussed how domain randomization can help bring simulations closer to reality, but thereâs another promising area that can help bridge the reality gap: **real-to-sim**. Real-to-sim techniques help bridge the reality gap by incorporating real-world data into simulations. This approach makes simulations behave more like their real-world counterparts.

There are various methods we can apply hereâthe first of which is **system identification**.

## System Identification[#](#system-identification "Link to this heading")

System identification is a data-driven method that involves:

- Identifying key hardware parameters, like DC motor characteristics
- Recording real robot trajectories
- Fine-tuning simulation parameters to match real-world behavior

In the example above, we can see actuator characterization where we have one of the motors from a robot. We can send signals and inputs to make the bar move and record the data, then we can see the estimated friction coefficient of the motor itself.

*Deformable object characterization using differentiable physics, (Source: ETH ZÃ¼rich, Real2Sim: Visco-elastic parameter estimation from dynamic motion, D. Hahn et al)*

ETH ZÃ¼rich is conducting work focusing on learning to characterize the parameters of deformable objects in simulation. These objects are typically parameterized by numerous variables. The goal is to adapt these parameters to best explain the motion observed in the real world.

An example of this process can be seen with a deformable hand model above. Researchers wiggle the hand and observe how the fingers move using a motion capture system. In their differential simulation, they optimize all the parameters to ensure that the simulated movement matches the real-world motion as closely as possible.

This data-first approach provides more accurate results than arbitrary parameter selection, as itâs based on actual physical observations rather than theoretical assumptions.

On this page
