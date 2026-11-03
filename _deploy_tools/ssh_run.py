import paramiko
import sys
import time

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HOST = "200.141.5.148"
PASSWORD = sys.argv[1] if len(sys.argv) > 1 else ""
CMD = sys.argv[2] if len(sys.argv) > 2 else ""
TIMEOUT = int(sys.argv[3]) if len(sys.argv) > 3 else 1800

if not PASSWORD or not CMD:
    print("Usage: ssh_run.py <password> <command> [timeout]")
    sys.exit(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    HOST,
    username="root",
    password=PASSWORD,
    timeout=60,
    allow_agent=False,
    look_for_keys=False,
    banner_timeout=60,
)

print(">>>", CMD[:200], flush=True)
_stdin, stdout, stderr = client.exec_command(CMD, timeout=TIMEOUT, get_pty=True)
# stream output
channel = stdout.channel
while True:
    if channel.recv_ready():
        chunk = channel.recv(4096).decode("utf-8", errors="replace")
        print(chunk, end="", flush=True)
    if channel.recv_stderr_ready():
        chunk = channel.recv_stderr(4096).decode("utf-8", errors="replace")
        print(chunk, end="", flush=True)
    if channel.exit_status_ready() and not channel.recv_ready() and not channel.recv_stderr_ready():
        break
    time.sleep(0.1)

code = channel.recv_exit_status()
client.close()
print("\nexit", code, flush=True)
sys.exit(code)
