from .base import *

DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "10.0.2.2", "192.168.18.64"]
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'