# 06 — แผนพัฒนา Frontend (รายการงานหลัก "W" + วิธีทำงานกับ AI)

> ไฟล์นี้คือ **แหล่งความจริงเดียวของรายการงานฝั่ง Frontend** (รหัส `W…`) — ไฟล์อื่น (02 §4.2, 03 §9, 05 §8) ชี้มาที่นี่ ไม่เก็บรายการงานซ้ำ
> ประกอบจาก: โจทย์ `01` · แผนรวม+contract `02` · ความต้องการ `03` · สถาปัตยกรรม `04` · การออกแบบ 3 หน้า `05` · **กฎเขียนโค้ดสำหรับ AI `AI_WEB_RULES_10B.md`** (ผูกเข้ากับทุกงานในนี้ — ดู §2)
> ไม่มีโค้ดจริงในแผนนี้ — มีเฉพาะแผน เกณฑ์ผ่าน และตัวอย่างสั้นๆ ของรูปแบบเอกสาร
> สถานะ: ร่างแผน · ยังไม่เริ่ม W0

---

## 1. ข้อเท็จจริงของ repo นี้ (ใช้ตัดสินว่าไฟล์ไปอยู่ที่ไหน)

| เรื่อง | ค่า |
|---|---|
| ชื่อ repo | `timetable-maker-Frontend` (repo ของฝั่ง Frontend เท่านั้น — algorithm อยู่ repo อื่นของเพื่อน ชื่อยังไม่ตกลง เอกสารใช้ชื่อกลาง `timetable-algo`) |
| ราก **แอป** | `frontend/` (ปัจจุบันว่างเปล่า) — พาธโค้ดทั้งหมดในแผนนี้คือ `frontend/src/...` |
| เอกสาร | `docs/` (ไฟล์นี้อยู่ที่นี่) |
| สำเนา contract | `frontend/contract/` (ดึงจาก repo `ai-contract` ตาม 02 §3 · **ห้าม AI แก้**) |
| ไฟล์กฎ AI ประจำโปรเจกต์ | `AGENTS.md` ที่ **ราก repo** = ไฟล์ทางเข้าสั้นๆ (ขั้นตอนเริ่มงาน + ขอบเขต + กฎย่อ) ที่ **ชี้ไป** `docs/AI_WEB_RULES_10B.md` (ไม่ใช่สำเนา — กัน drift) · สร้างไว้แล้ว |
| ตัวอย่างทอง (golden examples) | `docs/examples/` (เริ่มสร้างใน W0c, เติมตาม §10) |
| เครื่องมือ | Node (เครื่องนี้ 24.x) · React + Vite + TypeScript ตาม 04 §14 · ตัวจัดการแพ็กเกจ **npm** (ตัดสินแล้ว — มากับ Node; ใช้ `package-lock.json`) |

---

## 2. กฎ AI ที่ผูกเข้าแผน (AI_WEB_RULES_10B → จุดบังคับในแผนนี้)

| กฎใน `AI_WEB_RULES_10B` | บังคับที่ไหนในแผน |
|---|---|
| §1 ข้อ 1–2 แยกไฟล์/ไม่ one-page, แตก component | **W0b** (lint จำกัดขนาด) + ไฟล์ที่แก้ได้ใน Task Brief จำกัดทีละไม่กี่ไฟล์ |
| §1 ข้อ 3, §4 ห้าม hard-code | **W0b** (กฎ lint/regex) + ข้อความไทยทั้งหมดอยู่ `config/texts` (W1b) + ข้อมูลทดสอบอยู่ `frontend/contract/examples` เท่านั้น |
| §1 ข้อ 4, §2.2 ชื่อตามหน้าที่ | ชื่อไฟล์/ฟังก์ชันที่คาดไว้ในแต่ละ W (§5) + ตรวจใน DoD |
| §1 ข้อ 5 อ่านก่อนเขียน / ห้ามเดา | ช่อง "ลอกรูปแบบจาก" ใน Task Brief บังคับทุกงาน |
| §1 ข้อ 6–7 ทีละงาน/แก้เฉพาะขอบเขต | Task Brief: "ไฟล์ที่แก้ได้ / ห้ามแตะ" · 1 W = 1 session (§9) |
| §1 ข้อ 8, §6 เรียกเครือข่ายชั้นเดียว | **W0b** (`no-restricted-globals` สำหรับ `fetch` ยกเว้น `lib/api-client`) + W1a |
| §1 ข้อ 9, §6 สถานะ 3 อย่าง (loading/error/empty) | เกณฑ์ผ่านของทุก W ที่เป็น UI + DoD ข้อ 7 |
| §1 ข้อ 10 TypeScript/ตรวจข้อมูลภายนอก | **W0b** (`tsc --strict`, ห้าม `any`/`@ts-ignore`) · ชนิดข้อมูลมาจาก contract |
| §1 ข้อ 11 รันจริงแล้วแปะผล | รายงานจบงานตาม `AI_WEB_RULES_10B §10` (§7 ด้านล่าง) |
| §1 ข้อ 12 ติด 3 ครั้งหยุด | §9 ขั้นตอนเมื่อติดขัด |
| §3 ขนาดโค้ด | ไฟล์ ≤ 200 บรรทัด/ฟังก์ชัน ≤ 40 บังคับด้วย lint · **component ≤ 120 บรรทัด และ props ≤ 8 ลินต์ตรวจตรงๆ ไม่ได้** → ตรวจโดยคนใน review + เช็กลิสต์ DoD |
| §11 บังคับด้วยเครื่อง | **W0b** ทำครบรายการ (ตารางใน §5 ของแผนนี้) |
| §12 ไซส์ XS–L + แม่แบบคำสั่งงาน | §4 (Task Brief) · งาน M ถูกแตกเป็น S แล้วทั้งหมด |
| §13 เช็กลิสต์ก่อนส่งงาน | §7 Definition of Done |

**ข้อควรรู้เมื่อใช้ TanStack Query:** `queryFn`/`mutationFn` ต้องเรียก **ฟังก์ชันของ `lib/api-client` เท่านั้น** (ไม่เรียก `fetch` ตรง) จึงไม่ขัดกฎ §1 ข้อ 8

**โครงโฟลเดอร์ที่ AI ต้องยึด:** ตาม `05 §7` (ได้ปรับ `AI_WEB_RULES_10B §2.1` ให้ตรงกันแล้ว: มี `state/`, `features/*/logic/`, และข้อมูลทดสอบอยู่ที่ `frontend/contract/examples`) · ตัดสินที่เคยเป็น "pages หรือ app": ใช้ `src/app/` (shell, routes, guards) + `src/pages/` (3 หน้า)

---

## 3. ตัวช่วยกำหนดลำดับ: ทำไมเรียงแบบนี้

1. **ฐานก่อน** (W0–W2): เครื่องมือบังคับกฎ → ชั้น API → ที่เก็บสถานะ — เพื่อให้ทุกงานถัดไปถูกตรวจอัตโนมัติ
2. **หน้า 3 ก่อนหน้า 1–2** (W3–W5): หน้า 3 ซับซ้อนที่สุดและใช้ผลเฉลยตัวอย่างได้เลย → พิสูจน์ว่ารูปทรงข้อมูลใน contract พอ ถ้าไม่พอจะแก้ contract ได้ทัน (05 §8)
3. **หน้า 1** (W6) แล้ว **หน้า 2** (W7) — พึ่งชั้น API และสถานะที่ทำแล้ว
4. **ส่งออก/นักเรียน/สาธิต** (W8–W10) — ใช้ view-model เดิม
5. **ต่อของจริง + ซ้อม** (W11) — สลับ stub → http เมื่อ algorithm พร้อม
6. **ถ้ามีเวลา** (W12)

**Prerequisite D2 — design tokens + Design System:** ผู้ใช้จะเพิ่มไฟล์ (ที่ `docs/design/` — รูปแบบไฟล์ยังไม่ทราบ) · งาน UI ทุกงานตั้งแต่ W1b เป็นต้นไปต้องรอ **W0d** (นำ token เข้า) เพราะกฎห้ามใช้ค่าสี/ขนาดตายตัว (`AI_WEB_RULES §4, §7`) · งานที่ไม่แตะ UI (W0a–c, W1a, W2) ทำได้ก่อน

**เงื่อนไขก่อนเริ่ม W3a (Prerequisite D1):** ต้องมี contract v0.2+ ที่ใส่ข้อมูลจริง และ fixtures F1–F4 + ผลเฉลยตัวอย่าง (ยังไม่ได้ทำ — 02 §2.6) · ถ้ายังไม่มี → W0–W2 ทำได้เลย แล้วที่ W3a ให้กำหนดชนิดข้อมูล **ชั่วคราว** ในไฟล์เดียวที่ติดป้าย `TEMP` และเปลี่ยนเมื่อ contract ออก (ความเสี่ยงอยู่ใน §11)

---

## 4. Task Brief (รูปแบบงานที่ส่งให้ AI — ตาม `AI_WEB_RULES_10B §12`)

ทุก W ใน §5 ต้องถูกขยายเป็น Brief ก่อนส่งให้ AI ด้วยแม่แบบนี้ (ตัวอย่างกรอกแล้วด้านล่าง) · เก็บ Brief ไว้ที่ `docs/tasks/W3a.md` เพื่อสืบย้อนได้

```
อ่าน AGENTS.md ก่อน แล้วทำงานนี้เพียงงานเดียว
งาน: <W-ID + ทำอะไร ผลลัพธ์ที่ต้องได้>
เกณฑ์ผ่าน: <ข้อๆ ที่ตรวจได้ด้วยคำสั่ง/ผลรัน>
ไฟล์ที่แก้ได้: <path>      ห้ามแตะ: ที่เหลือทั้งหมด (รวม frontend/contract/**)
ลอกรูปแบบจาก: <path ใน docs/examples/ หรือไฟล์ที่ทำเสร็จแล้ว>
บริบทที่ให้: <ตัดเฉพาะส่วนของ contract/ข้อกำหนดที่งานนี้ใช้ — วางเนื้อหาจริง>
ทำตามขั้นตอน AI_WEB_RULES_10B §9 และรายงานตาม §10
ไม่แน่ใจข้อไหนให้ถามก่อน อย่าเดา
```

### ตัวอย่างกรอกแล้ว: W3a
```
งาน: W3a — ฟังก์ชันบริสุทธิ์ "สร้างกริดตารางของกลุ่มเรียน" จาก Problem + Schedule → โครงกริด (วัน × คาบ) พร้อมแถวพักกลางวัน
เกณฑ์ผ่าน:
 - [ ] ผลเฉลยตัวอย่าง (ปวช.1 กลุ่ม 1) ได้กริดตรงกับที่คาด (test ผ่าน)
 - [ ] วิชา 4–5 ชม. แสดงเป็นช่วงต่อเนื่องเดียว (ไม่ฉีก)
 - [ ] วิชาทฤษฎีรวม 2 กลุ่ม ปรากฏในกริดของทั้ง 2 กลุ่ม
 - [ ] ช่องพักกลางวันมาจากข้อมูล Lunch ใน Schedule (ไม่เดาจากเลข 4/5/6)
 - [ ] จำนวนวัน/คาบมาจาก Problem (ไม่ฝังเลข 5 หรือ 9/11)
 - [ ] ข้อมูลว่าง / Schedule ไม่ครบ → ไม่ throw คืนกริดที่ระบุ "ช่องว่าง/ไม่ครบ"
 - [ ] lint, typecheck, test ผ่าน (แปะผลจริง)
ไฟล์ที่แก้ได้: frontend/src/features/schedule-view/logic/build-grid-by-group.ts (+ .test.ts), frontend/src/features/schedule-view/types.ts
ห้ามแตะ: ที่เหลือทั้งหมด
ลอกรูปแบบจาก: docs/examples/pure-function.md (หรือผลของ W0c)
บริบทที่ให้: โครงฟิลด์ Schedule/Problem ส่วนที่เกี่ยวข้อง (จาก 02 §2.1–2.2) + ไฟล์ fixtures ผลเฉลยตัวอย่าง 1 ไฟล์
```

---

## 5. รายการงาน W (สั้น ≤ M · M ถูกแตกเป็น S แล้ว)

> ไซส์ตาม EPEF §17/AI_WEB_RULES §12: **XS** ≤ 30 บรรทัด 1 ไฟล์ · **S** 1–3 ไฟล์ ≤ 120 บรรทัด · งานที่ต้องแตะ > 5 ไฟล์ให้แตกก่อน
> คอลัมน์ "FR" ชี้ไป `03` · "เกณฑ์ผ่าน" ละรายละเอียดหน้าจอไว้ที่ `05 §3.5, §4.5, §5.4` (อ้างเลขท้ายแถว)
> `fsv` = `frontend/src/features/schedule-view`

### P0 ฐานโปรเจกต์ (เป้าหมาย M1)
| ID | งาน | FR | ไซส์ | ไฟล์/โฟลเดอร์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W0a | สร้างโปรเจกต์ React+Vite+TS ใน `frontend/` · ใช้ npm + `package-lock.json` · โครงโฟลเดอร์ตาม 05 §7 (โฟลเดอร์ว่างพร้อมไฟล์ `index.ts`) | — | S | `frontend/**` (config, `src/` skeleton) | `dev` เปิดหน้าเปล่าได้ · `tsc --strict` ผ่าน |
| W0b | **บังคับกฎด้วยเครื่อง** (`AI_WEB_RULES §11`) · ดูตารางล่าง | — | S | `frontend/eslint config`, `package scripts` | คำสั่ง `check` = lint + typecheck + test ผ่าน · ทดสอบว่ากฎจับของผิดจริง (เขียนไฟล์ทดลอง 1 ไฟล์ที่ผิดทุกกฎ แล้วลบ) |
| W0d | **นำ design tokens + Design System เข้าโปรเจกต์** (ไฟล์จากผู้ใช้ — Prerequisite D2): ต่อ token เข้า `src/styles/tokens` + config ของ Tailwind (ถ้าใช้) · จดรายการ component ของ Design System ใน `docs/design/INDEX.md` | — | S | `frontend/src/styles/**`, `frontend/tailwind/สไตล์ config`, `docs/design/INDEX.md` | component ทดลอง 1 ตัวใช้ token ได้ · ไม่มีค่าสี/ขนาดตายตัวนอก token · รายละเอียด Brief เขียนเมื่อได้รับไฟล์ |
| W0c | `frontend/.env.example` + `src/config/env.ts` (อ่านตัวแปรที่เดียว) · สร้าง `docs/examples/INDEX.md` (ว่าง มีหัวข้อชนิดตัวอย่างตาม §10) — `AGENTS.md` ที่รากมีอยู่แล้ว ห้ามแก้ | — | XS | `frontend/.env.example`, `frontend/src/config/env.ts`, `docs/examples/INDEX.md` | `npm run check` ผ่าน · env อ่านผ่านที่เดียว |

**ตาราง W0b (กฎ → เครื่องมือ):**
| กฎ | เครื่องมือ |
|---|---|
| ไฟล์ ≤ 200 · ฟังก์ชัน ≤ 40 · ซ้อน ≤ 3 · พารามิเตอร์ ≤ 4 · ความซับซ้อน | ESLint `max-lines`, `max-lines-per-function`, `max-depth`, `max-params`, `complexity` |
| ห้าม `any` / `@ts-ignore` | `no-explicit-any`, `ban-ts-comment`, `tsc --strict` |
| ห้าม `fetch` นอก `lib/api-client` | `no-restricted-globals` (+ override ในโฟลเดอร์ api-client) |
| ห้าม import ลึกข้ามฟีเจอร์ | `eslint-plugin-boundaries` หรือ dependency-cruiser (เลือก 1) |
| ห้าม `console.log` | `no-console` |
| ห้ามสี/ขนาดตายตัวใน component | กฎ lint/regex ใน CI (ค่า arbitrary, `#hex`, `px`) |
| รูปแบบโค้ด | Prettier |
| secret | gitleaks (pre-commit) |
| ก่อน merge | pre-commit + CI: lint → typecheck → test → build |

### P1 โครงแอป (M1–M2)
| ID | งาน | FR | ไซส์ | ไฟล์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W1a | `api-client`: ชนิด interface (health/import/solve/jobs/cancel/validate) · ตัว `stub` (อ่าน `frontend/contract/examples`) · ตัว `http` (timeout, แปลง error เป็นรหัส) · สลับด้วย env | FR-81 | S | `src/lib/api-client/**`, `src/config/env.ts` | สลับ stub↔http ด้วย env โดยไม่แก้ UI · test ครบรหัส: ตามสัญญา (`INVALID_INPUT`…) + `TIMEOUT`/`NETWORK`/`BAD_RESPONSE` |
| W1b | App Shell: ตัวบอกสถานะระบบ (`/health` + เวอร์ชัน contract) · ป้ายโหมด stub/สำรอง · พื้นที่แจ้งเตือน error ตามรหัส · `config/texts` เริ่มต้น | FR-80, 81, 82(ป้าย) | S | `src/app/AppShell.tsx`, `src/components/ui/**`, `src/config/texts.ts` | เกณฑ์ 05 §2 · ข้อความไทยอยู่ใน texts ทั้งหมด |
| W1c | เส้นทาง 3 หน้า + ตัวกั้น (guard) + ตัวบอกขั้น 1·2·3 | — | S | `src/app/routes.tsx`, `src/app/guards.ts`, `src/pages/*Page.tsx` (เปลือกว่าง) | เข้า `/process` ไม่ได้ถ้ายังไม่ยืนยันโจทย์ · เข้า `/result` ไม่ได้ถ้ายังไม่มีผล (ยกเว้นสาธิต) · ข้อความบอกเหตุผล |
| W2 | ที่เก็บสถานะ (05 §6) + บันทึกในเครื่อง (try/catch) + กู้คืนหลังรีเฟรช | FR-83 | S | `src/state/**`, `src/lib/persistence/**` | รีเฟรชแล้วข้อมูล/jobId อยู่ · ที่เก็บในเครื่องใช้ไม่ได้ → แอปทำงานต่อไม่บันทึก |

### P2 หน้า 3 ผลลัพธ์ (M2–M3) — ต้องมี Prerequisite D1 (§3)
| ID | งาน | FR | ไซส์ | ไฟล์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W3a | ฟังก์ชันสร้างกริด **ตามกลุ่ม** (ฟังก์ชันบริสุทธิ์ + test) | FR-20, 24 | S | `fsv/logic/build-grid-by-group.ts`, `fsv/types.ts` | ตัวอย่าง §4 |
| W3b | `ScheduleGrid` + `ScheduleCell` + `CellDetail` (คาบคร่อม, พัก, 2 กลุ่มพร้อมกัน, ทับซ้อนมีสัญลักษณ์) | FR-24, 25, 27 | S | `fsv/components/ScheduleGrid*.tsx`, `CellDetail.tsx` | 05 §5.4 (ส่วนแสดงตาราง) · มี loading/error/empty |
| W3c | `ResultPage` เปลือก: แถบสรุปผล, แท็บ, ตัวสลับมุมมอง, ไฮไลต์ตามตัวกรอง | FR-26 | S | `src/pages/ResultPage.tsx`, `fsv/components/ViewSwitcher.tsx` | หน้าเปิดได้ด้วยผลเฉลยตัวอย่าง · ≤ 40 บรรทัด (ประกอบอย่างเดียว) |
| W4a | มุมมองตามครู + สรุปภาระสอนเทียบเกณฑ์ตำแหน่ง | FR-21 | S | `fsv/logic/build-grid-by-teacher.ts`, `TeacherLoadSummary.tsx` | ผ่าน/ไม่ผ่านด้วยข้อความ ไม่ใช้สีอย่างเดียว · เกณฑ์ภาระมาจากข้อมูล |
| W4b | มุมมองตามห้อง | FR-22 | S | `fsv/logic/build-grid-by-room.ts` | ข้อมูลตรงมุมมองอื่น |
| W4c | มุมมองตามรายวิชา | FR-23 | S | `fsv/logic/build-grid-by-course.ts` | ข้อมูลตรงมุมมองอื่น |
| W4d | (C) ภาพรวมทุกกลุ่มพร้อมกัน | FR-30 | S | `fsv/**` | — |
| W5a | แท็บรายงาน: สรุปตามข้อคะแนน 1.1–2.4 + ปุ่ม "ตรวจอีกครั้ง" (เรียก validate) | FR-40, 44 | S | `src/features/report/components/RubricSummary.tsx` | ทุกข้อมีผล · ปุ่มเรียก validate ผ่าน api-client |
| W5b | รายการการฝ่าฝืน + กดแล้วกระโดดไปตำแหน่งในตาราง | FR-41 | S | `report/components/ViolationList.tsx`, `report/logic/group-violations.ts` | ใช้ fixture ฝ่าฝืนแล้วกระโดดถูกที่ |
| W5c | สาเหตุเมื่อจัดไม่ได้ (`infeasibility[]`) + เมตริก/ค่าโทษ/น้ำหนัก | FR-42, 43 | S | `report/components/InfeasibilityList.tsx`, `MetricsPanel.tsx` | F3 แสดงสาเหตุอ่านเข้าใจ (ตาม 05 §5.4) |
| W5d | (C) แผงคะแนนประเมินตัวเองตามแบบประเมิน | FR-45 | S | `report/**` | — |

### P3 หน้า 1 นำเข้า (M3)
| ID | งาน | FR | ไซส์ | ไฟล์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W6a | `UploadBox` + `useImportFile` + ปุ่มโหลดข้อมูลตัวอย่าง | FR-01, 73 | S | `src/features/import-data/components/UploadBox.tsx`, `hooks/useImportFile.ts` | ไฟล์ผิดชนิด/เสีย → ข้อความไทยชัด (05 §3.5) |
| W6b | `WarningList` + รับทราบทีละข้อ | FR-03 | S | `import-data/components/WarningList.tsx` | ยืนยันไม่ได้ถ้าคำเตือน "ต้องแก้" ยังค้าง |
| W6c | `DataTabs` (กลุ่ม/วิชา/ครู/ห้อง/เวลา) แบบอ่านอย่างเดียว + จำนวนสรุป | FR-02 | S | `import-data/components/DataTabs.tsx` | จำนวนตรงไฟล์ตัวอย่าง (05 §3.5) · จำนวนแถวไม่ตายตัว |
| W6d | แก้/เพิ่ม/ลบ วิชา ครู ห้อง บนหน้าจอ | FR-04, 05 | S | `import-data/**` | ค่าที่แก้ถูกส่งไปกับ `Problem` |
| W6e | `RulesForm` (ข้อสมมติ Q1–Q12 ที่เป็นข้อมูล) + ช่องข้อกำหนดเพิ่มจากกรรมการ | FR-06, 07 | S | `import-data/components/RulesForm.tsx` | เปลี่ยนค่าแล้วอยู่ใน `Problem.rules` |
| W6f | `ConfirmSummary` + บันทึก/เปิดชุดโจทย์เป็นไฟล์ + เชื่อมกับ guard | FR-08, 09 | S | `import-data/components/ConfirmSummary.tsx`, `logic/` | เกณฑ์ 05 §3.5 ครบ |

### P4 หน้า 2 ประมวลผล (M4)
| ID | งาน | FR | ไซส์ | ไฟล์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W7a | `SolveOptionsForm` + `useSolveJob` (เริ่มงาน) | FR-10, 14 | S | `src/features/solve/components/SolveOptionsForm.tsx`, `hooks/useSolveJob.ts` | ส่งตัวเลือกไปกับ solve |
| W7b | `JobStatusPanel`: สถานะ, ยกเลิก, กู้คืนงานหลังรีเฟรช | FR-11, 13 | S | `solve/components/JobStatusPanel.tsx` | ตามเครื่องสถานะ 05 §4.3 และ 02 §2.3 (`done` + outcome) |
| W7c | `PenaltyChart` + `LiveMetrics` (โพลทุก ~1 วินาที) | FR-12 | S | `solve/components/PenaltyChart.tsx`, `LiveMetrics.tsx` | กราฟอัปเดตต่อเนื่องและลดลงตามข้อมูล (stub จำลอง) |
| W7d | `RunHistory` (เก็บ/เทียบ/เลือกผล) + `FeasibilityHint` ก่อนเริ่ม | FR-15, 16 | S | `solve/components/RunHistory.tsx`, `FeasibilityHint.tsx` | เลือกผลแล้วหน้า 3 ใช้ผลนั้น |

### P5 ส่งออก / นักเรียน / สาธิต (M4–M5)
| ID | งาน | FR | ไซส์ | ไฟล์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W8a | ตัวสร้างสมุดงาน Excel (ฟังก์ชันบริสุทธิ์จาก view-model เดียวกับหน้าจอ) | FR-60 | S | `src/features/export/excel/**` | เปิดไฟล์ได้ ข้อมูลตรงหน้าจอ ไทยถูก |
| W8b | UI ส่งออก (เลือกกลุ่ม/ครู/ห้อง) + ส่งออกรายงาน + ไฟล์ JSON สำรอง | FR-62, 63, 64 | S | `export/components/**` | ไฟล์ตรงที่เลือก |
| W9a | **Spike S1** (04 §14.4): ทดลอง print-to-PDF กับ pdfmake + ฟอนต์ไทย บนเครื่องอื่น → บันทึกผลตัดสินใจ | — | S | `docs/` (บันทึกผล) + ไฟล์ทดลองแยก | สระ/วรรณยุกต์ถูก, ตารางไม่ล้นหน้า → ได้ข้อสรุปว่าใช้วิธีไหน |
| W9b | Export PDF / พิมพ์ ตามผล W9a | FR-61, 65 | S | `export/pdf/**` (+ print stylesheet) | 05 §5.4 ข้อ Export · A4 แนวนอน |
| W10a | หน้านักเรียน (เลือกชั้น/กลุ่ม → ดู) อ่านบนจอแคบได้ | FR-28, 29 | S | `fsv/components/StudentView.tsx` | 05 §5.4 ข้อหน้านักเรียน |
| W10b | แท็บสาธิต: `TechniqueExplainer`, `AssumptionsPanel`, `DemoScript` | FR-70, 71, 72 | S | `src/features/demo/**` | ซ้อมสาธิตตามสคริปต์ได้ใน 02 §9 |

### P6 ต่อของจริง + ซ้อม (M5–M6)
| ID | งาน | FR | ไซส์ | ไฟล์ที่คาดว่าแตะ | เกณฑ์ผ่าน |
|---|---|---|---|---|---|
| W11a | สลับ stub → http กับ algorithm จริง + รัน contract-check ของ `ai-contract` | FR-80 | S | `frontend/.env*`, สคริปต์ตรวจ | ตัวตรวจ contract ผ่าน · ทุกหน้าใช้ได้ด้วยข้อมูลจริง |
| W11b | Failure drill (algorithm ล่ม, ไฟล์เสีย, timeout, ผลช้า) + โหมดสำรอง (เปิดผลที่บันทึกไว้ **พร้อมป้าย**) | FR-82 | S | `src/features/**`, `src/app/**` | ทุกกรณีแสดงข้อความชัด ไม่ค้าง ไม่ crash |
| W11c | e2e 1–2 flow (นำเข้า → จัด → ดูผล → ส่งออก) | — | S | `frontend/e2e/**` | ผ่านด้วย stub และกับของจริง |
| W12a | (C) แก้ตารางด้วยมือ/ล็อกช่อง + เรียก validate ทันที | FR-50–52 | แตกเป็น S×3 ก่อนเริ่ม | — | ทำเมื่อ FQ2 = ใช่ หรือเวลาเหลือ |
| W12b | (C) บันทึกการกระทำสำคัญ | FR-84 | S | `src/lib/**` | — |

---

## 6. FR → หน้า → งาน (ตรวจไม่ให้ความต้องการตกหล่น)

| FR (03) | ระดับ | หน้า (05) | งาน |
|---|---|---|---|
| FR-01 | M | 1 | W6a |
| FR-02 | M | 1 | W6c |
| FR-03 | M | 1 | W6b |
| FR-04, 05 | S | 1 | W6d |
| FR-06, 07 | M, S | 1 | W6e |
| FR-08, 09 | S, M | 1 | W6f |
| FR-10, 14 | M, S | 2 | W7a |
| FR-11, 13 | M, S | 2 | W7b |
| FR-12 | M | 2 | W7c |
| FR-15, 16 | S | 2 | W7d |
| FR-20, 24 | M | 3 | W3a (+W3b) |
| FR-21 | M | 3 | W4a |
| FR-22 | M | 3 | W4b |
| FR-23 | M | 3 | W4c |
| FR-25, 27 | S, M | 3 | W3b |
| FR-26 | S | 3 | W3c |
| FR-28, 29 | M, S | 3 | W10a |
| FR-30 | C | 3 | W4d |
| FR-40, 44 | M | 3 | W5a |
| FR-41 | M | 3 | W5b |
| FR-42, 43 | M, S | 3 | W5c |
| FR-45 | C | 3 | W5d |
| FR-50–52 | C | 3 | W12a |
| FR-60 | M | 3 | W8a |
| FR-61, 65 | M, C | 3 | W9a → W9b |
| FR-62, 63, 64 | S | 3 | W8b |
| FR-70, 71, 72 | S | 3 | W10b |
| FR-73 | S | 1 | W6a |
| FR-80, 81 | M | ทุกหน้า | W1a, W1b, W11a |
| FR-82 | S | ทุกหน้า | W1b (ป้าย) + W11b |
| FR-83 | S | ทุกหน้า | W2 |
| FR-84 | C | ทุกหน้า | W12b |

---

## 7. Definition of Done (ทุก W — ตาม `AI_WEB_RULES_10B §13` + ส่วนของโปรเจกต์นี้)

- [ ] ไม่มีไฟล์เกิน 200 บรรทัด / ฟังก์ชันเกิน 40 · component ≤ 120 บรรทัด และ props ≤ 8 (ตรวจโดยคนใน review)
- [ ] ไฟล์หน้า (`pages/*Page.tsx`) ประกอบอย่างเดียว ไม่มีตรรกะ/เรียก API
- [ ] ไม่มี hard-code: ข้อความไทยอยู่ `config/texts` · ค่าคงที่อยู่ `constants` · **ไม่มีชื่อวิชา/ครู/จำนวนของไฟล์ตัวอย่างในโค้ด**
- [ ] ชื่อไฟล์/ฟังก์ชันบอกหน้าที่ · ไม่ซ้ำโค้ดเกิน 2 ที่ · ไม่สร้าง component ซ้ำกับ `components/ui`
- [ ] เรียกเครือข่ายผ่าน `lib/api-client` เท่านั้น (รวมกรณีใช้ TanStack Query)
- [ ] UI มี loading / error (ตามรหัส) / empty ครบ · สถานะไม่สื่อด้วยสีอย่างเดียว · ใช้คีย์บอร์ดได้ในส่วนหลัก
- [ ] ไม่มี `any`, `@ts-ignore`, `console.log`, โค้ดที่ comment ทิ้ง, secret
- [ ] ข้อมูลภายนอก/ไฟล์ผ่านการตรวจชนิด · ชนิดมาจาก contract (ไม่เขียนซ้ำ)
- [ ] แก้เฉพาะไฟล์ในขอบเขต Task Brief
- [ ] `check` (lint + typecheck + test) ผ่านและ **แปะผลจริง** ในรายงานจบงาน
- [ ] เกณฑ์ผ่านเฉพาะงาน (§5 + 05 §3.5/4.5/5.4) ผ่านครบ
- [ ] อัปเดตเอกสารถ้าพฤติกรรมเปลี่ยน (`docs/`) · commit อ้างรหัส W (ดู §9)

**รายงานจบงาน:** ใช้แม่แบบใน `AI_WEB_RULES_10B §10` ทุกครั้ง — ห้ามรายงานว่า "ผ่าน" ถ้าไม่ได้รันคำสั่งจริง

---

## 8. แผนทดสอบ Frontend

| ชั้น | ทดสอบอะไร | เครื่องมือ (04 §14) | งานที่เกี่ยว |
|---|---|---|---|
| ฟังก์ชันบริสุทธิ์ | build-grid ทุกมุมมอง, group-violations, ตัวสร้าง Excel | Vitest | W3a, W4a–c, W5b, W8a |
| api-client | สลับ stub/http, ทุกรหัส error, timeout, ตอบไม่ใช่ JSON | Vitest | W1a |
| คอมโพเนนต์ | ทุกสถานะ (loading/error/empty/สำเร็จ) ของส่วนสำคัญ | Vitest + Testing Library | W3b, W5*, W6*, W7* |
| Contract | ข้อมูลจาก `frontend/contract/examples` ตรง schema · ตัวตรวจกับ server จริง | สคริปต์ของ `ai-contract` | W11a |
| Failure drill | algorithm ล่ม · ไฟล์เสีย · timeout · job นาน | มือ + e2e | W11b |
| e2e | นำเข้า → จัด → ดูผล → ส่งออก | Playwright | W11c |
| ตรวจ export | เปิด Excel/PDF บนเครื่องอื่น (ฟอนต์ไทย) | มือ | W8a, W9b |

ข้อมูลทดสอบทั้งหมดมาจาก `frontend/contract/examples` (F1–F4 + ผลเฉลยตัวอย่าง) ที่เดียว · ไม่สร้างข้อมูลจำลองในโค้ด

---

## 9. วิธีทำงานกับ AI และ Git ทุกงาน

0. **เลือกงานเอง ไม่ต้องถามผู้ใช้:** ดู `README.md §0` — งานถัดไป = งานแรกที่ `todo` ใน `PROGRESS.md` ซึ่ง "ต้องมีก่อน" เป็น `done` · Roadmap (ไฟล์นี้) บอกว่าทำอะไร · `AI_WEB_RULES_10B.md` บอกว่าทำอย่างไร
1. **1 W = 1 เซสชันใหม่** (context ยาวทำให้โมเดลเล็กลืมกฎ) · ใส่ Task Brief (§4) + ตัวอย่างที่ต้องลอก 1 ไฟล์ + ส่วนของ contract ที่เกี่ยวข้อง — **ไม่ส่งทั้งโปรเจกต์/ทั้งเอกสาร**
2. AI ต้องเขียนแผน 3–7 ข้อก่อนลงมือ (AI_WEB_RULES §9) · แตะ > 5 ไฟล์ หรือ > 150 บรรทัดใหม่ → หยุด เสนอแตกงาน
3. คุณ review diff ทุกครั้ง: ตรวจ DoD (§7) โดยเฉพาะข้อที่ lint ตรวจไม่ได้ (ขนาด component, ชื่อ, การซ้ำ)
4. **ติดขัด:** แก้เรื่องเดิมไม่ผ่านเกิน 3 ครั้ง → หยุด สรุป: สิ่งที่ลอง · ข้อสังเกต · สมมติฐานสาเหตุ แล้วถามคน · ห้ามลบ test/ปิด lint/ใส่ `any` เพื่อให้ผ่าน
5. **Handoff Note** (≤ 15 บรรทัด) เมื่อต้องต่อข้ามเซสชัน: ทำแล้ว / เหลือ / การตัดสินใจที่ทำไป / ไฟล์ที่เปลี่ยน / ผล test
6. **Git:** branch `feat/W3a-grid-by-group` อายุ ≤ 1 วัน · commit แบบ Conventional Commits อ้างรหัส เช่น `feat(schedule-view): build grid by group (W3a)` + บรรทัด `Refs: FR-20, FR-24` · `main` ต้องรันและ `check` ผ่านเสมอ · **AI ไม่แก้** `frontend/contract/**`, `.github/**`, ไฟล์ lock โดยไม่ได้รับอนุมัติ
7. ถ้างานเปลี่ยนสิ่งที่ตกลงกับเพื่อน (ชื่อ/โครงฟิลด์/สถานะ) → **หยุด** แล้วเปิด PR ที่ `ai-contract` (02 §3) ก่อน ไม่แก้เองใน FE

---

## 10. ตัวอย่างทอง (golden examples) — ให้โมเดลเล็ก "ลอกรูปแบบ"

เก็บใน `docs/examples/` (ดัชนี `INDEX.md` สร้างที่ W0c) · งานแรกของแต่ละชนิดที่ผ่านการ review กลายเป็นตัวอย่าง:

| ชนิด | งานที่สร้างตัวอย่าง |
|---|---|
| ฟังก์ชันบริสุทธิ์ + test | W3a |
| Presentational component (ครบ 3 สถานะ) | W3b |
| ชั้น api-client + การจัดการรหัส error | W1a |
| รูปแบบ `config/texts` | W1b |
| Hook ที่โพลงาน | W7a |
| ฟอร์ม + ตรวจข้อมูล | W6e |

**กฎ:** งานที่ยังไม่มีตัวอย่างของชนิดนั้น (ตัวแรก) ให้คนเขียน/แก้เองอย่างละเอียดก่อน แล้วค่อยให้ AI ลอก

---

## 11. ความเสี่ยงเฉพาะแผนนี้ (ความเสี่ยงรวมอยู่ 02 §10)

| เรื่อง | ผลกระทบ | แนวทาง |
|---|---|---|
| Prerequisite D1 (contract v0.2 + fixtures) ยังไม่มี | W3a เริ่มไม่ได้อย่างถูกต้อง | ใช้ชนิด `TEMP` ไฟล์เดียว · อย่าเริ่ม W3b–W5 ก่อนมี contract จริง (ต้นทุนแก้ซ้ำสูง) |
| AI ขยายขอบเขต/แก้ไฟล์อื่น | ปะทะกับ contract/โครง | Task Brief จำกัดไฟล์ · lint boundaries · review diff ทุกครั้ง |
| งานหน้า 3 บวม | ล่าช้า | ทำเฉพาะ M ก่อน (W3, W4a–c, W5a–c, W8a) · C ทีหลัง |
| ภาษาไทยใน PDF | สูง | W9a ก่อน W9b · แผนสำรองให้ฝั่ง algorithm สร้าง PDF (ADR-07 ใน 04) |
| โมเดลเล็กลืมกฎเมื่อ context ยาว | คุณภาพตก | 1 W/เซสชัน · กฎที่เครื่องตรวจได้อยู่ใน lint ไม่ใช่ใน prompt |
| คำถามที่ยังไม่ตอบ (Q/G/FQ) | ออกแบบผิดทิศ | ดูดัชนีใน `README.md` · FQ1, FQ2, FQ4 กระทบแผนนี้ตรงๆ |

---

## 12. เช็กลิสต์ก่อนเริ่มลงมือ (Go/No-Go ของ W0)
- [ ] อ่าน `README.md` (ดัชนี) และ `AI_WEB_RULES_10B.md` แล้ว · Task Brief ของ W0a–W0c อยู่ที่ `docs/tasks/` แล้ว
- [ ] ตกลงรับ/ปฏิเสธข้อสมมติเริ่มต้นของ Q1–Q12 (หรืออย่างน้อยรู้ว่ายังไม่ตอบ)
- [ ] ตอบ FQ6 (เทคโนโลยี) — **ตอบแล้ว: React + Vite + TypeScript**
- [x] ตัวจัดการแพ็กเกจ — **ตัดสินแล้ว: npm**
- [ ] ตกลงกับเพื่อนว่า contract v0.2 จะมาเมื่อไหร่ (กำหนด Prerequisite D1)
