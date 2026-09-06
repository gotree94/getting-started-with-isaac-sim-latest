# Prerequisites[#](#prerequisites "Link to this heading")

Before starting either workflow, verify that you have the required background knowledge and the correct hardware and software for your chosen path.

## Recommended Skills[#](#recommended-skills "Link to this heading")

All tools run on Linux and use Docker, so you should be comfortable navigating directories, running scripts, reading terminal logs, and working with Docker containers.

This course assumes intermediate Python proficiency. You run training scripts, modify configuration files, and inspect data throughout both workflows.

Humanoids are highly sophisticated robots. This course assumes you have a basic understanding of their operation and control, along with some prior experience operating real robots.

Tip

To build foundational knowledge before starting, refer to the [Physical AI learning](https://docs.nvidia.com/learning/physical-ai) offerings and resources.

## Shared Requirements (Both Workflows)[#](#shared-requirements-both-workflows "Link to this heading")

Both paths collect demonstrations through teleoperation, convert them to LeRobot format, and post-train GR00T 1.7. The requirements below apply whether you work in simulation or on the physical G1.

| Activity | Requirement |
| --- | --- |
| **Teleoperation** | Any [Isaac Teleop supported input device](https://nvidia.github.io/IsaacTeleop/main/overview/ecosystem.html#supported-input-devices) such as Meta Quest 3 or PICO 4 Ultra, **except Apple Vision Pro**, plus a workstation and network that meet the [Isaac Teleop system requirements](https://nvidia.github.io/IsaacTeleop/main/references/requirements.html#teleoperation-with-isaac-sim-and-isaac-lab) |
| **Training** | NVIDIA GPU with at least 48 GB VRAM for GR00T 1.7 post-training (1 GPU minimum; 8Ã GPUs recommended for the real-robot workflow at scale) |

## Simulation Workflow Requirements[#](#simulation-workflow-requirements "Link to this heading")

### Workstation[#](#workstation "Link to this heading")

You need a workstation capable of running Isaac Sim with real-time physics and rendering.

These requirements follow the [Isaac Sim 6.0 hardware requirements](https://docs.isaacsim.omniverse.nvidia.com/6.0.0/installation/requirements.html) for x86\_64 workstations.

| Component | Minimum | Recommended | Ideal |
| --- | --- | --- | --- |
| OS | Ubuntu 22.04 or 24.04 | Ubuntu 22.04 or 24.04 | Ubuntu 22.04 or 24.04 |
| CPU | Intel Core i7 7th Gen or AMD Ryzen 5 | Intel Core i7 9th Gen or AMD Ryzen 7 | Intel Core i9, Intel X-series or higher, AMD Ryzen 9, Threadripper or higher |
| CPU cores | 4 cores | 8 cores | 16 cores |
| RAM | 32 GB | 64 GB | 64 GB |
| Storage | 50 GB SSD | 500 GB SSD | 1 TB NVMe SSD |
| GPU | GeForce RTX 4080 | GeForce RTX 5080 | RTX PRO 6000 Blackwell |
| VRAM | 16 GB | 16 GB | 48 GB |
| Driver | Linux 580.65.06 | Linux 580.65.06 | Linux 580.65.06 |

Note

The Isaac Sim container runs on Linux. Loading Isaac Sim assets and running some extensions require internet access. Isaac Sim does not support GPUs without RT Cores, such as A100 or H100.

Isaac Lab and GR00T workflows can require additional RAM, VRAM, and storage beyond the base Isaac Sim requirements, especially for training or large scenes.

### Software[#](#software "Link to this heading")

Install `ffmpeg` on the simulation workstation before collecting or converting demonstration data. The simulation workflow uses it when writing and processing video observations.

```
sudo apt-get update
sudo apt-get install -y ffmpeg
```

## Real Robot Workflow Requirements[#](#real-robot-workflow-requirements "Link to this heading")

| Component | Details |
| --- | --- |
| Robot | [Unitree G1](https://support.unitree.com/home/en/G1_developer/about_G1) connected to Thor using Ethernet, with Dex3-1 hands |
| Camera Extension | USB3 extension cable long enough to route the head-mounted RealSense camera USB connection from the G1 head to Jetson AGX Thor |
| Edge Compute | [Jetson AGX Thor Developer Kit](https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/) for real robot setup, teleoperation, recording, and deployment. The developer kit includes a Jetson T5000 module with a 2560-core NVIDIA Blackwell GPU, 14-core Arm Neoverse-V3AE CPU, 128 GB LPDDR5X memory, 1 TB NVMe storage, USB3 ports, and 5 GbE RJ45 networking. |

Refer to [Shared Requirements (Both Workflows)](#shared-requirements-both-workflows) for teleoperation device and training GPU requirements.

### Workspace Requirements[#](#workspace-requirements "Link to this heading")

The physical workspace for the real robot workflow requires controlled conditions for reliable policy performance.

| Element | Specification |
| --- | --- |
| Robot | Unitree G1, standing in front of the table, facing the table, using built-in RealSense camera |
| Table | Standard height table with a black tablecloth |
| Apple | Red, placed on the table to the left of the plate, within left arm reach |
| Plate | White, placed on the table within left arm reach |
| Background | White wall behind the table |
| Lighting | Consistent indoor lighting, avoid strong shadows or glare |

On this page
