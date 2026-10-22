---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<h1 id="about-me">About me</h1>

I received my B.S. degree in 2023 from the Department of Statistics and Information Science at Fu Jen Catholic University (FJCU), Taiwan, where I was advised by Prof. Hao-Chiang Shao.

I completed my M.S. degree in 2025 at National Cheng Kung University (NCKU), where I conducted research at the <a href="https://sites.google.com/view/acvlab/" style="color:#0B3C8A;">Advanced Computer Vision Laboratory (ACVLAB)</a> under the mentorship of Prof. <a href="https://cchsu.info/" style="color:#0B3C8A;">Chih-Chung Hsu</a> and the Computational Photography Laboratory (CPLAB) at National Yang Ming Chiao Tung University (NYCU), working with Prof. <a href="https://yulunalexliu.github.io/" style="color:#0B3C8A;">Yu-Lun Liu</a>.

I am an incoming Ph.D. student at the University at Albany, State University of New York (SUNY Albany), where I will conduct research at the Computer Vision and Machine Learning Laboratory (CVML LAB) under the co-supervision of Prof. <a href="https://mingching.github.io/" style="color:#0B3C8A;">Ming-Ching Chang</a> and Prof. <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" style="color:#0B3C8A;">Xin Li</a>.

<p>My research goal is to advance <strong>Reliable and Efficient Multimodal Intelligence</strong>, developing systems that integrate complementary information to build a faithful understanding of the world from imperfect observations. Building on my work in visual reconstruction and computational photography, I aim to extend this perspective across modalities: recovering missing information, assessing whether the resulting representations can be trusted, and making that process computationally practical. These challenges connect <strong>perception, trust, and efficiency</strong> within a common goal—to develop intelligent systems that remain useful and dependable when information is incomplete and computational resources are limited. Full list of publications <a href="https://scholar.google.com/citations?user=koBVaaUAAAAJ" target="_blank" rel="noopener">here</a>.</p>

<div class="profile-actions">
<a href="https://drive.google.com/file/d/1eScbrrYYBnmpGsqvjF-DXRo07L2i7evm/view?usp=sharing"
   style="color:#0B3C8A;"
   target="_blank" rel="noopener">Curriculum vitae ↗</a>
<span>Updated Jan 17, 2026</span>
</div>

In my free time, I enjoy traveling ✈️, capturing moments through photography 📸, and making desserts 🍰.

<!-- Recent highlights hidden for now; remove the comment markers to show them again.
<h2 id="news">Recent highlights</h2>

<div id="news-timeline" style="padding: 10px 5px; border-left: 2px solid #eee; margin-left: 10px;">
  <div class="news-item" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.07.15</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Runner-up]</b> 2nd place in both the Event-guided Segmentation and Brightness Adjustment challenges at ECCV 2026 EBMV.</span>
  </div>
  <div class="news-item" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.07.01</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[4th Place]</b> 4th place in the IJCAI 2026 DDL2.0 Deepfake Localization Challenge.</span>
  </div>
  <div class="news-item" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.06.08</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Award]</b> ELSA won the CVPR 2026 Computational Transparency Award.</span>
  </div>
  <div class="news-item" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.05.27</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[ICML]</b> One paper accepted to the ICML CoLoRAI Workshop.</span>
  </div>
  <div class="news-item" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.02.21</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[CVPR]</b> Three papers accepted to CVPR and CVPR Findings.</span>
  </div>
</div>
-->

<h2 id="publications">Selected Publications</h2>

<div id="pub-container">
<div class="paper-box" data-sort="99999" id="paper-irismix">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="irismix-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="IrisMix on one face: eyes, lips and blush are picked from different reference looks and put on her photo part by part; her look splits into a bare face and one layer per part; lip shades and finishes change on the lip layer, and a face-paint design is dragged and scaled before rendering">
<source src="images/web/irismix-home.mp4?v=2" type="video/mp4"/>
<a href="images/web/irismix-teaser.mp4?v=3">View the IrisMix video</a>
</video>
<picture><source srcset="images/web/irismix-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/irismix-home.webp?v=2" width="854" height="480" alt="" decoding="async" fetchpriority="high"/></picture>
</div>
<script>/* top preview: start the lite file buffering while the page is still parsing; same rules as previews.js, which later upgrades it to the full file on fast links */(function(v,c){var r=matchMedia('(prefers-reduced-motion: reduce)').matches,m=c.saveData||/2g$/.test(c.effectiveType||'');if(!r||m||/^3g$/.test(c.effectiveType||'')||(c.downlink>0&&c.downlink<3))v.src=v.querySelector('source').getAttribute('src').replace(/\.mp4(?=\?|$)/,'-lite.mp4');if(m||r)return;v.preload='auto';v.load()})(document.getElementById('irismix-home-preview'),navigator.connection||{})</script>
</div>
<div class="paper-box-text">
<div class="paper-venue">Preprint</div>
<h4>IrisMix: Compositional Makeup Transfer with Layered Diffusion Transformers</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, <a href="https://mingching.github.io/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>
<p class="paper-summary">Lets a user compose a makeup look from parts of different references, such as the eyes of one photo, the lips of another and the face paint of a third, and apply it to their own photo while keeping their identity and background. Each reference is split once into a bare face and an explicit makeup layer, so strength, color, lip finish, blending between looks and the placement of a design can all be adjusted directly on the layer before it is rendered onto the face.</p>
<div class="links">
<a href="images/web/irismix-teaser.mp4?v=3" rel="noopener" target="_blank">Video</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-spectral-world-renderer">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="swr-home-preview" width="854" height="560" muted loop playsinline preload="none" aria-label="Material queries in four worlds, each in its own colour: in Market, terracotta by name, wood by a click in shadow and stone or travertine; in Karst, limestone by a click in shadow and water; in City, a living-leaf reference spectrum and terracotta; in Botanical, a near-infrared index and wood">
<source src="images/web/swr-query-preview.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/Spectral-World-Renderer/">View Spectral World Renderer</a>
</video>
<picture><source srcset="images/web/swr-query-preview.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/swr-query-preview.webp?v=2" width="854" height="560" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text">
<div class="paper-venue">Preprint</div>
<h4>Spectral World Renderer: Unified 3D Hyperspectral Unmixing</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Yu-Jou Hsiao, <a href="https://mingching.github.io/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>
<p class="paper-summary">Reveals what a 3D scene is made of, not just how it looks, to support tasks such as inspecting wafers and thin films in semiconductor manufacturing, examining building materials and monitoring crop health. It carries classical hyperspectral unmixing efficiently into 3D, so every part of a scene can be queried for its materials by name, by a click on the image or by a reference spectrum within milliseconds, and generated worlds with known material composition make the results verifiable.</p>
<div class="links">
<a href="https://arxiv.org/pdf/2610.19520" rel="noopener" target="_blank">Paper</a>
<a href="https://arxiv.org/abs/2610.19520" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/Spectral-World-Renderer" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/Spectral-World-Renderer/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/3FrSH7MaSjU" rel="noopener" target="_blank">Video</a>
<a href="https://huggingface.co/datasets/ming0531/SWR-Bench" rel="noopener" target="_blank">Dataset</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-doctor-trigger">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="doctor-trigger-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="Doctor Trigger: face images are swapped and reposted online; a private record verifies which copies are the ones actually posted">
<source src="images/web/doctor-trigger-home.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/Doctor-Trigger/">View the Doctor Trigger project page</a>
</video>
<picture><source srcset="images/web/doctor-trigger-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/doctor-trigger-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text">
<div class="paper-venue">Preprint</div>
<h4>Doctor Trigger: A Framework for Release-Bound Face Verification</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Chia-Yu Lin, Hung-Kai Huang, Yi-Ting Ku, Yu-Chen Liang, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>

<p class="paper-summary">People often know when their face has been swapped into an image, yet they have no objective evidence that fact-checkers or investigators can act on. Doctor Trigger binds each face image to its original release, so a circulating copy can be checked against what was actually published, supporting digital governance and giving users and investigators verifiable evidence.</p>
<div class="links">
<a href="https://arxiv.org/pdf/2610.16336v2" rel="noopener" target="_blank">Paper</a>
<a href="https://arxiv.org/abs/2610.16336v2" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/Doctor-Trigger" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/Doctor-Trigger/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/qtT09O2Ib1U" rel="noopener" target="_blank">Video</a>
<a href="https://youtu.be/F8ZLMuwN4hc" rel="noopener" target="_blank">Video (中文)</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-flashfocus">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="flashrefocus-home-preview" width="854" height="570" muted loop playsinline preload="none" aria-label="FlashReFocus montage: a defocused photo is restored once, then the focus is pulled from near to far, the aperture opens on a portrait, a tilt-shift band sweeps over a tulip field, and two focal planes keep a face and a shark sharp">
<source src="images/web/flashrefocus-preview.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/FlashReFocus/">View FlashReFocus</a>
</video>
<picture><source srcset="images/web/flashrefocus-preview.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/flashrefocus-preview.webp?v=2" width="854" height="570" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text">
<div class="paper-venue">Preprint</div>
<h4>FlashReFocus: Interactive Image Refocusing in Seconds</h4>
<p class="paper-authors">Ching-Heng Cheng*, <strong>Chia-Ming Lee*</strong>, <a href="https://mingching.github.io/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>
<p class="paper-note">* Equal contribution.</p>

<p class="paper-summary">Enables interactive refocusing of a single photograph, allowing users to explore focal points, aperture settings, and depth-of-field effects with responsive visual feedback. After a one-time restoration step, a lightweight renderer updates each focal edit in about half a second, making it practical to compare and refine the desired look.</p>
<div class="links">
<a href="https://arxiv.org/pdf/2610.23297" rel="noopener" target="_blank">Paper</a>
<a href="https://arxiv.org/abs/2610.23297" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/FlashReFocus" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/FlashReFocus/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/g032M7moWQ4" rel="noopener" target="_blank">Video</a>
<a href="https://huggingface.co/spaces/ming0531/FlashReFocus" rel="noopener" target="_blank">Demo</a>
<a href="https://huggingface.co/datasets/ming0531/3CReal" rel="noopener" target="_blank">Dataset</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="20266" id="paper-replaymark">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="replaymark-home-preview" width="854" height="526" muted loop playsinline preload="none" aria-label="Two-scene illustration: hash-based word lists versus keyed model-response groups, explaining why carpet is red in one example and green in the other, followed by icon diagrams comparing generation and verification.">
<source src="images/web/replaymark-home-paradigms.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/ReplayMark/">View the ReplayMark project page</a>
</video>
<picture><img class="pv-poster" src="images/web/replaymark-home-paradigms.webp?v=2" width="854" height="526" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text">
<div class="paper-venue">NeurIPS 2026 FLMSec Workshop</div><div class="paper-venue" style="margin-left: 6px;">★ Distinguished Paper Award</div>
<h4>ReplayMark: Probe-and-Replay Model-Response Watermarking for Diffusion Language Models</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Wen-Hsin Tsai, Tung Yuk Ying, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>
<p class="paper-summary">How can we verify where AI-generated text came from when a model writes tokens in parallel? ReplayMark embeds a watermark in how a diffusion language model responds to re-masked context, while preserving its decoding schedule. A verifier replays the same checkpoint on the finished text and checks whether its responses agree with a secret key, providing exact false-positive control without calibration.</p>
<div class="links">
<a href="https://openreview.net/pdf?id=fmXX4kVZ30" rel="noopener" target="_blank">Paper</a>
<a href="https://openreview.net/forum?id=fmXX4kVZ30" rel="noopener" target="_blank">OpenReview</a>
<a href="https://github.com/ming053l/ReplayMark" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/ReplayMark/" rel="noopener" target="_blank">Project Page</a>
<a href="https://ming053l.github.io/images/web/replaymark-home-paradigms.mp4" rel="noopener" target="_blank">Video</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-c4">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="c4-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="C4 versus full decoding on the same GSM8K prompt with LLaDA-8B, replayed from recorded runs: C4 reaches the answer 288 at step 50 in 7.2 seconds, full decoding needs all 256 steps and 37.6 seconds; replayed at 4x speed">
<source src="images/web/c4-home.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/c4-dllm.github.io/">View the C4 project page</a>
</video>
<picture><source srcset="images/web/c4-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/c4-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text">
<div class="paper-venue">Preprint</div>
<h4>C⁴: Commit Locally, Exit Globally — Coordinating Adaptive Sampling and Early Exit in Diffusion Language Models</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Shao-Kai Liu, <a href="https://mingching.github.io/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>

<p class="paper-summary">Diffusion language models write a whole draft at once, then keep revising it for a fixed number of rounds, often long after the answer has settled. C⁴ adds two simple rules: lock in the words the model is already sure about, and stop once the answer is confident and no longer changing. No retraining, one setting for every task: 2.6–18.6× faster on 12 benchmarks with LLaDA and Dream, never losing more than 2 points of accuracy.</p>
<div class="links">
<a href="https://github.com/ming053l/C4-dLLM/blob/main/paper/C4_preprint.pdf" rel="noopener" target="_blank">Paper</a>
<a href="https://arxiv.org/abs/2607.28166" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/C4-dLLM" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/c4-dllm.github.io/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/R1kKAmhyGPQ" rel="noopener" target="_blank">Video</a>
</div>
</div>
</div>
<div class="paper-box" data-sort="99999" id="paper-elsa-journal">
<div class="paper-box-image">
<div class="pv" data-pv>
<video id="elsa-v2-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="ELSA v2 compared with v1: v1 computes exact softmax attention as a parallel scan over the state (m, S, W); v2 adds a two-phase fixed-order merge, precision routes, an analytic backward pass, carried statistics and CUDA/ROCm validation. Shown: 32 partitions summarised at once and folded in a fixed order; at 65K tokens on A100 the fp16x3 route takes 632 ms versus 979 ms for memory-efficient SDPA; carrying the second moment uses 120 MiB instead of 8,288 MiB; 130 configurations give identical bits over 100 runs">
<source src="images/web/elsa-v2-home.mp4?v=2" type="video/mp4"/>
<a href="images/elsa-journal-preview.png">View the ELSA journal overview</a>
</video>
<picture><source srcset="images/web/elsa-v2-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/elsa-v2-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text">
<div class="paper-venue">Journal Manuscript</div>
<h4>ELSA: Two-Phase Standard-Softmax Scan Attention with Path-Specific Precision and Carried Statistics</h4>
<p class="paper-authors"><a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, Xin-Di Ma, <strong>Chia-Ming Lee</strong>, Po-Jen Pan, Wo-Ting Liao</p>
<p class="paper-summary">Extends ELSA into a two-phase attention framework with path-specific precision, analytic gradients for the standard output, and attention-weighted statistics computed without a second score pass. Independent partition summaries and fixed-order merging support memory-efficient execution, with numerical accuracy and repeatability evaluated across multiple hardware platforms.</p>
</div>
</div>
<div class="paper-box" data-sort="20266">
<div class="paper-box-image">

<div class="pv" data-pv>
<video id="phasr-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="PhaSR removes shadows from real photos: a shadow on grass is erased by a sweeping band of light; a brick wall, cans on striped cloth, an indoor bedroom and grass are restored the same way; a histogram of the brick photo shows the shadow pixels moving to match the lit ones once the lighting is corrected.">
<source src="images/web/phasr-home.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/PhaSR_github/">View the project page</a>
</video>
<picture><source srcset="images/web/phasr-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/phasr-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR 2026</div>
<h4>PhaSR: Generalized Image Shadow Removal with Physically Aligned Priors
      </h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" rel="noopener" target="_blank">Yu-Fan Lin</a>, Yu-Jou Hsiao, Jin-Hui Jiang, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>

<p class="paper-summary">Shadows are easily mistaken for dark materials, and most shadow-removal methods break down indoors, where light comes from many directions at once. PhaSR first corrects the lighting with a closed-form, physically based normalization, then aligns depth geometry with semantic features so it can tell where a shadow ends and an object begins. It removes hard outdoor shadows and soft indoor ones while keeping the surface texture intact.</p>
<div class="links">
<a href="https://www.arxiv.org/abs/2601.17470" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/PhaSR" rel="noopener" target="_blank">GitHub</a>
<a href="https://youtu.be/I4OTtCleuvE" rel="noopener" target="_blank">Video</a>
<a href="https://ming053l.github.io/PhaSR_github/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="20265">
<div class="paper-box-image">

<div class="pv" data-pv>
<video id="reflexsplit-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="ReflexSplit: a camera shoots through glass that carries a reflection; an AI-generated cafe clip with a reflection of a street added on the glass; the released ReflexSplit model separates every frame into the scene behind the glass and the reflection, shown as two layers moving apart; three real photos through windows are separated the same way.">
<source src="images/web/reflexsplit-home.mp4?v=2" type="video/mp4"/>
<a href="https://wuw2135.github.io/ReflexSplit-ProjectPage/">View the project page</a>
</video>
<picture><source srcset="images/web/reflexsplit-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/reflexsplit-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR 2026</div>
<h4>ReflexSplit: Single Image Reflection Separation via Layer Fusion–Separation
      </h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" rel="noopener" target="_blank">Yu-Fan Lin</a>, Jin-Hui Jiang, Yu-Jou Hsiao, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a></p>

<p class="paper-summary">A photo taken through glass mixes the scene behind it with a reflection, and existing methods often confuse the two where the reflection is strong. ReflexSplit separates the layers by repeatedly fusing the structure they share and then subtracting one stream from the other, coordinated across scales. It recovers both a clean view of the scene and the reflection itself, including on real photos taken through windows.</p>
<div class="links">
<a href="https://www.arxiv.org/abs/2601.17468" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/wuw2135/ReflexSplit" rel="noopener" target="_blank">GitHub</a>
<a href="https://youtu.be/9vquP7T20kY" rel="noopener" target="_blank">Video</a>
<a href="https://wuw2135.github.io/ReflexSplit-ProjectPage/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="20264">
<div class="paper-box-image">

<div class="pv" data-pv>
<video id="elsa-v1-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="ELSA v1: the online recurrence takes one step per token, while ELSA merges the same (m, S, W) states as a tree in 4 levels for 16 tokens and 24 levels at 16K tokens. In FP32 on A100 at 16K tokens ELSA takes 12.06 ms versus 41.77 ms for memory-efficient SDPA, and Math-SDPA runs out of memory. Drop-in results: 1.5 to 1.6 times faster on Jetson TX2, 2.27 times on BERT IMDB, 60 to 62 percent higher throughput on hyperspectral HSIMAE-L, and 1,309 versus 791 images per second for ViT-T against FlashAttention-2">
<source src="images/web/elsa-v1-home.mp4?v=2" type="video/mp4"/>
<a href="https://ming053l.github.io/ELSA_projectpage/">View the ELSA project page</a>
</video>
<picture><source srcset="images/web/elsa-v1-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/elsa-v1-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR Findings 2026</div><div class="paper-venue" style="margin-left: 6px;">★ CVPR 2026 Computational Transparency Award</div>
<h4>ELSA: Exact Linear-Scan Attention for Fast and Memory-Light Vision Transformers
      </h4>
<p class="paper-authors"><a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, Xin-Di Ma, Wo-Ting Liao, <strong>Chia-Ming Lee</strong></p>

<p class="paper-summary">Memory-efficient attention processes tokens one block after another, and the fastest exact kernels rely on Tensor Cores that offer no fast FP32 path. ELSA computes the same softmax attention as a parallel scan: blocks are summarised independently and merged in a logarithmic number of steps. No retraining and no Tensor Cores: up to 3.5× faster than memory-efficient attention in FP32 at 16K tokens, with the same kernel running from A100 GPUs to the Jetson TX2.</p>
<div class="links">
<a href="https://arxiv.org/abs/2604.23798" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/ELSA" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/ELSA_projectpage/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="20263">
<div class="paper-box-image">

<div class="pv" data-pv>
<video id="umcl-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="UMCL: a campus vlog is re-uploaded and compressed; of four reposts, two are deepfakes that detectors miss after compression. UMCL reads the facial pulse, landmark motion and a text prompt from the same video and still tells real from fake after compression. All people shown are AI-generated">
<source src="images/web/umcl-home.mp4?v=2" type="video/mp4"/>
<a href="images/UMCL.png">View the UMCL overview</a>
</video>
<picture><source srcset="images/web/umcl-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/umcl-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text"><div class="paper-venue">IJCV 2026</div>
<h4>UMCL: Unimodal-generated Multimodal Contrastive Learning for Cross-compression-rate Deepfake Detection
      </h4>
<p class="paper-authors">Ching-Yi Lai, Chih-Yu Jian, Pei-Cheng Chuang, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, <a href="https://www.cs.nthu.edu.tw/~cthsu/candy.html" rel="noopener" target="_blank">Chiou-Ting Hsu</a>, <a href="https://www.ee.nthu.edu.tw/cwlin/" rel="noopener" target="_blank">Chia-Wen Lin</a></p>

<p class="paper-summary">Social platforms re-compress every upload, and deepfake detectors trained on clean video lose much of their accuracy on the compressed copies. UMCL needs no extra recordings: from the face video it derives the facial pulse (rPPG) and landmark motion, pairs them with text prompts, and aligns all three so that fakes remain separable after compression and when one signal is unreliable. Trained on uncompressed FaceForensics++ video, it keeps 95.7 AUC at moderate compression, where a standard detector falls to 74.9.</p>
<div class="links">
<a href="https://arxiv.org/abs/2511.18983" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/IlikeBB/Unimodal-generated-Multimodal-Contrastive-Learning-for-Cross-compression-rate-Deepfake-Detection" rel="noopener" target="_blank">GitHub</a>
</div>
</div>
</div><div class="paper-box" data-sort="20262">
<div class="paper-box-image">

<div class="pv" data-pv>
<video id="wwe-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="WWE-UIE on AI-generated underwater footage: a depth gauge shows red, orange, yellow and green fading away; a moving divider compares the raw green-tinted video of a sea turtle with the same frames enhanced by the released WWE-UIE model; a diver scene with its three priors, white balance, wavelets and edges.">
<source src="images/web/wwe-home.mp4?v=2" type="video/mp4"/>
<a href="https://github.com/chingheng0808/WWE-UIE">View the paper</a>
</video>
<picture><source srcset="images/web/wwe-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/wwe-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text"><div class="paper-venue">WACV 2026</div>
<h4>WWE-UIE: A Wavelet &amp; White Balance Efficient Network for Underwater Image Enhancement</h4>
<p class="paper-authors">Ching-Heng Cheng, Jen-Wei Lee, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/">Chih-Chung Hsu</a></p>

<p class="paper-summary">Water absorbs red light first, leaving underwater photos hazy and blue-green, and the strongest enhancement networks are too heavy for real-time use. WWE-UIE builds three simple priors into a compact network: adaptive white balance to restore the missing reds, wavelet decomposition to recover both overall structure and fine texture, and an edge-aware module to keep outlines sharp. It restores natural color with a fraction of the computation, fast enough for real-time use on limited hardware.</p>
<div class="links">
<a href="https://arxiv.org/abs/2511.16321" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/chingheng0808/WWE-UIE" rel="noopener" target="_blank">GitHub</a>
</div>
</div>
</div><div class="paper-box" data-sort="20261">
<div class="paper-box-image">

<div class="pv" data-pv>
<video id="prompthsi-home-preview" width="854" height="480" muted loop playsinline preload="none" aria-label="PromptHSI: an AI-generated satellite scans the Earth; a real hyperspectral cube stacks up band by band with pixel spectra from visible to shortwave infrared; clouds, noise, missing bands and low resolution damage it, and no clean copy of the same moment exists; damage is simulated with the authors' code, each with a written description; the released PromptHSI model restores three damaged scenes following those descriptions.">
<source src="images/web/prompthsi-home.mp4?v=2" type="video/mp4"/>
<a href="https://github.com/chingheng0808/PromptHSI">View the paper</a>
</video>
<picture><source srcset="images/web/prompthsi-home.avif?v=2" type="image/avif"/><img class="pv-poster" src="images/web/prompthsi-home.webp?v=2" width="854" height="480" alt="" decoding="async" loading="lazy"/></picture>
</div>
</div>
<div class="paper-box-text"><div class="paper-venue">TGRS 2026</div>
<h4>PromptHSI: Universal Hyperspectral Image Restoration with Vision-Language Modulated Frequency Adaptation</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Ching-Heng Cheng, <a href="https://vanlinlin.github.io/" rel="noopener" target="_blank">Yu-Fan Lin</a>, Yi-Ching Cheng, Wo-Ting Liao, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, <a href="https://fuenyang1127.github.io/" rel="noopener" target="_blank">Fu-En Yang</a>, <a href="https://vllab.ee.ntu.edu.tw/ycwang.html" rel="noopener" target="_blank">Yu-Chiang Frank Wang</a></p>

<p class="paper-summary">Hyperspectral images from satellites and aircraft often arrive with several kinds of damage at once, such as thin cloud, noise, blur and missing bands, while restoration models are usually built for one kind at a time. PromptHSI is a single all-in-one model guided by a short text description of the damage: a vision-language model turns the description into controls that adjust frequency-aware features. One model handles many combinations of damage, and changing the description changes what it repairs.</p>
<div class="links">
<a href="https://arxiv.org/abs/2411.15922" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/chingheng0808/PromptHSI" rel="noopener" target="_blank">GitHub</a>
<a href="https://drive.google.com/drive/folders/1O0GDzoPt3AVD4mjXeu3R_lxyuTDEWWW1" rel="noopener" target="_blank">Dataset</a>
</div>
</div>
</div></div>

<a class="back-to-top" href="#about-me" aria-label="Back to top">↑</a>

<script src="{{ '/assets/js/previews.js' | relative_url }}?v=3" defer></script>
