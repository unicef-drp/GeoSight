"""Site preference serializer."""
import random

from rest_framework import serializers

from core.models.preferences import SitePreferences
from geosight.georepo.request import GeorepoUrl


class SitePreferencesSerializer(serializers.ModelSerializer):
    """Site preference serializer."""

    icon = serializers.SerializerMethodField()
    favicon = serializers.SerializerMethodField()
    background_image = serializers.SerializerMethodField()
    georepo_api = serializers.SerializerMethodField()

    def get_icon(self, obj: SitePreferences):
        """Return icon."""
        return obj.icon.url if obj.icon else ''

    def get_favicon(self, obj: SitePreferences):
        """Return favicon."""
        return obj.favicon.url if obj.favicon else ''

    def get_georepo_api(self, obj: SitePreferences):
        """Return georepo APIs."""
        georepo_url = GeorepoUrl()
        return georepo_url.urls

    def get_background_image(self, obj: SitePreferences):
        """Return background_image."""
        count = obj.sitepreferencesimage_set.count()
        if not count:
            return ''
        idx = random.randint(0, count - 1)
        return obj.sitepreferencesimage_set.all()[idx].image.url

    class Meta:  # noqa: D106
        model = SitePreferences
        exclude = ('georepo_api_key',)
