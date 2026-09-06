# Deployment in Simulation[#](#deployment-in-simulation "Link to this heading")

Serve the trained policy from a headless daemon, run Arena episodes, and record rollouts for
human review.

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this lesson, youâll be able to:

- **Evaluate** any shipped environment or your own checkpoint from a single prompt.
- **Explain** how the policy daemon and Arena work together to run a rollout.
- **Record** verification episodes for human review.

## Run It With a Prompt[#](#run-it-with-a-prompt "Link to this heading")

Evaluate the checkpoint from the previous lesson with the same stack used for training. N1.5 is
the shipped route. The N1.7 option explicitly confirms or restores the newer stack and model
before launch.

N1.5: Evaluate (Shipped Default)

```
Evaluate scissor\_pick\_and\_place for 2 episodes using the checkpoint I just trained.
```

N1.7: Evaluate (Optional Upgrade)

```
Confirm scissor\_pick\_and\_place uses policy.stack gr00t\_n17 and policy.model\_repo
nvidia/SO\_ARM\_Starter\_Gr00tN17, updating the YAML if needed. Evaluate it for 2 episodes
using the GR00T N1.7 checkpoint I just trained. Verify the N1.7 route and checkpoint path
before launch, record the rollouts, and report the task success rate.
```

When review is complete:

```
Stop all
```

## What Happens Under the Hood?[#](#what-happens-under-the-hood "Link to this heading")

Policy evaluation runs two processes: a policy daemon and Arena. Rollouts can be recorded to
HDF5. State-machine smoke tests use Arenaâs controller without a policy daemon.

### How Deployment Fits Together[#](#how-deployment-fits-together "Link to this heading")

- The **policy daemon** loads the foundation-model stack and serves inference without a window.
- **Arena** is the simulation. It steps the environment, queries the policy, and is the only process that opens the sim window.

The top-level `policy/run.sh` routes to the right stack by env id (`policy.stack` in the env YAML):

| Subproject | Environments |
| --- | --- |
| GR00T N1.5 (`gr00t_n15/`) | Shipped default for `scissor_pick_and_place`, plus `assemble_trocar` and `surgical_*` policy baselines |
| GR00T N1.7 (`gr00t_n17/`) | Optional `scissor_pick_and_place` upgrade selected by editing the env YAML |
| GR00T N1.6 (`gr00t_n16/`) | `locomanip_tray_pick_and_place`, `locomanip_push_cart` |
| openpi PI0 (`openpi_pi0/`) | `ultrasound_liver_scan` |

The N1.5 path uses the repository configuration as shipped. The N1.7 path updates the scissor
environmentâs `policy.stack` and `policy.model_repo`, then passes the matching checkpoint to the
N1.7 inference service.

For policy evaluation, launch order matters: start the daemon **first**, wait until it logs `policy ready`, then launch Arena. If Arena starts first, the episode canât connect. For state-machine smoke runs, Arena owns the controller and records the episode directly.

*Optional deep dive:*

```
Explain how the policy daemon and Arena communicate over Zenoh during a rollout, and why the daemon must report ready before Arena starts.
```

### Running a Rollout[#](#running-a-rollout "Link to this heading")

The eval prompt handles the orchestration: the daemon starts first, and once it logs `policy ready`, Arena runs the episodes against it and records each one for review. To evaluate your own fine-tuned checkpoint instead of the shipped model, the prompt simply points the daemon at your checkpoint directory.

Command Line: Validate a Checkpoint

```
REPO\_ROOT="${I4H\_WORKFLOWS:-$(git rev-parse --show-toplevel 2>/dev/null)}"; [ -d "$REPO\_ROOT/workflows/agentic" ] || REPO\_ROOT="$HOME/i4h-workflows"
ENV\_ID=scissor\_pick\_and\_place
CHECKPOINT="/path/to/checkpoint-200"
RUNS\_ROOT="${REPO\_ROOT}/workflows/agentic/runs"
RUN\_DIR="${RUNS\_ROOT}/eval\_${ENV\_ID}\_$(date +%Y%m%d\_%H%M%S)"
mkdir -p "${RUN\_DIR}/data" "${RUN\_DIR}/logs"
"${REPO\_ROOT}/workflows/agentic/policy/run.sh" --env "${ENV\_ID}" --model-path "${CHECKPOINT}" \
> "${RUN\_DIR}/logs/policy.log" 2>&1 &
until grep -qE "policy ready|Traceback|Error|FAILED" "${RUN\_DIR}/logs/policy.log" 2>/dev/null; do sleep 2; done
"${REPO\_ROOT}/workflows/agentic/arena/run.sh" --env "${ENV\_ID}" \
--episodes 1 \
--max-timesteps 200 \
--record-to "${RUN\_DIR}/data/verify.hdf5" \
2>&1 | tee "${RUN\_DIR}/logs/arena.log"
"${REPO\_ROOT}/workflows/agentic/stop.sh" policy --env "${ENV\_ID}"
```

*Optional deep dive:*

```
Walk me through what happens each control step when Arena queries the live policy and applies the returned action chunk.
```

## Whatâs Next?[#](#what-s-next "Link to this heading")

You can now deploy and validate a policy entirely in simulation. Next, youâll step back and assemble these pieces into a workflow of your own in [Build Your Own Workflow](07-build-your-own-workflow.html).

On this page
