# Conclusion and Next Steps[#](#conclusion-and-next-steps "Link to this heading")

You used agentic skills to teach a simulated healthcare robot a more autonomous behavior. Each
plain-language prompt selected a focused procedure grounded in the real tools under
`workflows/agentic/`.

## What You Automated[#](#what-you-automated "Link to this heading")

The workflow follows the same learning loop across SO-101, G1, ultrasound, and surgical robot
embodiments:

- **Collect demonstrations** with teleoperation, a state machine, or an existing policy.
- **Prepare the data** by expanding trajectories, labeling outcomes, replaying episodes, and
  formatting a LeRobot dataset.
- **Train by imitation** with a matching GR00T or openpi policy stack.
- **Evaluate in simulation** by recording rollouts and measuring task success.

The skills turn each stage into a reusable natural-language operation. You can run one stage,
review its output, and continue. You can also compose the same skills into an end-to-end
pipeline.

## Compose the Whole Pipeline[#](#compose-the-whole-pipeline "Link to this heading")

Once the individual stages work, one prompt can connect data collection, preparation, training,
and evaluation:

```
Run end-to-end smoke pipeline for scissor pick-and-place.
```

Simulation makes much of this pipeline suitable for unattended execution. Human attention moves
to the decisions that matter: reviewing demonstrations, checking rollouts, and comparing final
success rates.

## Build on It[#](#build-on-it "Link to this heading")

The registered environments are starting points. Fork the nearest task for a new embodiment or
clinical procedure, then run the same record-to-validate loop. When a repeated development step
has a stable command and a clear validation check, capture it as a skill. A precise description
helps the coding agent route requests to it, while grounded instructions keep execution tied to
the repository.

## Where To Go Next[#](#where-to-go-next "Link to this heading")

- Apply the loop to a healthcare robotics task you care about.
- Add a skill for one repeated operation that still requires manual setup.
- Compare policy success rates across scene randomization before moving toward hardware.
- Find the full source and host requirements at https://github.com/isaac-for-healthcare/i4h-workflows under `workflows/agentic/`.

On this page
