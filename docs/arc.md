> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arcprize.org/llms.txt
> Use this file to discover all available pages before exploring further.

# ARC-AGI-3 Quickstart

> ARC-AGI-3 is an Interactive Reasoning Benchmark designed to measure an AI Agent's ability to generalize in novel, unseen environments.
```index.html
<div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
  <div style={{ flex: 1 }}>
    <p>
      Traditionally, to measure AI, static benchmarks have been the yardstick.
      These work well for evaluating LLMs and AI reasoning systems. However, to evaluate frontier AI agent systems, we
      need new tools that measure:
    </p>
```
    <ul>
      <li>Exploration</li>
      <li>Percept → Plan → Action</li>
      <li>Memory</li>
      <li>Goal Acquisition</li>
      <li>Alignment</li>
    </ul>

    <p>
      By building agents that can play ARC-AGI-3, you're directly contributing
      to the frontier of AI research. <br /><br /> Learn more about{' '}
      <a href="https://arcprize.org/arc-agi/3">ARC-AGI-3</a>.
    </p>
  </div>

  <div style={{ flex: 1, textAlign: 'center' }}>
    <img src="https://mintcdn.com/arcprizefoundation/sx3SsV7kmM_q56IF/images/Ls20Human.gif?s=61025c7aeb245af080aba9e735a6f1cf" alt="Human playing LS20" width="512" height="512" data-path="images/Ls20Human.gif" />

    <p>
      Can you build an agent to beat{' '}
      <a href="https://arcprize.org/tasks/ls20">this game</a>?
    </p>
  </div>
</div>

## Play your first ARC-AGI-3 environment

### 1. Install the [ARC-AGI Toolkit](https://github.com/arcprize/arc-agi)

```bash theme={null}
uv init
uv add arc-agi
# or
pip install arc-agi
```

### 2. Set your `ARC_API_KEY`

Optionally set your `ARC_API_KEY`. If no key is provided, an anonymous key will be used. However, registering for an API key will give you access to public games at release. [Get an ARC\_API\_KEY](/api-keys)

```bash theme={null}
export ARC_API_KEY="your-api-key-here"
# or
echo 'ARC_API_KEY=your-api-key-here' > .env
```

### 3. Play your first game

Create a file called `play.py`:

```python theme={null}
import arc_agi
from arcengine import GameAction

arc = arc_agi.Arcade()
env = arc.make("ls20", render_mode="terminal")

# Take a few actions
for _ in range(10):
    env.step(GameAction.ACTION1)

print(arc.get_scorecard())
```

Run it:

```bash theme={null}
python play.py
```

You should see the game render in your terminal and a scorecard with your results.

🎉 Congratulations! You just played your first ARC-AGI-3 environment programmatically.

Do you feel the AGI yet?

## Next Steps

After running your first environment:

1. **Make it fast** - Use `env = arc.make("ls20")` without `render_mode` to hit +2K FPS
2. **Try a different game** - Run `env = arc.make("ft09", render_mode="terminal")` to play another game. See a list of games available at [arcprize.org/tasks](https://arcprize.org/tasks) or via the [ARC-AGI Toolkit](/toolkit/list-games)
3. **Use an agent** - Explore [agent templates](/llm_agents) or [create your own agent](/agents-quickstart).
4. **Explore the ARC-AGI Toolkit** - [The ARC-AGI Toolkit](./toolkit/overview) allows quick and easy integration with ARC-AGI Environments.

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.arcprize.org/llms.txt
> Use this file to discover all available pages before exploring further.

# ARC-AGI-3 Scoring Methodology

> How ARC-AGI-3 scoring works

ARC-AGI-3 uses **Relative Human Action Efficiency** (RHAE, pronounced "ray") to score AI systems.

RHAE measures per-level action efficiency compared to a human baseline, normalized per game, across all games.

## What Gets Measured

AI is scored on two criteria:

1. **Completion** — How many levels did the AI complete in each game?
2. **Efficiency** — How many actions did the AI take compared to humans?

## What Counts as an Action

An *action* is a discrete interaction with the environment. Each turn where the agent submits a command, move, or input that affects the game state counts as an action.

Internal operations that do not alter the environment (tool calls, reasoning steps, retries) are **not counted** as actions.

## Human Baseline

Human baselines are established through controlled testing where participants play each ARC-AGI-3 game for the first time (having never seen the game before). For each game, multiple first-time players are observed, and the **upper median human** (by fewest actions) per level is recorded as the baseline.

The upper median is used rather than the average. For an even number of players, the upper of the two middle entries is selected. For example, if four players complete a level, third place is the baseline; if five players complete it, third place is still the baseline.

Using the upper median human per level:

* Reflects typical proficient human performance rather than outlier runs
* Reduces the impact of luck on any individual level
* Keeps the baseline grounded in real play, not theoretical speed-runs

## How Scoring Works

### Per-Level Scoring

For each level the AI completes, calculate:

```
level_score = (human_baseline_actions / ai_actions) ^ 2
```

* If human baseline is 10 actions and AI takes 10 → level score is 1.0 (100%)
* If human baseline is 10 actions and AI takes 20 → level score is 0.25 (25%)
* If human baseline is 10 actions and AI takes 100 → level score is 0.01 (1%)

### Per-Level Score Cap

The maximum score per level is capped at **1.15x** human baseline. If an AI discovers a shortcut and completes a level faster than humans, it can receive at most 1.15.

This ensures a single subpar level does not disproportionately drag down the overall score for an AI that generalizes well across an entire game.

### Per-Game Aggregation

The game score is the **weighted average** of all per-level scores, using the 1-indexed level number as the weight. This underweights the starting tutorial/easy levels and overweights the more difficult later levels where mastery must be demonstrated.

The maximum game score is also determined by this weighted average structure — it is capped based on how many levels the AI actually completed. To unlock a maximum game score of 100%, the AI must complete all levels, including the final one.

**Example:** A game has 5 levels and the AI completes only the first 4:

```
max_game_score = (1 + 2 + 3 + 4) / (1 + 2 + 3 + 4 + 5) = 10 / 15 = 66.7%
```

No matter how efficiently the AI played levels 1–4, its game score cannot exceed 66.7%.

### Total Score

Total score is the **average of all game scores**, resulting in a final score between 0% and 100%.

## Score Interpretation

| Score | Interpretation                                                                |
| ----- | ----------------------------------------------------------------------------- |
| 100%  | AI completes all games/levels while matching or surpassing human efficiency   |
| 1-99% | A mixture of level completion rates and efficiency relative to human baseline |
| 0%    | AI never completes a level across any game                                    |

**LAMIS** (Large Multimodal System) is an open-source embodied AI framework developed by Aura Ecosystem to bring real-time voice, vision, and autonomous decision-making to physical robots such as the Unitree G1 quadruped.

---

**Core Perception & Cognition Loop**

The system executes a continuous non-blocking operational cycle: **Observe → Interpret → Decide → Act → Continue**.

* **Perception:** Captures continuous audio streams via omnidirectional USB microphones and periodic visual frames via an Intel RealSense D435i depth camera.
* **Cognition & Decision:** Utilizes OpenAI's Realtime API for conversational intelligence combined with structured function calling for gesture classification.
* **Actuation:** Executes physical arm and body movements through the Unitree G1 SDK with high-confidence thresholding and automatic arm releases for physical safety.

**Operational Modes**

* **Conversational Mode:** Continuous voice-driven dialogue paired with periodic visual ingestion.
* **Gesture Command Mode:** Voice commands trigger mechanical actions with fail-safe arm releases.
* **Autonomous Social Mode:** Fully vision-based gesture recognition operating independently of voice triggers.

**Hardware & Systems Specifications**

| Component | Specification |
| --- | --- |
| **Robot Base** | Unitree G1 Quadruped (12 Servos + Arm SDK) |
| **Compute** | Intel i7-12700H / Nvidia Jetson Orin |
| **GPU** | RTX 3070 / Orin GPU |
| **Sensors** | Intel RealSense D435i Depth Camera, USB Omnidirectional Mic |
| **Software Stack** | Python 3.11, OpenAI Realtime API, Unitree G1 Arm SDK |

**Cost Optimization Strategies**

To mitigate high continuous multimodal streaming costs (~$120/hr baseline), LAMIS incorporates:

* Dynamic image sampling intervals and JPEG compression adjustments.
* Silence-aware audio throttling to save token bandwidth.
* Conditional vision triggers during static environmental conditions.

**Auxiliary Developer Tooling Included**

* **Kaggle MCP & CLI Integration:** Configured Model Context Protocol endpoints (`[https://www.kaggle.com/mcp](https://www.kaggle.com/mcp)`) and CLI commands for ARC Prize competition submissions.
* **arXiv REST API Integration:** Endpoints for querying metadata, semantic searching, and exporting citation graphs (`arxiv.gg/api/v1/papers`).
* **BYOND Dream Maker (DM) Script:** Environment setup defining world settings, mob attributes, and tab-indented verb commands.

---
