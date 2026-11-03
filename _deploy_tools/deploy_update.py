import paramiko
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HOST = "200.141.5.148"
PASSWORD = sys.argv[1]
LOCAL = r"C:\Users\Asus\OneDrive\Desktop\Workspase\CCII\_deploy_ccii_slim.tar.gz"
REMOTE = "/tmp/ccii_update.tar.gz"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username="root", password=PASSWORD, timeout=60, allow_agent=False, look_for_keys=False)


def run(cmd, timeout=1800):
    print(">>>", cmd[:160], flush=True)
    _i, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=True)
    ch = stdout.channel
    while True:
        if ch.recv_ready():
            print(ch.recv(4096).decode("utf-8", errors="replace"), end="", flush=True)
        if ch.recv_stderr_ready():
            print(ch.recv_stderr(4096).decode("utf-8", errors="replace"), end="", flush=True)
        if ch.exit_status_ready() and not ch.recv_ready() and not ch.recv_stderr_ready():
            break
        time.sleep(0.05)
    code = ch.recv_exit_status()
    print("\nexit", code, flush=True)
    return code


size = os.path.getsize(LOCAL)
print(f"Uploading {size/1024/1024:.1f} MB...", flush=True)
sftp = client.open_sftp()
last = [time.time()]

def cb(t, total):
    now = time.time()
    if now - last[0] > 3:
        print(f"  {t/1024/1024:.1f}/{total/1024/1024:.1f} MB", flush=True)
        last[0] = now

sftp.put(LOCAL, REMOTE, callback=cb)
sftp.close()
print("Upload done", flush=True)

# Preserve .env, extract over project
code = run(
    "cp /var/www/ccii/.env /tmp/ccii.env.bak 2>/dev/null; "
    "cp /var/www/ccii/.env.local /tmp/ccii.env.local.bak 2>/dev/null; "
    "mkdir -p /var/www/ccii && tar -xzf /tmp/ccii_update.tar.gz -C /var/www/ccii && "
    "cp /tmp/ccii.env.bak /var/www/ccii/.env 2>/dev/null; "
    "cp /tmp/ccii.env.local.bak /var/www/ccii/.env.local 2>/dev/null; "
    "rm -f /tmp/ccii_update.tar.gz; "
    "grep AUTH_URL /var/www/ccii/.env"
)
if code != 0:
    sys.exit(code)

# Ensure AUTH_URL is production domain
run(
    "sed -i 's|AUTH_URL=.*|AUTH_URL=https://consciouscine.org|' /var/www/ccii/.env; "
    "sed -i 's|AUTH_URL=.*|AUTH_URL=https://consciouscine.org|' /var/www/ccii/.env.local 2>/dev/null; "
    "grep AUTH_URL /var/www/ccii/.env"
)

code = run("cd /var/www/ccii && npm ci 2>&1", timeout=1800)
if code != 0:
    sys.exit(code)

code = run("cd /var/www/ccii && npx prisma db push 2>&1", timeout=600)
if code != 0:
    print("prisma push failed (continuing if schema already synced)", flush=True)

code = run("cd /var/www/ccii && npm run build 2>&1", timeout=1800)
if code != 0:
    sys.exit(code)

run("cd /var/www/ccii && pm2 restart ccii --update-env && pm2 save && sleep 2 && curl -sI https://consciouscine.org | head -15")
client.close()
print("DEPLOY_OK", flush=True)
