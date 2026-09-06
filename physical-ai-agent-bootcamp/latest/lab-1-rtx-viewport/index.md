# Ray Trace Your Way to a Better Life: Omniverse Libraries, OpenUSD, Agents, and You[#](#ray-trace-your-way-to-a-better-life-omniverse-libraries-openusd-agents-and-you "Link to this heading")

## The Attic Story[#](#the-attic-story "Link to this heading")

Welcome to the NVIDIA Physical AI Agent Bootcamp. The first two courses follow one connected story at the Museum of Lost Things.

Youâre the agentic engineer called in to recover a glowing **Memory Cube** from the Old Attic. In **Operation Attic Signal â Commission the Scene**, youâll bring its browser-streamed RTX portal online and make the digital scene trustworthy enough for a future robot to identify, control, and perceive the cube without modifying the original attic.

In the next course, **Operation Attic Containment â Commission the Physical Scene**, youâll add simulation readiness and physics evidence so a future robotics team can test how the cube and its containment pod behave before deployment.

## Why This, Why You[#](#why-this-why-you "Link to this heading")

**Physical AI needs people who know how worlds are built.** A robotâs intelligence begins before a model makes its first prediction. Someone must define the world at the correct scale, organize its objects, establish coordinate frames, rig its sensors, describe what each object means, and decide what evidence can be trusted. These are not finishing touches around the AI system - they are the spatial foundation the system reasons from.

Robotics, autonomous vehicles, digital twins, perception models, and world models cannot be built by models and chips alone. A model can only learn from and act on the world it is given. If a hierarchy is wrong, a sensor is mounted in the wrong frame, or ground-truth labels are inconsistent, that error travels through the application, the model, the infrastructure, and ultimately the physical machine. That is why your 3D expertise is essential.

| Your 3D skill | What physical AI needs it to provide |
| --- | --- |
| Scene hierarchy and naming | Stable identities for objects, assemblies, environments, and action targets. |
| Units, transforms, pivots, and coordinate frames | Shared spatial truth for robot motion, sensors, objects, and world state. |
| Cameras, lenses, and framing | Calibrated virtual sensors with intentional placement, coverage, and repeatable observations. |
| Geometry, materials, and lighting | Trustworthy visual and sensor evidence for perception, testing, and synthetic data. |
| Semantic labels and taxonomies | Machine-readable meaning and ground truth for training and evaluation. |
| OpenUSD layers and composition | A canonical digital twin that many applications and experiments can extend safely. |
| Render outputs and AOVs | The observations engineers and models use to measure and understand the world. |

![Diagram titled Why This, Why You. On the left, a column of 3D skills - hierarchy and naming, units and transforms, cameras and sensors, materials and lighting, and semantics and layers - connects to a central cutaway of the OpenUSD attic world showing a glowing cube, coordinate axes, a camera, and structure, furniture, object, light, and floor layers. On the right, those skills map to physical AI needs: stable object identities, shared spatial truth, calibrated observations, trustworthy sensor evidence, and machine-readable context. Along the bottom, a chain shows where your decisions propagate: applications to models to infrastructure to chips to energy.](../_images/lab-1-why-this-why-you.png)

This expertise starts in the **application** and **infrastructure** layers of the five-layer AI cake, but it shapes the whole stack: models receive the observations you define, chips execute the rendering and sensor workloads you request, and energy use follows the scale of those decisions. OpenUSD gives your 3D knowledge a shared, structured form; `ovrtx` turns that world into RTX camera and sensor observations; `ovstream` makes those results operational in a connected application. Agents and skills accelerate the implementation - but they still need someone who understands what a correct world, sensor, transform, and result should be.

**That is where you come in.** Physical AI needs 3D practitioners who can build worlds coherent enough for machines to perceive, simulate, reason about, and act within. In this lab you are not decorating the world around a robot - you are defining the world the robot must learn to trust.

## The Big Picture: RTX, OpenUSD, and Agents[#](#the-big-picture-rtx-openusd-and-agents "Link to this heading")

Your whole mission at a glance. Step through the slides, then jump into the build below.

1

The Mission

Operation Attic Signal - Commission the Scene.

**Identify** the lost **Memory Cube** as a stable target a future robot can use.

A robot application cannot act until the scene provides control, focus, and machine-readable perception.

Turn the empty **Signal Panel** into a robot-readiness console.

Never touch the source attic - author in app-owned layers.

A structured build first, then open exploration to make it your own.

```
flowchart TD
Cube["Lost Memory Cube"] --> Find["Find it in the attic"]
Find --> Prep["Prepare the scene for a robot"]
Prep --> Ctrl["Control"]
Prep --> Focus["Focus"]
Prep --> Perc["Perception"]
Ctrl --> Panel["Scene-readiness console"]
Focus --> Panel
Perc --> Panel
```

2

What Youâll Build

By the end of the mission, you canâ¦

**Launch** a browser-streamed RTX viewer.

**Control** the cube with replay-safe poses and a focus camera.

**Perceive** the scene through semantic segmentation and lidar.

**Package** a repeatable workflow as a reusable agent skill.

```
flowchart LR
Viewer["Browser-streamed<br/>RTX viewer"] --> Control["Replay-safe poses<br/>+ focus camera"]
Control --> Perceive["Semantic<br/>+ lidar perception"]
Perceive --> Skill["Reusable<br/>agent skill"]
```

3

Who Owns What

Each piece has a clear job.

**OpenUSD** describes and names the attic and its prims.

**`ovrtx`** loads the stage and renders RTX frames plus sensor output.

**`ovstream`** carries frames to the browser and input back.

**The browser** displays the stream - it never renders the scene.

**Your agent** builds and changes the app for you.

**Skills** give the agent the reliable, source-backed route.

```
flowchart TD
Skills["Skills: source-backed route"] --> Agent["Your agent"]
Agent -->|builds| App["Server application"]
App --> USD["OpenUSD: names prims"]
USD --> ovrtx["ovrtx: renders frames + sensors"]
ovrtx --> ovstream["ovstream: carries frames + input"]
ovstream --> Browser["Browser: displays only"]
```

4

Runtime Path

The server renders, the browser displays.

**1. OpenUSD** - the composed scene to render.

**2. `ovrtx`** - renders each RTX frame from that scene.

**3. `ovstream`** - carries frames out, input back.

**4. Browser** - displays the stream.

Most âwhy doesnât this workâ bugs live at a **boundary** between two of these.

```
flowchart LR
USD["1 - OpenUSD scene"] --> ovrtx["2 - ovrtx renders frame"]
ovrtx --> ovstream["3 - ovstream carries out/in"]
ovstream --> Browser["4 - Browser displays"]
```

5

Prompt Contract

One repeatable four-field habit.

**Goal** - what should be true after this step.

**Skills** - which source-backed procedures the agent should read.

**Context** - the application, scene, current state, and constraints.

**Done when** - observable evidence that proves the work is complete.

Learn the **pattern**, not the exact strings - thatâs what makes it repeatable.

```
flowchart TD
Goal["Goal: what's true after this step"] --> Skills["Skills: procedures to read"]
Skills --> Context["Context: app, scene, state, constraints"]
Context --> Done["Done when: observable evidence"]
```

## Case File: Operation Attic Signal â Commission the Scene[#](#case-file-operation-attic-signal-commission-the-scene "Link to this heading")

**The story:** Youâre the agentic engineer on call for the Museum of Lost Things. A glowing **Memory Cube** has been misplaced in the Old Attic, and because the museum only stores its most long-lost items in this attic, the cube must be removed. The museum relies on robot assistance for these treacherous tasks, and your job is to commission the digital scene and its remote portal so a future robotics team can identify the target, inspect it from repeatable viewpoints, and evaluate machine-readable sensor evidence before a real robot is deployed.

**The problem:** The Memory Cube is easy for a person to recognize, but the attic is not yet ready for a robot. A robot-ready application needs stable identity, deterministic commands, repeatable sensor views, and machine-readable evidence before physical hardware enters the scene.

First, youâll bring the Attic Portal online: an interactive RTX viewport streamed into your browser. Then youâll turn the human observation âthe glowing cyan cubeâ into a scene contract a future robot application can use - an exact OpenUSD prim, replay-safe commands, a repeatable camera, semantic labels, and lidar evidence.

**Your mission:** Turn the empty diagnostics panel beside the viewport into a robot-readiness console. Youâll prove that the application can resolve and move `/Root/Workshop/Cube`, create a nondestructive focus camera, expose semantic segmentation, and activate an `ovrtx` lidar sensor - all through the existing browser connection with Omniverse libraries and your agent.

Youâll work through a structured build, then extend the portal on your own.

Learning Objectives

By the end of this course, youâll be able to:

1. **Map** how OpenUSD, `ovrtx`, `ovstream`, the browser, your agent, and skills divide the work.
2. **Trace** the renderâstreamâinput lifecycle, following how a browser command travels through `ovstream`, becomes queued application work, and reaches `ovrtx`.
3. **Direct** focused, source-backed `ovrtx` skills to control transforms, camera outputs, semantic labels, and lidar data for version-specific APIs.
4. **Preserve** the supplied scene by putting viewer cameras, semantics, and sensors in application-owned OpenUSD layers.
5. **Launch** a browser-streamed RTX viewer, extend it with robot-oriented controls and perception, and **package** the workflow as a reusable agent skill.

The **What Youâll Build** slide above previews these, and each mission page proves one of them.

## Before You Start[#](#before-you-start "Link to this heading")

Tip

You can start fresh here - this course stands on its own and assumes no prior experience with the others.

- **Provided assets:** the Old Attic scene (`~/RTXViewport/Attic_Nvidia/old_attic.usd`), the prepared Attic Portal project (`~/RTXViewport/Attic_Portal`), and the Omniverse Realtime Viewer skill (`~/RTXViewport/skills/omniverse-realtime-viewer`).
- **Prerequisites:** basic comfort with a browser and a terminal. No graphics or RTX experience required.
- **Your AI agent:** if you havenât already, follow [Initialize Your AI Agent](../get-started.html) to start the agent and point it at the skills.

## Download Course Materials[#](#download-course-materials "Link to this heading")

Download the assets, starter code, and NVIDIA agent skills used in this course:

- **Course materials:** [Download the course bundle (`ovlibraries_physicalai.zip`)](https://developer.nvidia.com/downloads/omniverse/learning/courses/physicalaiagentbootcamp/ovlibraries_physicalai.zip)

Warning

The course bundle is roughly **5 GB**. You donât have to download it to complete this course - you can work through every mission with assets you already have. Grab the bundle only if you want the exact starter assets, code, and agent skills used here.

## Key Ingredients[#](#key-ingredients "Link to this heading")

- **`ovrtx`** - a lightweight C and Python SDK for Omniverse RTX that loads the OpenUSD stage and produces real-time, physically accurate rendering and sensor output inside the server application.
- **`ovstream`** - a streaming library that carries server-rendered frames to the browser and native input back to the application.
- **OpenUSD** - the open framework that describes and composes the attic, including its hierarchy, materials, cameras, and prim identities.
- **The browser** - displays the video stream and collects your controls; it does not render the USD scene.
- **Agent skills** - version-specific procedures that give your agent the reliable route. `AGENTS.md` gives context; each `SKILL.md` points the agent at real source code.

## Your Prompt Contract[#](#your-prompt-contract "Link to this heading")

Every mission brief uses the same four fields, so you learn a repeatable habit rather than memorizing specific strings.

```
Goal: <what should be true after this step>
Skills: <which source-backed procedures the agent should read>
Context: <the application, scene, current state, and constraints>
Done when: <observable evidence that proves the work is complete>
```

You donât have to know all four fields up front. Start with what you already know - often the **Goal** and the **Done when** that will prove it - and fill in as much **Context** as you can. You donât need to name the right skills yourself: this course supplies each missionâs **Goal** and the **Skills** route to the source-backed procedures the agent should read. Your job is to sharpen the **Context** the agent should not guess and the **Done when** that is your test contract, then compare the agentâs result against that proof.

This course supplies the mission and the tested implementation route. You supply the 3D judgment that makes the result useful. Every mission follows the same loop:

1. **Inspect** - examine the scene, output, or production problem through the lens of your own discipline.
2. **Specify** - decide the 3D judgment this mission needs and shape it in the Prompt Builder.
3. **Build** - inject your answers into the promptâs `Context` and `Done when`, then direct the agent to implement it with the supplied skills.
4. **Verify** - approve or reject the result against the evidence you defined, not merely whether the code ran.

```
Course mission + library skills + your specification
â
agent implementation
â
your evidence-based approval
```

The Prompt Builder does not generate the entire prompt. **Goal** and **Skills** remain the reliable course contract; your decisions strengthen **Context** and **Done when**. Commit at least one `Context` or `Done when` decision of your own before you build - that judgment is the point of the course. Use the finished prompt to check your work or to unblock yourself if you get stuck, not as the default.

Important

Review-before-run is the core habit this course builds. Read and understand the generated diff, then run only after the code makes sense to you.

Note

Different AI coding agents and models work at different speeds, so how long a prompt takes to finish - and how many steps it runs - will vary. A longer wait doesnât mean something is wrong. Judge each result against your **Done when** evidence, not the clock.

## Two Ways to Work[#](#two-ways-to-work "Link to this heading")

Every build card gives you two paths:

1. **Make the mission yours** - open the [Prompt Builder](../prompt-builder.html), answer its questions, and review how your 3D decisions change `Context` and `Done when`. This is where the learning happens.
2. **Check or unblock** - if you get stuck, expand the **Show a finished prompt** dropdown to compare against a tested prompt. Treat it as a way to check your work or recover, not the default path.

## Your Route[#](#your-route "Link to this heading")

| Mission | Inspect and specify | Build and verify |
| --- | --- | --- |
| **1.a Attic Portal** | Decide which evidence distinguishes a live viewport from a robot-ready world. | Launch the portal, then verify the runtime path and your chosen commissioning evidence. |
| **2.b Cube Link** | Select the stable prim and define a replay-safe transform contract. | Build the controls, then prove they always reach the same authored targets. |
| **2.c Cube Focus** | Define framing, motion-envelope coverage, context, and rejection criteria. | Author the nondestructive camera preset, then approve or revise its observation. |
| **3.a Semantic Perception** | Define which authored identities and labels must survive appearance changes. | Build the semantic view, then verify its IDs and taxonomy. |
| **3.b Lidar Coverage** | Decide which task surfaces the sensor must observe and what counts as credible evidence. | Build the sensor link, then inspect coverage and telemetry rather than accepting a visual effect. |
| **Part 4 Your Skill** | Turn one production-quality rule into NEVER GUESS, REQUIRE, and PROVE guidance. | Create the skill, then forward-test whether another agent can repeat your quality bar. |

While each brief runs, review the plan and prepare the acceptance checks youâll hold the result to. If a build fails, revise the brief and try the step again.

## In This Course[#](#in-this-course "Link to this heading")

Work through the pages in order:

1. [Open the Attic Portal](open-the-attic-portal.html) - launch the browser-streamed RTX viewport and trace the renderâstreamâinput lifecycle.
2. [Establish the Cube Link](establish-the-cube-link.html) - give a future robot application a reliable prim identity, replay-safe pose controls, and a focus camera.
3. [Add Machine Perception](give-r17-machine-perception.html) - add semantic segmentation and a lidar sensor from the same scene.
4. [Create Your Own Agent Skill](create-your-own-skill.html) - package a repeatable workflow for your open-build exploration.
5. [Knowledge Check](knowledge-check.html) - check your understanding of the core concepts.
6. [Review](review.html) - recap, references, and what comes next.

---

On this page
