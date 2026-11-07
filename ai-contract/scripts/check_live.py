"""ยิง server จริง/mock แล้วตรวจว่า response ตรง contract.
ใช้:  python scripts/check_live.py http://localhost:8000          (Algorithm ตรวจตัวเอง)
      python scripts/check_live.py http://localhost:8000 --mock   (ตรวจ Prism mock: ข้ามเคส error)
exit code 0 = ตรง contract ทั้งหมด"""
import json
import sys
import urllib.error
import urllib.request

from contract import ROOT, errors, load


def call(method, url, body=None):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, method=method, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read())
        except ValueError:
            return e.code, None          # ไม่ใช่ JSON = ผิด contract
    except OSError as e:
        sys.exit(f"เชื่อมต่อ {url} ไม่ได้: {e}")


def main():
    base = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:8000"
    mock = "--mock" in sys.argv
    ex = ROOT / "examples"
    failed = 0

    def check(title, status, body, want_status, schema):
        nonlocal failed
        errs = [] if body is not None else ["response ไม่ใช่ JSON"]
        if body is not None:
            errs = errors(body, schema)
        if status != want_status:
            errs.insert(0, f"status {status} (ต้องเป็น {want_status})")
        print(("ok   " if not errs else "FAIL ") + title + ("" if not errs else f" -> {errs}"))
        failed += bool(errs)

    s, b = call("GET", f"{base}/health")
    check("GET /health", s, b, 200, "Health")
    s, b = call("POST", f"{base}/v1/process", load(ex / "process.request.sample.json"))
    check("POST /v1/process (sample)", s, b, 200, "ProcessResponse")
    if not mock:
        s, b = call("POST", f"{base}/v1/process", load(ex / "process.request.invalid.json"))
        check("POST /v1/process (input ผิด -> 422 INVALID_INPUT)", s, b, 422, "ErrorResponse")
        if b and b.get("error", {}).get("code") != "INVALID_INPUT":
            print("FAIL code ต้องเป็น INVALID_INPUT"); failed += 1
    print("ตรง contract" if not failed else f"{failed} รายการไม่ตรง contract")
    sys.exit(1 if failed else 0)


main()
