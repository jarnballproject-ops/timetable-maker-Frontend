# ai-contract — สัญญากลางระหว่าง Frontend ↔ Algorithm

repo เล็กๆ ตัวที่ 3 ที่ **ทั้งสองคนไม่เขียนโค้ดในนี้** มีแต่ข้อตกลง: `openapi.yaml` (แหล่งความจริงเดียว) + `examples/` (ข้อมูลตัวอย่างที่ทั้งสองฝั่งใช้ร่วมกัน) + สคริปต์ตรวจ

```
openapi.yaml        สัญญา: endpoint, schema, error  (ฟิลด์ TODO(domain) = placeholder)
VERSION             เลข version (ต้องตรงกับ info.version ใน openapi.yaml)
examples/*.json     fixtures ร่วม — FE ใช้เป็น stub, Algo ใช้เป็น test input
scripts/validate.py ตรวจว่า examples ตรง schema
scripts/check_live.py ยิง server จริง/mock แล้วตรวจว่า response ตรงสัญญา
```

## ติดตั้งครั้งแรก (ทั้งสองคน)
```powershell
git clone <url-ของ-ai-contract> ; cd ai-contract
python -m venv .venv ; .\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python scripts\validate.py        # ต้องขึ้น ALL PASS
```

## แต่ละฝั่งดึง contract ไปใช้อย่างไร (repo แยก 2 ตัว)
ทำเรียบง่ายที่สุด: **ใน repo ของตัวเองมีโฟลเดอร์ `contract/` ที่เป็นสำเนา** แล้วดึงเวอร์ชันล่าสุดด้วยคำสั่งเดียว
```powershell
git clone --depth 1 <url-ของ-ai-contract> .contract-tmp ; Remove-Item -Recurse -Force contract -ErrorAction SilentlyContinue
Move-Item .contract-tmp contract ; Remove-Item -Recurse -Force contract\.git
```
- commit `contract/` ไว้ใน repo ของตัวเอง และจด version ไว้ใน commit message (`chore: sync contract 0.2.0`)
- ไม่ใช้ git submodule: เพิ่มขั้นตอนที่มือใหม่พังง่าย (clone ลืม `--recurse-submodules`, pointer ค้าง)

## ฝั่ง Algorithm (เพื่อน)
- สร้าง server ให้ตรง `openapi.yaml` (FastAPI/Express อะไรก็ได้ — ภาษาไม่ผูก)
- ตรวจตัวเองทุกครั้งก่อน push: `python contract\scripts\check_live.py http://localhost:8000` → ต้องขึ้น "ตรง contract"
- ต้อง validate input เอง และตอบ error รูปแบบ `{"error":{"code","message","field"}}` ทุกกรณี (รวม 500)

## ฝั่ง Frontend (คุณ)
- ไม่ต้องรอ algorithm: รัน mock จากสัญญา `npx @stoplight/prism-cli mock contract/openapi.yaml -p 8000`
  แล้วตรวจว่า FE คุยได้ `python contract\scripts\check_live.py http://localhost:8000 --mock`
- หรือให้ stub อ่าน `contract/examples/*.json` โดยตรง (ไม่ต้องมี server)
- type ของ TypeScript generate จากสัญญา: `npx openapi-typescript contract/openapi.yaml -o src/api/generated.ts`

## กฎการเปลี่ยน contract
| เปลี่ยนอะไร | version | ต้องทำ |
|---|---|---|
| เพิ่ม field ใน response / เพิ่ม endpoint / เพิ่ม error code | minor (0.1.0 → 0.2.0) | PR + อีกฝ่าย approve |
| แก้ชื่อ/ชนิด/ลบ field, เปลี่ยน required, เปลี่ยน status code | **major** — นัดคุยกันก่อน | PR + อีกฝ่าย approve + ทั้งสองฝั่งอัปเดตพร้อมกัน |
| แก้คำอธิบาย/ตัวอย่าง | patch | PR |

ขั้นตอน: แก้ `openapi.yaml` + `examples/` + `VERSION` + `info.version` → `python scripts/validate.py` ผ่าน → เปิด PR ให้อีกฝ่าย approve → merge → **ทั้งสองคน sync** (คำสั่งด้านบน) → แจ้งในแชตว่า "contract x.y.z แล้ว"
**ห้ามตกลงเปลี่ยน field ทางแชต/ปากเปล่าโดยไม่แก้ไฟล์นี้**

## แผน "ออกแบบคร่าวๆ ก่อน ปรับให้ครอบคลุมข้อมูลจริงตอนท้าย" — ทำให้ปลอดภัยด้วย 3 ข้อ
1. **ภายใน 1–2 วันแรก** เพื่อนส่ง *ผลลัพธ์จริง 3–5 แบบ* (ปกติ / ว่าง / ยาวมาก / ค่าผิดปกติ / error) เป็นไฟล์ JSON ใส่ใน `examples/` แล้วแทน placeholder ใน `openapi.yaml` ให้ตรงของจริง → FE ออกแบบบนรูปร่างข้อมูลจริง ไม่ใช่เดา
2. FE เรนเดอร์แบบ **ทนต่อของที่ไม่คาดฝัน**: ignore field แปลกใหม่, รองรับค่าว่าง/null/ลิสต์ยาว, มีมุมมอง "ดู raw JSON" ไว้ debug
3. ช่วงท้าย (FE ~80%) เพื่อน **ยิงข้อมูลทั้งหมด** แล้วเก็บ response ที่แปลกใหม่ใส่ `examples/` เพิ่ม → นั่นคือขั้นตอน *ตรวจ* ไม่ใช่ขั้นตอน *ค้นพบ*: ถ้ามี field ใหม่ = bump minor, generate type ใหม่ แล้วให้ TypeScript ชี้เองว่าตรงไหนของ UI ต้องแก้
