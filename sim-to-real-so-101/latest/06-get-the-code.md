# Get the Code and Models[#](#get-the-code-and-models "Link to this heading")

What Do I Need for This Module?

Hands-on. Youâll need a computer with Docker and an NVIDIA GPU (Ada or Blackwell architecture).

In this module, youâll clone the workshop repository and build the Docker containers used throughout the rest of the course.

The current version of this content uses:

- Isaac Sim 5.1.0
- Isaac Lab 2.3.0
- LeRobot 0.4.3
- GR00T N1.6

## Clone the Repository[#](#clone-the-repository "Link to this heading")

```
git clone https://github.com/isaac-sim/Sim-to-Real-SO-101-Workshop.git
cd Sim-to-Real-SO-101-Workshop
```

## Build the Teleop and Simulation Container[#](#build-the-teleop-and-simulation-container "Link to this heading")

```
docker build -t teleop-docker -f docker/sim/Dockerfile .
```

## Build the Real Robot and Inference Server[#](#build-the-real-robot-and-inference-server "Link to this heading")

Important

This build takes significantly longer than the teleop container.
Expect it to take **up to an hour** or so to complete.
But it is not needed until later modules, so you can keep working on the course in the meantime.

Blackwell GPUs

For NVIDIA GPUs based on the Blackwell architecture (e.g. RTX PRO 6000):

```
./docker/real/build.sh blackwell
```

Ada GPUs

For NVIDIA GPUs based on the Ada architecture (e.g. RTX 4090):

```
./docker/real/build.sh ada
```

## Get the Models[#](#get-the-models "Link to this heading")

You can either download these now, or as you go.

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

## Whatâs Next?[#](#what-s-next "Link to this heading")

Next weâll calibrate and start running our robot!

Continue to [Calibrating the SO-101](07-calibrating-so101.html).

On this page
