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

I am an incoming Ph.D. student at the University at Albany, State University of New York (SUNY Albany), where I will conduct research at the Computer Vision and Machine Learning Laboratory (CVML LAB) under the co-supervision of Prof. <a href="https://www.albany.edu/faculty/mchang2/" style="color:#0B3C8A;">Ming-Ching Chang</a> and Prof. <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" style="color:#0B3C8A;">Xin Li</a>.

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
<div class="paper-box" data-sort="99999" id="paper-spectral-world-renderer">
<div class="paper-box-image">
<video id="swr-home-preview" width="640" height="420" muted loop playsinline controls preload="metadata" poster="images/swr-query-preview.webp?v=3" aria-label="Material queries in four worlds, each in its own colour: in Market, terracotta by name, wood by a click in shadow and stone or travertine; in Karst, limestone by a click in shadow and water; in City, a living-leaf reference spectrum and terracotta; in Botanical, a near-infrared index and wood">
<source src="images/swr-query-preview.mp4?v=3" type="video/mp4"/>
<a href="https://ming053l.github.io/Spectral-World-Renderer/">View Spectral World Renderer</a>
</video>
<script>
(function () {
  const video = document.getElementById('swr-home-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;
  let visible = false;
  function updatePlayback() {
    if (visible && !document.hidden && !reducedMotion.matches) {
      video.play().catch(function () {});
    } else { video.pause(); }
  }
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    updatePlayback();
  }, { threshold: 0.25 }).observe(video);
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
})();
</script>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>Spectral World Renderer: Towards Verifiable 3D Hyperspectral Unmixing</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Yu-Jou Hsiao, <a href="https://www.albany.edu/faculty/mchang2/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>
<p class="paper-summary">Reveals what a 3D scene is made of, not just how it looks, to support tasks such as inspecting wafers and thin films in semiconductor manufacturing, examining building materials and monitoring crop health. It carries classical hyperspectral unmixing efficiently into 3D, so every part of a scene can be queried for its materials by name, by a click on the image or by a reference spectrum within milliseconds, and generated worlds with known material composition make the results verifiable.</p>
<div class="links">
<a href="https://github.com/ming053l/Spectral-World-Renderer" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/Spectral-World-Renderer/assets/paper.pdf" rel="noopener" target="_blank">Paper</a>
<a href="https://ming053l.github.io/Spectral-World-Renderer/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/3FrSH7MaSjU" rel="noopener" target="_blank">Video</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-doctor-trigger">
<div class="paper-box-image">
<video id="doctor-trigger-home-preview" width="960" height="540" muted loop playsinline controls preload="metadata" poster="images/doctor-trigger-home.webp" aria-label="Doctor Trigger: face images are swapped and reposted online; a private record verifies which copies are the ones actually posted">
<source src="images/doctor-trigger-home.mp4" type="video/mp4"/>
<a href="https://ming053l.github.io/Doctor-Trigger/">View the Doctor Trigger project page</a>
</video>
<script>
(function () {
  const video = document.getElementById('doctor-trigger-home-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;
  let visible = false;
  function updatePlayback() {
    if (visible && !document.hidden && !reducedMotion.matches) { video.play().catch(function () {}); }
    else { video.pause(); }
  }
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; updatePlayback(); }, { threshold: 0.25 }).observe(video);
  document.addEventListener('visibilitychange', updatePlayback);
})();
</script>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>Doctor Trigger: A Framework for Release-Bound Face Verification</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Chia-Yu Lin, Hung-Kai Huang, Yi-Ting Ku, Yu-Chen Liang, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>

<p class="paper-summary">People often know when their face has been swapped into an image, yet they have no objective evidence that fact-checkers or investigators can act on. Doctor Trigger binds each face image to its original release, so a circulating copy can be checked against what was actually published, supporting digital governance and giving users and investigators verifiable evidence.</p>
<div class="links">
<a href="https://ming053l.github.io/Doctor-Trigger/static/pdf/paper.pdf" rel="noopener" target="_blank">Paper</a>
<a href="https://github.com/ming053l/Doctor-Trigger" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/Doctor-Trigger/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/qtT09O2Ib1U" rel="noopener" target="_blank">Video</a>
<a href="https://youtu.be/F8ZLMuwN4hc" rel="noopener" target="_blank">Video (中文)</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-flashfocus">
<div class="paper-box-image">
<video id="flashrefocus-home-preview" width="960" height="640" muted loop playsinline controls preload="metadata" poster="images/flashrefocus-preview.webp" aria-label="FlashReFocus montage: a defocused photo is restored once, then the focus is pulled from near to far, the aperture opens on a portrait, a tilt-shift band sweeps over a tulip field, and two focal planes keep a face and a shark sharp">
<source src="images/flashrefocus-preview.mp4" type="video/mp4"/>
<a href="https://ming053l.github.io/FlashReFocus/">View FlashReFocus</a>
</video>
<script>
(function () {
  const video = document.getElementById('flashrefocus-home-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;
  let visible = false;
  function updatePlayback() {
    if (visible && !document.hidden && !reducedMotion.matches) {
      video.play().catch(function () {});
    } else { video.pause(); }
  }
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    updatePlayback();
  }, { threshold: 0.25 }).observe(video);
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
})();
</script>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>FlashReFocus: Interactive Image Refocusing in Seconds</h4>
<p class="paper-authors">Ching-Heng Cheng*, <strong>Chia-Ming Lee*</strong>, <a href="https://www.albany.edu/faculty/mchang2/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>
<p class="paper-note">* Equal contribution.</p>

<p class="paper-summary">Enables interactive refocusing of a single photograph, allowing users to explore focal points, aperture settings, and depth-of-field effects with responsive visual feedback. After a one-time restoration step, a lightweight renderer updates each focal edit in about half a second, making it practical to compare and refine the desired look.</p>
<div class="links">
<a href="https://ming053l.github.io/FlashReFocus/assets/FlashReFocus.pdf" rel="noopener" target="_blank">Paper</a>
<a href="https://github.com/ming053l/FlashReFocus" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/FlashReFocus/" rel="noopener" target="_blank">Project Page</a>
<a href="https://youtu.be/g032M7moWQ4" rel="noopener" target="_blank">Video</a>
<a href="https://huggingface.co/spaces/ming0531/FlashReFocus" rel="noopener" target="_blank">Demo</a>
<a href="https://huggingface.co/datasets/ming0531/3CReal" rel="noopener" target="_blank">Dataset</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-c4">
<div class="paper-box-image">
<video id="c4-home-preview" width="1280" height="720" muted loop playsinline controls preload="metadata" poster="images/c4-home.webp?v=3" aria-label="C4 versus full decoding on the same GSM8K prompt with LLaDA-8B, replayed from recorded runs: C4 reaches the answer 288 at step 50 in 7.2 seconds, full decoding needs all 256 steps and 37.6 seconds; replayed at 4x speed">
<source src="images/c4-home.mp4?v=3" type="video/mp4"/>
<a href="https://ming053l.github.io/c4-dllm.github.io/">View the C4 project page</a>
</video>
<script>
(function () {
  const video = document.getElementById('c4-home-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;
  let visible = false;
  function updatePlayback() {
    if (visible && !document.hidden && !reducedMotion.matches) { video.play().catch(function () {}); }
    else { video.pause(); }
  }
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; updatePlayback(); }, { threshold: 0.25 }).observe(video);
  document.addEventListener('visibilitychange', updatePlayback);
})();
</script>
</div>
<div class="paper-box-text">
<div class="paper-venue">Preprint</div>
<h4>C⁴: Commit Locally, Exit Globally — Coordinating Adaptive Sampling and Early Exit in Diffusion Language Models</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Shao-Kai Liu, <a href="https://www.albany.edu/faculty/mchang2/" rel="noopener" target="_blank">Ming-Ching Chang</a>, <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" rel="noopener" target="_blank">Xin Li</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>

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
<video id="elsa-v2-home-preview" width="1280" height="720" muted loop playsinline controls preload="metadata" poster="images/elsa-v2-home.webp?v=2" aria-label="ELSA v2 compared with v1: v1 computes exact softmax attention as a parallel scan over the state (m, S, W); v2 adds a two-phase fixed-order merge, precision routes, an analytic backward pass, carried statistics and CUDA/ROCm validation. Shown: 32 partitions summarised at once and folded in a fixed order; at 65K tokens on A100 the fp16x3 route takes 632 ms versus 979 ms for memory-efficient SDPA; carrying the second moment uses 120 MiB instead of 8,288 MiB; 130 configurations give identical bits over 100 runs">
<source src="images/elsa-v2-home.mp4?v=2" type="video/mp4"/>
<a href="images/elsa-journal-preview.png">View the ELSA journal overview</a>
</video>
<script>
(function () {
  const video = document.getElementById('elsa-v2-home-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;
  let visible = false;
  function updatePlayback() {
    if (visible && !document.hidden && !reducedMotion.matches) { video.play().catch(function () {}); }
    else { video.pause(); }
  }
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; updatePlayback(); }, { threshold: 0.25 }).observe(video);
  document.addEventListener('visibilitychange', updatePlayback);
})();
</script>
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

<video width="1280" height="720" controls="" loop="" muted="" playsinline="" preload="none" poster="images/PhaSR_demo.webp">
<source src="images/PhaSR_demo.mp4" type="video/mp4"/>
</video>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR 2026</div>
<h4>PhaSR: Generalized Image Shadow Removal with Physically Aligned Priors
      </h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" rel="noopener" target="_blank">Yu-Fan Lin</a>, Yu-Jou Hsiao, Jin-Hui Jiang, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a></p>

<p class="paper-summary">Removes shadows from images by incorporating physical light models and geometric priors, enabling robust restoration across diverse real-world scenes and lighting conditions without retraining for each domain.</p>
<div class="links">
<a href="https://www.arxiv.org/abs/2601.17470" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/PhaSR" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/PhaSR_github/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="20265">
<div class="paper-box-image">

<video width="960" height="640" controls="" loop="" muted="" playsinline="" preload="none" poster="images/ReflexSplit_demo.webp">
<source src="images/ReflexSplit_demo.mp4" type="video/mp4"/>
</video>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR 2026</div>
<h4>ReflexSplit: Single Image Reflection Separation via Layer Fusion–Separation
      </h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" rel="noopener" target="_blank">Yu-Fan Lin</a>, Jin-Hui Jiang, Yu-Jou Hsiao, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, <a href="https://yulunalexliu.github.io/" rel="noopener" target="_blank">Yu-Lun Liu</a></p>

<p class="paper-summary">Separates reflected and transmitted layers in a single photo by alternating between fusing and splitting mixed features, teaching the network to disentangle overlapping visual signals that are hard to distinguish.</p>
<div class="links">
<a href="https://www.arxiv.org/abs/2601.17468" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/wuw2135/ReflexSplit" rel="noopener" target="_blank">GitHub</a>
<a href="https://wuw2135.github.io/ReflexSplit-ProjectPage/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="20264">
<div class="paper-box-image">

<video id="elsa-v1-home-preview" width="1280" height="720" muted loop playsinline controls preload="metadata" poster="images/elsa-v1-home.webp" aria-label="ELSA v1: the online recurrence takes one step per token, while ELSA merges the same (m, S, W) states as a tree in 4 levels for 16 tokens and 24 levels at 16K tokens. In FP32 on A100 at 16K tokens ELSA takes 12.06 ms versus 41.77 ms for memory-efficient SDPA, and Math-SDPA runs out of memory. Drop-in results: 1.5 to 1.6 times faster on Jetson TX2, 2.27 times on BERT IMDB, 60 to 62 percent higher throughput on hyperspectral HSIMAE-L, and 1,309 versus 791 images per second for ViT-T against FlashAttention-2">
<source src="images/elsa-v1-home.mp4" type="video/mp4"/>
<a href="https://ming053l.github.io/ELSA_projectpage/">View the ELSA project page</a>
</video>
<script>
(function () {
  const video = document.getElementById('elsa-v1-home-preview');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video || !('IntersectionObserver' in window)) return;
  let visible = false;
  function updatePlayback() {
    if (visible && !document.hidden && !reducedMotion.matches) { video.play().catch(function () {}); }
    else { video.pause(); }
  }
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; updatePlayback(); }, { threshold: 0.25 }).observe(video);
  document.addEventListener('visibilitychange', updatePlayback);
})();
</script>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR Findings 2026</div><div class="paper-award">★ CVPR 2026 Computational Transparency Award</div>
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

<a href="images/UMCL.png" rel="noopener" target="_blank"><img alt="UMCL: Unimodal-generated Multimodal Contrastive Learning for Cross-compression-rate Deepfake Detection — overview" decoding="async" loading="lazy" src="images/UMCL.webp" width="920" height="429"/></a>
</div>
<div class="paper-box-text"><div class="paper-venue">IJCV 2026</div>
<h4>UMCL: Unimodal-generated Multimodal Contrastive Learning for Cross-compression-rate Deepfake Detection
      </h4>
<p class="paper-authors">Ching-Yi Lai, Chih-Yu Jian, Pei-Cheng Chuang, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, <a href="https://www.cs.nthu.edu.tw/~cthsu/candy.html" rel="noopener" target="_blank">Chiou-Ting Hsu</a>, <a href="https://www.ee.nthu.edu.tw/cwlin/" rel="noopener" target="_blank">Chia-Wen Lin</a></p>

<p class="paper-summary">Detects deepfakes robustly across different video compression levels by synthesizing multimodal training signals from a single modality, using contrastive learning to keep real and fake representations well-separated even when compression artifacts obscure subtle forgery traces.</p>
<div class="links">
<a href="https://arxiv.org/abs/2511.18983" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/IlikeBB/Unimodal-generated-Multimodal-Contrastive-Learning-for-Cross-compression-rate-Deepfake-Detection" rel="noopener" target="_blank">GitHub</a>
</div>
</div>
</div><div class="paper-box" data-sort="20262">
<div class="paper-box-image">

<a href="images/wweuie.png" rel="noopener" target="_blank"><img alt="WWE-UIE: A Wavelet &amp; White Balance Efficient Network for Underwater Image Enhancement — overview" decoding="async" loading="lazy" src="images/wweuie.png"/></a>
</div>
<div class="paper-box-text"><div class="paper-venue">WACV 2026</div>
<h4>WWE-UIE: A Wavelet &amp; White Balance Efficient Network for Underwater Image Enhancement</h4>
<p class="paper-authors">Ching-Heng Cheng, Jen-Wei Lee, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/">Chih-Chung Hsu</a></p>

<p class="paper-summary">Enhances murky underwater photos by combining wavelet-based frequency analysis with white balance correction, efficiently restoring natural colors and recovering details lost to water scattering.</p>
<div class="links">
<a href="https://arxiv.org/abs/2511.16321" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/chingheng0808/WWE-UIE" rel="noopener" target="_blank">GitHub</a>
</div>
</div>
</div><div class="paper-box" data-sort="20261">
<div class="paper-box-image">

<a href="images/PromptHSI.png" rel="noopener" target="_blank"><img alt="PromptHSI: Universal Hyperspectral Image Restoration with Vision-Language Modulated Frequency Adaptation — overview" decoding="async" loading="lazy" src="images/PromptHSI.webp" width="590" height="357"/></a>
</div>
<div class="paper-box-text"><div class="paper-venue">TGRS 2026</div>
<h4>PromptHSI: Universal Hyperspectral Image Restoration with Vision-Language Modulated Frequency Adaptation</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Ching-Heng Cheng, <a href="https://vanlinlin.github.io/" rel="noopener" target="_blank">Yu-Fan Lin</a>, Yi-Ching Cheng, Wo-Ting Liao, <a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, <a href="https://fuenyang1127.github.io/" rel="noopener" target="_blank">Fu-En Yang</a>, <a href="https://vllab.ee.ntu.edu.tw/ycwang.html" rel="noopener" target="_blank">Yu-Chiang Frank Wang</a></p>

<p class="paper-summary">Restores degraded hyperspectral images using text prompts to guide frequency-domain adaptation, allowing a single model to handle multiple types of noise and distortion without task-specific retraining.</p>
<div class="links">
<a href="https://arxiv.org/abs/2411.15922" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/chingheng0808/PromptHSI" rel="noopener" target="_blank">GitHub</a>
<a href="https://drive.google.com/drive/folders/1O0GDzoPt3AVD4mjXeu3R_lxyuTDEWWW1" rel="noopener" target="_blank">Dataset</a>
</div>
</div>
</div></div>

<a class="back-to-top" href="#about-me" aria-label="Back to top">↑</a>
