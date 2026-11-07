# Task Brief — W0c (ไฟล์ประกอบการทำงานของ AI)

```
อ่าน AGENTS.md ก่อน แล้วทำงานนี้เพียงงานเดียว
งาน: W0c — สร้าง frontend/.env.example และ docs/examples/INDEX.md (AGENTS.md ที่ราก repo มีอยู่แล้ว — ห้ามแก้)
เกณฑ์ผ่าน:
 - [ ] frontend/.env.example มีตัวแปร 3 ตัวพร้อมคอมเมนต์ไทย 1 บรรทัดต่อตัว (ไม่มีค่าลับ):
       VITE_API_MODE (ค่า: stub | http · ค่าเริ่มต้น stub) · VITE_API_URL (เช่น ว่าง = same-origin ผ่าน proxy) · VITE_API_TIMEOUT_MS
 - [ ] src/config/env.ts อ่านตัวแปรทั้ง 3 ผ่านที่เดียว (ตรวจค่า + ค่าเริ่มต้น) — ห้ามใช้ import.meta.env ที่อื่น
 - [ ] docs/examples/INDEX.md มีตารางชนิดตัวอย่างทอง 6 ชนิดตาม docs/06_DEVELOPMENT_PLAN_Frontend.md §10 (คอลัมน์: ชนิด · งานที่สร้าง · พาธไฟล์ตัวอย่าง = "ยังไม่มี")
 - [ ] `npm run check` ผ่าน (แปะผลจริง)
ไฟล์ที่แก้ได้: frontend/.env.example, frontend/src/config/env.ts (+ test), docs/examples/INDEX.md
ห้ามแตะ: ที่เหลือทั้งหมด (รวม AGENTS.md และ frontend/contract/**)
ลอกรูปแบบจาก: ผลของ W0a/W0b
ทำตามขั้นตอน AI_WEB_RULES_10B §9 และรายงานตาม §10
ไม่แน่ใจข้อไหนให้ถามก่อน อย่าเดา
```

**ต้องมีก่อน:** W0b = `done`
