from __future__ import absolute_import, unicode_literals

from django.apps import AppConfig


class Config(AppConfig):
    """GeoSight Georepo App."""

    label = 'geosight_georepo'
    name = 'geosight.georepo'
    verbose_name = "GeoSight Georepo"


default_app_config = 'geosight.georepo.Config'
