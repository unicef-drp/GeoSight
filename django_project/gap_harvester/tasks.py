"""Tasks for harvester."""
from celery.utils.log import get_task_logger
from django.core.management import call_command

from core.celery import app

logger = get_task_logger(__name__)


@app.task
def run_harvesters():
    """Run all harvesters."""
    call_command('run_harvesters')


@app.task
def run_harvester(id):
    """Run all harvester by id."""
    call_command('run_harvesters', '--id', id, '-force', True)
