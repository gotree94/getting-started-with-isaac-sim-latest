# Setup and Environments[#](#setup-and-environments "Link to this heading")

The course runs on the open-source [i4h-workflows](https://github.com/isaac-for-healthcare/i4h-workflows) repository. Setup prepares a local checkout and confirms that your host can launch Isaac Sim and build the registered environments.

Clone the course-tested `v0.7.1` release (`f815694`), then keep its path available to the
commands in this course:

```
git clone --branch v0.7.1 --depth 1 https://github.com/isaac-for-healthcare/i4h-workflows.git
cd i4h-workflows
export I4H\_WORKFLOWS="$PWD"
```

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this lesson, youâll be able to:

- **Verify** host requirements and **run** the agentic setup.
- **List** registered environments, run import checks, and **smoke-test** a scene.

## Choose a Coding Agent[#](#choose-a-coding-agent "Link to this heading")

Run the coding agent on the same GPU host that will run Isaac Sim. The course skills are not
tied to one harness. These launch paths work with the repository:

Codex CLI

From an isolated course workstation or VM, `--yolo` lets Codex run setup and validation
without stopping for permission prompts:

```
codex --yolo -C "$I4H\_WORKFLOWS"
```

`--yolo` disables approvals and the Codex sandbox. Use it only when the host itself is isolated
and the checkout is trusted. On a shared workstation, omit `--yolo` and approve commands as
they appear.

Hosted Model, Local Tools

The repository can connect OpenCode to an NVIDIA-hosted model while every shell command still
runs on your GPU host:

```
export I4H\_AGENT\_API\_KEY=nvapi-...
I4H\_AGENT\_PROFILE=nvidia-hosted \
I4H\_AGENT\_BASE\_URL=https://integrate.api.nvidia.com \
./local-agent/run.sh agent
```

This is the cloud option for the hands-on course. A browser-only cloud agent cannot open the
Isaac Sim window or use your local GPU.

OpenCode With a Local Model

The repositoryâs local-agent wrapper starts SGLang, writes the OpenCode configuration, loads
the i4h skills, and leaves GPU 0 available for Isaac Sim when the host has another GPU:

```
./local-agent/run.sh start
./local-agent/run.sh agent
```

The default local profile needs one 96 GB GPU. The `qwen3-coder-30b-fp8` profile needs one
48 GB GPU. See the repositoryâs
[Local Agent guide](https://github.com/isaac-for-healthcare/i4h-workflows/blob/main/local-agent/README.md)
for installation and profile options.

## Run It With a Prompt[#](#run-it-with-a-prompt "Link to this heading")

```
Set up the i4h workflow on this machine and tell me if any host requirements are missing.
```

Note

Prompts are open-ended. Keep them on topic and review each result before continuing because
the same prompt can produce different steps or wording on another run.

## What Happens Under the Hood?[#](#what-happens-under-the-hood "Link to this heading")

The setup skill first checks Ubuntu, `uv`, `git`, the NVIDIA driver and GPU, network access, and
free disk space. It then runs the idempotent `workflows/agentic/setup.sh`. That script uses `uv`
to sync the shared package and the Arena, policy, mimic, dataset, and annotator environments. It
also prepares the pinned third-party checkouts. Cosmos remains optional.

After installation, the skill lists the Arena and policy environments. Two `--dry-run` checks
resolve `scissor_pick_and_place` and import its registered modules without starting Isaac Sim.
The final zero-action run launches the real scene, resets it, and advances 40 simulation steps
without policy or teleoperation input. Expect the first launch to take longer while assets are
downloaded and shaders are cached.

Command Line: Steps Run by the Skill

```
# 1. Verify host tools and GPU.
command -v uv && command -v git && nvidia-smi && df -h .
# 2. Run the idempotent setup (add --with-cosmos only if you need Cosmos augmentation).
workflows/agentic/setup.sh
# 3. Confirm both registries and import the default environment.
workflows/agentic/policy/run.sh --list-envs
workflows/agentic/arena/run.sh --list-envs
workflows/agentic/policy/run.sh --env scissor\_pick\_and\_place --dry-run
workflows/agentic/arena/run.sh --env scissor\_pick\_and\_place --dry-run
# 4. Launch the scene and smoke-test it with zero actions.
workflows/agentic/arena/run.sh --env scissor\_pick\_and\_place --num-steps 40
```

## Troubleshooting a Missing Window[#](#troubleshooting-a-missing-window "Link to this heading")

If setup passes but the Isaac Sim window does not appear, ask the agent to launch Arena on your
active local display and inspect `DISPLAY` and `XAUTHORITY`. This is common when the GPU host is
reached through NoMachine or VNC and the agentâs shell is not attached to the desktop session.

```
Isaac Sim started but no GUI appeared. Detect the active local display for this NoMachine or VNC session, launch Arena on that display, and stop before changing system-wide display settings.
```

*Optional deep dive:*

```
Walk me through how setup.sh syncs components and third-party checkouts, then show how Arena discovers and registers environments at runtime.
```

## Whatâs Next?[#](#what-s-next "Link to this heading")

With your host verified, the workflow set up, and a scene smoke-tested, youâre ready to start producing demonstrations. Continue to [Data Collection](03-data-collection.html).

On this page
