# Meet the Omniverse Libraries[#](#meet-the-omniverse-libraries "Link to this heading")

Before you start building, letâs meet the toolkit. NVIDIA Omniverse libraries are composable building blocks for physical AI: each one does a focused job well, and you can use a single library on its own or combine several inside your own application. They come ready to go, so you point your AI agent at them and start building rather than wiring plumbing from scratch.

This page is a quick map of the pieces youâll use across the bootcamp - what each one is and why itâs genuinely useful. Itâs intentionally short. For the complete, always-current catalog of libraries, tools, blueprints, and skills, see the canonical [NVIDIA Omniverse Libraries](https://developer.nvidia.com/omniverse) page.

Note

Youâre not locked into our story. Everything here is a reusable library or tool you can take into your own projects and use however you want. Weâll show you the pieces; what you build with them is up to you.

## The Core Libraries[#](#the-core-libraries "Link to this heading")

These are the runtime libraries youâll actually call. Each is a lightweight, GPU-accelerated library you drop into a Python or C++ application.

`ovrtx`

The RTX rendering and sensor library. It loads an OpenUSD stage and produces physically accurate camera images, semantic segmentation, and lidar returns through the same RTX path.

**In the bootcamp:** Course 1 uses `ovrtx` to render the live attic viewport and simulate its camera and lidar sensors.

`ovstream`

The streaming library. It carries server-rendered frames to a browser over WebRTC and sends browser input, commands, and state back to the application - low latency, no local GPU required.

**In the bootcamp:** Both released courses use `ovstream` to deliver the interactive viewport to your browser.

`ovphysx`

The open-source, USD-native physics library. It simulates rigid bodies, colliders, contact, and scene-level gravity with a fixed timestep, and shares pose data through tensors.

**In the bootcamp:** Course 2 uses `ovphysx` to run the drop test and prove the scene behaves under gravity.

## The Foundations and Tools[#](#the-foundations-and-tools "Link to this heading")

Libraries render and simulate; these define and validate the world they operate on.

OpenUSD

The open framework for describing and composing 3D worlds: hierarchy, prim identity, transforms, cameras, materials, schemas, and non-destructive layers. Itâs the shared scene truth every library reads from.

SimReady Foundation

The framework and specifications that define simulation-ready assets. It turns âphysics is brokenâ into named, versioned requirements an asset must meet before you can trust it in a simulation.

`simready-validate`

A validator that checks a USD asset against a chosen SimReady profile and reports a target, requirement ID, severity, authored location, and finding - a bill of health before handoff.

## The Agent Skills[#](#the-agent-skills "Link to this heading")

You donât memorize version-specific APIs - your agent reads a skill that points it at real, tested source code. A skill is packaged know-how that stays accurate because it references code that actually runs.

- **Omniverse Realtime Viewer** - the recipe skill that composes `ovrtx`, `ovstream`, browser input, and validation into one application while preserving a single app, renderer, and stream. Youâll use it in Courses 1 and 2.
- **CAD to SimReady** - the skill package that provides the `simready-validate` and conform-profile guidance behind Course 2âs validation and correction workflow.
- **Focused library skills** - small, single-purpose skills such as `stage-queries`, `writing-transforms`, `semantic-labels`, and `configuring-lidar-sensors` that the course prompts read to perform one job correctly.

For the full set of NVIDIA-verified skills, see the [AI agent skills published by NVIDIA](https://github.com/NVIDIA/skills).

## How the Pieces Fit Together[#](#how-the-pieces-fit-together "Link to this heading")

The real power comes from composition. A typical physical AI workflow chains these libraries into one evidence-producing loop.

```
flowchart LR
USD["OpenUSD scene"] --> SR["SimReady validate"]
SR --> Phys["ovphysx simulate"]
Phys --> RTX["ovrtx render"]
RTX --> Stream["ovstream deliver"]
Stream -->|your AI agent, following skills| USD
```

Start from a protected OpenUSD scene. Validate its assets with SimReady, simulate their behavior with `ovphysx`, render the current state with `ovrtx`, and deliver frames and telemetry to the browser with `ovstream` - all assembled by your agent following focused skills. Thatâs the exact arc youâll build across the bootcamp.

## What Each Course Uses[#](#what-each-course-uses "Link to this heading")

Each course introduces a new ingredient and reuses the ones before it.

Ray Trace Your Way to a Better Life

**Course 1.** OpenUSD, `ovrtx`, and `ovstream`, plus semantic and lidar outputs, orchestrated with the Omniverse Realtime Viewer skill.

[Ray Trace Your Way to a Better Life: Omniverse Libraries, OpenUSD, Agents, and You](lab-1-rtx-viewport/index.html)

SimReady or Not, Here Comes Gravity

**Course 2.** Adds `ovphysx`, SimReady validation and corrections, OpenUSD physics schemas, and the CAD to SimReady guidance.

[SimReady or Not, Here Comes Gravity: OpenUSD for Simulation](lab-2-simready-physics/index.html)

Coming Soon   
 Blender, Oranges, and OVRTX

Brings `ovrtx` and `ovphysx` into Blender with OpenUSD, and validates a prop with SimReady before a scene-level handoff.

Coming Soon   
 Isaac Sim and the Fine Art of Picking Things Up

Uses NVIDIA Isaac Sim with OpenUSD, SimReady assets, and URDF-to-USD conversion to drive a validated robot pick-and-place task.

Note

The **Coming Soon** label describes course availability, not the technologies. Omniverse libraries, OpenUSD, SimReady, Blender, and NVIDIA Isaac Sim are all available today.

## Ready to Build[#](#ready-to-build "Link to this heading")

Youâve met the toolkit. Head to [Ray Trace Your Way to a Better Life](lab-1-rtx-viewport/index.html) to put `ovrtx`, `ovstream`, and OpenUSD to work, or jump into whichever course youâre here for.

On this page
