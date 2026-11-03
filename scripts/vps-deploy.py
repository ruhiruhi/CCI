#!/usr/bin/env python3
from __future__ import annotations

import sys
import tarfile
import time
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
REMOTE_DIR = "/var/www/cci"
REMOTE_TAR = "/tmp/cci-deploy.tar.gz"
LOCAL_TAR = ROOT / "cci-deploy.tar.gz"

EXCLUDE_DIRS = {
    "node_modules",
    ".next",
    ".git",
    "public_extracted",
    "drive-download-20260706T045733Z-3-001",
    ".tmp-thumbs",
    ".tmp-day2-thumbs",
    "Day1image",
    "Day2image",
    "__pycache__",
}

EXCLUDE_FILES = {
    ".env",
    ".env.local",
    "cci-deploy.tar.gz",
    "cci-public.zip",
    "drive-download-20260706T045733Z-3-001.zip",
    "body.txt",
    "cookies.txt",
    "headers.txt",
    "vdo_1.mp4",
}


def log(msg: str) -> None:
    print(msg, flush=True)


def run_remote(client: paramiko.SSHClient, command: str, timeout: int = 1800) -> int:
    _, stdout, stderr = client.exec_command(command, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    code = stdout.channel.recv_exit_status()
    if out.strip():
        log(out.rstrip())
    if err.strip():
        log("STDERR:\n" + err.rstrip())
    return code


def create_archive() -> None:
    count = 0
    with tarfile.open(LOCAL_TAR, "w:gz") as tar:
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
    size_mb = LOCAL_TAR.stat().st_size / (1024 * 1024)
    log(f"Archive: {count} files, {size_mb:.1f} MB")


def main() -> int:
    if len(sys.argv) < 2:
        log("Usage: python scripts/vps-deploy.py <password> [host]")
        return 1

    password = sys.argv[1]
    # CCI production host (default). Pass a second arg to override.
    host = sys.argv[2] if len(sys.argv) > 2 else "187.127.181.234"
    auth_url = f"http://{host}"

    log("Step 1/4: Creating archive...")
    create_archive()

    log(f"Step 2/4: Connecting to VPS ({host})...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username="root", password=password, timeout=30)

    log("Step 3/4: Uploading archive...")
    run_remote(client, f"rm -f {REMOTE_TAR}", timeout=30)
    # Ensure app directory exists on fresh Hostinger boxes
    run_remote(client, f"mkdir -p {REMOTE_DIR}", timeout=30)
    sftp = client.open_sftp()
    sftp.put(str(LOCAL_TAR), REMOTE_TAR)
    sftp.close()
    LOCAL_TAR.unlink(missing_ok=True)

    remote_script = f"""set -e
mkdir -p {REMOTE_DIR}
cd {REMOTE_DIR}
cp .env /tmp/cci-env-backup 2>/dev/null || true
cp .env.local /tmp/cci-env-local-backup 2>/dev/null || true
# Clear previous src so deleted TypeScript files do not linger after extract
rm -rf src
tar -xzf {REMOTE_TAR} -C {REMOTE_DIR}
if [ -f /tmp/cci-env-backup ]; then mv /tmp/cci-env-backup .env; fi
if [ -f /tmp/cci-env-local-backup ]; then mv /tmp/cci-env-local-backup .env.local; fi
touch .env .env.local
grep -q '^AUTH_URL=' .env || echo 'AUTH_URL="{auth_url}"' >> .env
grep -q '^AUTH_URL=' .env.local || echo 'AUTH_URL="{auth_url}"' >> .env.local
npm install
npm run db:push || true
npm run db:sync || true
npm run build
pm2 delete cci 2>/dev/null || true
PORT=3002 pm2 start npm --name cci -- start
pm2 save
sleep 6
curl -s -o /dev/null -w 'HOME:%{{http_code}}\\n' http://127.0.0.1:3002/
curl -s -o /dev/null -w 'ACTIVITIES:%{{http_code}}\\n' http://127.0.0.1:3002/our-activities
curl -s -o /dev/null -w 'DELHI:%{{http_code}}\\n' http://127.0.0.1:3002/our-activities/delhi
pm2 list
"""

    log("Step 4/4: Building and restarting on VPS (this may take several minutes)...")
    code = run_remote(client, remote_script, timeout=1800)
    client.close()

    if code != 0:
        log(f"Deploy failed: exit code {code}")
        return code

    log("Deploy completed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
