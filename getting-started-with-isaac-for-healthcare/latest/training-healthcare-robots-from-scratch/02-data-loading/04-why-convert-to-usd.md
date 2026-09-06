# Why Convert a CT Dataset From NIfTI or DICOM to USD?[#](#why-convert-a-ct-dataset-from-nifti-or-dicom-to-usd "Link to this heading")

Medical imaging data, such as CT scans we just discussed, are typically stored in formats like **NIfTI (.nii, .nii.gz)** or **DICOM (.dcm)**. These formats are well-suited for clinical and research workflows, as they efficiently store volumetric (3D) data and associated metadata. However, they are not directly compatible with 3D simulation, visualization, or robotics platforms like NVIDIA Isaac Sim.

**Universal Scene Description (USD)** is a powerful, extensible 3D file format originally developed by Pixar and widely adopted in the visual effects, animation, and simulation industries. USD is designed for non-destructive editing, collaboration, efficient scene representation, asset interchange, and real-time rendering.

## Key Reasons for Conversion[#](#key-reasons-for-conversion "Link to this heading")

### Interoperability With Simulation Platforms[#](#interoperability-with-simulation-platforms "Link to this heading")

Isaac Sim and other robotics/graphics tools natively support USD for importing, manipulating, and rendering 3D assets. Converting medical data to USD enables seamless integration into these environments.

### Mesh Representation[#](#mesh-representation "Link to this heading")

NIfTI and DICOM store volumetric data (voxels), but simulation and visualization platforms require surface meshes (e.g., OBJ, STL, or USD) to represent anatomical structures. The conversion process extracts and processes these meshes from the volumetric data.

### Efficient Rendering and Manipulation[#](#efficient-rendering-and-manipulation "Link to this heading")

USD supports hierarchical scene graphs, material definitions, and efficient rendering pipelines, making it ideal for interactive applications, simulation, and digital twin workflows.

### Rich Metadata and Structure[#](#rich-metadata-and-structure "Link to this heading")

USD allows for the inclusion of semantic labels, hierarchical organization, and physical properties, which are essential for robotics, AI training, and advanced visualization.

Tip

Learn more about USD by enrolling in the [NVIDIA OpenUSD Learning Path](https://www.nvidia.com/en-us/learn/learning-path/openusd/)

## Summary[#](#summary "Link to this heading")

Converting CT datasets from NIfTI or DICOM to USD is necessary to:

- Enable use in simulation and robotics platforms like Isaac Sim
- Transform volumetric medical data into usable 3D surface meshes
- Leverage the advanced features and performance of the USD ecosystem

On this page
