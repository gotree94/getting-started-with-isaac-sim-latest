# Data Collection[#](#data-collection "Link to this heading")

In this module, weâll explain a data collection workflow focused on systematically gathering high-quality datasets for imitation learning using state machine-based workflows in simulation environments.

The module teaches how to define and automate a robotic ultrasound scanning process using distinct states.

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this chapter, you will be able to:

- Leverage state machines for data collection
- Perform scene randomization in Isaac Sim
- Collect and curate datasets for imitation learning

- [State Machines](02-state-machine.html)
  - [State Machines for Data Collection](02-state-machine.html#state-machines-for-data-collection)
    - [State Machine Architecture](02-state-machine.html#state-machine-architecture)
    - [Control Modules](02-state-machine.html#control-modules)
      - [Force Control Module](02-state-machine.html#force-control-module)
      - [Orientation Control Module](02-state-machine.html#orientation-control-module)
      - [Path Planning Module](02-state-machine.html#path-planning-module)
    - [Code Deep Dive & Explanation](02-state-machine.html#code-deep-dive-explanation)
    - [Data Collection](02-state-machine.html#data-collection)
      - [Data Collection Mechanism](02-state-machine.html#data-collection-mechanism)
      - [Data Collected Per Step](02-state-machine.html#data-collected-per-step)
    - [Code Instructions](02-state-machine.html#code-instructions)
      - [Synthetic Data Generation & Data Capture](02-state-machine.html#synthetic-data-generation-data-capture)
      - [Prepare the Collected Dataset](02-state-machine.html#prepare-the-collected-dataset)
      - [Process Termination](02-state-machine.html#process-termination)
- [Teleoperation](03-teleoperation.html)
  - [Teleoperation Witth Isaac Lab](03-teleoperation.html#teleoperation-witth-isaac-lab)
    - [Code Walkthrough](03-teleoperation.html#code-walkthrough)
      - [Key Files Structure](03-teleoperation.html#key-files-structure)
    - [Teleoperation Logic](03-teleoperation.html#teleoperation-logic)
    - [Code Instructions](03-teleoperation.html#code-instructions)
      - [Launching the Teleoperation Script](03-teleoperation.html#launching-the-teleoperation-script)
      - [Process Termination](03-teleoperation.html#process-termination)
    - [Teleoperation With Keyboard](03-teleoperation.html#teleoperation-with-keyboard)
      - [Keyboard Controller for SE(3): Se3Keyboard](03-teleoperation.html#keyboard-controller-for-se-3-se3keyboard)
    - [Teleoperation Code Deep Drive & Video Walkthrough](03-teleoperation.html#teleoperation-code-deep-drive-video-walkthrough)
- [Review](04-review.html)

On this page
