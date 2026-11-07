# API Integration Status: Frontend ↔ Algorithm API

## 🌐 Current Architecture
เราเลือกใช้รูปแบบ **Distributed Architecture** โดยแยกฝั่งการทำงานออกจากกันเพื่อให้สะดวกต่อการพัฒนา

- **Frontend (Client):** รันอยู่ที่เครื่อง User
- **Algorithm API (Server):** รันอยู่ที่เครื่องของเพื่อน (Remote Server)

## 🎯 Connection Strategy
ยิง API ข้ามเครื่องไปยังเครื่องของเพื่อนโดยตรง เพื่อให้ฝั่ง Frontend ไม่ต้อง Setup Algorithm environment ในเครื่องตัวเอง

### Connection Details
- **Target API:** Algorithm Ingest API
- **Base URL:** `[รอระบุ URL จากเครื่องเพื่อน]` (เช่น `http://<friend-ip>:8787`)

---

## 📝 Instructions for Algorithm Developer (Guide สำหรับเพื่อน)
เพื่อให้ฝั่ง Frontend สามารถเชื่อมต่อและยิง API มาที่เครื่องของเพื่อนได้ รบกวนเพื่อนดำเนินการตามขั้นตอนดังนี้:

### 1. รัน Server ให้พร้อมใช้งาน
รันคำสั่งต่อไปนี้ในโปรเจกต์ Algorithm:
```sh
npm ci
npm start
```
*ตรวจสอบให้แน่ใจว่า Server รันอยู่ที่ Port `8787` (ตามค่าเริ่มต้น)*

### 2. เปิดการเข้าถึงจากภายนอก (Network & Firewall)
เนื่องจากเป็นการยิงข้ามเครื่อง เพื่อนต้องทำอย่างใดอย่างหนึ่งดังนี้:
- **กรณีอยู่ในวง LAN เดียวกัน:** 
  - หา Local IP ของเครื่องตัวเอง (เช่น `192.168.x.x`)
  - ตั้งค่า Firewall ของ Windows/Mac ให้เปิด Port `8787` ให้เครื่องภายนอกเข้าได้ (Inbound Rule)
- **กรณีอยู่คนละที่ (ต่าง Network):** 
  - ใช้เครื่องมืออย่าง **Ngrok** หรือ **Cloudflare Tunnel** เพื่อสร้าง Public URL
  - ตัวอย่างการใช้ Ngrok: `ngrok http 8787` $\rightarrow$ เพื่อนจะได้ URL เช่น `https://random-id.ngrok-free.app`

### 3. ตั้งค่า CORS (สำคัญมาก!)
เพื่อให้ Browser ของ Frontend ยอมให้ยิง API ข้ามเครื่องได้ เพื่อนต้องตรวจสอบว่าในโค้ด Server มีการอนุญาต CORS สำหรับ URL ของ Frontend (เช่น `http://localhost:5173`)
*ถ้ายังไม่ได้ทำ ให้เพิ่ม CORS middleware ใน `app.js` หรือ `adapter.js`*

### 4. ส่งข้อมูลกลับมาให้ Frontend
เมื่อทำเสร็จแล้ว รบกวนส่งข้อมูลนี้กลับมา:
- **URL/IP ที่ใช้งานได้:** (เช่น `http://192.168.1.50:8787` หรือ `https://xxx.ngrok-free.app`)

---

## 🛠 Implementation Plan (Frontend)
1. **URL Configuration:** สร้างไฟล์ config ในฝั่ง Frontend เพื่อเก็บ `API_BASE_URL`
2. **API Testing:** เมื่อได้รับ URL จากเพื่อน จะใช้ `curl` ทดสอบการเชื่อมต่อเบื้องต้น
3. **Integration:** เชื่อมต่อ UI เข้ากับ API จริงตามสัญญา (Contract) ใน `api_list.md`

## ⚠️ Potential Risks
- **Network Stability:** การยิงข้ามเครื่องขึ้นอยู่กับความเสถียรของ Network
- **Security:** การเปิด Port ต้องระมัดระวังเรื่อง Firewall
