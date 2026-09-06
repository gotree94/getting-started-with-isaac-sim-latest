# Datasets and Models[#](#datasets-and-models "Link to this heading")

Pre-collected datasets and pre-trained model checkpoints used in this course, hosted on Hugging Face.

## Datasets[#](#datasets "Link to this heading")

| Dataset | Description | Used In | Link to Visualizer |
| --- | --- | --- | --- |
| [sreetz-nv/so101\_teleop\_vials\_rack\_left](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left) | 75 sim-only teleoperation demonstrations | [Strategy 1](09-strategy1-dr-teleop.html), [Sim Evaluation](11-sim-evaluation.html), [Real Evaluation](12-real-evaluation.html) | [See episodes](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left%2Fepisode_0) |
| [sreetz-nv/so101\_teleop\_vials\_rack\_left\_sim\_and\_real](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_sim_and_real) | 75 sim-only demonstrations (same dataset as above) + 5 real-world teleoperation demonstrations | [Strategy 2](13-strategy2-cotraining.html) | [See episodes](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left_sim_and_real%2Fepisode_0) |
| [sreetz-nv/so101\_teleop\_vials\_rack\_left\_augment\_02](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_augment_02) | 75 sim + 7 Cosmos-augmented episodes | [Strategy 3](14-strategy3-cosmos.html) | [See episodes](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left_augment_02%2Fepisode_0) |
| [sreetz-nv/so101\_teleop\_vials\_rack\_left\_cosmos\_70](https://huggingface.co/datasets/sreetz-nv/so101_teleop_vials_rack_left_cosmos_70) | 75 sim + 70 Cosmos-augmented episodes | [Strategy 3](14-strategy3-cosmos.html) | [See episodes](https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2Fsreetz-nv%2Fso101_teleop_vials_rack_left_cosmos_70%2Fepisode_0) |

## Models[#](#models "Link to this heading")

| Model | Description | Used In |
| --- | --- | --- |
| [aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left](https://huggingface.co/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left) | Sim-only fine-tuned (75 sim episodes) | [Sim Evaluation](11-sim-evaluation.html), [Real Evaluation](12-real-evaluation.html) |
| [aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left\_sim\_and\_real](https://huggingface.co/aravindhs-NV/grootn16-finetune_sreetz-so101_teleop_vials_rack_left_sim_and_real) | Sim + real co-trained (75 sim + 50 real) | [Strategy 2](13-strategy2-cotraining.html) |
| [aravindhs-NV/sreetz-so101\_teleop\_vials\_rack\_left\_augment\_02](https://huggingface.co/aravindhs-NV/sreetz-so101_teleop_vials_rack_left_augment_02) | Cosmos-augmented (75 sim + 7 Cosmos) | [Strategy 3](14-strategy3-cosmos.html) |
| [aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70](https://huggingface.co/aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70) | Cosmos-augmented (75 sim + 70 Cosmos) | [Strategy 3](14-strategy3-cosmos.html) |

## Download Models[#](#download-models "Link to this heading")

From the root of the course repository:

```
mkdir -p models
```

Note

Before downloading from Hugging Face, log in with `hf auth login` to avoid anonymous rate limits.

```
hf download aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left \
--local-dir ./models/aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left
hf download aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left\_sim\_and\_real \
--local-dir ./models/aravindhs-NV/grootn16-finetune\_sreetz-so101\_teleop\_vials\_rack\_left\_sim\_and\_real
hf download aravindhs-NV/sreetz-so101\_teleop\_vials\_rack\_left\_augment\_02 \
--local-dir ./models/aravindhs-NV/sreetz-so101\_teleop\_vials\_rack\_left\_augment\_02
hf download aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70 \
--local-dir ./models/aravindhs-NV/so100-orig-groot-vials-rack-left-cosmos-70
```

On this page
