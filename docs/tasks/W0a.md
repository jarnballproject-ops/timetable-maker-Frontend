# Task Brief — W0a (สร้างโปรเจกต์)

```
อ่าน AGENTS.md ก่อน แล้วทำงานนี้เพียงงานเดียว
งาน: W0a — สร้างโปรเจกต์ React + Vite + TypeScript ใน frontend/ พร้อมโครงโฟลเดอร์ตาม docs/05_FRONTEND_3หน้า_ออกแบบ.md §7 (ไม่ทำฟีเจอร์ใดๆ)
ตัวจัดการแพ็กเกจ: npm (ตัดสินแล้ว — มากับ Node ที่เครื่องมี) · ใช้ package-lock.json
เกณฑ์ผ่าน:
 - [ ] ในโฟลเดอร์ frontend/ รัน `npm install` แล้ว `npm run dev` เปิดหน้าเปล่าได้ (แปะผล/พอร์ตที่ขึ้น)
 - [ ] `npx tsc --noEmit` ผ่านโดยเปิด "strict": true ใน tsconfig ที่ใช้ตรวจโค้ดแอป
 - [ ] มีโครงโฟลเดอร์ใต้ frontend/src: app/ pages/ features/{import-data,solve,schedule-view,report,export,demo}/ lib/api-client/ lib/persistence/ state/ components/ui/ config/ styles/  (แต่ละโฟลเดอร์มีไฟล์ index.ts ว่างหรือคอมเมนต์ 1 บรรทัดบอกหน้าที่ — ห้ามใส่โค้ดฟีเจอร์)
 - [ ] ลบโค้ด/รูป/สไตล์ตัวอย่างของเทมเพลต Vite ที่ไม่ใช้ออก (App.css, assets ตัวอย่าง ฯลฯ) หน้าแรกแสดงข้อความสั้นๆ จาก src/config/texts.ts (ไฟล์ texts เริ่มต้นมี 1 ค่า)
 - [ ] ไม่มีไฟล์ใดเกิน 200 บรรทัด
ไฟล์ที่แก้ได้: frontend/** (ยกเว้น frontend/contract/**)
ห้ามแตะ: ทุกอย่างนอก frontend/ · ห้ามเพิ่มแพ็กเกจนอกเหนือจากที่เทมเพลต Vite react-ts ติดตั้งให้
ลอกรูปแบบจาก: (ไม่มี — งานแรก) ใช้โครงตาม 05 §7
บริบทที่ให้: โฟลเดอร์ frontend/ ปัจจุบันว่างเปล่า · Node 24 + npm 11 · ชื่อแอป: timetable-maker-frontend
ทำตามขั้นตอน AI_WEB_RULES_10B §9 และรายงานตาม §10
ไม่แน่ใจข้อไหนให้ถามก่อน อย่าเดา
```

**หลังงานเสร็จ:** ผู้ใช้ review แล้วเปลี่ยน `docs/PROGRESS.md` W0a เป็น `done` · งานถัดไป: W0b
