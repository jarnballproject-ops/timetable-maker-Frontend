> ⚠️ **เอกสารอ้างอิงเก่า (ถูกแทนที่แล้ว)** — checklist ชุดเดียวใช้กับทุกงาน ถูกแทนที่ด้วย `ENTERPRISE_PROJECT_ENGINEERING_FRAMEWORK.md` (EPEF)
> กฎเขียนโค้ดสำหรับ AI ของโปรเจกต์นี้ให้ใช้ `../AI_WEB_RULES_10B.md`

---

# AI Dev Playbook — แผนพัฒนาเว็บ Fullstack สำหรับ AI ทุกขนาด

> วิธีใช้: วางไฟล์นี้ที่ root โปรเจกต์ (หรือเปลี่ยนชื่อเป็น `CLAUDE.md` / `AGENTS.md` / `.cursorrules`)
> ทุกครั้งที่เริ่มงานใหม่ ให้ AI **อ่านไฟล์นี้ก่อน** แล้วทำ **ทีละ 1 งาน** ตามหัวข้อ 8

หลักคิดสำหรับโมเดลเล็ก: **ไม่ต้องตัดสินใจ ไม่ต้องเดา ไม่ต้องจำ** — ทุกอย่างถูกกำหนดไว้แล้ว (stack, โครงสร้างโฟลเดอร์, ชื่อ, ขั้นตอน) AI มีหน้าที่แค่ "เติมช่องว่าง" ตามแม่แบบ

---

## 1. ลำดับขั้นตอน (ห้ามข้ามขั้น)

| Phase | ผลลัพธ์ (ไฟล์ที่ต้องมี) | เสร็จเมื่อ |
|---|---|---|
| 0. Requirements | `docs/01-requirements.md` | มี user story + acceptance criteria ครบทุกฟีเจอร์ |
| 1. System design | `docs/02-system-design.md` | มี data model, API list, หน้าจอ ครบ |
| 2. Design system | `docs/03-design-system.md` + `src/styles/tokens.css` | มี token + รายการ component |
| 3. Scaffold | โปรเจกต์รันได้, CI ผ่าน | `pnpm dev`, `pnpm lint`, `pnpm test` ผ่านบนโปรเจกต์ว่าง |
| 4. Feature loop | ฟีเจอร์ละ 1 vertical slice | ผ่าน Definition of Done (หัวข้อ 9) |
| 5. Hardening | security / a11y / perf checklist | ทุกข้อติ๊กผ่าน |
| 6. Deploy | production + rollback plan | health check ผ่าน |

กฎ: เริ่ม Phase ถัดไปได้ก็ต่อเมื่อ Phase ก่อนหน้า "เสร็จเมื่อ" ครบ

---

## 2. Tech Stack (ล็อกแล้ว — ห้ามเปลี่ยนเองโดยไม่ถามคน)

| ชั้น | เครื่องมือ | เหตุผลสั้นๆ |
|---|---|---|
| Language | **TypeScript** (`strict: true`) | type ช่วยจับผิดแทน AI |
| Framework | **Next.js (App Router)** | frontend + backend ในที่เดียว |
| Styling | **Tailwind CSS** + **shadcn/ui** | ใช้ token เดียว ไม่ต้องเขียน CSS เอง |
| Validation | **Zod** | schema เดียวใช้ทั้ง client/server |
| Database | **PostgreSQL** + **Prisma** | schema ชัด, migration อัตโนมัติ |
| Auth | **Auth.js** (หรือ Clerk ถ้าไม่อยาก host เอง) | ห้ามเขียน auth เอง |
| Data fetching (client) | **TanStack Query** | cache/loading/error มาตรฐาน |
| Test | **Vitest** (unit) + **Playwright** (e2e) | |
| Package manager | **pnpm** | |
| Lint/Format | **ESLint + Prettier** | |
| CI | **GitHub Actions** | lint → typecheck → test → build |
| Deploy | **Vercel** หรือ **Docker** | |

ถ้าต้องการอะไรนอกตารางนี้ → **หยุดแล้วถามคน** พร้อมเหตุผล 1 บรรทัด

---

## 3. Software Architecture

### 3.1 รูปแบบ: Layered (Modular Monolith)

```
UI (app/, components/)
   ↓ เรียกได้เฉพาะ
Server Actions / Route Handlers  (src/app/**/actions.ts, route.ts)  ← รับ input + validate (Zod)
   ↓
Service (src/modules/<feature>/service.ts)                          ← business logic ล้วนๆ
   ↓
Repository (src/modules/<feature>/repo.ts)                          ← เรียก Prisma ที่นี่ที่เดียว
   ↓
Database
```

**ลูกศรไปทางเดียว** ห้ามเรียกย้อนขึ้น และห้ามข้ามชั้น (เช่น component เรียก Prisma ตรงๆ = ผิด)

### 3.2 โครงสร้างโฟลเดอร์

```
src/
  app/                      # เฉพาะ routing + page composition (บาง)
    (marketing)/page.tsx
    (app)/dashboard/page.tsx
    api/<name>/route.ts
  modules/                  # 1 โฟลเดอร์ = 1 ฟีเจอร์ (โค้ดจริงอยู่ที่นี่)
    todo/
      schema.ts             # Zod schema + type
      repo.ts               # Prisma เท่านั้น
      service.ts            # business logic
      actions.ts            # server actions
      components/           # UI เฉพาะฟีเจอร์นี้
      todo.test.ts
  components/ui/            # shadcn primitives (ห้ามแก้เกินจำเป็น)
  components/shared/        # component ที่ใช้ข้ามฟีเจอร์
  lib/                      # utils ทั่วไป (db.ts, auth.ts, env.ts, errors.ts)
  styles/tokens.css         # design tokens
prisma/schema.prisma
docs/
tests/e2e/
```

### 3.3 กฎการ import
- `modules/A` ห้าม import ข้างใน `modules/B` — ต้องผ่านไฟล์ `index.ts` ของ B เท่านั้น
- `components/ui` ห้าม import จาก `modules`
- อ่านตัวแปร env ผ่าน `lib/env.ts` (validate ด้วย Zod) ห้ามใช้ `process.env` กระจายทั่วโค้ด

### 3.4 รูปแบบมาตรฐาน (ใช้ซ้ำทุกฟีเจอร์)
- **ตั้งชื่อไฟล์:** `kebab-case`; component: `PascalCase.tsx`; ฟังก์ชัน: `camelCase`; ตาราง DB: `snake_case` พหูพจน์
- **Error:** ใช้ `Result` pattern → `{ ok: true, data } | { ok: false, error: { code, message } }` ห้าม throw ข้ามชั้น service→UI
- **Response API:** รูปแบบเดียวทั้งโปรเจกต์ `{ data, error }`
- **Time:** เก็บ UTC ใน DB เสมอ, แปลงตอนแสดงผล

---

## 4. System Design (เติมแม่แบบนี้ใน `docs/02-system-design.md`)

```markdown
# System Design: <ชื่อโปรเจกต์>

## 1. เป้าหมาย (1-3 บรรทัด)
## 2. ผู้ใช้และบทบาท (role)       เช่น guest, member, admin
## 3. ฟีเจอร์ (เรียงตามความสำคัญ)  F1, F2, ...  (MVP = F1..Fn)
## 4. Data model                    ตาราง / ฟิลด์ / ชนิด / ความสัมพันธ์ (ER แบบ text)
## 5. API / Server actions          ชื่อ | input | output | ใครเรียกได้ | error codes
## 6. หน้าจอ (routes)               path | วัตถุประสงค์ | ต้อง login? | component หลัก
## 7. Non-functional                ผู้ใช้พร้อมกัน, เวลาตอบสนอง, ข้อมูลอ่อนไหว
## 8. ความเสี่ยง / สิ่งที่ยังไม่รู้   → ต้องถามคนก่อนเริ่มโค้ด
## 9. นอกขอบเขต (ไม่ทำใน MVP)
```

กฎ: ถ้าหัวข้อไหนเดาไม่ได้ ให้เขียน `TODO-ASK:` แล้วถามคน **ห้ามเดาเอง**

### ตัวอย่าง data model ที่ดี
```
users(id uuid pk, email unique, name, role enum[member,admin], created_at)
todos(id uuid pk, user_id fk→users, title, done bool default false, created_at)
index: todos(user_id, created_at desc)
```
กฎ DB: ทุกตารางมี `id`, `created_at`, `updated_at`; ใช้ foreign key เสมอ; migration ผ่าน `prisma migrate` เท่านั้น

---

## 5. Design System (`docs/03-design-system.md` + `src/styles/tokens.css`)

### 5.1 Tokens (แหล่งความจริงเดียว — ห้าม hardcode ค่าในคอมโพเนนต์)

```css
:root {
  /* color: semantic ไม่ใช่ชื่อสี */
  --color-bg: ...;  --color-surface: ...;  --color-text: ...;  --color-text-muted: ...;
  --color-primary: ...;  --color-primary-fg: ...;  --color-danger: ...;  --color-border: ...;
  /* spacing: ฐาน 4px */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px;
  /* radius, shadow, font */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;
  --font-sans: ...;  --text-sm: 14px; --text-base: 16px; --text-lg: 20px; --text-2xl: 28px;
}
[data-theme="dark"] { /* override เฉพาะสี */ }
```
ผูก token เข้า `tailwind.config` แล้วใช้ผ่าน class (`bg-surface`, `text-muted`, `p-4`)

### 5.2 Component
- ใช้ shadcn/ui เป็นฐาน: Button, Input, Select, Dialog, Toast, Table, Card, Skeleton
- ทุก component ต้องมี **ครบ 4 state:** default / loading / empty / error (และ hover/focus/disabled สำหรับ interactive)
- ต้องมี **focus ring** และรองรับคีย์บอร์ด; contrast ข้อความ ≥ 4.5:1; ปุ่ม/ลิงก์แตะได้ ≥ 44px บนมือถือ
- ก่อนสร้าง component ใหม่ → **ค้นใน `components/` ก่อน** ถ้ามีอยู่แล้วให้ใช้ซ้ำ
- Layout: mobile-first, breakpoint มาตรฐาน `sm 640 / md 768 / lg 1024 / xl 1280`
- Icon: ชุดเดียว (`lucide-react`) ; ห้ามใช้ emoji เป็นไอคอน UI

---

## 6. AI RULES (กฎเหล็ก — ละเมิดข้อใดถือว่างานไม่ผ่าน)

### 6.1 ขนาดและโครงสร้างโค้ด
1. **ห้ามเขียนโค้ดไฟล์เดียวยาวๆ (one-page code)** — ไฟล์ละ ≤ **200 บรรทัด**, ฟังก์ชันละ ≤ **40 บรรทัด**, component ละ ≤ **150 บรรทัด** เกินให้แตกไฟล์
2. 1 ไฟล์ = 1 หน้าที่ (component / service / schema อย่างใดอย่างหนึ่ง)
3. `app/**/page.tsx` ห้ามมี business logic หรือ query DB — ทำหน้าที่ประกอบ component เท่านั้น
4. ห้ามเขียน CSS/Tailwind ค่าตายตัวที่ไม่อยู่ใน token (เช่น `#3b82f6`, `p-[13px]`)
5. ห้ามคัดลอก-วางโค้ดซ้ำเกิน 2 ที่ → แยกเป็นฟังก์ชัน/คอมโพเนนต์

### 6.2 กระบวนการทำงาน
6. ทำ **ทีละ 1 งาน ทีละ 1 slice** เสร็จ+ทดสอบก่อนเริ่มงานต่อไป
7. **อ่านก่อนเขียน:** เปิดไฟล์ที่เกี่ยวข้อง + ไฟล์ตัวอย่างที่คล้ายกันในโปรเจกต์ แล้วทำตามรูปแบบเดิม
8. **ห้ามเดา:** API/ฟังก์ชัน/ไลบรารี/ชื่อฟิลด์ที่ไม่แน่ใจ → ค้นโค้ดจริงหรือเอกสาร ถ้ายังไม่ชัด → ถามคน
9. **ห้ามแก้ไฟล์นอกขอบเขตงาน** ถ้าจำเป็นต้องแก้ ให้บอกเหตุผลก่อน
10. ห้ามเพิ่ม dependency ใหม่เองโดยไม่ถาม; ห้ามสร้างฟีเจอร์ที่ไม่ได้ขอ ("เผื่อไว้")
11. ห้ามลบ/ปิด test หรือ lint rule เพื่อให้ผ่าน — ต้องแก้ที่สาเหตุ
12. ก่อนจบงานต้องรัน `pnpm lint && pnpm typecheck && pnpm test` แล้วรายงานผลจริง ห้ามบอกว่า "ผ่าน" ถ้าไม่ได้รัน

### 6.3 คุณภาพโค้ด
13. TypeScript: **ห้าม `any`**, ห้าม `@ts-ignore`, ห้าม non-null `!` ถ้าไม่มีเหตุผลในคอมเมนต์
14. ทุก input จากภายนอก (form, query, body, env, webhook) ต้อง **validate ด้วย Zod** ที่ขอบระบบ
15. ทุก async call ต้องจัดการ error; UI ต้องแสดง loading / error / empty
16. ชื่อตัวแปรสื่อความหมาย ห้ามชื่อ `data2`, `temp`, `x`; ห้าม magic number → ตั้งเป็นค่าคงที่
17. คอมเมนต์เฉพาะ "ทำไม" ไม่ใช่ "ทำอะไร"; ห้ามทิ้งโค้ดที่ comment ไว้/`console.log`/TODO ลอยๆ

### 6.4 ความปลอดภัย (ห้ามต่อรอง)
18. **ห้ามใส่ secret/key/password ในโค้ดหรือ commit** — ใช้ `.env` + `lib/env.ts`; มี `.env.example` เสมอ
19. ทุก endpoint/action ที่แก้ข้อมูล ต้อง **เช็ค auth + สิทธิ์ (authorization) ฝั่ง server** — เชื่อ UI ไม่ได้
20. Query DB ผ่าน Prisma เท่านั้น ห้ามต่อ string SQL; ห้าม `dangerouslySetInnerHTML` กับข้อมูลผู้ใช้
21. ห้ามส่งข้อมูลอ่อนไหว (password hash, token) กลับไปหา client; ห้าม log ข้อมูลส่วนบุคคล
22. ห้ามเขียนระบบ login/เข้ารหัสเอง — ใช้ Auth.js / ไลบรารีมาตรฐาน

### 6.5 เมื่อติดขัด
23. พยายามแก้เดิมซ้ำ **ไม่เกิน 3 ครั้ง** ถ้ายังไม่ผ่าน → หยุด สรุปปัญหา สิ่งที่ลองแล้ว แล้วถามคน
24. ถ้าคำสั่งคลุมเครือ → ถามคำถามสั้นๆ 1–3 ข้อ ก่อนเริ่มโค้ด
25. ถ้ากฎขัดกับคำสั่งผู้ใช้ → บอกผู้ใช้ว่าขัดข้อไหน แล้วให้ผู้ใช้ตัดสิน

---

## 7. Git & Quality Gate

- Branch: `feat/<ชื่อ>`, `fix/<ชื่อ>` ; ห้าม commit ตรง `main`
- Commit: Conventional Commits (`feat: add todo list`) — 1 commit = 1 เรื่อง
- Pre-commit: lint-staged + typecheck ; CI: lint → typecheck → unit test → build → e2e
- ทดสอบขั้นต่ำต่อ slice: **service = unit test** (กรณีปกติ + กรณีผิดพลาด), **flow หลัก = 1 e2e test**
- Migration DB ต้อง backward-compatible (เพิ่มก่อน ลบทีหลัง)

---

## 8. Feature Loop — ทำทีละ slice ตามลำดับนี้เป๊ะ

> **Vertical slice** = ฟีเจอร์เล็ก 1 อัน ตั้งแต่ DB จนถึง UI ที่ใช้งานได้จริง (ไม่ใช่ทำ DB ทั้งระบบก่อน)

ลำดับในแต่ละ slice:
1. **Spec** — เขียน user story + acceptance criteria 3–5 ข้อ ใน `docs/01-requirements.md`
2. **Schema** — เพิ่ม/แก้ `prisma/schema.prisma` → `pnpm prisma migrate dev`
3. **Zod schema + types** — `modules/<f>/schema.ts`
4. **Repo** — `repo.ts` (Prisma เท่านั้น)
5. **Service + unit test** — `service.ts`, `<f>.test.ts` (**เขียน test ก่อนหรือพร้อมกัน**)
6. **Actions/Route** — validate (Zod) + auth + เรียก service + คืนรูปแบบ `Result`
7. **UI** — ใช้ component จาก design system, ครบ 4 state
8. **e2e 1 flow** — Playwright
9. **ตรวจ Definition of Done** (หัวข้อ 9) → commit

### แม่แบบ prompt สั่งงาน AI (copy ใช้ได้เลย)

```
อ่าน AI_DEV_PLAYBOOK.md ก่อน แล้วทำงานนี้เพียงงานเดียว

งาน: <เช่น "เพิ่มฟีเจอร์สร้าง todo">
Acceptance criteria:
- ...
- ...
ไฟล์ที่อนุญาตให้แตะ: src/modules/todo/**, prisma/schema.prisma
ตัวอย่างที่ให้ทำตาม: src/modules/<ฟีเจอร์ที่เสร็จแล้ว>/
ขั้นตอน: ทำตามหัวข้อ 8 ข้อ 1–9 ทีละข้อ ระบุว่าอยู่ข้อไหนทุกครั้ง
เมื่อเสร็จ: รัน lint/typecheck/test รายงานผลจริง + รายชื่อไฟล์ที่เปลี่ยน
ถ้าไม่แน่ใจข้อไหน ให้ถามก่อน อย่าเดา
```

### แม่แบบรายงานเมื่อจบงาน (AI ต้องตอบรูปแบบนี้)
```
✅ ทำแล้ว: ...
📁 ไฟล์ที่เปลี่ยน: ...
🧪 ผลรัน: lint [ผ่าน/ไม่ผ่าน] | typecheck [...] | test [x passed, y failed]
⚠️ ข้อสังเกต/สิ่งที่ยังไม่ได้ทำ/ความเสี่ยง: ...
❓ คำถามค้างถึงคน: ...
```

---

## 9. Definition of Done (ติ๊กครบทุกข้อถึงจะเรียกว่าเสร็จ)

- [ ] ตรงตาม acceptance criteria ทุกข้อ
- [ ] ไม่มีไฟล์เกิน 200 บรรทัด / ฟังก์ชันเกิน 40 บรรทัด
- [ ] ไม่มี `any`, `console.log`, โค้ดที่ comment ทิ้ง, secret
- [ ] input ทุกจุด validate ด้วย Zod; endpoint ที่แก้ข้อมูลเช็คสิทธิ์ฝั่ง server
- [ ] UI มี loading / empty / error; ใช้ token เท่านั้น; ใช้คีย์บอร์ดได้; mobile ไม่พัง
- [ ] มี unit test ของ service (ปกติ + ผิดพลาด) และ e2e อย่างน้อย 1 flow
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` ผ่าน (รันจริง)
- [ ] อัปเดต `docs/` ถ้า data model / API / route เปลี่ยน
- [ ] commit message ตาม Conventional Commits

---

## 10. Hardening Checklist (Phase 5) และ Deploy (Phase 6)

**Security:** rate limit บน login/API สาธารณะ · security headers (CSP, HSTS) · CORS จำกัด origin · `pnpm audit` ไม่มี high/critical · cookie `HttpOnly + Secure + SameSite`
**A11y:** ผ่าน axe/Lighthouse ≥ 90 · alt text · label ทุก input · heading เรียงลำดับ
**Performance:** Lighthouse Perf ≥ 85 · รูปใช้ `next/image` · query มี index · ไม่มี N+1
**Deploy:** env ครบบน production · `/api/health` ตอบ 200 · backup DB อัตโนมัติ · มีขั้นตอน rollback (deploy ก่อนหน้า + migration ถอยได้) · error monitoring (เช่น Sentry)

---

## 11. Anti-patterns ที่โมเดลเล็กชอบทำ (ห้ามทำ)

| ❌ อย่าทำ | ✅ ทำแทน |
|---|---|
| ยัดทั้งแอปไว้ใน `page.tsx` ไฟล์เดียว | แยกเป็น module/service/component ตามหัวข้อ 3 |
| สร้างฟีเจอร์ 5 อย่างในครั้งเดียว | 1 slice ต่อ 1 รอบ |
| ประดิษฐ์ชื่อฟังก์ชัน/ไลบรารีที่ไม่มีจริง | ค้นในโค้ด/เอกสารก่อน ไม่เจอให้ถาม |
| เขียนสี/ขนาดตรงๆ ใน JSX | ใช้ token |
| แก้ test ให้ผ่านแทนการแก้โค้ด | แก้ที่ต้นเหตุ |
| บอก "เสร็จแล้ว" โดยไม่รันอะไร | รันแล้วแปะผลจริง |
| เขียน auth/crypto เอง | ใช้ Auth.js |
| ติดแล้ววนแก้ไม่จบ | หยุดหลัง 3 ครั้ง แล้วถามคน |

---

## 12. Quick Start (ลำดับคำสั่ง Phase 3)

```bash
pnpm create next-app@latest app --ts --tailwind --eslint --app --src-dir --use-pnpm
cd app
pnpm dlx shadcn@latest init
pnpm add zod @tanstack/react-query @prisma/client next-auth lucide-react
pnpm add -D prisma vitest @playwright/test prettier lint-staged husky
pnpm prisma init
# แล้ว: สร้างโครงโฟลเดอร์ตามหัวข้อ 3.2, lib/env.ts, .env.example, GitHub Actions CI
```
