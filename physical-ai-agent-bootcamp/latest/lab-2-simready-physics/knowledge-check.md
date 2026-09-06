# Knowledge Check[#](#knowledge-check "Link to this heading")

Letâs reinforce the key concepts from this course. Try each question on your own before revealing the answer.

---

**Question 1:** In this course, why must an asset be SimReady before you can meaningfully simulate it?

A. SimReady only changes the assetâs color and materials  
B. A physics simulation needs correct units, mass, and colliders; SimReady is the âbill of healthâ that confirms the asset has them  
C. SimReady compresses the asset so it loads faster  
D. SimReady is only required for rendering, not simulation

Show Answer

**Answer: B**

A pretty USD file isnât enough to drop into a physics sim - it needs mass, colliders, correct units, and a clean validation report. Drop in a non-SimReady asset and it falls through the floor or wonât move. SimReady is the bill of health that makes âpress playâ actually behave, and it lets downstream tools trust the asset.

---

**Question 2:** Which evidence turns âphysics is brokenâ into an actionable SimReady finding?

A. A named target, Profile and version, Requirement ID, severity, authored location, and concise finding  
B. A screenshot showing that the object looks correct in the viewport  
C. A renderer log with no warnings and no asset-specific details  
D. A list of every file in the project, regardless of relevance

Show Answer

**Answer: A**

An actionable SimReady report names the target and the versioned Profile used to evaluate it. It also records the Requirement ID, severity, authored location, and concise finding so the team knows what failed and where to repair it. A screenshot alone cannot provide that structured, reproducible diagnosis.

---

**Question 3:** When wiring physics into the viewer, what import-order rule must you follow?

A. Import `ovphysx` before `ovrtx`  
B. The order doesnât matter  
C. Import `ovrtx` before `ovphysx`, because the renderer must initialize first  
D. Never import both in the same process

Show Answer

**Answer: C**

`import ovrtx` must come **before** `import ovphysx` - the renderer initializes first, then physics. This preserves the required initialization order for two libraries sharing the GPU. It extends the same create -> load -> step -> cleanup lifecycle discipline used throughout the course.

---

**Question 4:** In this course, what happens to the protected source USD while you apply corrections and compose physics layers?

A. It is overwritten in place with each change  
B. It is deleted after each step  
C. It is converted to FBX before editing  
D. It stays unmodified - state goes into session and sublayers, keeping the source clean

Show Answer

**Answer: D**

Non-destructive authoring is a recurring rule. Corrections and physics state live in separate output, session, sublayer, or composite layers, so the protected source USD is never touched. Source hashes provide evidence that the workflow preserved the original.

---

**Question 5:** After the second drop test, what actually proves the rehearsal behaved correctly?

A. A convincing screenshot of the cube resting inside the pod  
B. Runtime telemetry (advancing time, step, and pose), a containment result, and a persistent OVD report you can reproduce  
C. The fact that the viewport rendered without errors  
D. A longer render time, which means more physics happened

Show Answer

**Answer: B**

A picture is not evidence. Advancing telemetry, a containment result, and the persistent OVD report are what a robotics team can review and reproduce from the same inputs. The rendered frame alone proves nothing about physical behavior.

---

**Question 6:** The physics picker lets you drag a simulated object. What must it never do?

A. Route the interaction through `ovstream` and `ovphysx`  
B. Return authority to `ovphysx` when you release  
C. Write the objectâs transform directly to move it  
D. Reject protected static geometry

Show Answer

**Answer: C**

The picker expresses *intent*: input travels through `ovstream`, `ovphysx` performs the interaction under mass and collision, and authority returns to the solver on release. Writing the transform directly would bypass physics and break the simulation contract.

---

**Question 7:** What is the collider overlay for?

A. It is the final render the robotics team ships  
B. It permanently changes the assetâs materials  
C. It is a diagnostic view of the physical contact geometry, so you can confirm C-9 stays open at the top and colliders match the intended surfaces  
D. It replaces the need for a SimReady report

Show Answer

**Answer: C**

The overlay visualizes otherwise-invisible collision representation so you can inspect which prims participate, whether the pod stays open at the top, and whether the colliders match the rendered surfaces. It is a diagnostic view, not a deliverable.

---

Nice work. If any were tricky, revisit the relevant page before continuing to the [Review](review.html).
