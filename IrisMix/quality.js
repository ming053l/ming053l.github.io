// Browser-only, conservative photo screening. This is not an IrisMix inference model.
let detector;
async function getDetector() {
  if (!detector) detector = (async () => {
    const { FaceLandmarker, FilesetResolver } = await import('./vendor/mediapipe/vision_bundle.mjs');
    const files = await FilesetResolver.forVisionTasks('./vendor/mediapipe/wasm');
    return FaceLandmarker.createFromOptions(files, {
      baseOptions: { modelAssetPath: './vendor/mediapipe/face_landmarker.task', delegate: 'CPU' },
      runningMode: 'IMAGE', numFaces: 2,
      minFaceDetectionConfidence: .6, minFacePresenceConfidence: .6
    });
  })().catch(error => { detector = null; throw error; });
  return detector;
}
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export async function checkPhoto(file) {
  const issues = [], warnings = [];
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) return { ok: false, issues: ['僅接受 JPG、PNG 或 WebP 照片。'], warnings };
  if (file.size > 12 * 1024 * 1024) return { ok: false, issues: ['檔案超過 12 MB，請先縮小圖片。'], warnings };
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const width = bitmap.width, height = bitmap.height;
  try {
    if (Math.min(width,height) < 512) return { ok: false, issues: ['圖片短邊須至少 512 像素。'], warnings, width, height };
    const c = document.createElement('canvas');
    const scale = Math.min(1, 1536 / Math.max(width, height));
    c.width = Math.round(width * scale); c.height = Math.round(height * scale);
    c.getContext('2d').drawImage(bitmap, 0, 0, c.width, c.height);
    const model = await getDetector(), found = model.detect(c).faceLandmarks;
    if (!found.length) return { ok: false, issues: ['未偵測到清楚人臉，請改用正面、無遮擋的單人照片。'], warnings, width, height };
    if (found.length > 1) return { ok: false, issues: ['照片中有多人，請裁成單人照片。'], warnings, width, height };
    const p = found[0];
    const minX = Math.min(...p.map(v=>v.x)), maxX = Math.max(...p.map(v=>v.x));
    const minY = Math.min(...p.map(v=>v.y)), maxY = Math.max(...p.map(v=>v.y));
    if ((maxX-minX)*width < 180 || (maxY-minY)*height < 210) issues.push('臉部太小，請使用較近距離的人像。');
    const left = { x:(p[33].x+p[133].x)/2, y:(p[33].y+p[133].y)/2 };
    const right = { x:(p[263].x+p[362].x)/2, y:(p[263].y+p[362].y)/2 };
    const yaw = distance(p[1],left)/Math.max(distance(p[1],right),1e-5);
    if (yaw < .38 || yaw > 2.65) issues.push('側臉角度過大，請使用正面或輕微側臉。');
    const roll = Math.abs(Math.atan2(right.y-left.y,right.x-left.x));
    if (roll > .38 && roll < Math.PI-.38) issues.push('頭部傾斜較大，請先將照片轉正。');
    const e1 = distance(p[159],p[145])/Math.max(distance(p[33],p[133]),1e-5);
    const e2 = distance(p[386],p[374])/Math.max(distance(p[362],p[263]),1e-5);
    if (e1 < .1 && e2 < .1) issues.push('雙眼閉合或過度瞇眼，眼妝容易貼合錯誤。');
    else if (Math.min(e1,e2) < .11) warnings.push('一側眼睛較閉合，眼線與眼影位置可能不準。');
    if (distance(p[13],p[14])/Math.max(distance(left,right),1e-5) > .28) warnings.push('嘴巴張開較大，唇妝可能變形；建議嘴巴輕閉。');
    const face = document.createElement('canvas'); face.width = face.height = 256;
    face.getContext('2d').drawImage(c, minX*c.width, minY*c.height, (maxX-minX)*c.width, (maxY-minY)*c.height, 0, 0, 256, 256);
    const rgba = face.getContext('2d').getImageData(0,0,256,256).data;
    const gray = new Float32Array(256*256); let dark=0,bright=0;
    for(let i=0;i<gray.length;i++) { const j=i*4; const v=.299*rgba[j]+.587*rgba[j+1]+.114*rgba[j+2];gray[i]=v;if(v<22)dark++;if(v>242)bright++; }
    if(dark/gray.length>.45) issues.push('臉部過暗，無法穩定判斷彩妝與五官。');
    if(bright/gray.length>.45) issues.push('臉部過曝，請改用光線均勻的照片。');
    let sum=0,sum2=0,count=0;
    for(let y=1;y<255;y++)for(let x=1;x<255;x++){const i=y*256+x;const v=4*gray[i]-gray[i-1]-gray[i+1]-gray[i-256]-gray[i+256];sum+=v;sum2+=v*v;count++;}
    const sharpness=sum2/count-(sum/count)**2;
    if(sharpness<22) issues.push('臉部過於模糊或磨皮嚴重，請更換清晰原圖。');
    warnings.push('請自行確認沒有頭髮、手、眼鏡遮擋，或明顯美顏／色彩濾鏡；自動檢查無法完整辨識這些情況。');
    return { ok:!issues.length, issues, warnings, width, height, sharpness:Math.round(sharpness) };
  } finally { bitmap.close(); }
}
