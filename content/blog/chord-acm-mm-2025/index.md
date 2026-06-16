---
title: 'CHORD: Customizing Hybrid-precision On-device Recommendation Models with Device-Cloud Collaboration'
date: Oct 2025
authorId: tianqi-liu-2025-22551275
links:
  - kind: paper
    href: https://dl.acm.org/doi/10.1145/3746027.3755632
desc: >-
  CHORD personalizes an on-device sequential recommender without any on-device
  training: the cloud searches for a per-user "lottery ticket" — a channel-wise
  mixed-precision quantization strategy — encodes it in 2 bits per channel, and the
  device adapts its frozen weights in a single forward pass. Accepted to ACM MM 2025.
tags:
  - Recommender Systems
  - Device-Cloud Collaboration
  - Mixed-precision Quantization
  - On-device Deployment
cover: cover.png
coverAlt: Overview of CHORD — on-device profiling, multi-granularity importance, and channel-wise mixed-precision strategy generation
---
We are happy to share that **CHORD** has been accepted to **ACM MM 2025**. CHORD is about a deceptively simple goal: give every user a *personalized* recommendation model that runs **on their own device**, without paying to train or fine-tune a model per user.

On-device recommendation is attractive — it is private, low-latency, and offloads the cloud. But the moment you try to make the on-device model *personal*, the costs pile up: you either fine-tune on the device (expensive, needs backprop) or ship a fresh model to every user (huge bandwidth). CHORD takes a different route — it treats personalization as a **quantization** problem rather than a **training** problem.

## The problem: personalize an on-device model without paying to train it

Device-cloud recommendation runs into a few stubborn tensions:

- **Interest and resource heterogeneity.** Users have different tastes *and* different phones — memory, compute, and bandwidth all vary.
- **Evolving interests.** A user's behavior drifts over time, so a one-shot deployment goes stale.
- **Frequent transmission, limited bandwidth.** Pushing updated weights to millions of devices is costly.

That creates a double bind: you want **customization** (a model shaped to this user) **and** **compression** (a model small enough for this device) **at the same time**, while keeping the device-cloud communication cheap.

## CHORD in one idea: frozen weights + a channel-wise quantization strategy

CHORD's main idea is a single equation:

> **Frozen weights + channel-wise quantization strategy = fast *and* personalized adaptation.**

The key insight is to look for **"lottery tickets" inside mixed-precision quantization**. Instead of retraining weights, every device keeps the **same frozen backbone**, and personalization is expressed entirely as a **per-user, per-channel bit-width assignment** — which channels keep more precision and which are quantized harder. Finding that winning bit-width pattern is the cloud's job; applying it is cheap.

This buys three things at once: an **importance-aware ~3-bit mixed-precision** model for fast inference, a **compact strategy** that is **2 bits per channel** to transmit, and adaptation that needs **only one forward pass** — no on-device backpropagation.

![Overview of CHORD: the device profiles real-time interactions; the cloud extracts intra-layer (filter/element) and inter-layer (layer) importance with multi-level hypernetworks, composes a channel-wise mixed-precision strategy, and the device applies it to shared frozen weights in a single forward pass.](cover.png)

## How the cloud builds a personalized strategy

The work happens on the cloud and reduces to three components:

1. **User profiling generator.** From the user's **real-time interactions**, the device produces latent interest embeddings that summarize "who this user is right now."
2. **Multi-granularity sensitivity generator.** A set of **hypernetworks** estimates parameter importance at three granularities — **element**, **filter**, and **layer**. The cloud reconstructs filter-level importance from element-level signals, then weights it by layer-level importance.
3. **Personalized strategy generator.** The combined importance is turned into a **channel-wise mixed-precision strategy**: sensitive channels keep higher precision, the rest are pushed lower. The strategy — not the weights — is what gets encoded and sent.

Because the mapping is **real-time data → parameter importance → quantization strategy**, the cloud responds with forward inference only, and the device decodes the strategy **according to its own resource budget**.

## Why it's efficient

The design pays off on four axes at once:

- **Better recommendation** — models are personalized to each user instead of one-size-fits-all.
- **Faster adaptation** — a single forward pass, with **no on-device training**.
- **Faster inference** — an importance-aware **~3-bit mixed-precision** model.
- **Lighter transmission** — only **2 bits per channel** travel over the wire, instead of full 32-bit weights.

## Experiments

We evaluate CHORD on three real-world datasets (**Amazon-CDs, Yelp, ML-100K**) with two standard sequential-recommendation backbones, **SASRec** and **Caser**, reporting **NDCG@5/10** and **HR@5/10**. Against both full-precision and compressed baselines, CHORD delivers **higher recommendation performance**, **higher inference and adaptation efficiency**, and **less transmission overhead**.

Beyond the headline comparison, the paper shows CHORD:

- **degrades gracefully** under tighter budgets and **supports different average bit-widths** for adaptive deployment;
- **supports weight–activation quantization**, not just weights;
- **trains stably** while reaching higher performance; and
- through visualizations, **validates that importance is genuinely heterogeneous** across both layers and channels — which is exactly what makes a per-user, per-channel strategy worthwhile.

## Takeaway

Personalizing an on-device model does not have to mean training one per user. CHORD reframes customization as **searching for a per-user quantization lottery ticket** and splitting the work across device and cloud — frozen shared weights, a tiny channel-wise strategy, and one forward pass. We think this device-cloud, quantization-first view is a practical path to personalized models that actually fit on phones.

## Further reading

- Paper: [CHORD (ACM MM 2025)](https://dl.acm.org/doi/10.1145/3746027.3755632)
