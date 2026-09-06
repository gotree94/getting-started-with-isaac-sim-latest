# Structuring Your Project Folders[#](#structuring-your-project-folders "Link to this heading")

To keep our digital twin project organized and scalable, we need to set up a clear folder structure before we begin assembling assets or building scenes. Good folder organization helps everyone on the team quickly find what they need, makes collaboration easier, and prevents issues like broken filepaths or misplaced resources as our project grows.

## Why Project Structure Matters[#](#why-project-structure-matters "Link to this heading")

- **Reduces errors** A consistent structure helps us avoid broken references, lost files, and confusion when moving or sharing work.
- **Supports scalability**: As our scenes become more complex, a clean folder setup makes it easy to manage more assets, materials, and assemblies without getting overwhelmed.
- **Enables teamwork**: If you or someone else returns to this project in the future, a logical folder hierarchy ensures they can get up to speed quickly.

## Recommended Folder Layout[#](#recommended-folder-layout "Link to this heading")

While there is no âone wayâ to structure a project, here are some best practices to keep in mind.

- **Be specific with names** Use clear, descriptive names for files and folders (e.g., `N_03_Feeder.usd` instead of `machine1.usd`).
- **Separate working files from originals**: Store original assets in the `Assets` folder and your edited assemblies or scenes in their respective folders.
- **Keep references relative** Using relative filepaths (instead of hardcoded absolute paths) ensures your assets and scenes remain usable no matter where the project gets moved.

  - For example, use `./factory/materials/red01` instead of `C:/Documents/my_project/factory/materials/red01`.
- **Document your structure** Add a brief README or notes in a `References` folder to explain any naming conventions or special organization choices.

Note

Organizing your folders at the start of your project will help prevent broken filepaths and lost work later. As you add more assets or export results, always save them to the most appropriate folder according to this structure. If you reorganize or rename files down the road, update any references to keep your project working smoothly.

---

By following these practices, we set ourselves, and anyone who joins this project, up for success as we build larger, more complex digital twins.

On this page
