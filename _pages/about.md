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

I received my B.S. degree in 2023 from the Department of Statistics and Information Science at Fu Jen Catholic University (FJCU), Taiwan, where I was advised by Prof. Hao-Chiang Shao. I recently completed my M.S. degree at National Cheng Kung University (NCKU), where I conducted research at the 
<a href="https://sites.google.com/view/acvlab/" style="color:#0B3C8A;">Advanced Computer Vision Laboratory (ACVLAB)</a> 
under the mentorship of Prof. 
<a href="https://cchsu.info/" style="color:#0B3C8A;">Chih-Chung Hsu</a> 
and the Computational Photography Laboratory at National Yang Ming Chiao Tung University (NYCU), working with Prof. 
<a href="https://yulunalexliu.github.io/" style="color:#0B3C8A;">Yu-Lun Liu</a>. 
I will be pursuing my Ph.D. at the University at Albany, State University of New York (SUNY), where I will continue my research collaboration with Prof. 
<a href="https://www.albany.edu/faculty/mchang2/" style="color:#0B3C8A;">Ming-Ching Chang</a>. 
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
<span style="color:#0B5D1E"><b>Medical Image Analysis</b></span>. 

In my free time, I enjoy traveling ✈️, capturing moments through photography 📸, and making desserts 🍰.

# 📢 News & Achievements

<div class="news-buttons" style="margin-bottom: 25px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
  <span style="font-weight: bold;">Filter:</span>
  <button onclick="filterNews('all', event)" style="background: #333; color: white; border: none; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em;">Show All</button>
  <button onclick="filterNews('award', event)" style="background: #f1f1f1; border: 1px solid #ddd; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">🏆 Awards</button>
  <button onclick="filterNews('paper', event)" style="background: #f1f1f1; border: 1px solid #ddd; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">📝 Publications</button>
  <button onclick="filterNews('challenge', event)" style="background: #f1f1f1; border: 1px solid #ddd; padding: 4px 16px; border-radius: 20px; cursor: pointer; font-size: 0.9em; color: #333;">🚀 Challenges</button>
</div>

<div id="news-timeline" style="max-height: 650px; overflow-y: auto; padding: 10px 5px; border-left: 2px solid #eee; margin-left: 10px;">

  <div class="news-item paper" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
    <span style="flex: 0 0 100px; color: #666; font-size: 0.95em; font-family: monospace;">2026.01.18</span>
    <span style="margin-left: 15px;"><b style="color: #27ae60;">[ICASSP]</b> One paper accepted by ICASSP 2026.</span>
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
    <span style="margin-left: 15px;"><b style="color: #7a838b;">[3rd Place]</b> 3rd place in CVPRW 2024,, COVID-19 Detection Challenge.</span>
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

# 📝 Selected Publications 

<div class="category-buttons" style="margin-bottom: 30px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;"> 
  <span style="font-weight: bold;">Filter by Topic:</span> 
  
  <button onclick="filterCategory('all', event)" class="filter-btn active" style="background-color: #333; color: white; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em;">Show All</button> 
  
  <button onclick="filterCategory('restoration', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Image Restoration and Enhancement</button> 
  
  <button onclick="filterCategory('hsi', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Hyperspectral Image Processing, Photogrammetry and Remote Sensing</button> 
  
  <button onclick="filterCategory('efficient', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Efficient AI and Model Acceleration</button> 
  
  <button onclick="filterCategory('security', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Deepfake Video Detection</button> 

  <button onclick="filterCategory('smp', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Social Media Content Analysis</button> 
  
  <button onclick="filterCategory('medical', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Medical Image Analysis</button> 

  <button onclick="filterCategory('recognition', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Visual Recognition, Tracking and Reasoning</button> 
  
  <button onclick="filterCategory('defect', event)" class="filter-btn" style="background-color: #f1f1f1; border: 1px solid #ddd; padding: 2px 12px; border-radius: 5px; cursor: pointer; font-size: 0.9em; color: #333;">Image Defect Detection</button> 
</div>

<div id="section-restoration" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">✨ Image Restoration & Enhancement</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Under Review</div>
      <img src='images/simflowsr.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">SimFlowSR: Self-similarity Aggregation over Consistent Information Flow for Single Image Super-Resolution</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Image Super-resolution (Stronger, faster DRCT)</li>
        <li>Information Bottleneck & Self-similarity Aggregation</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ming053l.github.io/SimFlowSR/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project Page</a>
        <a href="https://github.com/ming053l/SimFlowSR" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>


  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Under Review</div>
      <img src='images/PhaSR.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">PhaSR: Generalized Image Shadow Removal with Physically Aligned Priors</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, Yu-Jou Hsiao, Jing-Hui Jung, <a href="https://yulunalexliu.github.io/" target="_blank" style="text-decoration: underline;">Yu-Lun Liu</a>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Single Image Shadow Removal</li>
        <li>Ambient Light Normalization</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ming053l.github.io/PhaSR/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project Page</a>
      </div>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Under Review</div>
      <img src='images/ReflexSplit.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">ReflexSplit: Single Image Reflection Separation via Layer Fusion–Separation</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, Jing-Hui Jung, Yu-Jou Hsiao, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <a href="https://yulunalexliu.github.io/" target="_blank" style="text-decoration: underline;">Yu-Lun Liu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Single Reflection Removal</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://wuw2135.github.io/ReflexSplit-ProjectPage/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project Page</a>
      </div>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">WACV 2026</div>
      <img src='images/wweuie.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">WWE-UIE: A Wavelet & White Balance Efficient Network for Underwater Image Enhancemen</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;">Ching-Heng Cheng, Jen-Wei Lee, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">Keywords</span>
        <img src="https://img.shields.io/github/stars/chingheng0808/WWE-UIE?style=social" alt="Github Stars">
      </div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Single Image Shadow Removal</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2511.16321" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/chingheng0808/WWE-UIE" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>

  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ACMMM 2025</div>
      <img src='images/DenseSR.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">DenseSR: Image Shadow Removal as Dense Prediction</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">Keywords</span>
        <img src="https://img.shields.io/github/stars/VanLinLin/DenseSR?style=social" alt="Github Stars">
      </div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Single Image Shadow Removal</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2507.16472" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://githubcom/VanLinLin/DenseSR" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>

  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #c0392b; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">CVPRW 2024</div>
      <img src='images/drct_fix.gif' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">DRCT: Saving Image Super-Resolution away from Information Bottleneck</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong>, <a href="https://nelly0421.github.io/" target="_blank" style="text-decoration: underline;">Yi-Shiuan Chou</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">Keywords</span>
        <img src="https://img.shields.io/github/stars/ming053l/DRCT?style=social" alt="Github Stars">
      </div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Image Super-resolution</li>
        <li>Information Bottleneck</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/pdf/2404.00722.pdf" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">PDF</a>
        <a href="https://arxiv.org/abs/2404.00722" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/ming053l/DRCT" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
        <a href="https://allproj002.github.io/drct.github.io/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Project page</a>
        <a href="https://drive.google.com/file/d/1zR9wSwqCryLeKVkJfTuoQILKiQdf_Vdz/view?usp=sharing" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Poster</a>
        <a href="https://docs.google.com/presentation/d/1MxPPtgQZ61GFSr3YfGOm9scm23bbbXRj/edit?usp=sharing" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Slide</a>
      </div>
    </div>
  </div>
</div>

<div id="section-hsi" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">🛰️ Hyperspectral & Remote Sensing</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Submitted to TGRS</div>
      <img src='images/PromptHSI.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">PromptHSI: Universal Hyperspectral Image Restoration with Vision-Language Modulated Frequency Adaptation</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Ching-Heng Cheng, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, Yi-Ching Cheng, Wo-Ting Liao, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <a href="https://fuenyang1127.github.io/" target="_blank" style="text-decoration: underline;">Fu-En Yang</a>, <a href="https://vllab.ee.ntu.edu.tw/ycwang.html" target="_blank" style="text-decoration: underline;">Yu-Chiang Frank Wang</a></p>
      <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold;">Keywords</span>
        <img src="https://img.shields.io/github/stars/chingheng0808/PromptHSI?style=social" alt="Github Stars">
      </div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Restoration & Text-Prompt Learning</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2411.15922" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
        <a href="https://github.com/chingheng0808/PromptHSI" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
        <a href="https://drive.google.com/drive/folders/1O0GDzoPt3AVD4mjXeu3R_lxyuTDEWWW1" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Dataset</a>
      </div>
    </div>
  </div>


    
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ICASSP 2026</div>
      <img src='images/SSCNet.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">HSSDCT: Factorized Spatial-Spectral Correlation for Hyperspectral Image Fusion</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Yu-How He, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, Jen-Wei Lee, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a>, <a href="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en" target="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en">Li-Wei Kang</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Fusion</li>
      </ul>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Submitted to TGRS</div>
      <img src='images/AuroraHSI.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">AuroraHSI: An End-to-End Hyperspectral Image Fusion Method for Degraded Imagery</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Cheng-Jun Kang, Ching-Heng Cheng, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, <a href="https://nelly0421.github.io/" target="https://nelly0421.github.io/">Yi-Shiuan Chou</a>, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a>, <a href="https://fuenyang1127.github.io/" target="https://fuenyang1127.github.io/">Fu-En Yang</a>, <a href="https://vllab.ee.ntu.edu.tw/ycwang.html" target="https://vllab.ee.ntu.edu.tw/ycwang.html">Yu-Chiang Frank Wang</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Restoration & Robust Hyperspectral Image Fusion</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ming053l.github.io/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv (Coming Soon)</a>
        <a href="https://ming053l.github.io/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github (Coming Soon)</a>
      </div>
    </div>
  </div>


  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Submitted to JSTARS</div>
      <img src='images/S3RNET_SSAWB_beforeafter.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">S3RNet: Sparse Spatial-Spectral Representation with Hybrid Knowledge Distillation for Efficient Hyperspectral Image Pansharpening</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, <a href="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en" target="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en">Li-Wei Kang</a>, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Efficient Hyperspectral Image Fusion</li>
        <li>Knowledge Distillation</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ming053l.github.io/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv (Coming Soon)</a>
        <a href="https://ming053l.github.io/" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github (Coming Soon)</a>
      </div>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">IGARSS 2025</div>
      <img src='images/S3RNet.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Robust Hyperspectral Image Pansharpening via Sparse Spatial-Spectral Representation</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, <a href="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en" target="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en">Li-Wei Kang</a>, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Pansharpening & Sparse Representation</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2501.07953" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
      </div>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">IGARSS 2025</div>
      <img src='images/HyForen.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">HyperForensics++: Toward Adversarial Perturbed and Object Replacement in Hyperspectral Imaging Dataset</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, Min-Zo Ko, En-Zhao Liu, Yi-Ching Cheng, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a>, <a href="https://www.albany.edu/faculty/mchang2/" target="https://www.albany.edu/faculty/mchang2/">Ming-Ching Chang</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Forensics & Adversarial Attack </li>
      </ul>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">IGARSS 2025</div>
      <img src='images/HyFusionhpe.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">HyFusion: Enhanced Reception Field Transformer for Hyperspectral Image Fusion</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, Yu-Hao Ho, <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a></p>, <a href="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en" target="https://scholar.google.com/citations?user=QwSzhgEAAAAJ&hl=en">Li-Wei Kang</a>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Pansharpening </li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2501.04665" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
      </div>
    </div>
  </div>

  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #e67e22; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">TGRS 2024</div>
      <img src='images/RTCS.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Real-Time Compressed Sensing for Joint Hyperspectral Image Transmission and Restoration for CubeSat</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a>, Chih-Yu Jian, Eng-Shen Tu, <strong>Chia-Ming Lee</strong>, Guan-Lin Chen</p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
        <span style="font-weight: bold;">Keywords</span>
        <img src="https://img.shields.io/github/stars/ming053l/RTCS?style=social" alt="Github Stars">
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hyperspectral Image Restoration & Compression Sensing</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ieeexplore.ieee.org/abstract/document/10474407" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">paper</a>
        <a href="https://github.com/ming053l/RTCS" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>
</div>


      
<div id="section-efficient" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">⚡ Efficient AI & Acceleration</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e8dff; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Under Review</div>
      <img src='images/ELSA.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">ELSA: Exact Linear-Scan Attention for Fast and Memory-Light Vision Transformers</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, Xin-Di Ma, Wo-Ting Liao, <strong>Chia-Ming Lee</strong></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Hardware-Agnositic Transformer Acceleration</li>
        <li>Exact Linear-Scan Attention</li>
      </ul>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e8dff; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Under Review</div>
      <img src='images/FracQuant.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">FracQuant: Fractal Complexity Assessment for Content-aware Image Super-resolution Network Quantization</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Yu-Fan Lin, <a href="https://fuenyang1127.github.io/" target="https://fuenyang1127.github.io/">Fu-En Yang</a>, <a href="https://vllab.ee.ntu.edu.tw/ycwang.html" target="https://vllab.ee.ntu.edu.tw/ycwang.html">Yu-Chiang Frank Wang</a>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Fractal Coding for Image Compression</li>
        <li>Network Compression and Quantization</li>
      </ul>
    </div>
  </div>
</div>

<div id="section-security" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">📱 Deepfake Video Detection</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #001c4e; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">IJCV 2026</div>
      <img src='images/UMCL.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">UMCL: Unimodal-generated Multimodal Constrative Learning for Cross-compression-rate Deepfake Detection</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;">Ching-Yi Lai, Chih-Yu Jian, Pei-Cheng Chuang, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <a href="https://www.cs.nthu.edu.tw/~cthsu/candy.html" target="_blank" style="text-decoration: underline;">Chiou-Ting Hsu</a>, <a href="https://www.ee.nthu.edu.tw/cwlin/" target="_blank" style="text-decoration: underline;">Chia-Wen Lin</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Multimodality Constrative Learning</li>
        <li>Robust DeepFake Detection</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2511.18983" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
      </div>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #001c4e; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Submitted to TIFS</div>
      <img src='images/GRACEv2.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Towards Robust DeepFake Detection under Unstable Face Sequences: Adaptive Sparse Graph Embedding with Order-Free Representation and Explicit Laplacian Spectral Prior</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="https://cchsu.info/">Chih-Chung Hsu</a>, Shao-Ning Chen, Mei-Hsuan Wu, <strong>Chia-Ming Lee</strong>, Yi-Fang Wang, <a href="https://nelly0421.github.io/" target="https://nelly0421.github.io/">Yi-Shiuan Chou</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Adversarial Attack</li>
        <li>Graph Convolutional Network</li>
        <li>Robust DeepFake Detection</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2511.18983" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
      </div>
    </div>
  </div>
</div>




<div id="section-smp" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">💬 Social Media Analysis</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #eeff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ACMMM 2023</div>
      <img src='images/acmmm.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Gradient Boost Tree Network based on Extensive Feature Analysis for Popularity Prediction of Social Posts</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong>, Xiu-Yu Hou, Chi-Han Tsai</p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Social Media Popularity Prediction</li>
        <li>Multimodal Time Series Data</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://dl.acm.org/doi/10.1145/3581783.3612843" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">paper</a>
      </div>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #eeff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ACMMM 2024</div>
      <img src='images/SMPD24.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Revisiting Vision-Language Features Adaptation and Inconsistency for Social Media Popularity Prediction</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong>,  <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, <a href="https://nelly0421.github.io/" target="https://nelly0421.github.io/">Yi-Shiuan Chou</a>, Chi-Han Tsai</p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Social Media Popularity Prediction</li>
        <li>Multimodal Feature Alignment</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2407.00556" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
      </div>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #eeff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ACMMM 2025</div>
      <img src='images/smpd2025.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Anchoring Trends: Mitigating Social Media Popularity Prediction Drift via Feature Clustering and Expansion</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><strong>Chia-Ming Lee</strong>, Bo-Cheng Qiu, Cheng-Jun Kang, Yi-Hsuan Wu, Jun-Lin Chen, <a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, <a href="https://nelly0421.github.io/" target="https://nelly0421.github.io/">Yi-Shiuan Chou</a>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Social Media Popularity Prediction</li>
        <li>LLM-guided Feature Expansion</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/abs/2507.19863" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">arxiv</a>
      </div>
    </div>
  </div>
</div>


<div id="section-medical" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">🧠 Medical Image Analysis</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #b3ff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">Under Review</div>
      <img src='images/DSSFT.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">DSSFT: Dense Spatial-Slice Fusion Transformer for Medical Volumetric Super-Resolution</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> I-An Tsai, <strong>Chia-Ming Lee</strong>, Shen-Chieh Tai, <a href="http://cvml.cs.nycu.edu.tw/" target="_blank" style="text-decoration: underline;">Chun-Rong Huang</a>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>3D Medical Volumetric Super-Resolution</li>
      </ul>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #b3ff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ICCVW 2025</div>
      <img src='images/covid2025.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Taming Domain Shift in Multi-source CT-Scan Classification via Input-Space Standardization</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <strong>Chia-Ming Lee</strong>, Bo-Cheng Qiu, Ting-Yao Chen, Ming-Han Sun, Fang-Ying Lin, Jung-Tse Tsai, I-An Tsai, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Kernel-density Guided Sampling</li>
        <li>Multi-source Domain Adaption</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://openaccess.thecvf.com/content/ICCV2025W/PHAROS-AFE-AIMI/papers/Lee_Taming_Domain_Shift_in_Multi-source_CT-Scan_Classification_via_Input-Space_Standardization_ICCVW_2025_paper.pdf" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">paper</a>
      </div>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #b3ff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">CVPRW 2024</div>
      <img src='images/4SFL.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">A Closer Look at Spatial-Slice Features Learning for COVID-19 Detection</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong>, Yang Fan Chiang, <a href="https://nelly0421.github.io/" target="_blank" style="text-decoration: underline;">Yi-Shiuan Chou</a>, Chih-Yu Jiang, Shen-Chieh Tai, Chi-Han Tsai</p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Computed Tomography Scanning</li>
        <li>Mathematical Morphology</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://openaccess.thecvf.com/content/CVPR2024W/DEF-AI-MIA/papers/Hsu_A_Closer_Look_at_Spatial-Slice_Features_Learning_for_COVID-19_Detection_CVPRW_2024_paper.pdf" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">paper</a>
        <a href="https://github.com/ming053l/E2D" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">Github</a>
      </div>
    </div>
  </div>

  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #b3ff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">arxiv 2024</div>
      <img src='images/ICIP.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Divide and Conquer: Grounding a Bleeding Areas in Gastrointestinal Image with Two-Stage Model</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, Bo-Cheng Qiu,  <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Gastrointestinal Image</li>
        <li>Multitask Learning</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://arxiv.org/pdf/2412.16723?" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">paper</a>
      </div>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #b3ff89; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ICASSPW 2023</div>
      <img src='images/icassp.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Bag of Tricks of Hybrid Network for Covid-19 Detection of CT Scans</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"><a href="https://vanlinlin.github.io/" target="https://vanlinlin.github.io/">Yu-Fan Lin</a>, Bo-Cheng Qiu, <strong>Chia-Ming Lee</strong>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Computed Tomography Scanning</li>
        <li>Ensemble Learning</li>
      </ul>
      <div class="links" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <a href="https://ieeexplore.ieee.org/document/10192945" target="_blank" style="background: #7a838b; color: white; padding: 5px 15px; border-radius: 4px; font-size: 0.9em; font-weight: bold; text-decoration: none;">paper</a>
      </div>
    </div>
  </div>
</div>


<div id="section-recognition" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">👁️ Visual Recognition and Reasoning</h2>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e001c; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ACMMM 2025</div>
      <img src='images/gtatrack.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">GTATrack: Winner Solution to SoccerTrack 2025 with Deep-EIoU and Global Tracklet Association
</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;">Rong-Lin Jian, Ming-Chi Luo, Cheng-Wei Huang, <strong>Chia-Ming Lee</strong>, <a href="https://vanlinlin.github.io/" target="_blank" style="text-decoration: underline;">Yu-Fan Lin</a>, <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Fisheye Camera</li>
        <li>Object Detection and Tracking</li>
      </ul>
    </div>
  </div>
  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e001c; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">MIPR 2024</div>
      <img src='images/omnidet.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">OmniDet: Omnidirectional Object Detection via Fisheye Camera Adaptation</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, Wei-Hao Huang, Wen-Hai Tseng, Ming-Hsuan Wu, Ren-Jung Xu, <strong>Chia-Ming Lee</strong></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Fisheye Camera</li>
        <li>Object Detection</li>
      </ul>
    </div>
  </div>
        
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e001c; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">ICCVW 2023</div>
      <img src='images/icme.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">MISS: Memory-efficient Instance Segmentation Framework By Visual Inductive Priors Flow Propagation</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong></p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Few-shot Learning</li>
        <li>Instance Segmentation</li>
      </ul>
    </div>
  </div>

  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #4e001c; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">MMAsia 2023</div>
      <img src='images/mmasia.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">Adapting Object Detection to Fisheye Cameras: A Knowledge Distillation with Semi-Pseudo-Label Approach</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, Wen-Hai Tseng, Ming-Husan Wu, <strong>Chia-Ming Lee</strong>, Wei-Hao Huang</p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Fisheye Camera</li>
        <li>Object Detection</li>
      </ul>
    </div>
  </div>
</div>


<div id="section-defect" class="category-section">
  <h2 style="clear: both; border-bottom: 2px solid #0B3C8A; padding-bottom: 10px; margin-top: 50px;">🚨 Defect Detection</h2>

  
  <div class='paper-box' style="display: flex; flex-wrap: wrap; margin-bottom: 35px; align-items: flex-start;">
    <div class='paper-box-image' style="flex: 0 0 350px; max-width: 100%; margin-right: 25px; position: relative;">
      <div style="position: absolute; background: #32004e; color: white; padding: 2px 10px; font-size: 13px; font-weight: bold; top: 10px; left: 0px; z-index: 1;">APCCAS 2025</div>
      <img src='images/pfvl.png' style="width: 100%; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); border-radius: 2px;">
    </div>
    <div class='paper-box-text' style="flex: 1; min-width: 300px;">
      <h4 style="margin: 0 0 10px 0; font-size: 1.15em; color: #333;">OCR is All you need: Importing Multi-Modality into Image-based Defect Classification System</h4>
      <p style="margin: 0 0 10px 0; font-size: 1.05em;"> <a href="https://cchsu.info/" target="_blank" style="text-decoration: underline;">Chih-Chung Hsu</a>, <strong>Chia-Ming Lee</strong>, Po-Tsun Yu, Chun-Hung Sun, Kuang-Ming Wu</p>
      <div style="margin-bottom: 5px; font-weight: bold;">Keywords</div>
      <ul style="margin: 0 0 15px 20px; padding: 0; color: #555;">
        <li>Fisheye Camera</li>
        <li>Object Detection</li>
      </ul>
    </div>
  </div>
</div>        
# 🚀 Academic Services

### 📝 Reviewer
- *Conference Papers*: CVPR, ICLR, ICCV, ACMMM, MMAsia, AAAI, ICME
- *Journal Papers*: TMM, TIFS, TGRS, GRSL, IJPRAI

<script>
function filterNews(type, e) {
  const items = document.querySelectorAll('.news-item');
  items.forEach(item => {
    if (type === 'all' || item.classList.contains(type)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

  const btns = document.querySelectorAll('.news-buttons button');
  btns.forEach(b => { 
    b.style.background = '#f1f1f1'; 
    b.style.color = '#333'; 
  });
  e.currentTarget.style.background = '#333';
  e.currentTarget.style.color = 'white';
}
</script>

<script>
function filterCategory(categoryId, e) {
  // 防止任何連結跳轉行為
  if (e) e.preventDefault();

  // 1. 取得所有類別區塊
  const sections = document.querySelectorAll('.category-section');
  
  sections.forEach(section => {
    if (categoryId === 'all') {
      section.style.display = 'block';
    } else {
      if (section.id === 'section-' + categoryId) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    }
  });

  // 2. 更新按鈕樣式
  const buttons = document.querySelectorAll('.category-buttons button');
  buttons.forEach(btn => {
    btn.style.backgroundColor = '#f1f1f1';
    btn.style.color = '#333';
  });
  
  // 高亮當前點擊的按鈕
  if (e && e.currentTarget) {
    e.currentTarget.style.backgroundColor = '#333';
    e.currentTarget.style.color = 'white';
  }
}
</script>
