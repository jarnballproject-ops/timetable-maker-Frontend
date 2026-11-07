"""ตรวจว่า examples/*.json ตรง schema และ VERSION ตรงกับ spec. รัน: python scripts/validate.py"""
import sys

from contract import ROOT, SPEC, errors, load

# ไฟล์ตัวอย่าง -> (ชื่อ schema, ควรผ่าน?)
EXPECT = {
    "health.ok.json": ("Health", True),
    "process.request.sample.json": ("ProcessRequest", True),
    "process.request.invalid.json": ("ProcessRequest", False),   # ต้อง "ไม่ผ่าน" เพื่อยืนยันว่า schema จับของผิดได้
    "process.response.ok.json": ("ProcessResponse", True),
    "process.response.invalid.json": ("ErrorResponse", True),
    "process.response.algo_error.json": ("ErrorResponse", True),
}

failed = 0
ver = (ROOT / "VERSION").read_text().strip()
if ver != SPEC["info"]["version"]:
    print(f"FAIL VERSION ({ver}) != openapi.yaml info.version ({SPEC['info']['version']})")
    failed += 1

on_disk = {p.name for p in (ROOT / "examples").glob("*.json")}
for name in sorted(on_disk - EXPECT.keys()):
    print(f"FAIL {name}: ไม่ได้ลงทะเบียนใน EXPECT (เพิ่มเองใน validate.py)")
    failed += 1

for name, (schema, should_pass) in EXPECT.items():
    errs = errors(load(ROOT / "examples" / name), schema)
    ok = (not errs) == should_pass
    print(("ok   " if ok else "FAIL ") + f"{name} vs {schema}" + ("" if ok else f" -> {errs or 'ควรไม่ผ่านแต่ผ่าน'}"))
    failed += not ok

print(f"contract {ver}: {'ALL PASS' if not failed else f'{failed} FAILED'}")
sys.exit(1 if failed else 0)
