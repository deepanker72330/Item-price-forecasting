from django.apps import AppConfig


class PredictionConfig(AppConfig):
    name = 'prediction'

    def ready(self):
        from prediction import updater
        updater.start()
