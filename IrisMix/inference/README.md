# IrisMix 瀏覽器研究版

開啟此資料夾的 index.html 網址。需使用 HTTPS 或 localhost；直接開啟本機 HTML 檔案無法執行。

完整 Stage I、Stage II、人臉解析與 VAE 均在訪客瀏覽器執行。照片不上傳；靜態模型檔案會從 model-config.json 指定、固定 commit 的 Hugging Face 網址下載。首次需下載約 3.4 GB，速度取決於網路及裝置。

這個 Git 網頁目錄只包含程式、runtime、範例照片及授權；沒有模型權重或 ONNX 圖。REMOTE-MODELFILES.json 記錄遠端模型的 URL、位元組數與 SHA-256；WEBFILES.json 記錄這份網頁快照。請保留上層 quality.js 與 vendor/mediapipe/，並使用相同版本的套件。

需支援 WebGPU 的桌機瀏覽器、至少 768 MiB 的單一 storage binding 及 buffer 上限，以及足夠的整體 GPU 記憶體。這是非商業研究展示；第三方 face parser 限非商業研究與教育用途。模型條款見 MODELS.md、licenses/；實測範圍見 VALIDATION.md。
