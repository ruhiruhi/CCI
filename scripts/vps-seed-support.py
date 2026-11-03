#!/usr/bin/env python3
import sys
import paramiko

password = sys.argv[1]
host = sys.argv[2] if len(sys.argv) > 2 else "187.127.181.234"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username="root", password=password, timeout=30)

cmd = """cd /var/www/cci && npm run db:seed 2>&1 | tail -30; curl -s -o /dev/null -w 'SUPPORT:%{http_code}\\n' http://127.0.0.1:3002/support; curl -s -o /dev/null -w 'ADMIN_SUPPORT:%{http_code}\\n' http://127.0.0.1:3002/admin/support"""
_, stdout, stderr = client.exec_command(cmd, timeout=120)
print(stdout.read().decode("utf-8", errors="replace"))
err = stderr.read().decode("utf-8", errors="replace")
if err.strip():
    print("STDERR:", err[:800])
client.close()
