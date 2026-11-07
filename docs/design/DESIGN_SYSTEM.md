# Fusion Design System

พื้นหลังขาว ตัดด้วยเส้นเขียว เน้นอ่านข้อมูลหนาแน่นแบบ enterprise
แหล่งความจริงเดียวคือ `tokens.json` ส่วน `tokens.css` สร้างจากมันด้วย `node build-tokens.mjs` ห้ามแก้ `tokens.css` ด้วยมือ

## 1. ลักษณะเฉพาะ (ที่ทำให้ไม่ใช่ UI สำเร็จรูป)

ดึงจากต้นแบบโดยตรง แล้วแปลงเป็น token

| ลักษณะจากต้นแบบ | Token ที่รองรับ |
|---|---|
| การ์ดขาวมุมโค้งใหญ่ วางบนพื้นเทาอมเขียวอ่อน | `radius-card` (24px), `color-surface-canvas`, `color-surface-card` |
| ปุ่ม ชิป เมนูเป็นทรงแคปซูล ตัดกับการ์ดมุมใหญ่ | `radius-control` (full), `radius-field` (16px) |
| เมนูบนเป็นแคปซูล ตัวที่เลือกเป็นเขียวเกือบดำ | `color-nav-active-bg` (green-900) |
| ตัวเลข KPI ใหญ่ น้ำหนักบาง พร้อมป้ายเปลี่ยนแปลงเล็ก | `type-kpi-*` (40px, light), `font-numeric-tabular` |
| แท่งกราฟโค้งมน ตัวเด่นสีเข้ม ที่เหลือสีอ่อน | `color-chart-bar-highlight`, `color-chart-bar-muted` |
| เส้นเขียวบาง ๆ แบ่งเนื้อหา | `color-border-default` (green-200) |

## 2. สถาปัตยกรรม Token

สามชั้น และอ้างอิงได้ทางเดียว: component อ้าง semantic, semantic อ้าง primitive

| ชั้น | ตัวอย่างชื่อ | ใช้ที่ไหน |
|---|---|---|
| Primitive | `--color-green-700`, `--space-4`, `--radius-xl` | อ้างได้เฉพาะใน semantic เท่านั้น |
| Semantic | `--color-text-primary`, `--color-action-primary-bg`, `--size-control-md` | ใช้ใน component และหน้าจอ |
| Component | `--button-height-md`, `--card-padding`, `--table-row-height` | ใช้ภายใน component นั้น |

ชื่อ: `หมวด-กลุ่ม-ชื่อ-สถานะ` ตัวพิมพ์เล็ก คั่นด้วย `-` เช่น `color-action-primary-bg-hover`
ตัว build จะล้มเหลวถ้ามีชื่อ CSS ซ้ำกัน, alias ไม่มีปลายทาง หรือ dark theme มี token ไม่ครบเท่า light

### ครบตามที่กำหนด

สี `color-*` / ระยะ `space-*` / ตัวอักษร `font-*` และ `type-*` / มุม `radius-*` / เงา `shadow-*` / เส้นขอบ `border-*` / ขนาด `size-*` / ลำดับซ้อน `z-*` / breakpoint `breakpoint-*` / การเคลื่อนไหว `duration-*` `easing-*`

### พาเลตสีแบรนด์ (Green)

| Step | Hex | ที่มา |
|---|---|---|
| 50 | `#F0F8F2` | คำนวณเพิ่ม |
| 100 | `#DAF1DE` | ตามต้นแบบ |
| 200 | `#BADBC3` | คำนวณเพิ่ม |
| 300 | `#8EB69B` | ตามต้นแบบ |
| 400 | `#6C9D7D` | คำนวณเพิ่ม |
| 500 | `#4A8264` | คำนวณเพิ่ม |
| 600 | `#2E6455` | คำนวณเพิ่ม |
| 700 | `#235347` | ตามต้นแบบ |
| 800 | `#163832` | ตามต้นแบบ |
| 900 | `#0B2B26` | ตามต้นแบบ |
| 950 | `#051F20` | ตามต้นแบบ |

ข้อควรระวัง: green-100 และ green-300 ใช้เป็นพื้นหรือเส้นตกแต่งเท่านั้น ห้ามใช้เป็นสีตัวอักษรบนพื้นขาว (คอนทราสต์ไม่ผ่าน)

### Breakpoint

`sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` (px) CSS variable ใช้ใน `@media` ไม่ได้ ให้อ่านจาก `tokens.json` หรือเขียนค่าตัวเลขตรง ๆ ตามตารางนี้เท่านั้น

### ธีมและความหนาแน่น

- Light เป็นค่าเริ่มต้น Dark: ตั้ง `data-theme="dark"` ที่ `<html>`
- Density: `data-density="compact"` ลดความสูงควบคุมจาก 40 เป็น 32px และแถวตารางจาก 56 เป็น 40px
- อุปกรณ์สัมผัส (`pointer: coarse`) ได้เป้าหมายอย่างน้อย 44px เสมอ แม้เป็น compact
- `prefers-reduced-motion` ลดการเคลื่อนไหวเหลือเกือบ 0 อัตโนมัติ

## 3. ตัวอักษร

ฟอนต์ `IBM Plex Sans Thai` ตัวเดียวครอบคลุมไทยและละติน ทำให้ข้อความผสมมีจังหวะเดียวกัน

| Style | ขนาด | น้ำหนัก | Line height |
|---|---|---|---|
| kpi | 40px | 300 | 1.3 |
| h1 / h2 / h3 | 30 / 24 / 20px | 600 | 1.4 |
| title | 18px | 500 | 1.4 |
| body | 16px | 400 | 1.5 |
| body-sm / label | 14px | 400 / 500 | 1.5 |
| caption | 12px | 400 | 1.5 |

กฎภาษาไทย: line-height ต่ำสุด 1.3 (ต่ำกว่านี้สระและวรรณยุกต์ถูกตัด) เนื้อหาปกติ 1.5 ขึ้นไป
ตัวเลขใน KPI, ตาราง และราคา ใช้ `font-variant-numeric: var(--font-numeric-tabular)` เพื่อให้หลักตรงกัน

## 4. ไอคอน

- ใช้ `lucide-react` ตัวเดียวทั้งระบบ ห้ามผสม library อื่น ห้ามใช้ Emoji และอักขระ Unicode ตกแต่งแทนไอคอนทุกกรณี
- ขนาด: `size-icon-sm/md/lg` = 16 / 20 / 24px, `stroke-width` = `icon-stroke` (1.75) ค่าเดียวทั้งระบบ
- ไอคอนตกแต่ง: `aria-hidden="true"` ปุ่มที่มีแต่ไอคอน: ต้องมี `aria-label` และ tooltip
- สถานะ (สำเร็จ/ผิดพลาด/เตือน/ข้อมูล) ต้องมีไอคอนและข้อความคู่กันเสมอ ห้ามสื่อด้วยสีอย่างเดียว เพราะเขียวแบรนด์กับเขียวสำเร็จใกล้กัน
  - สำเร็จ `circle-check` / ผิดพลาด `circle-alert` / เตือน `triangle-alert` / ข้อมูล `info`

## 5. มาตรฐาน Component

สถานะ: D=Default, H=Hover, F=Focus-visible, A=Active, X=Disabled, L=Loading, E=Error  ช่อง "-" คือไม่มีสถานะนั้น

| Component | D | H | F | A | X | L | E | หมายเหตุ |
|---|---|---|---|---|---|---|---|---|
| Button (primary/secondary/ghost/danger) | มี | มี | มี | มี | มี | มี | - | Loading: ไอคอนหมุน ล็อกความกว้าง `aria-busy` |
| Input / Textarea | มี | มี | มี | - | มี | มี | มี | Error: เส้นขอบแดง + ไอคอน + ข้อความใต้ช่อง |
| Select | มี | มี | มี | - | มี | มี | มี | ใช้ `menu` เป็นรายการ |
| Checkbox | มี | มี | มี | มี | มี | - | มี | มี indeterminate |
| Radio | มี | มี | มี | มี | มี | - | มี | จัดกลุ่มด้วย `fieldset` + `legend` |
| Dialog | มี | - | มี | - | - | มี | มี | ติด focus trap ปิดด้วย Esc คืน focus เดิม |
| Dropdown / Menu | มี | มี | มี | มี | มี | มี | - | ลูกศรขึ้นลง Home/End Esc |
| Navigation (pill, sidebar) | มี | มี | มี | มี | มี | - | - | ตัวที่เลือก `aria-current="page"` |
| Card | มี | มี* | มี* | - | - | มี | มี | *เฉพาะการ์ดที่กดได้ ต้องเป็น `a` หรือ `button` จริง |
| Table | มี | มี | มี | - | - | มี | มี | หัวตารางใช้ `th scope`, เรียงลำดับได้ด้วยคีย์บอร์ด |
| Badge | มี | - | - | - | - | - | - | ไอคอน + ข้อความเสมอ |
| Tooltip | มี | - | มี | - | - | - | - | แสดงเมื่อ focus ด้วย ปิดด้วย Esc |
| Feedback (Alert, Toast, Inline) | มี | - | - | - | - | - | - | Toast: `role="status"`, ข้อผิดพลาด `role="alert"` |

ขนาดควบคุม: sm 32 / md 40 / lg 48px ค่าเริ่มต้นคือ md Focus ring: 2px สี `color-focus-ring` เว้น 2px ต้องเห็นชัดทั้งบน canvas และบนการ์ด

## 6. สถานะข้อมูลของทุกหน้า

ทุกเนื้อหาที่โหลดข้อมูลต้องจัดการครบสี่สถานะ

| สถานะ | รูปแบบ | กฎ |
|---|---|---|
| Loading | Skeleton ทรงเดียวกับเนื้อหาจริง | กระพริบความโปร่งใสเท่านั้น (`duration-pulse`) ห้ามใช้ shimmer เพราะต้องใช้ gradient |
| Empty | ไอคอน + หัวข้อ + คำอธิบาย | ใส่ปุ่ม CTA เฉพาะเมื่อมี action จริงและผู้ใช้มีสิทธิ์ ถ้าไม่มีให้บอกเหตุผล |
| Error | `status-danger` + ไอคอน + ข้อความ + ปุ่มลองใหม่ | บอกว่าเกิดอะไรและทำอย่างไรต่อ ไม่แสดง stack trace |
| Success | Toast หรือ Alert `status-success` | ยืนยันผลของ action ที่ผู้ใช้ทำ |

ห้ามสร้างปุ่มที่ไม่มีการทำงานจริง ปุ่มที่ใช้ไม่ได้ชั่วคราวต้องมีข้อความหรือ tooltip บอกเหตุผล

## 7. กราฟ

- ซีรีส์ 1-5 ใช้ `color-chart-series-*` และต้องมีป้าย/ค่าประกอบ ไม่พึ่งสีอย่างเดียว
- แท่งที่ไม่ได้เน้นใช้สีทึบ `chart-bar-muted` ห้ามทำลายทแยง (hatch) ด้วย `repeating-linear-gradient` หากต้องการลวดลายให้ใช้ SVG pattern
- ห้ามใช้ gradient ในกราฟ พื้นหลัง หรือปุ่ม

## 8. คอนทราสต์ (ผลตรวจจริง)

`node build-tokens.mjs` ตรวจ 46 คู่สีต่อธีม (รวม 92 รายการ ทั้ง light และ dark) และจบด้วย exit 1 ถ้าไม่ผ่าน ผลล่าสุดผ่านทั้งหมด ดู `contrast-report.txt`

เกณฑ์: ข้อความ 4.5:1, ขอบควบคุม/focus ring/สีกราฟ 3:1 เทียบกับทั้ง canvas และการ์ด

ค่าที่ต้องรู้ (light): `text-muted` บน canvas 5.88:1, `border-control` บน canvas 4.02:1, `focus-ring` บน canvas 6.30:1

## 9. ทำ / ห้าม

| ทำ | ห้าม |
|---|---|
| ใช้ `var(--color-text-primary)` | เขียน hex หรือ rgb ตรงใน component |
| ขอเพิ่ม token ในระบบกลางก่อน | สร้างค่าเฉพาะกิจใน component |
| ตรวจ token ที่มีอยู่ก่อนเพิ่มใหม่ | สร้างค่าที่ซ้ำกับของเดิมโดยชื่อต่าง |
| ใช้ component กลาง | ทำ component ใหม่ที่หน้าที่ซ้ำกับของเดิม |
| ใช้ Lucide พร้อมขนาดจาก token | ใช้ Emoji, Unicode ตกแต่ง หรือหลาย icon library |
| ใช้สีทึบและสีนุ่ม | ใช้ gradient, neon หรือสีฉูดฉาด |

เช็กอัตโนมัติที่แนะนำใน CI (ใส่เมื่อรู้โครงสร้างโปรเจกต์): ค้น hex `#[0-9a-fA-F]{3,8}` และ `gradient(` ในโค้ด component ซึ่งต้องไม่พบเลย

## 10. การเปลี่ยนแปลง Token / Component กลาง

1. ค้นหาว่ามี token ที่ใช้ได้อยู่แล้วหรือไม่
2. เพิ่มที่ `tokens.json` ชั้นที่ถูกต้อง (primitive ก่อน แล้ว semantic แล้ว component) พร้อมค่าของ dark theme
3. รัน `node build-tokens.mjs` ต้องผ่านทั้งหมด
4. ก่อนแก้ component กลาง ให้ค้นรายชื่อทุกหน้าที่ใช้ และตรวจผลกระทบทั้ง light/dark และ compact
5. ดูภาพรวมได้ที่ `specimen.html`

## ไฟล์

| ไฟล์ | หน้าที่ |
|---|---|
| `tokens.json` | แหล่งความจริงเดียว (รูปแบบ W3C DTCG) |
| `build-tokens.mjs` | สร้าง `tokens.css` และตรวจคอนทราสต์ |
| `tokens.css` | ไฟล์สร้างอัตโนมัติ ห้ามแก้ |
| `contrast-report.txt` | ผลตรวจล่าสุด |
| `specimen.html` | หน้าตัวอย่างที่ใช้เฉพาะ token |

## การนำไปใช้ในโปรเจกต์ timetable-maker (D2 -> W0d)

ไฟล์ชุดนี้คือ Prerequisite D2 ของ `docs/06_DEVELOPMENT_PLAN_Frontend.md` งานที่นำเข้าแอปคือ W0d (ต้องรอ W0a)

| เรื่อง | ข้อกำหนด |
|---|---|
| ฟอนต์ | แอปต้องใช้งานออฟไลน์ (03 NFR, 04 §14) ห้ามโหลดจาก Google Fonts ใน `frontend/` ให้ติดตั้ง `@fontsource/ibm-plex-sans-thai` (ชุดย่อยไทย+ละติน น้ำหนัก 300/400/500/600/700) หรือเปลี่ยนเป็น Sarabun/Noto Sans Thai แล้วแก้ `font-family-sans` ใน `tokens.json` ที่เดียว |
| specimen.html | เป็นเอกสารตัวอย่างเท่านั้น โหลดฟอนต์และ Lucide จาก CDN จึงต้องออนไลน์ ไม่ใช่ส่วนของแอป |
| ตำแหน่งในแอป | คัดลอก `tokens.css` ไป `frontend/src/styles/` (ตามโครง 05 §7) แหล่งจริงยังเป็น `docs/design/tokens.json` ห้ามแก้ที่สำเนา |
| Tailwind | map utility ไปที่ `var(--...)` ใน `tailwind.config` เช่น `bg-surface-card` -> `var(--color-surface-card)` ห้ามใส่ค่า hex ซ้ำใน config และห้ามใช้ arbitrary values (`p-[13px]`) |
| ขนาดไฟล์ | `tokens.css` และ `tokens.json` เป็นไฟล์ข้อมูลที่เกิน 200 บรรทัดโดยธรรมชาติ ต้องยกเว้นใน `max-lines` และใน regex ตรวจ hex ของ W0b (ตรวจเฉพาะ `src/components`, `src/features`, `src/pages`) |
| ตรวจก่อน commit | รัน `node docs/design/build-tokens.mjs` เมื่อแก้ `tokens.json` แล้ว commit `tokens.css` พร้อมกัน |
| ยังไม่มี | token เฉพาะตารางเรียน (สีวิชาทฤษฎี/ปฏิบัติ/พักกลางวัน/ช่องชน) ควรเพิ่มใน W0d หรือ W3b เมื่อรู้หน้า 3 จริง |
