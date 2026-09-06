# Setting Up Isaac for Healthcare[#](#setting-up-isaac-for-healthcare "Link to this heading")

Now that weâve covered the value of robotics and foundation models for healthcare, letâs set up a simulation environment to train our robot!

## Requirements[#](#requirements "Link to this heading")

Please check the [system prerequisites here](https://github.com/isaac-for-healthcare/i4h-workflows/blob/main/workflows/robotic_ultrasound/README.md#-system-prerequisites-validation).
GR00T prerequisites can be found [here](https://github.com/NVIDIA/Isaac-GR00T/tree/10de3f983eeef81730f1bc195c2233423b056c0e?tab=readme-ov-file#prerequisites). The course is best experienced with a powerful workstation, large monitor, keyboard and mouse. We are working on making the course available on cloud resources too.

### Clone the Isaac for Healthcare Workflows Repo[#](#clone-the-isaac-for-healthcare-workflows-repo "Link to this heading")

1. Open a terminal.
2. Clone the repository.

   ```
   git clone https://github.com/isaac-for-healthcare/i4h-workflows.git
   ```
3. Navigate to the cloned directory.

   ```
   cd i4h-workflows
   ```

Note

The repository will be cloned to your current directory. If you want to clone it to a specific location, you can:

```
git clone https://github.com/isaac-for-healthcare/i4h-workflows.git /path/to/desired/location
cd /path/to/desired/location/i4h-workflows
```

4. Check out this specific **version tag (self-paced-DLI)** from the repo.

   ```
   git checkout self-paced-DLI
   # or
   git checkout 920bccf90fd3fe765545c01696491b73ce58d0c7
   ```
5. Alternatively, the above commands can be combined to only checkout the tag.

   ```
   git clone --depth 1 --branch self-paced-DLI https://github.com/isaac-for-healthcare/i4h-workflows.git
   ```

---

### Installation[#](#installation "Link to this heading")

The estimated Setup Duration is 30-40 minutes, depending on network speeds for asset downloads.

#### Install Robotic Ultrasound Workflows[#](#install-robotic-ultrasound-workflows "Link to this heading")

1. Navigate to the **Robotic Ultrasound** Workflow Directory.

   ```
   cd workflows/robotic\_ultrasound
   ```
2. Refer to the [quick start guide](https://github.com/isaac-for-healthcare/i4h-workflows/blob/main/workflows/robotic_ultrasound/README.md#-quick-start) on the Isaac for Healthcare (I4H) repo for system prerequisites, driver requirements and dependencies. You will also need to download an [RTI Connect Express license](https://content.rti.com/l/983311/2025-07-25/q6729c). Please see the [usage rules](https://www.rti.com/products/connext-express) for Connext Express.
3. Follow the installation steps until `bash tools/env_setup_robot_us.sh`. Instead of this line, follow the instructions below to setup the repository to use GR00T. For your convenience the steps are:

   ```
   conda create -n robotic\_ultrasound python=3.10 -y
   conda activate robotic\_ultrasound
   ```
4. Install the **GR00T dependencies**.

   ```
   # Install the dependencies for GR00T N1
   ./tools/env\_setup\_robot\_us.sh --policy gr00tn1
   # Download the model weights for GR00T N1
   i4h-asset-retrieve --sub-path Policies/LiverScan/GR00TN1
   i4h-asset-retrieve
   # Example for GR00T N1
   python -m policy\_runner.run\_policy --policy gr00tn1
   ```
5. Install **I4H-sensor-simulation** for ultrasound simulation

   The code for custom sensor simulation is kept in a separate repository for separation of concerns. Simulating medical modalities is independent from the IsaacSim and Isaac Lab derived workflows.

   Follow the [instructions here](https://github.com/isaac-for-healthcare/i4h-sensor-simulation/blob/main/ultrasound-raytracing/README.md) closely to build and install the ultrasound simulation package.
   Follow the instructions and install the package in the same conda environment used before. Once built, you can test the ultrasound simulation as a standalone app.

   ```
   # Launch a simulation application.
   python examples/sphere\_sweep.py
   # Start a Web interface
   python examples/server.py
   ```

   The application can be accessed through your web browser. The default address is <http://127.0.0.1:8010>. Check the terminal output for the address.
6. Configure **environment variables**.

   In this course you will frequently start new terminal tabs. Therefore we recommend adding these environment variables to your `.bashrc` script, otherwise these variables would need to be set for every new terminal.

   ```
   export PYTHONPATH=`pwd`/workflows/robotic\_ultrasound/scripts:$PYTHONPATH
   export RTI\_LICENSE\_FILE=<path-to-your-rti-license-file>
   ```

   Persistent Environment Configuration:
   From the root folder of the i4h-workflows repository run:

   ```
   echo "export PYTHONPATH=`pwd`/workflows/robotic\_ultrasound/scripts:\$PYTHONPATH" >> ~/.bashrc
   echo "export RTI\_LICENSE\_FILE=<path-to-your-rti-license-file>" >> ~/.bashrc
   echo "export I4H\_HOME=`pwd`" >> ~/.bashrc
   source ~/.bashrc
   ```

   This ensures the environment variables are automatically set when you open new terminals.

Note

If you have `robotic_surgery` workflow scripts or previous versions of `robotic_ultrasound` workflow scripts in your `PYTHONPATH`, you can reset it to include only the robotic\_ultrasound scripts by running `export PYTHONPATH=$(pwd)/workflows/robotic_ultrasound/scripts`

6. Activate the **conda environment**, and **launch teleoperation** to test our setup.

   ```
   conda activate robotic\_ultrasound
   (python -m simulation.examples.ultrasound\_raytracing & \
   python -m simulation.environments.teleoperation.teleop\_se3\_agent --enable\_cameras & \
   python -m utils.visualization & \
   wait)
   ```

At this point, the teleoperation script will launch Isaac Sim with the robotic ultrasound environment!
You should see two windows, one running Isaac Sim and a custom visualization GUI:

![Teleoperation with Ultrasound](static/teleoperation_with_ultrasound.png)

You can teleoperate the robot using these controls:

#### Keyboard Controller for SE(3): Se3Keyboard[#](#keyboard-controller-for-se-3-se3keyboard "Link to this heading")

```
Reset all commands: R
Toggle gripper (open/close): K
Move arm along x-axis: W/S
Move arm along y-axis: A/D
Move arm along z-axis: Q/E
Rotate arm along x-axis: Z/X
Rotate arm along y-axis: T/G
Rotate arm along z-axis: C/V
```

### Isaac Sim viewport control keyboard shortcuts[#](#isaac-sim-viewport-control-keyboard-shortcuts "Link to this heading")

Module 2 contains a video walkthrough on how to manipulate viewports in Isaac Sim. For now these instructions may help.

- Press the MMB (middle mouse button) to Pan.
- Press LMB (left mouse button) + ALT to Orbit.
- Use the Scroll Wheel or Press RMB (right mouse button) + ALT to zoom.
- Press F when something is selected to Center and Zoom on that object.
- Press F when nothing is Selected to Zoom All.

### Expected Behavior[#](#expected-behavior "Link to this heading")

- Isaac Sim physics simulation with Franka robotic arm, table and phantom
- Direct SE(3) pose control via keyboard/SpaceMouse/gamepad input
- Real-time ultrasound image generation during manual scanning
- Multi-camera visualization with synchronized ultrasound feedback

In Module 3, we will take a close look at all of the features of this teleoperation script, and build it yourself! For now, please explore and test out the completed demo.

**When youâre ready to move on**, leave this running and complete the cleanup steps below.

#### Stopping the teleoperation[#](#stopping-the-teleoperation "Link to this heading")

1. When youâre done, **terminate** the process using **Ctrl+C** in the terminal window that opened teleoperation.
2. Then execute the script below to **cleanly terminate** all distributed processes.

   ```
   ./workflows/robotic\_ultrasound/reset.sh
   ```

---

## Summary[#](#summary "Link to this heading")

In the next modules of this course, we will show you how to:

- Create the scene in Isaac Sim
- Modify the robotic arm to hold an ultrasound probe
- Load alternative torso models derived from CT-data
- Use a state machine to collect data for imitation learning
- Fine-tune a GR00T N1 VLA model
- Deploy this model in the simulation environment

On this page
