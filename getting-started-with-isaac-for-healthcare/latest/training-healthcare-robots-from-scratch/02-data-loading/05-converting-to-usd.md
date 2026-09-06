# Converting to USD[#](#converting-to-usd "Link to this heading")

The conversion process involves three stages:

**NRRD to NIfTI Conversion**

- Convert segmentation files from NRRD to NIfTI format

**NIfTI to Mesh Processing**

- Groups 140 labels into 17 anatomical categories
- Creates separate OBJ files for each organ
- Applies smoothing and mesh reduction
- Supports detailed anatomical structures including:

  - **Organs:** Liver, Spleen, Pancreas, etc.
  - **Skeletal system:** Spine, Ribs, Shoulders, Hips
  - **Vascular system:** Veins and Arteries
  - **Muscular system:** Back muscles

**Mesh to USD Conversion**

- Converts the processed meshes to USD format
- Final USD files can be imported into Isaac Sim

---

## NRRD to USD Converter Tool[#](#nrrd-to-usd-converter-tool "Link to this heading")

To convert NRRD medical images to USD format, follow these steps:

1. Go to the `i4h-workflows/tutorials/assets/CT_to_USD` folder in the tutorials directory of Isaac for Healthcare.
2. Install the required packages using the provided `requirements.txt`.
3. Make a backup of your CT data, as the conversion will modify files in place.
4. Run `converter.py` on your CT data folder to start the conversion process.

### Usage[#](#usage "Link to this heading")

**Setup:**
Consider using a seperate virtual environment for this optional part of the course. If you have created a new environment for the MONAI workflow before, you can use this one.

```
conda activate monai
cd $I4H\_HOME/tutorials/assets/CT\_to\_USD
pip install -r requirements.txt
```

Note

If you encounter issues with the additional dependencies, please use a seperate conda environment.

**Usage:**
Copy your data to a sample folder of your choice, then export the folder name.

```
export GENERATED\_DATA="/media/data/dli/maisi/sample\_1/"
```

```
# Then run the converter
python utils/converter.py $GENERATED\_DATA
```

In this video, we convert the previously generated CT data to a USD file and load it into IsaacS im.

### Output Structure[#](#output-structure "Link to this heading")

The converter generates:

```
output/
âââ nii/ # Intermediate NIfTI files
âââ obj/ # Intermediate mesh files
âââ all\_organs.usd # Final USD file
```

### Supported Anatomical Structures[#](#supported-anatomical-structures "Link to this heading")

The tool processes 140 labels grouped into 17 categories including:

- **Organs:** Liver, Spleen, Pancreas, Heart, Gallbladder, Stomach, Kidneys
- **Digestive:** Small bowel, Colon
- **Skeletal:** Spine, Ribs, Shoulders, Hips
- **Vascular:** Veins and Arteries
- **Respiratory:** Lungs
- **Muscular:** Back muscles

#### Conversion Pipeline[#](#conversion-pipeline "Link to this heading")

The tool implements the complete conversion workflow:

1. **NRRD â NIfTI:** Format conversion for medical data
2. **NIfTI â Mesh:** Surface extraction with smoothing and reduction
3. **Mesh â USD:** Final format suitable for Isaac Sim and 3D visualization

Each organ maintains unique labeling for proper segmentation in the final USD file.

---

### Load CT-derived Data Into Isaac Sim[#](#load-ct-derived-data-into-isaac-sim "Link to this heading")

#### Open assets again[#](#open-assets-again "Link to this heading")

1. Launch **Isaac Sim** again.
2. Find the path of your **I4H-assets**.

```
python -c "from i4h\_asset\_helper import get\_i4h\_local\_asset\_path; print(get\_i4h\_local\_asset\_path())"
```

3. Open a **CT-derived USD file**, for example from `i4h-workshop/outputs/`.
   We provide some generated CT data, with the converted USD asset. You can downlaod it here.

---

#### Scene With Generated CT[#](#scene-with-generated-ct "Link to this heading")

In this video, we build a new robotic ultrasound setup, with a patient model derived from the generated CT data.

---

On this page
