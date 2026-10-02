const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const diagramNames = [
  '01_usecase_tong_quan_he_thong.png',
  '02_usecase_phan_he_khach_hang.png',
  '03_usecase_phan_he_quan_tri.png',
  '04_sequence_dang_nhap_jwt.png',
  '05_sequence_dat_hang_va_kiem_soat.png',
  '06_sequence_thanh_toan_vietqr.png',
  '07_sequence_thanh_toan_the_tin_dung_3dsecure.png',
  '08_sequence_xu_ly_don_hang_hoan_kho.png',
  '09_sequence_kiem_duyet_danh_gia_ai.png',
  '10_class_thuc_the_csdl.png',
  '11_class_kien_truc_3_tang.png'
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function exportAll() {
  const mdPath = path.join(__dirname, '..', 'SYSTEM_DIAGRAMS.md');
  const content = fs.readFileSync(mdPath, 'utf8');
  const regex = /```mermaid([\s\S]*?)```/g;
  let match;
  let i = 0;
  const outDir = path.join(__dirname, '..', 'diagrams');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  while ((match = regex.exec(content)) !== null) {
    const code = match[1].trim();
    const fileName = diagramNames[i] || ('diagram_' + (i + 1) + '.png');
    console.log(`Processing [${i + 1}/11]: ${fileName}...`);

    const state = { code, mermaid: { theme: 'default' } };
    const json = JSON.stringify(state);
    const deflated = zlib.deflateSync(json, { level: 9 });
    const b64pako = deflated.toString('base64url');
    const url = 'https://mermaid.ink/img/pako:' + b64pako + '?type=png';

    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      attempts++;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          const filePath = path.join(outDir, fileName);
          fs.writeFileSync(filePath, buf);
          console.log(`  -> OK (${buf.length} bytes)`);
          success = true;
        } else {
          console.warn(`  Attempt ${attempts} failed with HTTP ${res.status}. Retrying in 1.5s...`);
          await sleep(1500);
        }
      } catch (err) {
        console.warn(`  Attempt ${attempts} failed with error: ${err.message}. Retrying in 1.5s...`);
        await sleep(1500);
      }
    }

    if (!success) {
      console.error(`  FAILED to export ${fileName}`);
    }
    await sleep(800);
    i++;
  }
  console.log('\nFinished exporting all diagrams to diagrams/ directory!');
}

exportAll();

