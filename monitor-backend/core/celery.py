# core/celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check-services-every-minute': {
        'task': 'monitor.tasks.check_services',
        'schedule': crontab(minute='*/1'),
    },
      'check_connections_every_60s': {
        'task': 'monitor.tasks.check_connections',
        'schedule': 60.0,
    },
}
