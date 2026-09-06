# Robot Operating System (ROS)[#](#robot-operating-system-ros "Link to this heading")

## What is ROS?[#](#what-is-ros "Link to this heading")

ROS, or Robot Operating System, is a set of open-source software libraries and tools that enables you to develop robot applications. Letâs explore its key aspects and importance in the field of robotics.

### Governance and Ecosystem[#](#governance-and-ecosystem "Link to this heading")

NVIDIA joined the Open Source Robotics Alliance (OSRA) as a founding member and platinum sponsor. OSRA is an initiative by Open Source Robotics Foundation to foster collaboration, innovation and technical guidance in the robotics community by supporting several open-source robotics projects, including the Robot Operating System (ROS).

### Architecture and Components[#](#architecture-and-components "Link to this heading")

ROS functions as a middleware distributed systems framework. Its architecture consists of:

- **ROS packages**: Units of work that contain one or more nodes
- **Nodes**: Individual components that can be assembled into graphs
- **Graphs**: Represent the overall application structure

Nodes in a ROS system handle various tasks, such as:

- Interfacing with cameras
- Managing executive behavior
- Performing motion planning
- Communicating with actuators

These nodes can be interconnected in flexible ways, allowing for modular and reusable robotics software development.

### Ecosystem and Tools[#](#ecosystem-and-tools "Link to this heading")

The ROS ecosystem includes a wide range of tools and packages, some of which have been made open-source by their developers while others have built packages that are proprietary. Some notable examples include:

- [MoveIt](https://picknik.ai/moveit/): A trajectory planning framework developed by Picknik
- [Nav2](https://docs.nav2.org/): A navigation stack for Autonomous Mobile Robots (AMRs)

ROS 2 continues to evolve, with ongoing efforts to improve its capabilities for production robotics and integration with hardware acceleration technologies like those offered by NVIDIA - and this is a great reason for roboticists to embrace ROS.

As a roboticist, you probably donât want to be thinking too much about your middleware. By leveraging ROS, roboticists can focus on developing advanced capabilities rather than reinventing basic middleware functionality. This standardization also promotes collaboration and knowledge sharing within the robotics community.

On this page
