# Pick Up the Physical World[#](#pick-up-the-physical-world "Link to this heading")

**Mission connection:** You now have a composed scene with an explicit `PhysicsScene`, corrected physical assets, and a repeatable drop test. The next question is whether the world continues to behave correctly when you intentionally disturb it.

In a physical-AI workflow, interaction is another form of validation. Picking up, dragging, and releasing a simulated object helps expose unstable constraints, incorrect mass, unexpected collision boundaries, and objects that cannot recover naturally after intervention.

Your rigging and interactive-tool experience transfers directly. You already understand the difference between controlling an object through a system and breaking that system by forcing its transform. Here, your job is to preserve constraints, translate user intent into a supported interaction, and return control cleanly to the simulation.

## Physics-Picker Experience[#](#physics-picker-experience "Link to this heading")

Mission 5 adds a physics-aware picker to the existing streamed viewport:

- You point at a supported simulated object.
- Your configured mouse press or drag is carried to the server through `ovstream`.
- The application resolves the hit against the rendered scene and confirms that the selected prim is an eligible physics body.
- The simulation-owning loop gives the interaction to the supported `ovphysx` picker or constraint workflow.
- The selected object follows your input while remaining subject to mass, collision, constraints, and the rest of the simulation.
- When you release it, the temporary interaction ends and full authority returns to `ovphysx`.

The important distinction is that you are expressing an **intent**, not directly editing a transform:

```
your pointer input
-> ovstream transports it
-> the application validates and queues it
-> ovphysx performs the physical interaction
-> ovrtx renders the resulting world state
-> ovstream returns the frame and authoritative status
```

The browser must never drag an object by writing its transform directly. The picker must also reject protected static geometry, avoid bypassing `ovphysx`, and reuse the existing input, simulation, rendering, and streaming paths.

A successful interaction is not merely âthe object followed my cursor.â The object must remain part of the physical world while you move it, respond naturally when released, and produce state that agrees with what the viewport displays.

## Package the Workflow as a Reusable Skill[#](#package-the-workflow-as-a-reusable-skill "Link to this heading")

You have now assembled a complete physical-scene commissioning workflow:

```
connect ovphysx
-> run and measure a baseline rehearsal
-> launch targeted SimReady validation
-> route Requirement findings
-> stage corrected outputs
-> inspect collider overlays
-> author the scene-level physics contract
-> rerun runtime proof
-> expose reports and interaction safely
```

Your final challenge is to begin turning that workflow into a reusable agent skill.

The skill does not add new features to OpenUSD, `ovphysx`, or the SimReady tools. It gives your agent a reliable recipe for coordinating their existing capabilities, following the correct version-specific instructions, respecting ownership boundaries, and collecting evidence before declaring success.

As you write it, preserve the distinction between:

- what the libraries are capable of doing;
- what requires your 3D domain judgment;
- what asset-level SimReady validation proves;
- what composed-scene runtime evidence proves;
- what the application must orchestrate; and
- which source content must remain protected.

Your 3D expertise defines the quality bar: which objects may move, which surfaces must remain static, what interaction should feel physically credible, and what evidence is strong enough to trust. The skill preserves that judgment so your agent can apply the workflow consistently to the next scene.

## Make It Your Own[#](#make-it-your-own "Link to this heading")

This mission has no single finished prompt. Extend the containment system and begin the skill on your own, so write your own briefs against the four-line contract and prove each one before you move on.

Tip

**Make It Yours:** Open the [Prompt Builder](../prompt-builder.html) to shape your open-build briefs, then send each set of `Context` and `Done when` decisions into the prompt.

**Start from a scaffold.** You have authored `Context` and `Done when` all course; take the wheel gradually. For your first extension - the physics picker - the `Goal` and `Skills` are scaffolded below, so you only author the `Context` and `Done when` you have been practicing:

```
Goal: Add a physics-aware picker so a user can drag a simulated object through
ovstream and ovphysx, never by writing its transform directly.
Skills: Read ~/SimReadyPhysics/skills/omniverse-realtime-viewer/SKILL.md and its
streaming-messages, viewer-control-patterns, and validation references.
Context: <the composed physics stage and ownership boundaries to preserve>
Done when: <the telemetry or state proving the object stayed under physics and returned
authority to ovphysx on release>
```

For your later extensions, start from the blank contract and author all four fields:

```
Goal: <the observable interaction or skill behavior you want>
Skills: <the focused installed guidance the agent should read>
Context: <the composed physics stage and ownership boundaries to preserve>
Done when: <the telemetry, state, or evidence that proves it worked>
```

Extension ideas:

- Add the physics picker and prove it never writes a transform directly, rejects protected static geometry, and returns authority to `ovphysx` on release.
- Add a bounded disturbance and prove the scene settles and can reproduce the result from the same inputs.
- Draft the reusable skillâs structure: the ownership boundaries it protects and the evidence it must collect before declaring success.

## Validate: Interaction and Skill Are Trustworthy[#](#validate-interaction-and-skill-are-trustworthy "Link to this heading")

Before you wrap up, confirm you can answer:

- Does the picker express intent through `ovstream` and `ovphysx` rather than writing a transform directly?
- Does the object stay part of the physical world while moving and respond naturally on release?
- Does your draft skill coordinate existing capabilities without inventing new library features?
- Does it preserve your 3D judgment about what may move, what must stay static, and what evidence to trust?

When youâre ready, head to the [Review](review.html) for a mission debrief and whatâs next.

On this page
