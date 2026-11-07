# PROGRESS — สถานะงาน Frontend (W)

> ไฟล์นี้เก็บ **สถานะอย่างเดียว** (รายละเอียดงาน/เกณฑ์ผ่านอยู่ที่ `06_DEVELOPMENT_PLAN_Frontend.md §5`) · AI/คน เลือกงานถัดไปจากที่นี่
> สถานะ: `todo` ยังไม่เริ่ม · `doing` กำลังทำ (ได้ครั้งละ 1 งาน) · `blocked` ติด (ใส่เหตุผล) · `done` ผ่าน DoD (`06 §7`) แล้ว
> **แก้สถานะเป็น `done` ได้เมื่อ** รายงานจบงาน (AI_WEB_RULES §10) แปะผล `check` จริง และคน review แล้วเท่านั้น

**วิธีเลือกงานถัดไป:** งานแรกจากบนลงล่างที่ `todo` และ "ต้องมีก่อน" เป็น `done` ครบ · ไม่ข้ามลำดับ · งาน (C) ทำเมื่องาน M/S ในเฟสนั้นเสร็จหมดแล้วหรือคนสั่ง

| ID | ต้องมีก่อน | ระดับ | สถานะ | หมายเหตุ |
|---|---|---|---|---|
| W0a | — | M | todo | Brief: `tasks/W0a.md` · **เริ่มที่นี่** |
| W0b | W0a | M | todo | Brief: `tasks/W0b.md` · gitleaks/pre-commit/CI เลื่อน (ต้องอนุมัติ) |
| W0c | W0b | M | todo | Brief: `tasks/W0c.md` |
| W0d | W0a + **D2** | S | todo | D2 = ไฟล์ design tokens + Design System จากผู้ใช้ (`docs/design/`) · Brief เขียนเมื่อได้ไฟล์ |
| W1a | W0b | M | todo | |
| W1b | W1a, W0d | M | todo | งาน UI ตั้งแต่ตรงนี้ต้องใช้ token |
| W1c | W1b | M | todo | |
| W2 | W1c | S | todo | |
| W3a | W2 + **D1** | M | todo | D1 = contract v0.2+ และ fixtures F1–F4 (`06 §3`) · D2 = design tokens (`06 §3`) |
| W3b | W3a | M | todo | |
| W3c | W3b | M | todo | |
| W4a | W3c | M | todo | |
| W4b | W3c | M | todo | |
| W4c | W3c | M | todo | |
| W4d | W4a–c | C | todo | |
| W5a | W3c | M | todo | |
| W5b | W5a | M | todo | |
| W5c | W5a | M | todo | |
| W5d | W5c | C | todo | |
| W6a | W2 | M | todo | |
| W6b | W6a | M | todo | |
| W6c | W6a | M | todo | |
| W6d | W6c | S | todo | |
| W6e | W6c | M | todo | |
| W6f | W6b, W6e | M | todo | |
| W7a | W6f | M | todo | |
| W7b | W7a | M | todo | |
| W7c | W7b | M | todo | |
| W7d | W7b | S | todo | |
| W8a | W4a–c | M | todo | |
| W8b | W8a | S | todo | |
| W9a | W8a | M | todo | spike S1 (`04 §14.4`) |
| W9b | W9a | M | todo | |
| W10a | W3c | M | todo | |
| W10b | W5c, W7c | S | todo | |
| W11a | W7c + algorithm พร้อม | M | todo | |
| W11b | W11a | S | todo | |
| W11c | W11b | M | todo | |
| W12a | W11c | C | todo | ทำเมื่อ FQ2 = ใช่ หรือเวลาเหลือ |
| W12b | W11c | C | todo | |

> หมายเหตุ: คอลัมน์ "ระดับ" คือความสำคัญ M/S/C ตาม `03` (ไม่ใช่ไซส์ XS–M — ไซส์อยู่ที่ `06 §5`)
