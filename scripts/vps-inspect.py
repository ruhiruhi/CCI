import paramiko
import sys

HOST = "187.127.181.234"
USER = "root"
PASSWORD = sys.argv[1] if len(sys.argv) > 1 else ""

if not PASSWORD:
    print("Usage: python vps-inspect.py <password>", file=sys.stderr)
    sys.exit(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASSWORD, timeout=30)

cmds = [
    "cat /root/deploy-cci.sh",
    "ls -la /var/www/cci",
    "pm2 jlist",
    "head -30 /var/www/cci/package.json",
    "grep -E '^[A-Z_]+=' /var/www/cci/.env 2>/dev/null | sed 's/=.*$/=***/'",
    "grep -E '^[A-Z_]+=' /var/www/cci/.env.local 2>/dev/null | sed 's/=.*$/=***/'",
    "ls /etc/nginx/sites-enabled/",
    "cat /etc/nginx/sites-enabled/* 2>/dev/null",
    "systemctl is-active mysql mariadb nginx 2>/dev/null",
    "mysql -e 'SHOW DATABASES;' 2>/dev/null || echo MYSQL_CMD_FAILED",
]

for cmd in cmds:
    print("===", cmd, "===")
    _, stdout, stderr = client.exec_command(cmd, timeout=120)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    print(out[:15000])
    if err.strip():
        print("ERR:", err[:2000])

client.close()
