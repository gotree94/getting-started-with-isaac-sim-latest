# Best Practices for Managing Given Assets[#](#best-practices-for-managing-given-assets "Link to this heading")

Welcome to **Best Practices for Managing Given Assets**. This course builds on your foundation to teach practical scene assembly techniques for creating functional production line layouts within digital twin environments.

Now that you understand how to set up Omniverse and work with USD files, youâll learn to prepare assets for integration into larger scenes. This course focuses on two critical skills: managing materials across multiple assets to maintain visual consistency, and assembling individual machines into coordinated production line configurations that represent real facility layouts.

Working with the same industrial USD assets, youâll learn non-destructive material editing workflows, centralized material management, precision placement techniques, and metadata configuration for facility management integration. These workflows ensure that your digital twin scenes remain maintainable, updatable, and connected to operational data systems.

By the end of this course, youâll be able to assemble production lines with proper positioning, consistent materials, and metadata that supports real-world facility management requirements.

## Learning Objectives[#](#learning-objectives "Link to this heading")

1. **Apply non-destructive material editing workflows** to maintain asset integrity while customizing appearance.
2. **Implement centralized material libraries** to ensure visual consistency across multiple assets and scenes.
3. **Assemble production line layouts** using USD references and proper hierarchical organization.
4. **Use precision placement tools** to achieve accurate machine positioning and alignment.
5. **Configure custom metadata attributes** to enable facility management data integration.

Letâs get started!

---

## **Naming, Organization, and Versioning**[#](#naming-organization-and-versioning "Link to this heading")

Always use clear, descriptive, and consistent names for assets, components, and assemblies. For example, instead of a generic name like machine1.usd, use a specific name like N\_03\_Feeder.usd or SCARA\_Arm\_v2.usd.

**Clear and Descriptive Naming**

- Use underscores or camel case to improve readability.
- Include version numbers when creating iterations (such as N\_03\_Feeder\_v2.usd).
- Avoid using spaces or special characters, which can cause issues in pipelines and references.

**Folder Structure**

- Organize assets by type (e.g., /Assets/Machines, /Assets/Props, /Scenes/Assemblies).
- Separate source/original files from working versions or exported scenes.
- Create subfolders as needed for materials, variants, or documentation.
- Maintain a logical, scalable directory layout so assets are easy to find and share.

**Versioning Working Copies**  
Whenever you edit or experiment with a USD asset, save your changes in a new file with an updated version token. This preserves the original asset and your history.

- Example: `SCARA_Arm_v2.usd when updating SCARA_Arm_v1.usd`

## **Resolve Broken Filepaths and References**[#](#resolve-broken-filepaths-and-references "Link to this heading")

- **Use Relative Filepaths**  
  When referencing USD files or external resources, always use relative paths within your project directory (e.g., `../Assets/Machines/N_03_Feeder.usd`).

  - This ensures that scenes and assemblies remain portable, moving the project to a new location wonât break asset references.
- **Avoid Duplicating Assets**  
  Reference assets rather than copying them whenever possible.

  - Referencing maintains a single source of truth and reduces storage and management overhead.

Note

Weâll be covering this further in later modules.

- **Update References After Reorganizing**  
  If you must move or rename an asset, be sure to update all scenes or assemblies that reference it to avoid broken links.

  - Use the [USD Paths](https://docs.omniverse.nvidia.com/extensions/latest/ext_usd-paths.html) tool available inside of KIT to help with this task.
- **Prevention Tips**

  - Plan folder and file layout in advance to minimize the need for reorganizing mid-project.
  - When collaborating, coordinate moves and name changes with your team.

## References vs. Payloads: When to Use Each[#](#references-vs-payloads-when-to-use-each "Link to this heading")

Understanding when to use references versus payloads is crucial for building efficient USD workflows. Both allow you to bring external USD content into your scene, but they serve different purposes and have distinct performance implications.

### References (Orange Arrow Icon)[#](#references-orange-arrow-icon "Link to this heading")

**Use references when you need**

- Lightweight scene composition without heavy geometry
- Multiple instances of the same asset in different locations
- Metadata, transforms, and organizational structures
- Assets that will always be loaded and visible in your scene

References are ideal for bringing in asset hierarchies, material definitions, and scene organization elements that you want immediately available. They load automatically when the stage opens and cannot be dynamically unloaded.

### Payloads (Blue Arrow Icon)[#](#payloads-blue-arrow-icon "Link to this heading")

**Use payloads when you need**

- Heavy geometry, animation, or simulation data
- The ability to selectively load/unload content for performance
- Working with large scenes where you only need portions loaded at a time
- Assets that contain renderable geometry or complex data

Payloads are essential for managing performance in complex scenes. They can be loaded and unloaded on demand, making them perfect for heavy geometry that you might not always need in memory.

## Best Practice Workflow[#](#best-practice-workflow "Link to this heading")

For most production scenarios, follow this pattern:

1. **Asset Structure**: Use references to bring in your assetâs organizational structure and metadata
2. **Heavy Data**: Place geometry, materials, and other heavy content behind payloads within those referenced assets
3. **Scene Assembly**: Reference assets into your scene, then selectively load payloads as needed for your current task

This approach gives you the organizational benefits of references while maintaining the performance advantages of payload-based loading for heavy data.

## Visual Identification in Omniverse[#](#visual-identification-in-omniverse "Link to this heading")

- **Orange arrow**: Reference (always loaded)
- **Blue arrow**: Payload (can be toggled on/off via checkbox in Properties panel)
- **No arrow**: Content defined directly in the current stage

This distinction becomes especially important when working with large factory scenes where you might want to load only specific production lines or equipment while keeping the overall facility structure available for navigation and organization.

Note

Good asset management ensures project scalability, makes teamwork easier, and prevents major headaches as the project grows. By following best practices for naming, versioning, and referencing, you create a more robust and maintainable digital twin project.

On this page
