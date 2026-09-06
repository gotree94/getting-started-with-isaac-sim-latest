# The Challenges of Reinforcement Learning[#](#the-challenges-of-reinforcement-learning "Link to this heading")

Reinforcement learning is a powerful tool that has demonstrated impressive performance across various domains, which we discussed in the previous lesson. However, it comes with its own challenges. Letâs dive into why reinforcement learning can be challenging, especially when applied to robotics.

## Sample Inefficiency[#](#sample-inefficiency "Link to this heading")

Reinforcement learning is notoriously sample inefficient. To get a policy to converge, you typically need between 10 million to 1 billion data samplesâand thatâs just for a single training run. When youâre tuning a policy, you might need to run dozens of these training sessions. This means youâre dealing with an enormous amount of data.

## Safety Concerns[#](#safety-concerns "Link to this heading")

When training on real robots, safety becomes a major issue. In the early stages of training, the robotâs behavior is erratic and unpredictable. This poses risks not only to the human operators overseeing the experiments but also to the robot itself. Thereâs a real chance of damaging expensive equipment.

## Practical Challenges[#](#practical-challenges "Link to this heading")

Training on real robots is also logistically cumbersome. You need to set up and randomize the scene for each trial. When the robot inevitably falls, you have to pick it up and reset it. This process is time-consuming and labor-intensive.

On this page
