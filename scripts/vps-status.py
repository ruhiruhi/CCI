import sys
import paramiko

PASSWORD = sys.argv[1]
HOST = "187.127.181.234"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username="root", password=PASSWORD, timeout=30)

cmds = [
    "pm2 list",
    "curl -s -o /dev/null -w 'HOME:%{http_code}' http://127.0.0.1:3002/",
    "echo",
    "curl -s -o /dev/null -w 'ADMIN:%{http_code}' http://127.0.0.1:3002/admin",
    "echo",
    "ls -la /var/www/cci/package.json /var/www/cci/scripts/vps-deploy.py 2>/dev/null || echo NO_DEPLOY_SCRIPT",
    "tail -5 /root/.pm2/logs/cci-error.log 2>/dev/null",
    "ls /tmp/cci-deploy.tar.gz 2>/dev/null && ls -lh /tmp/cci-deploy.tar.gz || echo NO_TAR",
]

for cmd in cmds:
    print("===", cmd, "===")
    _, o, e = client.exec_command(cmd, timeout=60)
    print(o.read().decode())
    err = e.read().decode()
    if err.strip():
        print("ERR:", err)

client.close()
