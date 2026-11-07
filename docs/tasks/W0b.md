# Task Brief — W0b (บังคับกฎด้วยเครื่อง)

```
อ่าน AGENTS.md ก่อน แล้วทำงานนี้เพียงงานเดียว
งาน: W0b — ตั้งค่าเครื่องมือบังคับกฎใน frontend/ ตาม docs/AI_WEB_RULES_10B.md §11 และตาราง W0b ใน docs/06_DEVELOPMENT_PLAN_Frontend.md §5
เกณฑ์ผ่าน:
 - [ ] ESLint บังคับ: max-lines 200 · max-lines-per-function 40 · max-depth 3 · max-params 4 · complexity · no-explicit-any · ban-ts-comment · no-console
 - [ ] ห้ามเรียก fetch นอก src/lib/api-client (no-restricted-globals + override เฉพาะโฟลเดอร์ api-client)
 - [ ] ห้าม import ลึกข้ามฟีเจอร์ (ใช้ eslint-plugin-boundaries หรือ dependency-cruiser — เลือก 1 แล้วบอกเหตุผลในรายงาน)
 - [ ] Prettier ตั้งค่าแล้ว
 - [ ] npm scripts ใน frontend/package.json: lint · typecheck · test (Vitest — ใส่ --passWithNoTests) · format · check (= lint + typecheck + test)
 - [ ] ทดสอบว่ากฎจับของผิดจริง: สร้างไฟล์ชั่วคราว 1 ไฟล์ที่ฝ่าฝืนทุกกฎ (ยาวเกิน, any, console.log, fetch) → `npm run lint` ต้องล้ม → แปะผล → ลบไฟล์นั้นทิ้ง → `npm run check` ผ่าน
 - [ ] รายงานระบุว่ากฎ "component ≤ 120 บรรทัด, props ≤ 8, ห้ามสี/px ตายตัว" lint ตรวจตรงๆ ไม่ได้ (ถ้าใส่กฎ regex ได้ให้ใส่ ถ้าไม่ได้ให้บอก)
ไฟล์ที่แก้ได้: frontend/ ไฟล์ตั้งค่า (eslint, prettier, vitest, tsconfig ถ้าจำเป็น, package.json) · เพิ่มได้เฉพาะ devDependencies ที่เกี่ยวกับ lint/format/test ที่ระบุข้างบน
ห้ามแตะ: frontend/src/** (ยกเว้นไฟล์ทดสอบชั่วคราว ซึ่งต้องลบ) · frontend/contract/** · ทุกอย่างนอก frontend/
ข้ามไว้ก่อน (ต้องให้ผู้ใช้อนุมัติ): gitleaks, pre-commit hook (husky), CI (.github)
ลอกรูปแบบจาก: ผลของ W0a
ทำตามขั้นตอน AI_WEB_RULES_10B §9 และรายงานตาม §10
ไม่แน่ใจข้อไหนให้ถามก่อน อย่าเดา — โดยเฉพาะชื่อ/รุ่นของแพ็กเกจ ให้ตรวจว่ามีอยู่จริงใน registry ก่อนติดตั้ง
```

**ต้องมีก่อน:** W0a = `done`
