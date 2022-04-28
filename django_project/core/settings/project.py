# coding=utf-8

"""Project level settings.

Adjust these values as needed but don't commit passwords etc. to any public
repository!
"""

import os  # noqa

from django.utils.translation import ugettext_lazy as _

from .contrib import *  # noqa

ALLOWED_HOSTS = ['*']
ADMINS = (
    ('Irwan Fathurrahman', 'irwam@kartoza.com'),
)
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': os.environ['DATABASE_NAME'],
        'USER': os.environ['DATABASE_USERNAME'],
        'PASSWORD': os.environ['DATABASE_PASSWORD'],
        'HOST': os.environ['DATABASE_HOST'],
        'PORT': 5432,
        'TEST_NAME': 'unittests',
    }
}

# Due to profile page does not available,
# this will redirect to home page after login
LOGIN_REDIRECT_URL = '/'

# How many versions to list in each project box
PROJECT_VERSION_LIST_SIZE = 10

# Set debug to false for production
DEBUG = TEMPLATE_DEBUG = False

SOUTH_TESTS_MIGRATE = False

# Set languages which want to be translated
LANGUAGES = (
    ('en', _('English')),
)

# Set storage path for the translation files
LOCALE_PATHS = (ABS_PATH('locale'),)

# Extra installed apps
INSTALLED_APPS = INSTALLED_APPS + (
    'core',
    'gap_data',
    'gap_harvester',
    'gap_dashboard',
)

# -------------------------------------------------- #
# ----------            CELERY          ------------ #
# -------------------------------------------------- #
CELERY_BROKER_URL = 'amqp://guest:guest@%s:5672//' % os.environ.get('RABBITMQ_HOST', 'rabbitmq')
CELERY_RESULT_BACKEND = None
CELERY_TASK_ALWAYS_EAGER = False  # set this to False in order to run async
CELERY_TASK_IGNORE_RESULT = True
CELERY_TASK_DEFAULT_QUEUE = "default"
CELERY_TASK_DEFAULT_EXCHANGE = "default"
CELERY_TASK_DEFAULT_EXCHANGE_TYPE = "direct"
CELERY_TASK_DEFAULT_ROUTING_KEY = "default"
CELERY_TASK_CREATE_MISSING_QUEUES = True
CELERY_TASK_RESULT_EXPIRES = 1
CELERY_WORKER_DISABLE_RATE_LIMITS = True
CELERY_WORKER_SEND_TASK_EVENTS = False

DATA_UPLOAD_MAX_NUMBER_FIELDS = 10000

# -------------------------------------------------- #
# ----------           ONEDRIVE         ------------ #
# -------------------------------------------------- #
ONEDRIVE_ROOT = '/onedrive/data'
# -------------------------------------------------- #

# ----------           BACKUPS          ------------ #
# -------------------------------------------------- #
BACKUPS_ROOT = '/backups'
