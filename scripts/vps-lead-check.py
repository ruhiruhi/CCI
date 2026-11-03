#!/usr/bin/env python3
import sys
import paramiko

password = sys.argv[1]
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("187.127.181.234", username="root", password=password, timeout=30)

# Write payload on server
sftp = client.open_sftp()
with sftp.file("/tmp/lead.json", "w") as f:
    f.write(
        '{"name":"Test Lead","email":"test@example.com","phone":"+919876543210",'
        '"city":"Delhi","interest":"Join the Movement","buttonName":"Join the Movement",'
        '"sourcePage":"/","pageUrl":"http://127.0.0.1:3002/","message":"Deploy test"}'
    )
sftp.close()

cmd = (
    'curl -s -X POST http://127.0.0.1:3002/api/leads '
    '-H "Content-Type: application/json" '
    '-H "Origin: http://127.0.0.1:3002" '
    '--data-binary @/tmp/lead.json; echo; '
    'cd /var/www/cci && node -e "const {PrismaClient}=require(\'@prisma/client\');'
    'const p=new PrismaClient();'
    'p.lead.findMany({orderBy:{createdAt:\\"desc\\"},take:2}).then(r=>{console.log(JSON.stringify(r.map(x=>({id:x.id,name:x.name,interest:x.interest,status:x.status}))));return p.\\$disconnect();})"'
)
_, stdout, stderr = client.exec_command(cmd, timeout=60)
print(stdout.read().decode("utf-8", errors="replace"))
err = stderr.read().decode("utf-8", errors="replace")
if err.strip():
    print("STDERR:", err[:1000])
client.close()
