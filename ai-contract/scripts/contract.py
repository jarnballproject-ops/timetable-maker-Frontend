"""ตัวช่วยกลาง: โหลด openapi.yaml แล้ว validate ข้อมูลกับ schema ด้วย jsonschema."""
import json
import pathlib
import sys

import yaml

# คอนโซล Windows ใช้ cp1252 เป็นค่าเริ่มต้น พิมพ์ภาษาไทยแล้วสคริปต์ล้ม
for _s in (sys.stdout, sys.stderr):
    _s.reconfigure(encoding="utf-8")
from jsonschema import Draft202012Validator

ROOT = pathlib.Path(__file__).resolve().parent.parent
SPEC = yaml.safe_load((ROOT / "openapi.yaml").read_text(encoding="utf-8"))


def errors(data, schema_name):
    """คืนรายการข้อผิดพลาด (ว่าง = ตรง schema). ใช้ $ref ชี้เข้า components ของ spec."""
    schema = {"$ref": f"#/components/schemas/{schema_name}", "components": SPEC["components"]}
    return [f"{'.'.join(map(str, e.path)) or '<root>'}: {e.message}"
            for e in Draft202012Validator(schema).iter_errors(data)]


def load(path):
    return json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
