# Reviewing Configuration Data[#](#reviewing-configuration-data "Link to this heading")

## Isaac Lab Configuration[#](#isaac-lab-configuration "Link to this heading")

In this module, weâll review the process of configuring a robot inside Isaac Sim, to match settings used during training of a policy. In the next module, weâll actually perform this conversion.

To simplify the course, the provided USD has all the joints rigged except for the left elbow joint, which we will do together as an example. In a realistic example, all joints would need configuration.

### Isaac Lab Configuration Data[#](#isaac-lab-configuration-data "Link to this heading")

Letâs take a closer look at the configuration YAML data as it was defined in Isaac Lab, during the policy training done outside of this course.

We will look closely at the **left\_elbow** joint and how to set up the physics for it.

#### Joint Positions[#](#joint-positions "Link to this heading")

```
joint\_pos:
.\*\_hip\_yaw: 0.0
.\*\_hip\_roll: 0.0
.\*\_hip\_pitch: -0.28
.\*\_knee: 0.79
.\*\_ankle: -0.52
torso: 0.0
.\*\_shoulder\_pitch: 0.28
.\*\_shoulder\_roll: 0.0
.\*\_shoulder\_yaw: 0.0
.\*\_elbow: 0.52
joint\_vel:
.\*: 0.0
```

#### Joint Properties[#](#joint-properties "Link to this heading")

```
arms:
class\_type: omni.isaac.lab.actuators.actuator\_pd:ImplicitActuator
joint\_names\_expr:
- .\*\_shoulder\_pitch
- .\*\_shoulder\_roll
- .\*\_shoulder\_yaw
- .\*\_elbow
effort\_limit: 300
velocity\_limit: 100.0
stiffness:
.\*\_shoulder\_pitch: 40.0
.\*\_shoulder\_roll: 40.0
.\*\_shoulder\_yaw: 40.0
.\*\_elbow: 40.0
damping:
.\*\_shoulder\_pitch: 10.0
.\*\_shoulder\_roll: 10.0
.\*\_shoulder\_yaw: 10.0
.\*\_elbow: 10.0
armature: null
friction: null
```

#### Converting the Parameters[#](#converting-the-parameters "Link to this heading")

Now to use these same parameters inside Isaac Sim, thereâs a conversion process. For any angular definitions, we need to first convert these from radians to degrees.

Isaac Simâs definition of these parameters is based on USD, which uses degrees instead of radians. The below values have been converted for you.

Weâll apply this data in the next module.

|  | Start Position | Effort Limit | Velocity Limit | Stiffness | Damping |
| --- | --- | --- | --- | --- | --- |
| **Isaac Lab** | 0.52 rad | 300 (Nm) | 100 (rad/s) | 40 (kgm^2/(rad s^2)) | 10 (kgm^2/(rad s)) |
| **Isaac Sim (These are the ones we use in this step)** | 29.79 deg | 300 (Nm) | 5729.58 (deg/s) | 0.698132 (kgm^2/(deg s^2)) | 0.174533 (kgm^2/(deg s)) |

On this page
