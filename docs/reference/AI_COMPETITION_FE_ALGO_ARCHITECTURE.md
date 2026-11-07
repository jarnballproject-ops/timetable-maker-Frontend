> ⚠️ **เอกสารอ้างอิงเก่า (ถูกแทนที่แล้ว)** — เขียนก่อนรู้โจทย์จริง ใช้ contract แบบ placeholder (`/v1/process` ตัวเดียว) และสมมติว่าประมวลผลสั้น
> ปัจจุบันให้ใช้: contract → `../02_PLAN_แผนงาน.md` §2 · สถาปัตยกรรม → `../04_SYSTEM_ARCHITECTURE.md`
> **ยังใช้อ้างอิงได้:** หลักคิด Stub/Fake/Mock, การตั้งค่าเครือข่ายข้ามเครื่อง (§7), กลยุทธ์ Git (§8)

---

# สถาปัตยกรรมแยก Frontend / Algorithm — การแข่งขันทักษะ AI (2 คน)

> เขียนโดยใช้ EPEF (`ENTERPRISE_PROJECT_ENGINEERING_FRAMEWORK.md`) แบบ **Track FAST · Domain: D-WEB + D-API (+ D-ML ถ้าอัลกอริทึมเป็นโมเดล)**

## 0. Tailoring Note (EPEF §1, §15 ทำงานอย่างไรในเคสนี้)

| ข้ามไป | เหตุผล |
|---|---|
| RACI, Readiness 21 ข้อ, Solution matrix เต็มรูป | 2 คน เวลาจำกัด — ใช้ตารางเทียบสั้นใน §3 แทน |
| Threat model, IaC, DR, multi-env | ไม่มีข้อมูลอ่อนไหว (**ถ้าเป็นจริง** — ดู UNKNOWN) รันชั่วคราว |
| ERD / Database | ไม่มี DB ในโจทย์ |
| ADR ทุกเรื่อง | ทำ 3 บรรทัดสำหรับการตัดสินใจย้อนกลับยากเท่านั้น (§4) |

**คงไว้ (Safety floor แบบย่อ):** validate input ฝั่ง algorithm · ไม่ commit secret/weights · มี fallback ถ้าระบบล่มวันแข่ง · ซ้อมก่อนวันจริง
**Debt Register:** ที่ท้ายเอกสาร

---

## 1. Fast Brief + Intake (กรอกจากสิ่งที่คุณเล่ามา)

```
เป้าหมาย:   Input → Processing → Output; FE (คุณ) + Algorithm (เพื่อน) ทำคนละเครื่อง ต่อกันได้เร็ว
Deadline:   วันแข่ง (UNKNOWN: วันที่/เวลาเตรียมตัว)     ผู้รับผิดชอบ: คุณ (FE), เพื่อน (Algo)
Stack:      ตามหัวข้อ §3 (ขึ้นกับ UNKNOWN U2–U3)
Must-have:  M1 ผู้ใช้ป้อน input → เห็น output  M2 ทั้งสองฝั่งพัฒนา+ทดสอบแยกกันได้  M3 ต่อกันภายใน ≤ 30 นาที
Out of scope: auth, DB, deploy ขึ้น cloud, scale
แผนหลังจบ:  ทิ้ง (โปรเจกต์แข่ง)
```

**Intake A–C**
| ID | คำตอบ |
|---|---|
| A1 | สร้างระบบอัลกอริทึมที่มี UI สำหรับแข่ง AI |
| A2 | ผู้ใช้ = กรรมการ/ผู้ทดสอบ ไม่กี่คน |
| A3 | สำเร็จเมื่อ demo ตามโจทย์ได้ถูกต้องและไม่ล่มตอนแข่ง · `UNKNOWN`: เกณฑ์ตัดสินจริง |
| A4 | วันแข่ง · `UNKNOWN` วันที่แน่นอน |
| A5 | งบ ≈ 0 (ใช้เครื่องตัวเอง/ฟรีเทียร์) |
| A6 | ไม่ทำ: login, DB, cloud |
| B1 | `UNKNOWN` (สมมติ: ข้อมูลทั่วไป ไม่ใช่ PII) |
| B2 | กติกาแข่ง `UNKNOWN` (อินเทอร์เน็ตใช้ได้ไหม / ต้องรันเครื่องเดียวไหม / ต้องออฟไลน์ไหม) |
| B3 | ผลเสียหากล่มวันแข่ง = **สูง** (เสียคะแนน) → ต้องมี fallback |
| C1 | 2 คน: FE 1, Algo 1 · ทั้งคู่มีอินเทอร์เน็ต |
| C2 | `UNKNOWN` ทักษะ/ภาษาที่ถนัด |
| C4 | ใช้ AI ช่วยเขียนโค้ดไหม/โมเดลไหน `UNKNOWN` |

### ต้องตอบก่อนล็อก (ส่งผลต่อคำแนะนำ)
| # | คำถาม | ค่าเริ่มต้นที่ผมสมมติ | ถ้าตอบอย่างอื่น |
|---|---|---|---|
| U1 | กติกาอนุญาตให้ใช้เครือข่าย/ต้องรันบนเครื่องเดียว/ต้องออฟไลน์? | เครื่องเดียว localhost | ถ้าต้องสองเครื่องจริง → §8 |
| U2 | Frontend เขียนด้วยอะไร? (React/Vue/HTML ธรรมดา/Streamlit/Gradio) | เว็บ (React/HTML) | ถ้า Streamlit/Gradio → **ไม่ต้องมี API** (§3 ข้อ 4) |
| U3 | Algorithm ภาษาอะไร? | Python | ถ้าเป็น JS/Node → ใช้ Express + Zod แทน FastAPI |
| U4 | Input/Output เป็นชนิดไหน (รูป/ข้อความ/ตาราง/เสียง)? | JSON ธรรมดา | ถ้าเป็นรูป/ไฟล์ → §5 ข้อ "ไฟล์" |
| U5 | ประมวลผลนานเท่าไร? | < 5 วินาที | > ~30 วิ → async job (§5) |
| U6 | ผลลัพธ์ต้องส่งทีละส่วน (stream) หรือไม่? | ไม่ | ใช่ → SSE |

---

## 2. วิเคราะห์ปัญหาและสาเหตุราก (ข้อ 1)

**ความยุ่งยากที่คุณเจอ ไม่ได้มาจาก "คนละเครื่อง" และไม่ได้มาจาก "ยังไม่มี API"** แต่มาจาก 3 สาเหตุ:

| อาการ | สาเหตุจริง | ตัวแก้ |
|---|---|---|
| ไม่รู้ว่าอีกฝั่งรับ/ส่งรูปแบบไหน, เปลี่ยน field แล้วพัง | **ไม่มี contract กลางที่เป็นลายลักษณ์อักษรและตรวจได้ด้วยเครื่อง** | ไฟล์ schema เดียว + fixtures ร่วม (§5) |
| รอกัน / ทดสอบไม่ได้ | แต่ละฝั่ง *ไม่มีตัวแทน (double)* ของอีกฝั่งที่เชื่อถือได้ | stub/fake ที่อ่าน fixtures เดียวกัน (§6) |
| Merge conflict บ่อย | **สองคนแก้ไฟล์เดียวกัน** (โครงสร้างโฟลเดอร์ปนกัน/แก้ shared file) — ไม่เกี่ยวกับจำนวน repo | แบ่งความเป็นเจ้าของโฟลเดอร์ (§8) |

---

## 3. ประเมินแนวคิดของคุณ + เปรียบเทียบวิธีสื่อสาร (ข้อ 2, 3 · ครอบ 5.1, 5.4)

### 3.1 แนวคิด "Dummy Function + API" — ใช้ได้ แต่มีความเข้าใจคลาดเคลื่อน 4 จุด

1. **"Dummy function" ที่คุณหมายถึงคือ Stub/Fake ไม่ใช่ Dummy** (นิยามใน §6) — ไม่ใช่เรื่องใหญ่ แต่ใช้คำให้ตรงจะคุยกับเพื่อนได้ไม่สับสน
2. **API ไม่ได้ทำให้พัฒนาแยกกันได้เอง** — ที่ทำให้แยกได้คือ *contract + double* ถ้ามี API แต่ไม่มี contract ก็ยังพังเหมือนเดิม
3. **"พัฒนาคนละเครื่อง" ≠ "รันคนละเครื่องตอนแข่ง"** — ผมแนะนำให้ *รันบนเครื่องเดียวผ่าน `localhost`* ตอนแข่ง (เหตุผล §7) การแยกเครื่องเป็นเรื่องของ *ตอนพัฒนา* เท่านั้น
4. **REST ไม่ได้แปลว่าเข้าถึงกันผ่านอินเทอร์เน็ตอัตโนมัติ** — คุณเข้าใจถูกแล้ว ตามที่ระบุไว้ใน 5.5; เซิร์ฟเวอร์บนแล็ปท็อปเพื่อนต้อง bind, เปิดพอร์ต, หา IP/ทำ tunnel (§7)

### 3.2 ทางเลือกที่ "ง่ายกว่า API" — ตรวจก่อนเสมอ

| ทางเลือก | ใช้ได้เมื่อ | ข้อดี | ข้อเสีย |
|---|---|---|---|
| **A. ไม่มีเครือข่ายเลย: import ฟังก์ชันตรง** (Streamlit/Gradio, หรือ FE เรียก Python ผ่าน library) | FE เป็น Python UI (U2) | เร็วสุด, debug ง่ายสุด, ไม่มี CORS/IP/firewall | ผูกภาษา; แยก repo/เครื่องยาก; ใช้ได้เฉพาะถ้าเลือก UI เป็น Python |
| **B. HTTP + JSON (REST-style) บน localhost** ⭐ | FE เป็นเว็บ (React/HTML) | เครื่องมือเยอะ, ดูด้วยเบราว์เซอร์/curl ได้, FastAPI สร้าง docs+schema ให้ | ต้องจัดการ CORS/timeout |
| **C. CLI/ไฟล์** (FE เรียก `python algo.py input.json → output.json`) | ประมวลผลเป็นชุด, ไม่ต้อง server | ง่ายมาก, ไม่มีเครือข่าย | โหลดโมเดลซ้ำทุกครั้ง (ช้า), UI แบบ interactive ลำบาก |

### 3.3 เทียบวิธีสื่อสารสำหรับกรณีเว็บ (B vs อื่นๆ)

| วิธี | ง่ายพัฒนา | Debug | เหมาะกับเว็บเบราว์เซอร์ | หมายเหตุ | คำตัดสิน |
|---|---|---|---|---|---|
| **HTTP+JSON (REST)** | ★★★ | ★★★ (DevTools/curl/Swagger) | ★★★ | ค่าเริ่มต้น | ✅ **ใช้** |
| **SSE** (server→client stream) | ★★ | ★★ | ★★★ | ใช้ถ้าต้องแสดงความคืบหน้า/สตรีมผล (U6) | ➕ เพิ่มเฉพาะเมื่อจำเป็น |
| **WebSocket** | ★ | ★ | ★★ | สองทางต่อเนื่อง; ซับซ้อนกว่าที่งานนี้ต้องการ | ❌ ยกเว้น real-time จริง |
| **gRPC** | ★ | ★ | ✗ (เบราว์เซอร์ต้องมี grpc-web proxy) | เหมาะ service↔service | ❌ |
| **JSON-RPC** | ★★ | ★★ | ★★ | ใช้ได้ แต่ไม่ได้ดีกว่า REST และเครื่องมือน้อยกว่า | ❌ ไม่มีเหตุผลเปลี่ยน |
| **Gateway/Backend คั่นกลาง** | — | — | — | เพิ่มชั้นที่ต้องดูแลโดยไม่มีปัญหาที่มันแก้ | ❌ YAGNI (dev proxy ของ Vite/Next พอ) |

**ADR (3 บรรทัด):** *เลือก HTTP+JSON บน localhost, FastAPI+Pydantic ฝั่ง algorithm · ย้อนกลับได้เพราะ FE เรียกผ่าน client module เดียว (§9) · ทบทวนเมื่อ U1/U2/U6 ตอบต่างจากค่าเริ่มต้น หรือ processing > 30 วิ*

---

## 4. Architecture ที่เสนอ (ข้อ 4 · ครอบ 5.1)

```
        ┌────────────── เครื่องเดียว (วันแข่ง) ──────────────┐
 ผู้ใช้ ─► Frontend (:5173) ──HTTP JSON──► Algorithm API (:8000) ─► algorithm.process()
        │      ▲  algorithmClient (mock | http)                      (Pydantic validate)
        └──────┴────────────────────────────────────────────────────┘
 contracts/  ◄── ทั้งสองฝั่งอ้างอิง: openapi.json + examples/*.json
```

### Flow การทำงาน (ข้อ 5)
1. ผู้ใช้กรอก input ใน UI
2. FE validate เบื้องต้น (เพื่อ UX) → ไม่ผ่านแสดง error ทันที ไม่ส่ง
3. UI เรียก `algorithmClient.process(req)` (ที่เดียว — §9) แสดง loading + เริ่ม timeout
4. client ส่ง `POST /v1/process` (หรือคืน stub ถ้า mock mode)
5. Algo API validate ด้วย Pydantic → ผิดตอบ `422 INVALID_INPUT`
6. `algorithm_process()` คำนวณ → ผิดพลาดตอบ `500 ALGO_ERROR`
7. API ตอบ `200 {result, meta}` พร้อม `requestId`
8. FE แสดงผล; ถ้าเป็น error แสดงตาม `error.code` + ปุ่มลองใหม่; timeout/เชื่อมต่อไม่ได้ → แจ้งและเสนอ fallback (§11)

| คำถามของคุณ (5.1) | คำตอบ |
|---|---|
| แยกระดับใด? | แยก **process** (FE กับ Algo เป็นโปรเจกต์/โฟลเดอร์ของตัวเอง) คุยกันผ่าน contract เท่านั้น |
| FE เรียก API ตรงไหม? | ใช่ — **ไม่ต้องมี gateway/backend กลาง** |
| ลดการพึ่งพา source ของอีกฝั่งอย่างไร? | พึ่งพา *contract* ไม่ใช่ *โค้ด*: FE ไม่ import อะไรจาก `algorithm/` และกลับกัน |
| แยก repo หรือรวม? | **Monorepo เดียว 3 โฟลเดอร์** (§8) — แยก repo ทำให้ contract drift ง่ายขึ้นและ sync ยากขึ้น |

---

## 5. API Contract + ตัวอย่าง (ข้อ 6 · ครอบ 5.2)

**หลัก:** ให้ฝั่ง algorithm (เจ้าของ logic) เป็นคนเขียน schema ด้วย Pydantic → FastAPI สร้าง `openapi.json` อัตโนมัติ → commit ไว้ที่ `contracts/openapi.json` → FE สร้าง type จากไฟล์นี้ได้ (`npx openapi-typescript contracts/openapi.json -o frontend/src/api/types.ts`). **ห้ามแก้ field ด้วยปากเปล่าหรือใน chat** — แก้ที่ไฟล์ แล้วเปิด PR ให้อีกฝั่ง approve

> ⚠️ field ด้านล่างเป็น **placeholder** (`input.payload`, `result.value`) เพราะโดเมนจริงยังเป็น `UNKNOWN` (U4) — แทนที่ด้วยของจริงในประชุมแรก

### 5.1 Endpoints (ขั้นต่ำ)
| Method | Path | หน้าที่ |
|---|---|---|
| GET | `/health` | `{"status":"ok","version":"..."}` — ใช้เช็คก่อนเริ่ม demo |
| POST | `/v1/process` | รับ input → คืน result |

### 5.2 Request / Response (ตัวอย่าง placeholder)
```jsonc
// POST /v1/process   (Content-Type: application/json)
{
  "requestId": "c0a8…",          // FE สร้าง (uuid) ใช้ไล่ log สองฝั่ง — optional
  "input": { "payload": "..." }  // PLACEHOLDER: แทนด้วยโครงสร้าง input จริง
}

// 200 OK
{
  "requestId": "c0a8…",
  "result": { "value": 0.0, "label": "..." },   // PLACEHOLDER
  "meta":   { "elapsedMs": 120, "algoVersion": "0.1.0" }
}

// 4xx/5xx — รูปแบบ error เดียวทั้งระบบ
{
  "error": { "code": "INVALID_INPUT", "message": "payload must not be empty", "field": "input.payload" },
  "requestId": "c0a8…"
}
```

### 5.3 กฎ contract
| หัวข้อ | ข้อตกลง |
|---|---|
| ชื่อ field | `camelCase` ทั้งระบบ · ห้ามเปลี่ยนชื่อ/ลบ field โดยไม่ผ่าน PR (เพิ่ม field ใหม่แบบ optional ได้เสมอ) |
| Required/Optional | ระบุใน schema; FE ต้องทนต่อ field ที่เพิ่มมาใหม่ (ignore unknown) |
| Validation | **ทั้งสองฝั่ง validate**: FE เพื่อ UX, **Algo เพื่อความถูกต้อง** (FE ไม่ใช่ trust boundary) |
| Status codes | `200` สำเร็จ · `422/400` input ผิด (`INVALID_INPUT`) · `500` อัลกอริทึมพัง (`ALGO_ERROR`) · `503` ยังไม่พร้อม/โมเดลกำลังโหลด (`NOT_READY`) · `504` เกินเวลา (`TIMEOUT`) |
| Error codes | ค่าคงที่ใน schema (enum) — FE ใช้ `code` ตัดสิน ไม่ parse `message` |
| ตัวเลข/เวลา | ตัวเลขเป็น number ไม่ใช่ string · เวลา ISO-8601 UTC |
| ไฟล์/รูป (ถ้า U4) | เล็ก → base64 ใน JSON พร้อมกำหนดขนาดสูงสุด · ใหญ่ → `multipart/form-data` · ระบุ mime/ขนาดสูงสุดใน contract |
| Processing นาน (ถ้า U5) | `POST /v1/jobs` → `202 {jobId}` + `GET /v1/jobs/{id}` (poll) — ทำเมื่อวัดแล้วเกิน ~30 วิเท่านั้น |

### 5.4 Skeleton ฝั่ง Algorithm (FastAPI — ให้ schema เป็นแหล่งความจริง)
> ต้องใช้ Python ≥ 3.10 (ใช้ `str | None`) · ยังไม่ได้รันโค้ดชุดนี้จริง — ทดสอบก่อนใช้

```python
# algorithm/app/main.py
import json, time
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from .core import algorithm_process   # ฟังก์ชันจริงของเพื่อน (คืน Result)

app = FastAPI(title="Algo API", version="0.1.0")
# ค่าเริ่มต้นแนะนำ Vite proxy (§7.2) จึงไม่ต้องใช้ CORS; เปิดเฉพาะเมื่อ FE เรียกตรงข้าม origin
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
                   allow_methods=["*"], allow_headers=["*"])

class ErrorBody(BaseModel):
    code: str                      # INVALID_INPUT | ALGO_ERROR | NOT_READY | TIMEOUT
    message: str
    field: str | None = None
class ErrorResponse(BaseModel):
    error: ErrorBody
    requestId: str | None = None

# ทำให้ error ทุกชนิดมีรูปแบบตาม contract (ไม่ใช่ {"detail": ...} หรือข้อความดิบ)
@app.exception_handler(RequestValidationError)
async def on_invalid(_: Request, exc: RequestValidationError):
    e = exc.errors()[0]
    field = ".".join(str(p) for p in e["loc"] if p != "body")
    return JSONResponse(status_code=422, content={"error": {"code": "INVALID_INPUT", "message": e["msg"], "field": field}})

@app.exception_handler(Exception)
async def on_error(_: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": {"code": "ALGO_ERROR", "message": str(exc)}})

class Input(BaseModel):
    payload: str = Field(min_length=1)          # PLACEHOLDER
class ProcessRequest(BaseModel):
    requestId: str | None = None
    input: Input
class Result(BaseModel):
    value: float                                 # PLACEHOLDER
    label: str
class ProcessResponse(BaseModel):
    requestId: str | None
    result: Result
    meta: dict

@app.get("/health")
def health(): return {"status": "ok", "version": app.version}

@app.post("/v1/process", response_model=ProcessResponse,
          responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})  # ใส่ error schema ลง openapi.json
def process(req: ProcessRequest):
    t = time.time()
    res = algorithm_process(req.input)          # ฟังก์ชันจริงของเพื่อน (แยกไฟล์ algorithm/core.py)
    return {"requestId": req.requestId, "result": res,
            "meta": {"elapsedMs": int((time.time()-t)*1000), "algoVersion": app.version}}
```
สร้าง schema (ให้ Python เขียนไฟล์เอง ไม่ใช้ `>` ของ PowerShell ซึ่งอาจได้ UTF-16/BOM ทำให้ JSON พัง):
`python -c "import json;from app.main import app;open('../contracts/openapi.json','w',encoding='utf-8').write(json.dumps(app.openapi(),indent=2))"`

---

## 6. Dummy / Stub / Mock / Fake (ข้อ 7 · ครอบ 5.3)

| ชนิด | คืออะไร | ตัวอย่างในโปรเจกต์ | ใช้? |
|---|---|---|---|
| **Dummy** | ของที่ส่งไปให้ครบพารามิเตอร์ แต่ **ไม่ถูกใช้จริง** | `null`/ออบเจ็กต์ว่างที่ส่งเข้าไป | ไม่จำเป็น |
| **Stub** | คืน **คำตอบสำเร็จรูป** คงที่ | `algorithmClient` ฝั่ง FE ที่คืน `examples/process.ok.json` | ✅ FE ใช้เป็นหลัก |
| **Fake** | **ทำงานได้จริงแต่แบบง่าย** | mock server ที่คืนผลตาม input อย่างง่าย (เช่น echo/สุ่มอย่างมีกฎ) | ✅ เมื่อ UI ต้องการผลที่เปลี่ยนตาม input |
| **Mock** | ตัวที่ **ตรวจว่าถูกเรียกอย่างไร** (assert ว่าเรียกด้วย arg ที่คาด) | unit test: ยืนยันว่า FE เรียก client ด้วย input ถูกต้อง | ✅ ใน test เท่านั้น |

> สิ่งที่คุณเรียกว่า "Dummy Function" ส่วนใหญ่คือ **Stub** (คืนค่าตายตัว) หรือ **Fake** (ถ้ามีตรรกะ)

### กฎที่สำคัญที่สุด: ใช้ fixtures ชุดเดียวกัน
```
contracts/examples/
  process.ok.json            # response สำเร็จ
  process.invalid.json       # error INVALID_INPUT
  process.algo_error.json    # error ALGO_ERROR
  request.sample.json        # request ตัวอย่าง
```
- FE stub **อ่านไฟล์เหล่านี้** (ห้ามพิมพ์ JSON ซ้ำในโค้ด)
- Algo test ใช้ `request.sample.json` เป็น input และ assert ว่า output **ตรง schema** ของ `process.ok.json`
- ถ้าสองฝั่งอ่านไฟล์เดียวกัน → mock ไม่ drift จากของจริง; ถ้าแก้ไฟล์นี้ต้อง PR ให้อีกฝั่ง approve

### Mock Server ของทั้งสองฝ่าย (ข้อ 7)
| ฝั่ง | วิธีที่เร็วสุด |
|---|---|
| **FE** (ตอนยังไม่มี algo จริง) | ❶ stub ใน `algorithmClient` (§9) — ไม่ต้องรัน server ❷ ถ้าอยากทดสอบ network จริง: `npx @stoplight/prism-cli mock contracts/openapi.json -p 8000` (Prism จะสร้าง mock server จาก OpenAPI) หรือ MSW (Mock Service Worker) |
| **Algo** (ตอนยังไม่มี FE) | ไม่ต้องมี FE — เปิด `http://localhost:8000/docs` (Swagger UI) แล้วลองยิง หรือ `curl -X POST ... -d @contracts/examples/request.sample.json` + รัน `pytest` ด้วย request จาก fixtures |

---

## 7. การเชื่อมต่อผ่านเครือข่ายและการแข่งจริง (ข้อ 5, 10 · ครอบ 5.5)

### 7.1 หลักการ: ตอนแข่งรันเครื่องเดียว (ค่าเริ่มต้น)
ทั้งสองส่วนรันบนเครื่องเดียว (เช่นของคุณ) ผ่าน `localhost`:
- **ไม่ต้องมี** IP, firewall, HTTPS, CORS ข้ามเครื่อง, หรือพึ่ง Wi-Fi สถานที่แข่ง
- Wi-Fi งานแข่งมักมี **client isolation** ที่ทำให้สองแล็ปท็อปมองไม่เห็นกัน แม้อยู่ network เดียวกัน — นี่คือความเสี่ยงที่ใหญ่ที่สุดของการแยกเครื่องตอนแข่ง
- วิธีทำ: เพื่อนส่ง **โฟลเดอร์ `algorithm/` + ไฟล์โมเดล** (ผ่าน git/USB) ให้ติดตั้งบนเครื่องคุณ หรือเอาเครื่องเพื่อนเป็นเครื่องหลัก

### 7.2 ถ้าจำเป็นต้องรันข้ามเครื่องจริง (ตอนพัฒนา หรือกติกาบังคับ — U1)
**ความเข้าใจที่ถูก:** REST = รูปแบบสื่อสารผ่าน HTTP · "เข้าถึงกันได้" ต้องแก้ 4 เรื่อง:

| เรื่อง | ต้องทำ (Windows) |
|---|---|
| **Bind** | รัน `uvicorn app.main:app --host 0.0.0.0 --port 8000` (ค่าเริ่มต้น `127.0.0.1` รับเฉพาะเครื่องตัวเอง) |
| **หา IP** | `ipconfig` → IPv4 ของ Wi-Fi/Ethernet (เช่น `192.168.1.23`) แล้ว FE เรียก `http://192.168.1.23:8000` |
| **Firewall** | Windows Defender Firewall → อนุญาต inbound TCP พอร์ต 8000 (หรืออนุญาต Python) |
| **เครือข่าย** | ต้องอยู่ LAN/Wi-Fi เดียวกัน **และ** ไม่มี client isolation; ถ้าคนละเครือข่าย/อินเทอร์เน็ต → ใช้ tunnel: `cloudflared tunnel --url http://localhost:8000` หรือ ngrok หรือ Tailscale (เครือข่ายส่วนตัวระหว่างสองเครื่อง) |

| ประเด็น | คำแนะนำ |
|---|---|
| **CORS** | **ค่าเริ่มต้นที่แนะนำ: Vite dev proxy** — ตั้ง `server.proxy: {'/v1': 'http://localhost:8000'}` (หรือ IP ของเพื่อน) ให้ FE เรียก `/v1/process` แบบ same-origin → ไม่มี CORS, ไม่มี mixed-content, เปลี่ยนปลายทางที่จุดเดียว · ใช้ `CORSMiddleware` (§5.4) เป็นแผนสำรอง (ต้องใส่ทั้ง `localhost` และ `127.0.0.1`/IP ที่ใช้จริง) |
| **HTTPS / Mixed content** | หน้า HTTPS เรียก API แบบ HTTP จะถูกเบราว์เซอร์บล็อก → ถ้าใช้ tunnel ให้ใช้ URL `https://` ที่มันให้ หรือรัน FE แบบ HTTP ทั้งคู่ |
| **ความปลอดภัย** | เปิดพอร์ตสู่ LAN/อินเทอร์เน็ตชั่วคราวเท่านั้น; ห้ามเผย API ที่ไม่มี auth ขึ้น public นานเกินจำเป็น (ใช้ token ง่ายๆ ใน header ถ้าผ่าน tunnel public) |
| **Timeout** | FE ตั้ง timeout (เช่น 10 วิ ปรับตาม U5) ด้วย `AbortController` |
| **Error/Retry** | แยกกรณี: เชื่อมต่อไม่ได้ / timeout / `4xx` (ไม่ retry) / `5xx` (retry ได้ 1–2 ครั้งเฉพาะ call ที่ idempotent เช่น process ที่ไม่มีผลข้างเคียง) · UI ต้องมี loading, error, และปุ่มลองใหม่ |
| **ไม่พร้อม** | FE เรียก `/health` ตอนเปิดหน้า → ถ้าล้มเหลวแสดงสถานะชัดเจน (หรือสลับ stub อัตโนมัติ — fallback ใน §11) |

---

## 8. Git และลด Merge Conflict (ข้อ 9 · ครอบ 5.1)

**Monorepo 1 repo:**
```
repo/
  contracts/        # openapi.json, examples/*.json  ← เปลี่ยนต้อง PR + อีกฝั่ง approve
  frontend/         # เจ้าของ: คุณ
  algorithm/        # เจ้าของ: เพื่อน
  scripts/          # start script ตอนแข่ง
  README.md  .gitignore
```
กฎ (เรียงตามความสำคัญ):
1. **เจ้าของโฟลเดอร์:** แต่ละคนแก้เฉพาะโฟลเดอร์ตัวเอง → conflict แทบเป็นศูนย์ · ไฟล์รวม (`README`, root config) แก้ผ่านคนเดียวหรือ PR เล็กๆ
2. **Contract เป็นของร่วม:** แก้ `contracts/**` ได้ผ่าน PR เท่านั้น และอีกฝั่งต้อง approve (ตั้ง `CODEOWNERS`: `/contracts/ @คุณ @เพื่อน`)
3. **Branch สั้น + rebase บ่อย:** `feat/<ชื่อ>` อายุ ≤ 1 วัน, `git pull --rebase origin main` ก่อนเริ่มทุกครั้ง, merge เข้า `main` บ่อยๆ แทนสะสมการเปลี่ยนแปลงเยอะ
4. **`main` ต้องรันได้เสมอ** — ห้าม push สิ่งที่ทำให้อีกฝั่งรันไม่ขึ้น
5. **`.gitignore`:** `node_modules/`, `venv/`, `__pycache__/`, `.env`, **น้ำหนักโมเดลขนาดใหญ่** (เก็บแยก: USB/Drive/Git LFS) — ห้าม commit lockfile ที่ต่างกันโดยไม่ตั้งใจ (ใช้ `package-lock.json` + `requirements.txt` ที่ pin เวอร์ชัน)
6. **ฟอร์แมตตรงกัน:** ตั้ง `.editorconfig` + prettier/black เพื่อไม่ให้ conflict จากช่องว่าง/บรรทัดท้าย
7. **ถ้ายัง conflict บ่อย:** แสดงว่ามีไฟล์ที่ทั้งคู่แก้ → ย้ายไฟล์นั้นเข้า contract หรือแยกเป็นสองไฟล์

> ทำไมไม่แยก repo: contract ต้อง "สำเนาไปมา" หรือใช้ submodule → drift/ลืม sync ซึ่งคือปัญหาที่คุณมีอยู่แล้ว

---

## 9. Service Layer ฝั่ง FE — สลับ mock/จริงโดยไม่แก้ FE (ครอบ 5.6)

หลักการ: **มีไฟล์เดียวที่ FE เรียก algorithm** ส่วนอื่นของ FE ห้ามเรียก `fetch` ไปยัง algorithm เอง

> ยังไม่ได้รันโค้ดชุดนี้จริง · ข้อควรเช็คครั้งแรก: (1) `openapi-typescript` สร้าง `paths`/`components` ไม่ใช่ชื่อ type ตรงๆ จึงต้อง re-export ตามด้านล่าง (2) การ import JSON จากนอก `frontend/` ต้องตั้ง `server.fs.allow: ['..']` ใน `vite.config` และ `"resolveJsonModule": true` ใน `tsconfig`

```ts
// frontend/src/api/types.ts  (ไฟล์ที่ generate อยู่ที่ generated.ts)
import type { components } from './generated'; // npx openapi-typescript ../contracts/openapi.json -o src/api/generated.ts
export type ProcessRequest = components['schemas']['ProcessRequest'];
export type ProcessResponse = components['schemas']['ProcessResponse'];
```
```ts
// frontend/src/api/algorithmClient.ts
import type { ProcessRequest, ProcessResponse } from './types';
import okSample from '../../../contracts/examples/process.ok.json';

export interface AlgorithmClient { process(req: ProcessRequest): Promise<ProcessResponse>; }

// FE ตัดสินทุกอย่างจาก err.code เท่านั้น: INVALID_INPUT | ALGO_ERROR | NOT_READY | TIMEOUT | NETWORK | BAD_RESPONSE
export class ApiError extends Error {
  constructor(public code: string, message: string, public field?: string) { super(message); }
}

const stub: AlgorithmClient = {
  async process() { await new Promise(r => setTimeout(r, 300)); return okSample as ProcessResponse; },
};

const http: AlgorithmClient = {
  async process(req) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), Number(import.meta.env.VITE_TIMEOUT_MS ?? 10000));
    try {
      // base ว่าง = same-origin ผ่าน Vite proxy (แนะนำ); ใส่ VITE_API_URL เฉพาะเมื่อเรียกข้าม origin
      const r = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/v1/process`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req), signal: ctrl.signal });
      let body: any = null;
      try { body = await r.json(); } catch { /* ไม่ใช่ JSON (เช่น proxy error) */ }
      if (!r.ok) throw new ApiError(body?.error?.code ?? 'BAD_RESPONSE', body?.error?.message ?? `HTTP ${r.status}`, body?.error?.field);
      if (!body) throw new ApiError('BAD_RESPONSE', 'Response is not JSON');
      return body as ProcessResponse;
    } catch (e) {
      if (e instanceof ApiError) throw e;
      if ((e as Error).name === 'AbortError') throw new ApiError('TIMEOUT', 'Request timed out');
      throw new ApiError('NETWORK', 'Cannot reach algorithm API');   // fetch TypeError
    } finally { clearTimeout(t); }
  },
};

export const algorithmClient: AlgorithmClient =
  import.meta.env.VITE_USE_MOCK === 'true' ? stub : http;
```
- สลับด้วย `.env`: `VITE_USE_MOCK=true` ↔ `false` + `VITE_API_URL=http://localhost:8000`
- UI ทุกส่วนเรียก `algorithmClient.process()` เท่านั้น → เปลี่ยนจาก stub เป็น API จริงแก้ **ศูนย์ไฟล์** ในโค้ด UI
- ถ้าต้องเปลี่ยนวิธีสื่อสาร (เช่น เป็น SSE/ไลบรารี Python ตรง) แก้เฉพาะไฟล์นี้ — ตอบเงื่อนไข "ปรับรูปแบบการเชื่อมต่อได้หากไม่เหมาะ"

---

## 10. ทดสอบแยกส่วนก่อนต่อกัน (ข้อ 8 · ครอบ 5.3)

| ระดับ | ใครทำ | ทำอย่างไร | ผ่านเมื่อ |
|---|---|---|---|
| T1 Contract valid | ทั้งคู่ | validate `examples/*.json` กับ `openapi.json` (CI ด้วย `openapi-spec-validator` / ajv) | ทุก fixture ตรง schema |
| T2 Algo unit/API | เพื่อน | `pytest`: ใช้ `request.sample.json` → response ตรง schema; ทดสอบ input ผิด → `INVALID_INPUT`; input ขอบเขต | เขียว + `/docs` ลองยิงได้ |
| T3 FE ด้วย stub | คุณ | `VITE_USE_MOCK=true` → ทดลอง flow ครบ: loading / สำเร็จ / error (สลับ fixture `invalid`, `algo_error`) | ทุก state ของ UI ถูกต้อง |
| T4 Integration (เครื่องเดียว) | ทั้งคู่ | รัน algo + FE จริง `VITE_USE_MOCK=false` → ทดสอบ flow เดียวกับ T3 | ผลตรงกับ stub (หรือรู้ว่าต่างเพราะอะไร) |
| T5 Failure drill | ทั้งคู่ | ปิด algo กลางคัน, ส่ง input ขยะ, หน่วงเวลาให้ timeout | FE แสดง error ชัดเจน ไม่ค้าง ไม่ crash |
| T6 Rehearsal | ทั้งคู่ | ซ้อมตามขั้นตอนวันแข่ง (§11) จับเวลา | ต่อกันจนใช้งานได้ ≤ 30 นาที |

**Integration ครั้งแรก "ไม่ควรเป็นครั้งแรกวันแข่ง"** — นัด integration ทุกครั้งที่ฝั่งใดฝั่งหนึ่งเสร็จ endpoint (อย่าเก็บไว้ท้ายสุด)

---

## 11. ขั้นตอนวันแข่งขัน (ข้อ 10)

**ก่อนวันแข่ง (T-3 ถึง T-1 วัน)**
- [ ] ตอบ U1–U6, ล็อก contract v1 (tag `contract-v1`)
- [ ] ผ่าน T1–T6, ซ้อมเต็ม ≥ 1 รอบ
- [ ] **pin เวอร์ชัน:** Python/Node, `requirements.txt`, `package-lock.json`; **ดาวน์โหลดโมเดลล่วงหน้า** (ห้ามพึ่งการดาวน์โหลดสดวันแข่ง)
- [ ] สคริปต์เดียวเริ่มทั้งระบบ `scripts/start` (Windows: `start.ps1` เปิด algo + FE + เปิดเบราว์เซอร์) และ `scripts/check` (เรียก `/health` + ยิง sample)
- [ ] เตรียม **fallback mode**: ถ้า algo ล่ม → FE สลับไปใช้ stub/ผลที่ cache ไว้และ *แสดงป้ายบอกว่าเป็น demo mode* (อย่าทำให้เข้าใจผิดว่าเป็นผลจริงถ้ากติกาตรวจ)
- [ ] สำรอง: โปรเจกต์ทั้งก้อน + โมเดล + installer บน **USB** และบนเครื่องคนละเครื่อง

**วันแข่ง**
1. มาถึง → ติดตั้ง/วางโฟลเดอร์ → รัน `scripts/check` (≤ 10 นาที)
2. ถ้ากติกาอนุญาตเครือข่ายและจำเป็น: ทำ §7.2 *หลัง* ระบบเครื่องเดียวทำงานแล้ว (ไม่ใช่แทน)
3. รัน sample ตามโจทย์ → เทียบผลกับที่คาด
4. **Freeze:** ก่อนช่วงตัดสิน หยุดแก้ `contracts/` และอย่าอัปเกรด dependency
5. มีคนเฝ้า log ของ algo ระหว่างกรรมการทดสอบ (log มี `requestId`)

**ถ้ามีปัญหา:** `/health` ล้ม → restart algo; พอร์ตชน → เปลี่ยนพอร์ตผ่าน env; ต่อกันไม่ได้ → สลับ `VITE_USE_MOCK=true` เพื่อรักษา demo แล้วแก้ทีหลัง

---

## 12. Debt Register (Fast Track บังคับ)
| ID | ทางลัด | ความเสี่ยง | ชำระเมื่อ |
|---|---|---|---|
| DEBT-1 | ไม่มี auth บน API | ใครในเครือข่ายเรียกได้ | ก่อนเปิด tunnel public |
| DEBT-2 | ไม่มี async job | งานนาน > 30 วิ จะ timeout | เมื่อวัดเวลาจริงแล้วเกิน |
| DEBT-3 | fixtures/contract v1 เป็น placeholder | จนกว่าจะรู้โดเมนจริง (U4) | ประชุมแรก |

---

## 13. ตารางตรวจความครอบคลุม (เทียบกับที่คุณขอ)

| ที่ขอ | ตอบที่ |
|---|---|
| 1 วิเคราะห์ปัญหา/สาเหตุ | §2 |
| 2 ประเมิน Dummy + API | §3.1–3.2 |
| 3 เปรียบเทียบ REST กับอื่น | §3.3 |
| 4 Architecture | §4 |
| 5 Flow FE↔Algo | §4 (หัวข้อ "Flow การทำงาน" + แผนภาพ), §9 (ฝั่ง FE) |
| 6 API Contract + ตัวอย่าง | §5 |
| 7 Mock server / dummy | §6 (ตาราง "Mock Server ของทั้งสองฝ่าย") |
| 8 ทดสอบแยกส่วน | §10 |
| 9 ลดปัญหา Merge/GitHub | §8 |
| 10 ขั้นตอนวันแข่ง | §11 |
| 5.1 สถาปัตยกรรมแยก | §4, §8 |
| 5.2 API Contract | §5 |
| 5.3 Dummy/Stub/Mock/Fake | §6, §10 |
| 5.4 เลือกวิธีสื่อสาร | §3.2–3.3 |
| 5.5 เครือข่าย | §7 |
| 5.6 สลับ mock→จริง | §9 |

### หมายเหตุถึงตัว Framework (ผลการทดสอบ EPEF กับเคสจริง)
- **เข้าที่:** Intake + UNKNOWN บังคับให้ไม่เดา, Track FAST + Debt Register, หลัก "contract before code" ตรงกับสาเหตุรากพอดี
- **ตึง:** EPEF เขียนมาสำหรับระบบที่มี DB/ทีมเดียว — เคสนี้ต้อง *ข้าม* หลายส่วน และต้องเพิ่มหัวข้อ "dev vs. demo runtime" ที่ EPEF ไม่มี ควรเพิ่ม *Profile สำหรับงานแข่ง/ชั่วคราว* ใน EPEF ถ้าจะใช้บ่อย
