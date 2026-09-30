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


<span class='anchor' id='about-me'></span>

# 🧍‍♂️ Biography

I received my B.S. degree in 2023 from the Department of Statistics and Information Science at Fu Jen Catholic University (FJCU), Taiwan, where I was advised by Prof. Hao-Chiang Shao. I completed my M.S. degree in 2025 at National Cheng Kung University (NCKU), where I conducted research at the <a href="https://sites.google.com/view/acvlab/" style="color:#0B3C8A;">Advanced Computer Vision Laboratory (ACVLAB)</a> under the mentorship of Prof. <a href="https://cchsu.info/" style="color:#0B3C8A;">Chih-Chung Hsu</a> and the Computational Photography Laboratory (CPLAB) at National Yang Ming Chiao Tung University (NYCU), working with Prof. <a href="https://yulunalexliu.github.io/" style="color:#0B3C8A;">Yu-Lun Liu</a>. I will be pursuing my Ph.D. at the University at Albany, State University of New York (SUNY Albany), where I will conduct research at the Computer Vision and Machine Learning Laboratory (CVML LAB) under the co-supervision of Prof. <a href="https://www.albany.edu/faculty/mchang2/" style="color:#0B3C8A;">Ming-Ching Chang</a> and Prof. <a href="https://scholar.google.com/citations?user=gMBvzGoAAAAJ&hl=en" style="color:#0B3C8A;">Xin Li</a>.

Find my resume 
<a href="https://drive.google.com/file/d/1eScbrrYYBnmpGsqvjF-DXRo07L2i7evm/view?usp=sharing" 
   style="color:#0B3C8A;" 
   target="_blank">here</a> 
(last updated Jan 17, 2026).


My research interests include, but are not limited to, 
<span style="color:#0B5D1E"><b>Low-level Vision Problems</b></span>, 
<span style="color:#0B5D1E"><b>Computational Photography</b></span>, 
<span style="color:#0B5D1E"><b>Hyperspectral Image Processing</b></span>, 
<span style="color:#0B5D1E"><b>Multimedia Analysis and Security</b></span>, 
<span style="color:#0B5D1E"><b>Efficient AI and Model Acceleration</b></span>, and 
<span style="color:#0B5D1E"><b>Flow Matching</b></span>. 

I am always open to research collaborations. If you are interested in working together or simply want to exchange ideas, please feel free to reach out to me via <a href="mailto:zuw408421476@gmail.com" style="color:#0B3C8A;">email</a>.

In my free time, I enjoy traveling ✈️, capturing moments through photography 📸, and making desserts 🍰.

# 📢 News & Achievements

<div class="news-buttons" style="margin-bottom: 25px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
  <span style="font-weight: bold;">Filter:</span>
  <button onclick="filterNews('all', event)" style="background: #333; color: white; border: none; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em;">Show All</button>
  <button onclick="filterNews('award', event)" style="background: #f1f1f1; border: 1px solid #ddd; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">🏆 Awards</button>
  <button onclick="filterNews('paper', event)" style="background: #f1f1f1; border: 1px solid #ddd; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">📝 Publications</button>
  <button onclick="filterNews('challenge', event)" style="background: #f1f1f1; border: 1px solid #ddd; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">🚀 Challenges</button>
</div>


<div id="news-timeline" style="padding: 10px 5px; border-left: 2px solid #eee; margin-left: 10px;">

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.07.15</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Runner-up]</b> 2nd place in ECCV 2026, EBMV Event-guided Segmentation Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.07.15</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Runner-up]</b> 2nd place in ECCV 2026, EBMV Event-guided Brightness Adjustment Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.07.01</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[4th Place]</b> 4th place in IJCAI 2026, DDL2.0 Deepfake Localization Challenge.</span>
  </div>

  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.06.08</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[CVPR]</b> Our ELSA received the CVPR 2026 Computational Transparency Award Champion!!</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.05.27</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[ICML]</b> One paper accepted by ICML CoLoRAI Workshop.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.04.30</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[ICIP]</b> One paper accepted by ICIP.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.04.28</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[JSTARS]</b> One paper accepted by JSTARS.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.03.24</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[CVPRW]</b> Two paper accepted by CVPR Workshops (CV4Edu and NTIRE).</span>
  </div>
  
  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.03.21</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Top 1%]</b> Top 1% (5/258) performance in CVPR 2026, NTIRE Bokeh Rendering Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.03.20</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Top 1%]</b> Top 1% (5/569) performance in CVPR 2026, NTIRE Image Super-resolution Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.03.19</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Top 1%]</b> Top 1% (6/5268) performance in CVPR 2026, NTIRE Robust Deepfake Detection Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.03.18</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[3rd Place]</b> 3rd in CVPR 2026, NTIRE Ambient Lighening Normalization Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.03.14</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Top 2%]</b> Top 2% performance in CVPR 2026, PBVS Mars Landslide Segmentation Challenge.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.02.21</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[CVPR]</b> Three paper accepted by CVPR and CVPR Findings.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.01.29</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[TGRS]</b> One paper accepted by TGRS.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.01.18</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[ICASSP]</b> Two papers accepted by ICASSP 2026.</span>
  </div>
  
  <div class="news-item general" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.12.23</span>
    <span style="margin-left: 15px;">🪖 Started military service.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.12.17</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Winner]</b> 1st performance in WACV 2026, SkiTB Visual Tracking Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.12.03</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[3rd Place]</b> 3rd performance in ICASSP 2026, Hyper-Object Challenge (Spectral Reconstruction & Super-Resolution).</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.11.24</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[Top 2%]</b> Top 2% performance in BMVC 2025, Data-Centric Land Cover Classification Challenge.</span>
  </div>
  
  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.11.17</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[IJCV]</b> One paper accepted by IJCV.</span>
  </div>

  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.11.14</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[WACV]</b> One paper accepted by WACV 2026.</span>
  </div>

  <div class="news-item award" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.10.23</span>
    <span style="margin-left: 15px;"><b style="color: #d4af37;">[Best Thesis]</b> Best Master Thesis Award in IEEE Tainan Section 2025. <a href="https://r10.ieee.org/tainan/blog/2025/10/20/2025-awards-recipients/" target="_blank">Link</a></span>
  </div>

  <div class="news-item award" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.09.19</span>
    <span style="margin-left: 15px;"><b style="color: #d4af37;">[Award]</b> Future Tech Awards (2025 未來科技獎) (Top-3%).</span>
  </div>

  <div class="news-item award" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.08.20</span>
    <span style="margin-left: 15px;"><b style="color: #d4af37;">[Award]</b> Excellent Master Thesis Award (IPPR 2025) & Best Paper Award (CVGIP 2025). <a href="https://ippr.org.tw/wp-content/uploads/2025/08/%E7%AC%AC18%E5%B1%86%E5%8D%9A%E7%A2%A9%E5%A3%AB%E8%AB%96%E6%96%87%E7%8D%8E%E7%8D%B2%E7%8D%8E%E5%90%8D%E5%96%AE.pdf" target="_blank">Link</a></span>
  </div>

  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.07.24</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[ICCVW]</b> One paper accepted by ICCVW 2025.</span>
  </div>

  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.07.19</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[ACMMM]</b> Three papers accepted by ACMMM 2025.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.07.15</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Winner]</b> 1st performance in ACMMM 2025, SoccerTrack Challenge@MMSports.</span>
  </div>

  <div class="news-item general" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.07.07</span>
    <span style="margin-left: 15px;">🎉 Successfully defended Master's Thesis in NCKU!</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.07.06</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Winner]</b> 1st performance in ICCV 2025, Multi-source COV19 Detection Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.06.18</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[Top 2%]</b> Top 2% ranking in ACMMM 2025, Social Media Popularity Prediction Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.05.30</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Winner]</b> 1st performance in ICRA 2025, TreeScope Tree Diameter Estimation Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.03.24</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[3rd Place]</b> 3rd performance in CVPR 2025, NTIRE Workshop, Image Shadow Removal Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.03.24</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[Top 3%]</b> Top 3% ranking in CVPR 2025, NTIRE Workshop, Image Reflection Removal Challenge.</span>
  </div>

  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2025.03.15</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[IGARSS]</b> Four papers accepted by IGARSS 2025.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; padding-left: 0px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2024.12.24</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[Runner-up]</b> Runner-up in WACV 2025, USV-based Embedded Obstacle Segmentation Challenge.</span>
  </div>

  <div class="news-item award" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2024.09.19</span>
    <span style="margin-left: 15px;"><b style="color: #d4af37;">[Award]</b> Future Tech Awards (2024 未來科技獎). <a href="https://www.futuretech.org.tw/futuretech/index.php?action=brands_detail&br_uid=389&web_lang=en-us" target="_blank">Link</a></span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2024.07.01</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Winner]</b> Winner in ICPR 2024, Beyond Visible Spectrum: AI for Agriculture Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2024.05.01</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Award]</b> Top Performance Award in ACMMM 2024, Social Media Popularity Prediction Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2024.03.24</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[3rd Place]</b> 3rd place in CVPRW 2024, COVID-19 Detection Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2024.03.24</span>
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[6th Place]</b> 6th place in CVPRW, NTIRE 2024 Image Super-Resolution (x4).</span>
  </div>

  <div class="news-item award" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2023.11.01</span>
    <span style="margin-left: 15px;"><b style="color: #d4af37;">[Gold Medal]</b> Gold Medal Award (1/150+) in SAS Hackathon.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2023.10.01</span>
    <span style="margin-left: 15px;"><b style="color: #d4af37;">[Jury Prize]</b> Jury Prize (1/176) in ICCV 2023, Visual Inductive Priors Workshop Instance Segmentation Challenge.</span>
  </div>

  <div class="news-item challenge" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2023.06.01</span>
    <span style="margin-left: 15px;"><b style="color: #0B3C8A;">[Winner]</b> Winner in ICASSP 2023, COV19 Detection Challenge.</span>
  </div>

</div>

<script>
(function() {
  const LIMIT = 10;
  let expanded = false;

  function getBtn() { return document.getElementById('news-toggle-btn'); }

  function applyFilter(activeCategory) {
    const timeline = document.getElementById('news-timeline');
    const btn = getBtn();
    if (!timeline || !btn) return;
    const items = Array.from(timeline.querySelectorAll('.news-item'));
    let visible = 0;
    items.forEach(item => {
      const matchesCategory = (activeCategory === 'all' || item.classList.contains(activeCategory));
      if (matchesCategory) {
        item.style.display = (!expanded && visible >= LIMIT) ? 'none' : 'flex';
        visible++;
      } else {
        item.style.display = 'none';
      }
    });
    btn.style.display = visible > LIMIT ? 'inline-block' : 'none';
  }

  window.toggleNews = function() {
    expanded = !expanded;
    const btn = getBtn();
    if (btn) btn.textContent = expanded ? 'Show Less' : 'Show More';
    applyFilter(window._newsCategory || 'all');
  };

  window._newsCategory = 'all';
  window.filterNews = function(cat, e) {
    window._newsCategory = cat;
    const newsBtns = document.querySelectorAll('.news-buttons button');
    newsBtns.forEach(b => { b.style.background = '#f1f1f1'; b.style.color = '#333'; });
    if (e && e.currentTarget) {
      e.currentTarget.style.background = '#333';
      e.currentTarget.style.color = 'white';
    }
    expanded = false;
    const btn = getBtn();
    if (btn) btn.textContent = 'Show More';
    applyFilter(cat);
  };

  document.addEventListener('DOMContentLoaded', function() {
    applyFilter('all');
  });
})();
</script>

<div id="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'})"
  style="display:none; position:fixed; bottom:30px; right:30px; z-index:999;
         background:#333; color:white; border:none; border-radius:50%;
         width:44px; height:44px; font-size:20px; line-height:44px;
         text-align:center; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.3);">↑</div>
<script>
window.addEventListener('scroll', function() {
  document.getElementById('back-to-top').style.display =
    window.scrollY > 400 ? 'block' : 'none';
});
</script>

<div style="text-align: center; margin: 16px 0 32px 0;">
  <button id="news-toggle-btn" onclick="toggleNews()" style="background: #f1f1f1; border: 1px solid #ddd; padding: 5px 20px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">Show More</button>
</div>

# Publications

<div id="pub-container">

  <div class="paper-box" id="paper-doctor-trigger" data-category="security" data-sort="99999"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-text" style="flex: 1; min-width: 0;">
      <div style="margin-bottom: 10px; font-size: 0.85em; font-weight: bold;">Manuscript</div>
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Doctor Trigger: A Framework for Release-Bound Face Verification</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Chia-Yu Lin, Yu-Chen Liang, Hung-Kai Huang, Yi-Ting Ku, Chih-Chung Hsu</p>

      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Verifies circulating face images against private publisher-held release records using spectral agreement and a weak keyed Fourier-phase signal, providing release-specific evidence to flag suspicious copies for review.</p>
    </div>
  </div>

  <div class="paper-box" id="paper-flashfocus" data-category="restoration" data-sort="99999"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-text" style="flex: 1; min-width: 0;">
      <div style="margin-bottom: 10px; font-size: 0.85em; font-weight: bold;">Manuscript</div>
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">FlashFocus: Interactive Image Refocusing in Seconds</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;">Ching-Heng Cheng*, <strong>Chia-Ming Lee*</strong>, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>
      <p style="margin: 0 0 10px 0; font-size: 0.9em;">* Equal contribution.</p>
      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Restores an all-in-focus image once with a single diffusion step, then uses a lightweight depth-guided renderer for interactive focal and aperture edits. Introduces 3CReal, a benchmark of paired photographs from three camera and lens systems.</p>
    </div>
  </div>

  <div class="paper-box" id="paper-c4" data-category="efficient" data-sort="99999"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-text" style="flex: 1; min-width: 0;">
      <div style="margin-bottom: 10px; font-size: 0.85em; font-weight: bold;">Manuscript</div>
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">C⁴: Commit Locally, Exit Globally — Coordinating Adaptive Sampling and Early Exit in Diffusion Language Models</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Shao-Kai Liu, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>

      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Introduces C⁴, a training-free framework combining local token commitment with confidence-verified global early exit to reduce diffusion language model decoding steps while largely preserving task performance.</p>
    </div>
  </div>

  <div class="paper-box" id="paper-decobias" data-category="restoration" data-sort="99999"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-text" style="flex: 1; min-width: 0;">
      <div style="margin-bottom: 10px; font-size: 0.85em; font-weight: bold;">Manuscript</div>
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">DecoBias: Decomposing Neural Spatial Bias for Scalable Super-Resolution Transformers</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Yu-Fan Lin, Ming-Ching Chang, Xin Li, Yu-Lun Liu, Chih-Chung Hsu</p>

      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Decomposes spatial bias into geometry, locality, and topology, representing each outside additive attention-score space. Enables a standard fused-attention call for scalable super-resolution transformers while preserving shifted-window connectivity.</p>
    </div>
  </div>

  <!-- ===================== IMAGE RESTORATION ===================== -->


  <div class="paper-box" data-category="restoration" data-sort="20266"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">CVPR 2026</div>
      <video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause(); this.currentTime=0;"
        style="width:100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius:2px;">
        <source src="images/PhaSR_demo.mp4" type="video/mp4">
      </video>
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">PhaSR: Generalized Image Shadow Removal with Physically Aligned Priors
      </h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, Yu-Jou Hsiao, Jin-Hui Jiang, <a href="https://yulunalexliu.github.io/" target="_blank" style="text-decoration: underline;">Yu-Lun Liu</a>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">About</span>
        <img src="https://img.shields.io/github/stars/ming053l/PhaSR?style=social" alt="Github Stars">
      </div>
      <p style="margin: 0 0 15px 0; color: #555;">Removes shadows from images by incorporating physical light models and geometric priors, enabling robust restoration across diverse real-world scenes and lighting conditions without retraining for each domain.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://www.arxiv.org/abs/2601.17470" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/ming053l/PhaSR" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
        <a href="https://ming053l.github.io/PhaSR_github/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project Page</a>
      </div>
    </div>
  </div>

  <div class="paper-box" data-category="restoration" data-sort="20265"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">CVPR 2026</div>
      <video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause(); this.currentTime=0;"
        style="width:100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius:2px;">
        <source src="images/ReflexSplit_demo.mp4" type="video/mp4">
      </video>
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">ReflexSplit: Single Image Reflection Separation via Layer Fusion–Separation
      </h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, Jin-Hui Jiang, Yu-Jou Hsiao, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <a href="https://yulunalexliu.github.io/" target="_blank" style="text-decoration: underline;">Yu-Lun Liu</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">About</span>
        <img src="https://img.shields.io/github/stars/wuw2135/ReflexSplit?style=social" alt="Github Stars">
      </div>
      <p style="margin: 0 0 15px 0; color: #555;">Separates reflected and transmitted layers in a single photo by alternating between fusing and splitting mixed features, teaching the network to disentangle overlapping visual signals that are hard to distinguish.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://www.arxiv.org/abs/2601.17468" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/wuw2135/ReflexSplit" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
        <a href="https://wuw2135.github.io/ReflexSplit-ProjectPage/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project Page</a>
      </div>
    </div>
  </div>

  <div class="paper-box" data-category="restoration" data-sort="20262"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">WACV 2026</div>
      <img src='images/wweuie.png' loading="lazy" style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">WWE-UIE: A Wavelet &amp; White Balance Efficient Network for Underwater Image Enhancement</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;">Ching-Heng Cheng, Jen-Wei Lee, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">About</span>
        <img src="https://img.shields.io/github/stars/chingheng0808/WWE-UIE?style=social" alt="Github Stars">
      </div>
      <p style="margin: 0 0 15px 0; color: #555;">Enhances murky underwater photos by combining wavelet-based frequency analysis with white balance correction, efficiently restoring natural colors and recovering details lost to water scattering.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2511.16321" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/chingheng0808/WWE-UIE" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>


  <!-- ===================== HSI / REMOTE SENSING ===================== -->

  
  <div class="paper-box" data-category="hsi" data-sort="20261"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">TGRS 2026</div>
      <img src='images/PromptHSI.png' loading="lazy" style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">PromptHSI: Universal Hyperspectral Image Restoration with Vision-Language Modulated Frequency Adaptation</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Ching-Heng Cheng, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, Yi-Ching Cheng, Wo-Ting Liao, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <a href="https://fuenyang1127.github.io/" target="_blank" style="text-decoration: underline;">Fu-En Yang</a>, <a href="https://vllab.ee.ntu.edu.tw/ycwang.html" target="_blank" style="text-decoration: underline;">Yu-Chiang Frank Wang</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">About</span>
        <img src="https://img.shields.io/github/stars/chingheng0808/PromptHSI?style=social" alt="Github Stars">
      </div>
      <p style="margin: 0 0 15px 0; color: #555;">Restores degraded hyperspectral images using text prompts to guide frequency-domain adaptation, allowing a single model to handle multiple types of noise and distortion without task-specific retraining.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2411.15922" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/chingheng0808/PromptHSI" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
        <a href="https://drive.google.com/drive/folders/1O0GDzoPt3AVD4mjXeu3R_lxyuTDEWWW1" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Dataset</a>
      </div>
    </div>
  </div>

  <div class="paper-box" data-category="hsi" data-sort="20260"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ICASSP 2026</div>
      <img src='images/SSCNet.png' loading="lazy" style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">HSSDCT: Factorized Spatial-Spectral Correlation for Hyperspectral Image Fusion</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Yu-How He, <a href="https://vanlinlin.github.io/">Yu-Fan Lin</a>, Jen-Wei Lee, <a href="https://cchsu.info/">Chih-Chung Hsu</a>, <a href="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en">Li-Wei Kang</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Fuses low-resolution hyperspectral and high-resolution RGB images by factorizing spatial and spectral correlations separately, producing sharp, spectrally accurate results with reduced computational cost.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://www.arxiv.org/abs/2602.00490" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/jemmyleee/HSSDCT" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>


  <!-- ===================== EFFICIENT AI ===================== -->

  <div class="paper-box" data-category="efficient" data-sort="20264"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e8dff; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">CVPR Findings 2026</div>
      <video muted loop playsinline onmouseover="this.play()" onmouseout="this.pause(); this.currentTime=0;"
        style="width:100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius:2px;">
        <source src="images/ELSATeaserLight.mp4" type="video/mp4">
      </video>
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">ELSA: Exact Linear-Scan Attention for Fast and Memory-Light Vision Transformers
      </h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, Xin-Di Ma, Wo-Ting Liao, <strong>Chia-Ming Lee</strong></p>
      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Speeds up vision transformers by replacing the standard quadratic attention with a hardware-friendly linear scan, achieving the same exact results at a fraction of the memory and compute cost — with no approximation involved.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ming053l.github.io/ELSA_projectpage/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project Page</a>
        <a href="https://arxiv.org/abs/2604.23798" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/ming053l/ELSA" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>


  <!-- ===================== DEEPFAKE ===================== -->

  <div class="paper-box" data-category="security" data-sort="20263"
       style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class="paper-box-image" style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #6c3483; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">IJCV 2026</div>
      <img src='images/UMCL.png' loading="lazy" style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class="paper-box-text" style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">UMCL: Unimodal-generated Multimodal Contrastive Learning for Cross-compression-rate Deepfake Detection
      </h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;">Ching-Yi Lai, Chih-Yu Jian, Pei-Cheng Chuang, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <a href="https://www.cs.nthu.edu.tw/~cthsu/candy.html" target="_blank" style="text-decoration: underline;">Chiou-Ting Hsu</a>, <a href="https://www.ee.nthu.edu.tw/cwlin/" target="_blank" style="text-decoration: underline;">Chia-Wen Lin</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">About</div>
      <p style="margin: 0 0 15px 0; color: #555;">Detects deepfakes robustly across different video compression levels by synthesizing multimodal training signals from a single modality, using contrastive learning to keep real and fake representations well-separated even when compression artifacts obscure subtle forgery traces.</p>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2511.18983" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/IlikeBB/Unimodal-generated-Multimodal-Contrastive-Learning-for-Cross-compression-rate-Deepfake-Detection" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>


  <!-- ===================== SOCIAL MEDIA ===================== -->


  <!-- ===================== MEDICAL ===================== -->


  <!-- ===================== VISUAL RECOGNITION ===================== -->


  <!-- ===================== DEFECT ===================== -->


</div><!-- end #pub-container -->

<style>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
  .paper-box-text p  { color: #aaa !important; }
  #news-timeline     { border-left-color: #444 !important; }
  #news-timeline span[style*="color: #666"] { color: #888 !important; }
  table              { color: #e8e8e8; }
  table thead tr     { background: #2a2a2a !important; border-bottom-color: #444 !important; }
  table tbody tr[style*="#fafafa"] { background: #1e1e1e !important; }
  table tbody tr     { border-bottom-color: #333 !important; }
  .news-buttons button { background: #2a2a2a !important; color: #ccc !important; border-color: #444 !important; }
}
@media (max-width: 768px) {
  .paper-box {
    flex-direction: column !important;
  }
  .paper-box-image {
    flex: 0 0 100% !important;
    max-width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 15px !important;
  }
  .paper-box-image img,
  .paper-box-image video {
    width: 100% !important;
  }
}
</style>

<script>
(function () {
  const container = document.getElementById('pub-container');

  function sortAllPapers() {
    const cards = Array.from(container.querySelectorAll('.paper-box'));
    cards.sort((a, b) => parseInt(b.dataset.sort) - parseInt(a.dataset.sort));
    cards.forEach(c => container.appendChild(c));
  }

  sortAllPapers();

  // NEW badge: show only if paper published within 90 days
  const today = new Date();
  container.querySelectorAll('.paper-box').forEach(card => {
    const sort = parseInt(card.dataset.sort);
    if (!sort || sort > 9000) return; // skip under-review / submitted
    const year = Math.floor(sort / 100) + 2000 - 2000; // e.g. 20266 -> 2026
    const fullYear = Math.floor(sort / 100);
    // data-sort format: YYYYMM as integer e.g. 202603
    const sortStr = String(sort);
    if (sortStr.length < 5) return;
    const y = parseInt(sortStr.slice(0, 4));
    const m = parseInt(sortStr.slice(4)) - 1;
    const pubDate = new Date(y, m, 1);
    const diffDays = (today - pubDate) / (1000 * 60 * 60 * 24);
    if (diffDays <= 90) {
      const titleEl = card.querySelector('h4');
      if (titleEl) {
        const badge = document.createElement('span');
        badge.textContent = 'NEW';
        badge.style.cssText = 'background-color:orange;color:white;font-size:0.65em;font-weight:bold;animation:blink 1s step-start infinite;margin-left:6px;padding:1px 5px;border-radius:3px;';
        titleEl.appendChild(badge);
      }
    }
  });
})();
</script>
