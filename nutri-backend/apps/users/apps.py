from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'  # Ruta completa
    label = 'users'      # Nombre corto para la BD

    def ready(self):
        """
        Activamos las señales al arrancar.
        """
        import apps.users.signals