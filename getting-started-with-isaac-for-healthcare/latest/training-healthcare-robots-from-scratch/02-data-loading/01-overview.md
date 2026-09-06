# Loading Data for Simulation[#](#loading-data-for-simulation "Link to this heading")

Now letâs begin assembling all the assets needed for our simulation.

In this module, we will walk you through:

- Launching Isaac Sim
- Finding your local assets for medical simulation
- Loading a robot and phantom model to explore basic Isaac Sim features
- Working with USD files for the medical context

Letâs dive in!

- [Loading Custom Assets in Isaac Sim](02-loading-custom-assets.html)
  - [Launch Isaac Sim](02-loading-custom-assets.html#launch-isaac-sim)
  - [Determine Location of Pre-Downloaded Assets](02-loading-custom-assets.html#determine-location-of-pre-downloaded-assets)
  - [Load Assets in Isaac Sim](02-loading-custom-assets.html#load-assets-in-isaac-sim)
  - [Explore the Viewport](02-loading-custom-assets.html#explore-the-viewport)
  - [Explore the Customized Franka](02-loading-custom-assets.html#explore-the-customized-franka)
  - [Explore the Physics Inspector](02-loading-custom-assets.html#explore-the-physics-inspector)
  - [Cameras](02-loading-custom-assets.html#cameras)
  - [Add the Robot to a New Stage](02-loading-custom-assets.html#add-the-robot-to-a-new-stage)
  - [Add the Phantom model](02-loading-custom-assets.html#add-the-phantom-model)
  - [Drive Joints With the Physics Inspector](02-loading-custom-assets.html#drive-joints-with-the-physics-inspector)
  - [Creating Your Own Scene](02-loading-custom-assets.html#creating-your-own-scene)
- [Summary](02-loading-custom-assets.html#summary)
- [MAISI Synthetic Medical Data](03-maisi-synthetic-medical-data.html)
  - [MAISI](03-maisi-synthetic-medical-data.html#maisi)
  - [Benefits of Synthetic Data Generation (SDG)](03-maisi-synthetic-medical-data.html#benefits-of-synthetic-data-generation-sdg)
  - [Simulation Benefits](03-maisi-synthetic-medical-data.html#simulation-benefits)
    - [Software-in-the-loop (SIL)](03-maisi-synthetic-medical-data.html#software-in-the-loop-sil)
    - [Hardware-in-the-loop (HIL)](03-maisi-synthetic-medical-data.html#hardware-in-the-loop-hil)
- [MAISI CT: Foundational CT Volume Generation Model](03-maisi-synthetic-medical-data.html#maisi-ct-foundational-ct-volume-generation-model)
  - [Resources](03-maisi-synthetic-medical-data.html#resources)
- [MAISI CT Pipeline](03-maisi-synthetic-medical-data.html#maisi-ct-pipeline)
  - [Run MAISI CT Pipeline Locally With MONAI Model Zoo](03-maisi-synthetic-medical-data.html#run-maisi-ct-pipeline-locally-with-monai-model-zoo)
- [Why Convert a CT Dataset From NIfTI or DICOM to USD?](04-why-convert-to-usd.html)
  - [Key Reasons for Conversion](04-why-convert-to-usd.html#key-reasons-for-conversion)
    - [Interoperability With Simulation Platforms](04-why-convert-to-usd.html#interoperability-with-simulation-platforms)
    - [Mesh Representation](04-why-convert-to-usd.html#mesh-representation)
    - [Efficient Rendering and Manipulation](04-why-convert-to-usd.html#efficient-rendering-and-manipulation)
    - [Rich Metadata and Structure](04-why-convert-to-usd.html#rich-metadata-and-structure)
  - [Summary](04-why-convert-to-usd.html#summary)
- [Converting to USD](05-converting-to-usd.html)
  - [NRRD to USD Converter Tool](05-converting-to-usd.html#nrrd-to-usd-converter-tool)
    - [Usage](05-converting-to-usd.html#usage)
    - [Output Structure](05-converting-to-usd.html#output-structure)
    - [Supported Anatomical Structures](05-converting-to-usd.html#supported-anatomical-structures)
      - [Conversion Pipeline](05-converting-to-usd.html#conversion-pipeline)
    - [Load CT-derived Data Into Isaac Sim](05-converting-to-usd.html#load-ct-derived-data-into-isaac-sim)
      - [Open assets again](05-converting-to-usd.html#open-assets-again)
      - [Scene With Generated CT](05-converting-to-usd.html#scene-with-generated-ct)
- [Review](06-review.html)
