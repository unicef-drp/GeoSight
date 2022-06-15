from __future__ import absolute_import, unicode_literals

from django.apps import AppConfig


class Config(AppConfig):
    """GeoSight Config App."""

    label = 'geosight_harvester'
    name = 'geosight.harvester'
    verbose_name = "GeoSight Harvester"


default_app_config = 'geosight.harvester.Config'
