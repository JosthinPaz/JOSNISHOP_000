from dotenv import load_dotenv
import os
import sys

# Ensure import path includes BACKEND utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

from utils.email_utils import enviar_recuperacion_contrasena, send_registration_email

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/test_send_email.py <email> [mode]")
        print("mode: recover (default) | register")
        sys.exit(1)
    to = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else 'recover'
    if mode == 'register':
        send_registration_email(to)
    else:
        # generate a test temporary password
        enviar_recuperacion_contrasena(to, 'Test1234')
    print('Done')
