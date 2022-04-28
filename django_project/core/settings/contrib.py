# coding=utf-8
"""Settings for 3rd party."""
from .base import *  # noqa

# Extra installed apps
INSTALLED_APPS = INSTALLED_APPS + (
    'rest_framework',
    'rest_framework_gis',
)
