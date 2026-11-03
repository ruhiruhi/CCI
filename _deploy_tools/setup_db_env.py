import paramiko
import secrets
import string
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HOST = "200.141.5.148"
PASSWORD = sys.argv[1] if len(sys.argv) > 1 else ""

if not PASSWORD:
    print("Usage: setup_db_env.py <ssh-password>")
    sys.exit(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    HOST,
    username="root",
    password=PASSWORD,
    timeout=30,
    allow_agent=False,
    look_for_keys=False,
)


def run(cmd: str, timeout: int = 600):
    print(">>>", cmd[:160], flush=True)
    _stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    code = stdout.channel.recv_exit_status()
    text = (out + ("\n" + err if err else "")).strip()
    print(text[-3000:] if len(text) > 3000 else text, flush=True)
    print("exit", code, flush=True)
    return code, text


db_pass = "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(28))
auth_secret = secrets.token_urlsafe(48)

sql = (
    "CREATE DATABASE IF NOT EXISTS cci CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; "
    f"CREATE USER IF NOT EXISTS 'cci_app'@'localhost' IDENTIFIED BY '{db_pass}'; "
    f"ALTER USER 'cci_app'@'localhost' IDENTIFIED BY '{db_pass}'; "
    "GRANT ALL PRIVILEGES ON cci.* TO 'cci_app'@'localhost'; "
    "FLUSH PRIVILEGES;"
)
code, _ = run(f"mysql -e \"{sql}\"")
if code != 0:
    sys.exit(1)

env = f"""DATABASE_URL="mysql://cci_app:{db_pass}@localhost:3306/cci"
DB_HOST=localhost
DB_PORT=3306
DB_USER=cci_app
DB_PASSWORD={db_pass}
DB_NAME=cci
AUTH_SECRET={auth_secret}
AUTH_TRUST_HOST=true
AUTH_URL=http://200.141.5.148
NODE_ENV=production
PORT=3000
LEAD_ADMIN_EMAIL=admin@consciouscinema.in
"""

sftp = client.open_sftp()
for name in (".env", ".env.local"):
    path = f"/var/www/ccii/{name}"
    with sftp.file(path, "w") as f:
        f.write(env)
    sftp.chmod(path, 0o600)

with sftp.file("/root/.ccii_deploy_creds", "w") as f:
    f.write(f"DB_PASSWORD={db_pass}\nAUTH_SECRET={auth_secret}\n")
sftp.chmod("/root/.ccii_deploy_creds", 0o600)
sftp.close()

run(f"mysql -u cci_app -p'{db_pass}' -e 'SHOW DATABASES;'")
client.close()
print("DB_ENV_OK", flush=True)
