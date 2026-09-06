# Adding Your Own Skills[#](#adding-your-own-skills "Link to this heading")

Learn the `SKILL.md` structure needed to add a stage and route requests to it.

## Learning Objectives[#](#learning-objectives "Link to this heading")

By the end of this lesson, youâll be able to:

- **Describe** the frontmatter and body of a `SKILL.md`.
- **Write** a `description` that routes the agent to your stage.
- **Ground** a skill in the base code so it never invents paths.

## Where Skills Live[#](#where-skills-live "Link to this heading")

Every skill is a single `SKILL.md` whose directory name matches the skillâs `name`. In the
source repo, skills live under `skills/`; when installed, they may live in your agentâs
configured skills directory.

```
skills/
i4h-workflow/SKILL.md # routing / overview
i4h-workflow-validate/SKILL.md # per-stage skill
i4h-workflow-<your-stage>/SKILL.md # the one you'll add
```

## Anatomy of a SKILL.md[#](#anatomy-of-a-skill-md "Link to this heading")

A skill has two parts: a YAML **frontmatter** block that tells the agent *when* to use the skill, and a Markdown **body** that tells it *what to do*.

The frontmatter that matters most is the `name` (must match the directory) and the
**`description`:** the routing summary used to decide when to invoke the skill.
The current i4h skills also carry `version`, `license`, and a `metadata` block with
`author` and `tags`.

### The Description Is the Router[#](#the-description-is-the-router "Link to this heading")

Write the `description` as one capability sentence plus an explicit **âUse whenâ¦â** clause naming the trigger phrases a developer would actually say:

> *Roll out a policy against an env and record verification episodes. **Use when** the user asks to validate, evaluate, or rollout a policy or checkpoint.*

Use specific, non-overlapping verbs and nouns so the router can distinguish nearby skills.

### The Body Grounds in the Base Code[#](#the-body-grounds-in-the-base-code "Link to this heading")

The body starts with **Purpose** and **Base Code**, then adds task-specific sections such as
**Basics**, **What to Load**, **Run**, **Validation**, **Limitations**, or
**Troubleshooting**. Ground each skill in the workflow tree it owns. Agentic skills resolve
`workflows/agentic/`; catheter-navigation skills resolve `workflows/catheter_navigation/`.
Use `[[other-skill]]` links to defer stages another skill already owns.

Before naming a command or file, inspect the checkout with `rg --files` and read the owning
script or configuration. Reference only paths and flags that exist. If a required component is
missing, report that prerequisite instead of inventing a replacement. This keeps the skill tied
to executable repository behavior.

Base Code for an Agentic Workflow Skill

This block resolves the agentic workflow regardless of the working directory:

```
ROOT="${I4H\_WORKFLOWS:-$(git rev-parse --show-toplevel 2>/dev/null)}"
if [ ! -d "$ROOT/workflows/agentic" ]; then
ROOT="${I4H\_WORKFLOWS:-$HOME/i4h-workflows}"
[ -d "$ROOT/workflows/agentic" ] || git clone https://github.com/isaac-for-healthcare/i4h-workflows "$ROOT"
fi
export I4H\_WORKFLOWS="$ROOT"; cd "$ROOT"
```

## Authoring Checklist[#](#authoring-checklist "Link to this heading")

**Frontmatter**

`name` matches the directory; a routing `description` with a âUse whenâ¦â or âUse forâ¦â clause; `version`, `license`, `metadata.author`, and `metadata.tags`.

**Body**

Purpose, the Base Code block, task-specific instructions, runnable commands, validation, and any limitations or troubleshooting.

**Grounding**

Inspects the checkout, drives existing scripts in its owning workflow tree, reads the
source-of-truth config, and never invents paths or flags.

**Cross-Links**

`[[other-skill]]` references for stages you donât re-implement.

## Whatâs Next?[#](#what-s-next "Link to this heading")

You can now read, route, and author skills. In [Conclusion and Next Steps](10-conclusion.html), youâll pull the whole workflow together and find where to go from here.

On this page
