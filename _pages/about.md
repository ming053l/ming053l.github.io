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

<div class="profile-actions">
<a href="https://drive.google.com/file/d/1eScbrrYYBnmpGsqvjF-DXRo07L2i7evm/view?usp=sharing"
   style="color:#0B3C8A;"
   target="_blank" rel="noopener">Curriculum vitae ↗</a>
<span>Updated Jan 17, 2026</span>
</div>

In my free time, I enjoy traveling ✈️, capturing moments through photography 📸, and making desserts 🍰.

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

<h2 id="publications">Selected Publications</h2>

<p>My research goal is to advance <strong>Reliable and Efficient Multimodal Intelligence</strong>, developing systems that integrate complementary information to build a faithful understanding of the world from imperfect observations. Building on my work in visual reconstruction and computational photography, I aim to extend this perspective across modalities: recovering missing information, assessing whether the resulting representations can be trusted, and making that process computationally practical. These challenges connect <strong>perception, trust, and efficiency</strong> within a common goal—to develop intelligent systems that remain useful and dependable when information is incomplete and computational resources are limited. Full list of publications <a href="https://scholar.google.com/citations?user=koBVaaUAAAAJ" target="_blank" rel="noopener">here</a>.</p>

<div id="pub-container">
<div class="paper-box" data-sort="99999" id="paper-spectral-world-renderer">
<div class="paper-box-image">
<video id="swr-home-preview" width="640" height="400" muted loop playsinline controls preload="none" poster="images/swr-material-preview.webp" aria-label="RGB and all-material mixture comparison across NVIDIA HQ, Forbidden City, Karst valley and Song study">
<source src="images/swr-material-preview.mp4" type="video/mp4"/>
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
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Yu-Jou Hsiao, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>
<p class="paper-summary">Creates eight verifiable hyperspectral worlds with aligned material labels and subpixel proportions. Abundance-GS learns a compact Gaussian representation for efficient spectral rendering and material decomposition, enabling joint evaluation of reconstruction fidelity and material identification.</p>
<div class="links">
<a href="https://github.com/ming053l/Spectral-World-Renderer" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/Spectral-World-Renderer/" rel="noopener" target="_blank">Project Page</a>
<a href="https://ming053l.github.io/Spectral-World-Renderer/assets/supplementary.pdf" rel="noopener" target="_blank">Supplement</a>
<a href="https://ming053l.github.io/Spectral-World-Renderer/#demo" rel="noopener" target="_blank">Videos</a>
</div>
</div>
</div>

<div class="paper-box" data-sort="99999" id="paper-elsa-journal">
<div class="paper-box-image">
<a href="images/elsa-journal-preview.png" target="_blank" rel="noopener" aria-label="View full-size ELSA journal overview">
<img src="images/elsa-journal-preview.png" alt="ELSA two-phase attention: independent partition summaries followed by fixed-order flat or hybrid reductions" loading="lazy" decoding="async"/>
</a>
</div>
<div class="paper-box-text">
<div class="paper-venue">Journal Manuscript</div>
<h4>ELSA: Two-Phase Standard-Softmax Scan Attention with Path-Specific Precision and Carried Statistics</h4>
<p class="paper-authors">Chih-Chung Hsu, Xin-Di Ma, <strong>Chia-Ming Lee</strong>, Po-Jen Pan, Wo-Ting Liao</p>
<p class="paper-summary">Extends ELSA into a two-phase attention framework with path-specific precision, analytic gradients for the standard output, and attention-weighted statistics computed without a second score pass. Independent partition summaries and fixed-order merging support memory-efficient execution, with numerical accuracy and repeatability evaluated across multiple hardware platforms.</p>
</div>
</div>
<div class="paper-box" data-sort="99999" id="paper-doctor-trigger">
<div class="paper-box-image">
<a aria-label="View full-size doctor-trigger figure" href="images/doctor-trigger-preview.png" rel="noopener" target="_blank">
<img alt="Doctor Trigger release verification and review framework" decoding="async" loading="lazy" src="images/doctor-trigger-preview.png"/>
</a>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>Doctor Trigger: A Framework for Release-Bound Face Verification</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Chia-Yu Lin, Hung-Kai Huang, Yi-Ting Ku, Yu-Chen Liang, Chih-Chung Hsu</p>

<p class="paper-summary">Verifies circulating face images against private publisher-held release records using spectral agreement and a weak keyed Fourier-phase signal, providing release-specific evidence to flag suspicious copies for review.</p>
<div class="links">
<a href="https://github.com/ming053l/Doctor-Trigger" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/Doctor-Trigger/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="99999" id="paper-flashfocus">
<div class="paper-box-image">
<a aria-label="View full-size flashfocus figure" href="images/flashfocus-preview.png" rel="noopener" target="_blank">
<img alt="FlashReFocus one-step deblurring and interactive bokeh rendering pipeline" decoding="async" loading="lazy" src="images/flashfocus-preview.png"/>
</a>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>FlashReFocus: Interactive Image Refocusing in Seconds</h4>
<p class="paper-authors">Ching-Heng Cheng*, <strong>Chia-Ming Lee*</strong>, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>
<p class="paper-note">* Equal contribution.</p>

<p class="paper-summary">Enables interactive refocusing of a single photograph, allowing users to explore focal points, aperture settings, and depth-of-field effects with responsive visual feedback. After a one-time restoration step, a lightweight renderer updates each focal edit in about half a second, making it practical to compare and refine the desired look.</p>
<div class="links">
<a href="https://github.com/ming053l/FlashReFocus" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/FlashReFocus/" rel="noopener" target="_blank">Project Page</a>
<a href="https://huggingface.co/ming0531/FlashReFocus" rel="noopener" target="_blank">Hugging Face</a>
</div>
</div>
</div><div class="paper-box" data-sort="99999" id="paper-c4">
<div class="paper-box-image">
<a aria-label="View full-size c4 figure" href="images/c4-preview.png" rel="noopener" target="_blank">
<img alt="C4 local token commitment and confidence-verified early exit" decoding="async" loading="lazy" src="images/c4-preview.png"/>
</a>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>C⁴: Commit Locally, Exit Globally — Coordinating Adaptive Sampling and Early Exit in Diffusion Language Models</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Shao-Kai Liu, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>

<p class="paper-summary">Introduces C⁴, a training-free framework combining local token commitment with confidence-verified global early exit to reduce diffusion language model decoding steps while largely preserving task performance.</p>
<div class="links">
<a href="https://github.com/ming053l/C4-dLLM" rel="noopener" target="_blank">GitHub</a>
<a href="https://c4-dllm.github.io/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="99999" id="paper-decobias">
<div class="paper-box-image">
<a aria-label="View full-size decobias figure" href="images/decobias-preview.png" rel="noopener" target="_blank">
<img alt="DecoBias super-resolution transformer and decomposed spatial bias architecture" decoding="async" loading="lazy" src="images/decobias-preview.png"/>
</a>
</div>
<div class="paper-box-text">
<div class="paper-venue">Manuscript</div>
<h4>DecoBias: Decomposing Neural Spatial Bias for Scalable Super-Resolution Transformers</h4>
<p class="paper-authors"><strong>Chia-Ming Lee</strong>, Yu-Fan Lin, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>

<p class="paper-summary">Decomposes spatial bias into geometry, locality, and topology, representing each outside additive attention-score space. Enables a standard fused-attention call for scalable super-resolution transformers while preserving shifted-window connectivity.</p>
</div>
</div><div class="paper-box" data-sort="20266">
<div class="paper-box-image">

<video controls="" loop="" muted="" playsinline="" preload="metadata">
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

<video controls="" loop="" muted="" playsinline="" preload="metadata">
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

<a aria-label="View full-size ELSA scan comparison" href="images/elsa-scan-preview.png" rel="noopener" target="_blank">
<img alt="Sequential scan with linear depth versus ELSA two-level prefix scan with logarithmic depth" decoding="async" loading="lazy" src="images/elsa-scan-preview.png"/>
</a>
</div>
<div class="paper-box-text"><div class="paper-venue">CVPR Findings 2026</div>
<h4>ELSA: Exact Linear-Scan Attention for Fast and Memory-Light Vision Transformers
      </h4>
<p class="paper-authors"><a href="https://cchsu.info/" rel="noopener" target="_blank">Chih-Chung Hsu</a>, Xin-Di Ma, Wo-Ting Liao, <strong>Chia-Ming Lee</strong></p>

<p class="paper-summary">Speeds up vision transformers by replacing the standard quadratic attention with a hardware-friendly linear scan, achieving the same exact results at a fraction of the memory and compute cost — with no approximation involved.</p>
<div class="links">
<a href="https://arxiv.org/abs/2604.23798" rel="noopener" target="_blank">arXiv</a>
<a href="https://github.com/ming053l/ELSA" rel="noopener" target="_blank">GitHub</a>
<a href="https://ming053l.github.io/ELSA_projectpage/" rel="noopener" target="_blank">Project Page</a>
</div>
</div>
</div><div class="paper-box" data-sort="20263">
<div class="paper-box-image">

<a href="images/UMCL.png" rel="noopener" target="_blank"><img alt="UMCL: Unimodal-generated Multimodal Contrastive Learning for Cross-compression-rate Deepfake Detection — overview" decoding="async" loading="lazy" src="images/UMCL.png"/></a>
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

<a href="images/PromptHSI.png" rel="noopener" target="_blank"><img alt="PromptHSI: Universal Hyperspectral Image Restoration with Vision-Language Modulated Frequency Adaptation — overview" decoding="async" loading="lazy" src="images/PromptHSI.png"/></a>
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
