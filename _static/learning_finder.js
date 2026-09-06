(function () {
  const taskLabels = {
    "build-robot-sim": "Build your first robot in simulation",
    "train-robot-policy": "Train robot policies at scale",
    "deploy-ros-robot": "Deploy accelerated ROS 2 robot software",
    "so101-pick-place": "Train an SO-101 arm for pick-and-place",
    "assemble-factory-twin": "Assemble an industrial factory or warehouse twin",
    "build-openusd-pipeline": "Build reusable OpenUSD assets and pipelines",
    "prepare-robot-assets": "Prepare robotics assets for enterprise simulation",
    "healthcare-robotics": "Explore healthcare robotics workflows",
    "g1-humanoid-e2e": "Train a Unitree G1 humanoid for end-to-end manipulation",
    "rebot-vla-pipeline": "Build a sim-to-real VLA pipeline with the Seeed reBot arm",
    "agent-omniverse-app": "Build an Omniverse app with an AI coding agent",
  };

  const taskDescriptions = {
    "build-robot-sim": "Assemble a robot, configure physics and sensors, and run a first Isaac Sim scene.",
    "train-robot-policy": "Use reinforcement learning and GPU acceleration to train robot behavior in Isaac Lab.",
    "deploy-ros-robot": "Apply Isaac ROS GEMs and NITROS to production perception and navigation workflows.",
    "so101-pick-place": "Collect demonstrations, post-train a GR00T policy, evaluate in Isaac Lab, and deploy to hardware.",
    "assemble-factory-twin": "Compose complex Omniverse scenes with OpenUSD assets and collaborative workflows.",
    "build-openusd-pipeline": "Learn USD fundamentals, asset modularity, composition arcs, and data exchange.",
    "prepare-robot-assets": "Convert URDF to USD, optimize robot assets, and scale multi-robot digital twins.",
    "healthcare-robotics": "Apply Isaac workflows to healthcare environments, safety protocols, and domain sensors.",
    "g1-humanoid-e2e": "Teleoperate, collect data, fine-tune a GR00T VLA policy, and deploy on Unitree G1 with Jetson Thor.",
    "rebot-vla-pipeline": "Teleoperate with LeRobot, emulate in Isaac Sim, augment with Cosmos, fine-tune GR00T, and deploy to Jetson.",
    "agent-omniverse-app": "Direct an AI agent against real NVIDIA SDKs to render OpenUSD scenes and run physics with Omniverse libraries.",
  };

  const courses = [
    {
      title: "NVIDIA Physical AI Agent Bootcamp",
      url: "https://docs.nvidia.com/learning/physical-ai/physical-ai-agent-bootcamp/latest/index.html",
      difficulty: "beginner",
      difficultyLabel: "Beginner",
      duration: "Self-paced",
      topics: ["first-sim", "openusd", "digital-twins", "sim-to-real"],
      products: ["openusd", "omniverse", "isaac-sim"],
      task: "agent-omniverse-app",
      skills: "AI agent workflows, OpenUSD, RTX rendering, Omniverse Kit libraries, SimReady physics",
      summary: "Direct an AI coding agent against real NVIDIA SDKs and Omniverse libraries to render OpenUSD scenes, validate SimReady assets, and run real-time physics.",
      topicScore: {
        "first-sim": 8,
        "train-policy": 1,
        "production-robot": 1,
        "sim-to-real": 3,
        "digital-twins": 5,
        openusd: 10,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 4,
        "isaac-lab": 1,
        "isaac-ros": 1,
        openusd: 12,
        omniverse: 12,
        gr00t: 1,
        healthcare: 1,
      },
      levelScore: { beginner: 7, intermediate: 4, advanced: 2 },
    },
    {
      title: "How to Develop and Deploy Humanoid Robots End-to-End with NVIDIA Isaac GR00T and Unitree G1",
      url: "https://docs.nvidia.com/learning/physical-ai/gr00t-e2e-workflow/latest/index.html",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "10-15 hours",
      topics: ["sim-to-real", "train-policy", "production-robot"],
      products: ["gr00t", "isaac-lab", "isaac-ros", "isaac-sim"],
      task: "g1-humanoid-e2e",
      skills: "NVIDIA Isaac GR00T, Isaac Lab-Arena, Isaac Teleop, Isaac ROS, Jetson Thor, Unitree G1",
      summary: "Teleoperate a Unitree G1, collect demonstrations, post-train a GR00T VLA policy, evaluate in Isaac Lab-Arena, and deploy to hardware through Jetson Thor.",
      topicScore: {
        "first-sim": 2,
        "train-policy": 8,
        "production-robot": 6,
        "sim-to-real": 14,
        "digital-twins": 1,
        openusd: 1,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 5,
        "isaac-lab": 9,
        "isaac-ros": 7,
        openusd: 1,
        omniverse: 2,
        gr00t: 14,
        healthcare: 1,
      },
      levelScore: { beginner: 1, intermediate: 6, advanced: 4 },
    },
    {
      title: "Getting Started With Isaac Sim",
      url: "https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-sim/latest/index.html",
      difficulty: "beginner",
      difficultyLabel: "Beginner",
      duration: "2-3 hours",
      topics: ["first-sim", "sim-to-real"],
      products: ["isaac-sim"],
      task: "build-robot-sim",
      skills: "Physics simulation, sensor integration, environment setup",
      summary: "Build a robot from scratch, configure physics and sensors, and run a first simulation.",
      topicScore: {
        "first-sim": 12,
        "train-policy": 2,
        "production-robot": 2,
        "sim-to-real": 4,
        "digital-twins": 2,
        openusd: 1,
        healthcare: 2,
      },
      productScore: {
        "isaac-sim": 12,
        "isaac-lab": 2,
        "isaac-ros": 1,
        openusd: 1,
        omniverse: 2,
        gr00t: 1,
        healthcare: 2,
      },
      levelScore: { beginner: 6, intermediate: 3, advanced: 1 },
    },
    {
      title: "Getting Started With Isaac Lab",
      url: "https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-lab/latest/index.html",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "3-4 hours",
      topics: ["train-policy", "sim-to-real"],
      products: ["isaac-lab"],
      task: "train-robot-policy",
      skills: "Reinforcement learning, GPU acceleration, policy training",
      summary: "Train robot policies at scale with GPU-accelerated reinforcement learning.",
      topicScore: {
        "first-sim": 3,
        "train-policy": 12,
        "production-robot": 2,
        "sim-to-real": 6,
        "digital-twins": 2,
        openusd: 1,
        healthcare: 2,
      },
      productScore: {
        "isaac-sim": 2,
        "isaac-lab": 12,
        "isaac-ros": 1,
        openusd: 1,
        omniverse: 1,
        gr00t: 3,
        healthcare: 2,
      },
      levelScore: { beginner: 2, intermediate: 6, advanced: 4 },
    },
    {
      title: "Getting Started With Isaac ROS",
      url: "https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-ros/latest/index.html",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "2-3 hours",
      topics: ["production-robot", "sim-to-real"],
      products: ["isaac-ros"],
      task: "deploy-ros-robot",
      skills: "ROS 2, NITROS acceleration, production robotics",
      summary: "Accelerate ROS 2 perception and navigation workflows for production-grade robots.",
      topicScore: {
        "first-sim": 2,
        "train-policy": 2,
        "production-robot": 12,
        "sim-to-real": 5,
        "digital-twins": 1,
        openusd: 1,
        healthcare: 3,
      },
      productScore: {
        "isaac-sim": 1,
        "isaac-lab": 1,
        "isaac-ros": 12,
        openusd: 1,
        omniverse: 1,
        gr00t: 1,
        healthcare: 3,
      },
      levelScore: { beginner: 2, intermediate: 6, advanced: 3 },
    },
    {
      title: "Train an SO-101 Robot From Sim-to-Real With NVIDIA Isaac",
      url: "https://docs.nvidia.com/learning/physical-ai/sim-to-real-so-101/latest/index.html",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "6-10 hours",
      topics: ["sim-to-real", "train-policy", "production-robot"],
      products: ["isaac-lab", "gr00t", "isaac-sim"],
      task: "so101-pick-place",
      skills: "NVIDIA Isaac Lab, NVIDIA GR00T, LeRobot, Cosmos, sim-to-real transfer",
      summary: "Configure a physical SO-101 arm, collect demonstrations, post-train a GR00T policy, evaluate in Isaac Lab, and deploy to hardware.",
      topicScore: {
        "first-sim": 2,
        "train-policy": 7,
        "production-robot": 5,
        "sim-to-real": 14,
        "digital-twins": 2,
        openusd: 1,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 4,
        "isaac-lab": 9,
        "isaac-ros": 2,
        openusd: 1,
        omniverse: 2,
        gr00t: 14,
        healthcare: 1,
      },
      levelScore: { beginner: 1, intermediate: 6, advanced: 4 },
    },
    {
      title: "Learning Physical AI: A Sim-to-Real VLA Pipeline with Seeed reBot Arm and NVIDIA Isaac",
      url: "https://www.seeedstudio.com/sim-to-real-with-seeed-rebot-and-nvidia-isaac",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "20+ hours",
      topics: ["sim-to-real", "train-policy", "production-robot"],
      products: ["gr00t", "isaac-sim", "isaac-lab"],
      task: "rebot-vla-pipeline",
      skills: "NVIDIA Isaac GR00T, Isaac Sim, LeRobot by Hugging Face, Seeed reBot Arm, Jetson Thor",
      summary: "Teleoperate the Seeed reBot arm with LeRobot, emulate a digital twin in Isaac Sim, augment scenes with Cosmos Transfer, fine-tune a GR00T VLA policy, and deploy to NVIDIA Jetson.",
      partner: true,
      topicScore: {
        "first-sim": 2,
        "train-policy": 7,
        "production-robot": 5,
        "sim-to-real": 14,
        "digital-twins": 2,
        openusd: 1,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 6,
        "isaac-lab": 6,
        "isaac-ros": 2,
        openusd: 1,
        omniverse: 2,
        gr00t: 14,
        healthcare: 1,
      },
      levelScore: { beginner: 1, intermediate: 6, advanced: 4 },
    },
    {
      title: "Assembling Digital Twins With Omniverse and OpenUSD",
      url: "https://docs.nvidia.com/learning/physical-ai/assembling-digital-twins/latest/index.html",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "3-4 hours",
      topics: ["digital-twins", "openusd"],
      products: ["omniverse", "openusd"],
      task: "assemble-factory-twin",
      skills: "OpenUSD, scene composition, asset organization, pipeline development",
      summary: "Assemble complex factory and warehouse scenes using Omniverse and OpenUSD workflows.",
      topicScore: {
        "first-sim": 2,
        "train-policy": 1,
        "production-robot": 1,
        "sim-to-real": 2,
        "digital-twins": 14,
        openusd: 7,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 1,
        "isaac-lab": 1,
        "isaac-ros": 1,
        openusd: 8,
        omniverse: 14,
        gr00t: 1,
        healthcare: 1,
      },
      levelScore: { beginner: 2, intermediate: 6, advanced: 3 },
    },
    {
      title: "Learn OpenUSD",
      url: "https://docs.nvidia.com/learn-openusd/latest/index.html",
      difficulty: "all",
      difficultyLabel: "Beginner to Advanced",
      duration: "Self-paced",
      topics: ["openusd", "digital-twins", "first-sim", "sim-to-real"],
      products: ["openusd", "omniverse"],
      task: "build-openusd-pipeline",
      skills: "USD fundamentals, asset modularity, data exchange",
      summary: "Build the OpenUSD foundation behind digital twins, simulation assets, and interoperable 3D pipelines.",
      topicScore: {
        "first-sim": 3,
        "train-policy": 2,
        "production-robot": 1,
        "sim-to-real": 3,
        "digital-twins": 8,
        openusd: 14,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 2,
        "isaac-lab": 1,
        "isaac-ros": 1,
        openusd: 14,
        omniverse: 7,
        gr00t: 1,
        healthcare: 1,
      },
      levelScore: { beginner: 6, intermediate: 5, advanced: 5 },
    },
    {
      title: "Going Further With Robotics",
      url: "https://docs.nvidia.com/learning/physical-ai/going-further-with-robotics/latest/index.html",
      difficulty: "advanced",
      difficultyLabel: "Advanced",
      duration: "4-5 hours",
      topics: ["production-robot", "digital-twins", "openusd"],
      products: ["isaac-sim", "openusd", "omniverse"],
      task: "prepare-robot-assets",
      skills: "USD interoperability, asset optimization, enterprise deployment",
      summary: "Convert URDF to USD, optimize robotic assets, and scale robotics digital twins for enterprise systems.",
      topicScore: {
        "first-sim": 1,
        "train-policy": 3,
        "production-robot": 6,
        "sim-to-real": 4,
        "digital-twins": 7,
        openusd: 8,
        healthcare: 1,
      },
      productScore: {
        "isaac-sim": 6,
        "isaac-lab": 2,
        "isaac-ros": 2,
        openusd: 8,
        omniverse: 6,
        gr00t: 1,
        healthcare: 1,
      },
      levelScore: { beginner: 0, intermediate: 3, advanced: 7 },
    },
    {
      title: "Getting Started With Isaac for Healthcare",
      url: "https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-for-healthcare/latest/index.html",
      difficulty: "intermediate",
      difficultyLabel: "Intermediate",
      duration: "3-4 hours",
      topics: ["healthcare", "production-robot"],
      products: ["healthcare", "isaac-sim"],
      task: "healthcare-robotics",
      skills: "Healthcare-specific robotics, safety protocols, domain adaptation",
      summary: "Explore robotics workflows for healthcare environments, including safety-critical design and domain-specific sensors.",
      topicScore: {
        "first-sim": 2,
        "train-policy": 2,
        "production-robot": 4,
        "sim-to-real": 3,
        "digital-twins": 2,
        openusd: 1,
        healthcare: 14,
      },
      productScore: {
        "isaac-sim": 3,
        "isaac-lab": 1,
        "isaac-ros": 2,
        openusd: 1,
        omniverse: 1,
        gr00t: 1,
        healthcare: 14,
      },
      levelScore: { beginner: 1, intermediate: 6, advanced: 3 },
    },
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getAnswer(container, name) {
    const selected = container.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
  }

  function rankCourses(answers) {
    return courses
      .map((course) => {
        const scoreKey = answers.mode === "product" ? "productScore" : "topicScore";
        const selectionScore = answers.mode === "task"
          ? course.task === answers.selection ? 16 : 0
          : course[scoreKey][answers.selection] || 0;

        return {
          ...course,
          score: selectionScore,
        };
      })
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }

  function renderEmpty(result) {
    result.innerHTML = '<p class="course-finder__empty">Choose a topic, product, or task to get a recommended course.</p>';
  }

  function renderResult(result, ranked) {
    const top = ranked[0];
    const alternatives = ranked
      .slice(1, 3)
      .map((course) => `<a href="${course.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(course.title)}</a>`)
      .join(" or ");

    result.innerHTML = `
      <div class="course-finder__match">
        <p class="course-finder__result-eyebrow">Recommended course</p>
        <h3>${escapeHtml(top.title)}</h3>
        <p class="course-finder__summary">${escapeHtml(top.summary)}</p>
        <p class="course-finder__task"><strong>Task:</strong> ${escapeHtml(taskLabels[top.task])}. ${escapeHtml(taskDescriptions[top.task])}</p>
        <p class="course-finder__meta">
          <span>${escapeHtml(top.difficultyLabel)}</span>
          <span>${escapeHtml(top.duration)}</span>
        </p>
        <p class="course-finder__skills"><strong>Key skills:</strong> ${escapeHtml(top.skills)}</p>
        <p><a class="course-finder__link" href="${top.url}" target="_blank" rel="noopener noreferrer">Start Learning</a></p>
        <p class="course-finder__alternates"><strong>Also relevant:</strong> ${alternatives}</p>
      </div>
    `;
  }

  function updateModePanels(form) {
    const mode = getAnswer(form, "finder-mode") || "topic";
    form.querySelectorAll("[data-finder-panel]").forEach((panel) => {
      const isActive = panel.getAttribute("data-finder-panel") === mode;
      panel.toggleAttribute("hidden", !isActive);
    });
    return mode;
  }

  function renderRecommendation(form, result) {
    const mode = updateModePanels(form);
    const selection = getAnswer(form, mode);
    if (!selection) {
      renderEmpty(result);
      return;
    }

    renderResult(result, rankCourses({ mode, selection }));
  }

  function initCourseFinder() {
    const startButton = document.getElementById("course-finder-start");
    const form = document.getElementById("course-finder-panel");
    const result = document.getElementById("course-finder-result");

    if (!startButton || !form || !result) {
      return;
    }

    startButton.addEventListener("click", function () {
      const isHidden = form.hasAttribute("hidden");
      if (isHidden) {
        form.removeAttribute("hidden");
        startButton.setAttribute("aria-expanded", "true");
        startButton.textContent = "Hide Course Finder";
        updateModePanels(form);
        const firstInput = form.querySelector("input");
        if (firstInput) {
          firstInput.focus();
        }
      } else {
        form.setAttribute("hidden", "");
        startButton.setAttribute("aria-expanded", "false");
        startButton.textContent = "Start Learning";
      }
    });

    form.addEventListener("change", function (event) {
      if (event.target.matches('input[name="finder-mode"]')) {
        updateModePanels(form);
      }
      renderRecommendation(form, result);
    });

    updateModePanels(form);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCourseFinder);
  } else {
    initCourseFinder();
  }
})();
