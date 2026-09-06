# Review[#](#review "Link to this heading")

Letâs recap what you built and the method you learned on Operation Attic Signal.

## What You Built[#](#what-you-built "Link to this heading")

Starting from a prepared portal scaffold, you directed an AI agent to bring a browser-streamed RTX viewport online, then turned an empty *Signal Panel* into a robot-readiness console: replay-safe Memory Cube pose controls, a non-destructive focus camera, colorized semantic segmentation, and a live lidar link. Ray tracing was the easy part; the durable skill is directing an agent against a real SDK while using your 3D judgment to define what makes the scene, camera, transforms, and sensor evidence trustworthy.

## Key Takeaways[#](#key-takeaways "Link to this heading")

- **The four-line prompt contract** - Goal, Skills, Context, Done when - is a repeatable habit that scaled from launching the portal to wiring perception, without ever regenerating the app.
- **The application is the bridge.** `ovstream` transports; the application validates and queues; `ovrtx` renders; the browser displays. Keeping that boundary clear is what makes the portal interactive and reliable.
- **Idempotent, named commands beat relative nudges** for automation: LEFT, HOME, and RIGHT always mean the same three transforms.
- **The server owns interpretation.** Semantic ID maps, palettes, and lidar channel decoding stay on the server; the browser gets one display-ready frame plus compact state.
- **Lidar sees geometry, not physics.** RTX lidar returns come from renderable USD geometry - never add PhysX collision just to make a prim âvisible.â Unlabeled `Material` prims need default-preserving nonvisual sensor-return labels, authored in a viewer-owned layer under both `omni:simready:nonvisual` and `inputs:nonvisual`, so scene surfaces return hits.
- **Skills package know-how** and point at live, tested code, so guidance canât rot. They guide the agent at build time; the finished application runs its own code.
- **Non-destructive USD.** Viewer cameras, semantics, and sensors live in application-owned layers, so the supplied attic source is never modified.

## Your Investigation Menu[#](#your-investigation-menu "Link to this heading")

You now have a working robot-readiness console. As you explore, work like an engineer: change one thing, make a prediction, and define the proof you expect before asking the agent to act. Scene assembly, animation, camera, lookdev, ray-tracing, and pipeline skills are the review system that tells you whether the agentâs implementation is spatially and operationally correct.

- Add another named pose (such as INSPECT or PARK) and confirm it replays without drift.
- Add a third camera preset and route it through the same command/state seam.
- Add a second semantic class and confirm its label and stable color.
- Add compact lidar telemetry (nearest range, valid count) to the panel and verify it clears on OFF.
- Package one repeatable workflow into a reusable skill (see [Create Your Own Agent Skill](create-your-own-skill.html)).

Tip

If your agent drifts, donât start over. Improve the **Goal**, give it the right **Skills**, add the missing **Context**, or make **Done when** more observable.

## Official References[#](#official-references "Link to this heading")

- [What `ovrtx` is and who it is for](https://nvidia-omniverse.github.io/ovrtx/)
- [`ovrtx` skills](https://github.com/NVIDIA-Omniverse/ovrtx/tree/main/skills)
- [`ovrtx` transform authoring](https://nvidia-omniverse.github.io/ovrtx/scene/transforms.html)
- [`ovrtx` semantic-labels skill](https://github.com/NVIDIA-Omniverse/ovrtx/blob/main/skills/semantic-labels/SKILL.md)
- [`ovrtx` camera-outputs-rt2 skill](https://github.com/NVIDIA-Omniverse/ovrtx/blob/main/skills/camera-outputs-rt2/SKILL.md)
- [`ovrtx` configuring-lidar-sensors skill](https://github.com/NVIDIA-Omniverse/ovrtx/blob/main/skills/configuring-lidar-sensors/SKILL.md)
- [`ovrtx` reading-sensor-pointclouds skill](https://github.com/NVIDIA-Omniverse/ovrtx/blob/main/skills/reading-sensor-pointclouds/SKILL.md)
- [`ovrtx` interpreting-lidar-pointclouds skill](https://github.com/NVIDIA-Omniverse/ovrtx/blob/main/skills/interpreting-lidar-pointclouds/SKILL.md)
- [NVIDIA Omniverse Realtime Viewer skill](https://github.com/NVIDIA/skills/blob/main/skills/omniverse-realtime-viewer/SKILL.md)

## What Comes Next[#](#what-comes-next "Link to this heading")

Continue with [SimReady or Not, Here Comes Gravity](../lab-2-simready-physics/index.html), where youâll integrate `ovphysx`, turn a failed drop test into a structured SimReady report, apply guarded corrections, and prove the Memory Cubeâs physics under gravity - all through the same Attic Portal.

Want to keep exploring on your own? Browse the [Resources](../resources.html) to keep building.

Share Your Feedback

Your feedback shapes future courses. [Share your feedback](https://surveys.hotjar.com/98510484-7ad7-4ddc-bfc4-1b7663827216?utm_source=physical-ai-agent-bootcamp) - it takes about two minutes. You can also use the **Survey** link in the top navigation bar at any time.

On this page
