# Knowledge Check[#](#knowledge-check "Link to this heading")

Letâs reinforce the key concepts from this course. Try each question on your own before revealing the answer.

---

**Question 1:** This course uses a single repeatable prompt shape for every build step. What are its four lines?

A. Input, Output, Error, Retry  
B. Goal, Skills, Context, Done when  
C. Prompt, Model, Temperature, Seed  
D. Plan, Code, Test, Ship

Show Answer

**Answer: B**

The Patterned Prompt Method is **Goal** (what the app should do after this step), **Skills** (which `SKILL.md` files to read), **Context** (scene path, GPU, what already exists), and **Done when** (an observable check). Using the same shape every time turns prompting into a repeatable habit rather than a set of memorized strings. The observable **Done when** field also gives you a test contract for reviewing the agentâs result.

---

**Question 2:** What is `ovrtx`, and why are its scenes described in OpenUSD?

A. A lightweight C and Python SDK for Omniverse RTX, using OpenUSD so scenes interchange across the content ecosystem  
B. A web renderer that draws USD geometry in the browser with WebGL  
C. A file converter that turns USD into FBX  
D. A cloud service that renders offline only

Show Answer

**Answer: A**

`ovrtx` is a lightweight C and Python SDK for Omniverse RTX. It provides physically accurate simulation of cameras, lidar, radar, and other sensors through the same RTX path, from RL-in-the-loop speeds through an interactive viewport to offline predictive rendering. Because scenes use OpenUSD, the same scene interchanges with a vast ecosystem of content creation, CAD, and simulation tools without reauthoring.

---

**Question 3:** What makes a `SKILL.md` more reliable than pasting code snippets into documentation?

A. It compresses the code so it loads faster  
B. It hides the source code from the agent for security  
C. It points the agent at live, tested source code instead of copied snippets, so the guidance canât drift from what actually runs  
D. It automatically rewrites the libraryâs API

Show Answer

**Answer: C**

A skill points at live, tested code (for example, âSource: `examples/python/minimal/main.py` snippet `step`â) rather than reprinting a snippet that can fall out of date. The documentation canât rot because it always reflects tested code. The same structured file also works as a human reference.

---

**Question 4:** An orchestrator or ârecipeâ skill such as `omniverse-realtime-viewer` differs from a single-task skill because it:

A. Does all the rendering work itself in one file  
B. Only works for a single hardcoded scene  
C. Replaces the need for an AI agent  
D. Routes a request to the right focused references across multiple libraries and enforces architectural guardrails

Show Answer

**Answer: D**

A recipe skill is a router: it chooses which focused references to read based on what you asked for and composes multiple âtools for agentsâ libraries (like `ovrtx`, `ovui`, and `ovstream`) into one outcome. It also encodes non-negotiable rules - for example, the browser displays a video stream; it never renders USD with Three.js. Thatâs institutional knowledge, packaged.

---

**Question 5:** A browser drag orbits the camera. In what order do the pieces cooperate to produce the next frame?

A. The browser renders the new view locally with WebGL, then tells the server  
B. `ovstream` carries the input to the app, which queues a camera intent; the renderer owner updates the camera and `ovrtx` steps the RenderProduct; `ovstream` sends the frame back  
C. `ovrtx` sends the input to the browser, which updates OpenUSD directly  
D. OpenUSD re-composes the whole stage on every drag before anything renders

Show Answer

**Answer: B**

The browser only displays. `ovstream` is the courier, the application validates and queues the intent, and only the renderer-owning loop writes the camera and steps `ovrtx` before `ovstream` returns the rendered frame. Most âwhy doesnât this workâ bugs live at a boundary between two of these stages.

---

**Question 6:** Where are the focus camera, semantic labels, and lidar materials authored, and why?

A. Directly in `old_attic.usd`, so everything lives in one file  
B. In viewer- or application-owned layers composed above the protected source, so the supplied attic is never modified  
C. In a new copy of the attic that overwrites the original  
D. Only in the browser client, never in USD

Show Answer

**Answer: B**

Non-destructive authoring keeps the canonical source read-only. Viewer-owned layers hold the camera, semantics, and sensor labels, so a digital twin keeps a protected source of truth plus reproducible application layers. Unchanged source hashes are the evidence the workflow preserved the original.

---

**Question 7:** What does packaging your workflow as an agent skill give another agent?

A. A new `ovrtx` API that the SDK did not previously expose  
B. A faster renderer that replaces `ovrtx`  
C. A reliable, source-backed route for coordinating existing capabilities - which sources to read, which order and constraints matter, and what evidence proves success  
D. A way to skip the AI agent entirely

Show Answer

**Answer: C**

A skill adds no new library feature. It encodes the repeatable route, the version-specific sources, the boundaries to respect, and the proof to collect - so your judgment transfers to the next scene without pretending the agent can decide spatial correctness on its own.

---

Nice work. If any were tricky, revisit the relevant page before continuing to the [Review](review.html).
