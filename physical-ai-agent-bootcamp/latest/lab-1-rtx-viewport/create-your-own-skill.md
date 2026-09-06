# Create Your Own Agent Skill[#](#create-your-own-agent-skill "Link to this heading")

Omniverse libraries work well as tools for agents because the libraries ship with focused agent skills. A skill does **not** add a new feature to `ovrtx` or `ovstream`. It tells an agent when to use an existing capability, which version-specific sources to read, which order and constraints matter, and what evidence proves success.

Youâve now used both kinds of skill composition:

- One hero skill with small supporting skills: replay-safe named cube poses.
- A workflow of several focused skills: camera composition, semantic output, and lidar readback.

**Why this matters for a robot-ready scene:** A correct one-off result is not yet a dependable production workflow. Robotics teams need the scene rules, authoring boundaries, version-specific procedures, and validation evidence to remain consistent across assets and iterations. A focused skill lets an agent repeat that established method without pretending the agent can judge spatial correctness on its own.

**Your 3D skills at work:** Pipeline TDs, technical artists, supervisors, and lead artists already turn craft knowledge into publishing rules, tools, templates, and review gates. Creating an agent skill is the same translation: you encode the intent, constraints, source of truth, and proof that make a 3D workflow safe enough to reuse for physical AI.

What a skill is - and what makes a good one. Step through the slides, then encode a rule from your own discipline.

1

Capability vs. Guidance

A skill points at power it doesnât add.

A skill guides an **existing** `ovrtx` or `ovstream` capability.

It routes the agent to the **version-specific** sources it should read.

It **cannot** invent a library API that the SDK does not expose.

It guides at build time; the finished application runs its own code.

```
flowchart TD
Skill["Skill: guidance"] -->|points at| Cap["Existing ovrtx / ovstream capability"]
Skill -->|routes to| Src["Version-specific sources"]
Skill -.->|cannot| Invent["Invent an API the SDK lacks"]
Skill --> Build["Guides at build time"]
Build --> App["Finished app runs its own code"]
```

2

Two Ways to Compose Skills

You have already used both.

**Hero + supporting** - one lead skill with small helpers, like replay-safe cube poses.

**A workflow** - several focused skills, like camera composition, semantics, and lidar.

A workflow skill routes to focused library skills and preserves their boundaries.

Pick the shape that matches how repeatable your request really is.

```
flowchart TD
Hero["Hero + supporting"] --> H1["One lead skill + small helpers<br/>(e.g. replay-safe cube poses)"]
Work["A workflow"] --> W1["Several focused skills<br/>(camera, semantics, lidar)"]
W1 --> Bound["Routes to library skills;<br/>preserves their boundaries"]
```

3

Anatomy of a Good Skill

Concise, source-backed, and validated.

Valid **name** and **description** frontmatter, plus generated agent metadata.

A concise `SKILL.md`; detailed API material lives in referenced files only when needed.

Scripts only for deterministic work that would otherwise be rewritten.

Validate the skill and run one realistic forward test before trusting it.

```
flowchart TD
Skill["SKILL.md (concise)"] --> FM["name + description frontmatter<br/>+ generated metadata"]
Skill --> Refs["Detailed API in referenced files,<br/>only when needed"]
Skill --> Scripts["Scripts only for deterministic work"]
Skill --> Validate["Validate + one forward test<br/>before trusting it"]
```

## Part 4 â Encode Your 3D Judgment as an Agent Skill[#](#part-4-encode-your-3d-judgment-as-an-agent-skill "Link to this heading")

### 1. Inspect â Find the Rule the API Cannot Know[#](#inspect-find-the-rule-the-api-cannot-know "Link to this heading")

A useful skill starts with a concrete repeated request. Keep `SKILL.md` concise; put detailed API material in referenced files only when needed; use scripts only for deterministic work that would otherwise be rewritten; and validate the skill before trusting it.

The distinction is simple: an Omniverse library provides a capability, and its focused skills teach the agent how to use that capability for the installed version. Neither can decide your production quality bar. Only you can define which layer may own an edit, which object boundary is meaningful, what framing is useful, which label is correct, or which evidence should fail review.

A useful skill starts with a physical-AI handoff another team will need to repeat. It preserves three different sources of truth:

| Source of truth | What it owns |
| --- | --- |
| **Library capability** | What `ovrtx` or `ovstream` can actually do. |
| **3D domain judgment** | Which hierarchy, frames, units, transforms, semantics, sensor placement, and acceptance criteria make the result meaningful. |
| **Skill guidance** | How your agent finds the current capability and reliably preserves that domain judgment. |

The library supplies features. The skill supplies a repeatable implementation route. The 3D engineer defines what âcorrectâ means.

| Your 3D expertise | Physical-AI value |
| --- | --- |
| OpenUSD layers and composition | Update a digital twin without damaging its source asset. |
| Transforms, units, and frames | Align robot motion and multi-sensor observations. |
| Semantic schemas | Produce ground truth for perception and world models. |
| Camera and lidar rigging | Build reproducible virtual-sensor tests. |
| Output selection and compact telemetry | Control compute, bandwidth, and energy at scale. |

Review the decisions you made in the first five missions. Pick one that you would want another artist, TD, or agent to apply consistently on the next scene.

### 2. Specify â Turn Craft Knowledge Into Skill Guidance[#](#specify-turn-craft-knowledge-into-skill-guidance "Link to this heading")

Choose your discipline and complete three parts:

- **NEVER GUESS** â the spatial or production decision an agent must not invent.
- **REQUIRE** â the authored inputs or evidence the workflow must have before acting.
- **PROVE** â the observable check that lets a human approve the result.

Open the [Prompt Builder](../prompt-builder.html), choose the **Ray Trace Your Way to a Better Life** session, and select the skill prompt that matches your discipline (**Part 4 - Skill: Scene Inspection Mode** or **Part 4 - Skill: Replay-Safe Scene Poses**). Turn that rule into skill intent for `Context` and a forward-test expectation for `Done when`. This is the point where your tacit 3D judgment becomes reusable agent guidance. Leave the optional fields blank or use one of the finished prompts below if you want a tested starting rule.

### 3. Build â Create and Forward-Test the Skill[#](#build-create-and-forward-test-the-skill "Link to this heading")

Choose one of these starting ideas - or invent your own.

### Idea 1 â Robot-Ready Inspection Mode[#](#idea-1-robot-ready-inspection-mode "Link to this heading")

Create one skill that packages the repeatable workflow âfocus on a target, switch to semantic view, activate lidar, and report evidence.â

Tip

**Make It Yours:** Open the [Prompt Builder](../prompt-builder.html), choose the **Ray Trace Your Way to a Better Life** session, and select **Part 4 - Skill: Scene Inspection Mode**. Add your NEVER GUESS / REQUIRE / PROVE rule to `Context` and `Done when`, then review the complete contract before copying it.

Show a finished skill-creation prompt

```
Goal: Create a reusable skill named r17-inspection-mode that teaches the agent how to
add a target-focused camera, semantic view, and optional Lidar evidence panel
to an existing browser-streamed ovrtx viewer. The skill must orchestrate
existing capabilities rather than implement an application now.
Skills: Use the skill-creator skill. Read the pinned ovrtx stage-queries,
writing-transforms, writing-attributes, semantic-labels, camera-outputs-rt2,
reading-render-output, configuring-lidar-sensors, reading-sensor-pointclouds,
and interpreting-lidar-pointclouds skills plus the Realtime Viewer stage-loading,
camera-controls, aov-switching, streaming-messages, and validation references.
Context: Create the skill at ~/RTXViewport/My\_Skills/r17-inspection-mode. It should
trigger on requests such as "prepare this streamed USD viewer for robot
inspection" and "add focus, semantic, and Lidar inspection controls." Keep
source USD immutable, preserve one renderer owner and one stream, require
application-owned layers, route native input separately from commands, and treat
the pinned local skills as the version-specific source of truth. Keep SKILL.md
concise and add references only when they prevent rediscovery; do not copy vendor
documentation wholesale.
Done when: The folder has valid SKILL.md frontmatter with only name and description,
concise workflow instructions, matching agents/openai.yaml, only necessary
resources, and no unrelated README or changelog; the skill validation command
passes; and a fresh test request causes the agent to select the correct focused
skills and produce a safe plan without modifying the live portal.
```

### Idea 2 â Replay-Safe Scene Poses[#](#idea-2-replay-safe-scene-poses "Link to this heading")

Create one skill that packages the pattern âresolve a prim, record its HOME transform, expose named browser poses, and make every command replay-safe.â

Tip

**Make It Yours:** Open the [Prompt Builder](../prompt-builder.html), choose the **Ray Trace Your Way to a Better Life** session, and select **Part 4 - Skill: Replay-Safe Scene Poses**. Add your NEVER GUESS / REQUIRE / PROVE rule to `Context` and `Done when`, then review the complete contract before copying it.

Show a finished skill-creation prompt

```
Goal: Create a reusable skill named ovrtx-named-scene-poses that teaches the agent to
add replay-safe named-pose controls for an OpenUSD prim in an existing
ovrtx/ovstream viewer.
Skills: Use the skill-creator skill. Read the pinned ovrtx stage-queries,
reading-attributes, writing-transforms, and stepping-and-rendering skills plus
the Realtime Viewer prim-transform-safety, streaming-messages,
viewer-control-patterns, viewer-feedback-status, and validation references.
Context: Create the skill at ~/RTXViewport/My\_Skills/ovrtx-named-scene-poses. It
should trigger on requests such as "add HOME, INSPECT, and PARK poses for this
prim" and "give my streamed viewer replay-safe named transform controls."
Require an explicit coordinate space and axis, record the complete HOME transform
once, derive every named target from HOME, make repeated desired-state commands
idempotent, queue writes on the renderer owner, send commands/state through the
existing ovstream application-message path, and preserve source USD. The skill
provides guidance only; it must not contain a replacement renderer or invent APIs.
Done when: The folder has valid SKILL.md frontmatter with only name and description, concise
imperative instructions, matching agents/openai.yaml, only necessary resources,
and no auxiliary documentation clutter; validation passes; and a fresh test
request produces a replay-safe named-pose implementation plan with observable
completion checks and no changes to the live portal.
```

### 4. Verify â Test Whether Your Judgment Transfers[#](#verify-test-whether-your-judgment-transfers "Link to this heading")

Validate the skill, then give a fresh agent one realistic request that should trigger it. Do not grade only whether the skill folder exists. Compare the agentâs plan with the NEVER GUESS, REQUIRE, and PROVE rule you wrote:

- Did it refuse to invent the decision you reserved for the 3D expert?
- Did it request or inspect the required authored evidence?
- Did it propose the proof you would use in a production review?
- Did it route implementation to the pinned library skills instead of copying or inventing APIs?

During the play period, test the skill on one real portal extension and improve it based on what the agent misunderstood. That iteration is how personal craft knowledge becomes reusable engineering guidance without pretending the agent can replace the judgment that created it.

When youâre ready, [review](review.html) the method and see whatâs next.

On this page
