from django.apps import AppConfig
from .ws_server import WebsocketServer


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        server = WebsocketServer()
