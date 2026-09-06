# Post-training With GR00T[#](#post-training-with-gr00t "Link to this heading")

## Setup GR00T[#](#setup-gr00t "Link to this heading")

If you havenât already installed GR00T during the setup module, letâs do it now:

```
# Install the dependencies for GR00T N1
bash tools/env\_setup\_robot\_us.sh --policy gr00tn1
# Download the model weights for GR00T N1
i4h-asset-retrieve --sub-path Policies/LiverScan/GR00TN1
# Example for GR00T N1
python -m policy\_runner.run\_policy --policy gr00tn1
```

## Launch GR00T N1 Finetuning[#](#launch-gr00t-n1-finetuning "Link to this heading")

Vision language action (VLA) models such as GR00T combine perception, with language context to predict actions for robots or agents.

- **Perception:** Receiving visual inputs (e.g. camera or simulated sensor data)
- **Understanding:** Interpreting these inputs in the context of language instructions, for example : âPerform a liver scanâ
- **Control:** Outputting actions that can be executed by a robot or agent, like a desired end-effector pose.

This integration makes VLA models especially powerful for embodied AI, robotics, and simulation-driven tasks, where understanding the environment and responding intelligently are tightly coupled.

Finetuning a VLA model typically involves adapting a large, pretrained foundation model to a specific environment or task. In our case we want to fine tune [GR00T N1](https://github.com/NVIDIA/Isaac-GR00T). Our training script wraps the [training module](https://github.com/NVIDIA/Isaac-GR00T/blob/10de3f983eeef81730f1bc195c2233423b056c0e/gr00t/experiment/trainer.py) from the repo and uses the data we have prepared. It follows the implementation of the [gr00t\_finetune.py](https://github.com/NVIDIA/Isaac-GR00T/blob/10de3f983eeef81730f1bc195c2233423b056c0e/scripts/gr00t_finetune.py) script.

We start with the pretrained GR00T model (N1 or N1.5) and then postâtrain it using your own demonstration data. The default configuration does not use LoRA (Low-Rank Adaptation), hence all model parameters are unfrozen and updated during training. Note that we use the EmbodimentTag `new_embodiment`, to specify that we use a custom robot. We encourage you to experiment with the finetuning parameters and have a look at the [finetuning tutorial](https://github.com/NVIDIA/Isaac-GR00T/blob/10de3f983eeef81730f1bc195c2233423b056c0e/getting_started/2_finetuning.ipynb).

---

## Code Instructions[#](#code-instructions "Link to this heading")

### Finetuning GR00T[#](#finetuning-gr00t "Link to this heading")

Modify this line to point to the dataset you have prepared in the previous step.

```
export DATASET\_PATH="<user\_dir>/.cache/huggingface/lerobot/gr00t\_ultrasound"
export OUTPUT\_DIR="<your\_model\_training\_folder>"
```

Run the finetuning code.

```
cd "$I4H\_HOME/workflows/robotic\_ultrasound/scripts/training/gr00t\_n1"
python train.py \
--data\_config single\_panda\_us \
--dataset\_path $DATASET\_PATH \
--output-dir $OUTPUT\_DIR
```

**Command Arguments:**

- `--data_config single_panda_us`: Specifies the data configuration for single Panda robot with ultrasound setup. It is mapped to this [configuration class](https://github.com/isaac-for-healthcare/i4h-workflows/blob/920bccf90fd3fe765545c01696491b73ce58d0c7/workflows/robotic_ultrasound/scripts/policy_runner/gr00tn1/utils.py#L23), specific to our setup.
- `--dataset_path`: Path to the HuggingFace dataset containing robotic ultrasound training data, in our case we point to the data we collected in the previous chapter.
- `--output-dir`: Directory where training outputs, checkpoints, and logs will be saved. Specify a location on your filesystem. We will load the trained model from this directory in the rollout phase.
- there are more configuration options in the training script. Have a look at the [Config class](https://github.com/isaac-for-healthcare/i4h-workflows/blob/920bccf90fd3fe765545c01696491b73ce58d0c7/workflows/robotic_ultrasound/scripts/training/gr00t_n1/train.py#L34) if you would like to change the base model, checkpoint saving frequency, or any learning-related parameters.

Note

By default the training script will save checkpoints every 500 epochs. If you want to test your own model, youâll need to wait for the first checkpoint to be saved. Donât expect the model to work well, given the small dataset and training time. A pre-trained model is available in the cached assets folder for the next section.

In this video, we prepare the command to launch the finetuning process for GR00T N1. You can train your model until convergence, or stop early. You will be able to continue the course without your own model. The code deep dive section into the training script is part of the next section. You will find it in âRollout a VLA Model.â

On this page
