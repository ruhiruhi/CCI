import os
import sys
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(r"C:\Users\Asus\OneDrive\Desktop\Workspase\CCII")
EXCLUDE_DIRS = {"node_modules", ".next", ".git", "public_extracted", "drive-download-20260706T045733Z-3-001", ".tmp-thumbs", "__pycache__", ".tmp-day2-thumbs", "Day1image", "Day2image"}
EXCLUDE_FILES = {".env", ".env.local", "cci-deploy.tar.gz", "cci-public.zip", "drive-download-20260706T045733Z-3-001.zip"}

tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
tmp.close()
archive = Path(tmp.name)
count = 0
with tarfile.open(archive, "w:gz") as tar:
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT)
        if set(rel.parts) & EXCLUDE_DIRS:
            continue
        if path.name in EXCLUDE_FILES:
            continue
        if path.suffix == ".zip" and path.stat().st_size > 50_000_000:
            continue
        tar.add(path, arcname=rel.as_posix())
        count += 1
print(f"files={count} size_mb={archive.stat().st_size/1024/1024:.1f} path={archive}")
