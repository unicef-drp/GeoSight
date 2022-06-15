"""Celery settings."""
from __future__ import absolute_import

from celery import Celery
from celery.schedules import crontab

app = Celery('project')

app.config_from_object('django.conf:settings', namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'run-harvester': {
        'task': 'geosight.harvester.tasks.run_harvesters',
        'schedule': crontab(hour=00)
    }
}


@app.task(bind=True)
def debug_task(self):
    """Debug task for celery."""
    print('Request: {0!r}'.format(self.request))
