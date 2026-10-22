# IrisMix 瀏覽器模型來源與授權

查核日期：2026-10-22。這是瀏覽器研究體驗版的來源紀錄。專案擁有者已同意公開執行用權重，部署版本以模型倉庫的固定雜湊為準。

| 元件 | 本原型使用方式 | 上游授權／官方來源 |
| --- | --- | --- |
| Black Forest Labs FLUX.2 [klein] 4B | 共用 transformer 底模、VAE；轉成 Q4／FP32 與 ONNX | Apache-2.0：[模型卡](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)、[完整授權](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/main/LICENSE.md)。此紀錄適用 4B，沒有把其他 FLUX 型號一併視為相同授權。 |
| Hugging Face Diffusers 0.37.0 | 匯出所依據的模型架構、patchification、VAE 與 sampler 實作 | Apache-2.0：[版本授權](https://github.com/huggingface/diffusers/blob/v0.37.0/LICENSE)。 |
| Microsoft ONNX Runtime Web 1.23.2（本地 JS 修補） | 訪客瀏覽器執行 VAE 與 face parser；僅補上既有 C++ `storageBufferCacheMode` 選項的傳遞，使用 `lazyRelease` 降低快取保留量；WASM、模型與數值計算未變更 | MIT：[版本授權](https://github.com/microsoft/onnxruntime/blob/v1.23.2/LICENSE)、[第三方 notices](https://github.com/microsoft/onnxruntime/blob/v1.23.2/ThirdPartyNotices.txt)。保留 Microsoft 上游權利；原版與修補版 SHA、差異及實測範圍見 `runtime/PROVENANCE.json`、`runtime/ort-storage-cache.patch`、`runtime/ORT-MODIFICATIONS.txt`。此 runtime 授權不是模型權重授權。 |
| IrisMix C2／FULL LoRA 與 learned skips | 專案訓練的兩階段參數；FP32 adapters 與 VAE skips | 本次公開範圍為非商業研究與個人體驗評估；具體使用許可見[研究體驗使用說明](licenses/IRISMIX-RESEARCH-NOTICE.md)。此說明不變更底模及第三方權利。 |
| `jonathandinu/face-parsing` | 目前原型的 SegFormer face parser；權重 revision `758b82e15a0178c9db39c1ff666a8b56e3a550c8` | 上游明列「non-commercial research and educational purposes」：[官方模型卡](https://huggingface.co/jonathandinu/face-parsing#model-description)。其他用途須確認適用授權或替換此依賴；不能因 runtime 是 MIT 就視其權重為 MIT。 |
| Google MediaPipe Tasks Vision 0.10.21／face landmarker | 瀏覽器人臉檢查與 landmarks；固定使用無外部遙測路徑的上游版本 | MediaPipe 專案 Apache-2.0：[官方授權](https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE)。保留 vendor LICENSE／NOTICE；SDK 來源、完整性與檔案雜湊見 `vendor/mediapipe/SDK-manifest.json`。 |
| OpenCV.js 4.13.0 | 瀏覽器前處理與幾何運算 | Apache-2.0：[版本授權](https://github.com/opencv/opencv/blob/4.13.0/LICENSE)。 |

部署包隨附對應的完整 LICENSE、原有 NOTICE／第三方聲明，以及 Q4 量化、格式轉換、LoRA、skips 等修改說明。Apache-2.0 的散布條件載於其第 4 節；MIT runtime 亦須保留其 copyright／permission notice。上述連結不代替實際部署包中的授權文件。

頁尾的 IrisMix 著作權與禁止盜用聲明僅涵蓋專案自有內容，不改寫上述第三方授權。瀏覽器需要取得執行用權重；公開下載不代表所有參數採用同一授權。

此包使用快取文字 embeddings，未附 Qwen 文字編碼器的完整權重。未採用或散布先前檢視過、缺少 LICENSE 的第三方 Vulkan port 程式碼。

本專案原創瀏覽器程式與介面保留所有權利；IrisMix 自有參數依上述研究體驗用途提供。其他使用與再散布須依適用授權或另行取得權利人同意。上述聲明不變更第三方授權。
