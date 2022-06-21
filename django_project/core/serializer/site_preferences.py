"""Site preference serializer."""
from rest_framework import serializers

from core.models.preferences import SitePreferences
from geosight.georepo.request import GeorepoUrl


class SitePreferencesSerializer(serializers.ModelSerializer):
    """Site preference serializer."""

    icon = serializers.SerializerMethodField()
    favicon = serializers.SerializerMethodField()
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
        return {
            'reference_layer_list': georepo_url.reference_layer_list
        }

    class Meta:  # noqa: D106
        model = SitePreferences
        exclude = ('georepo_api_key',)
