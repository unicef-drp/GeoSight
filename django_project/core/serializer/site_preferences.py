"""Site preference serializer."""
from rest_framework import serializers

from core.models.preferences import SitePreferences


class SitePreferencesSerializer(serializers.ModelSerializer):
    """Site preference serializer."""

    icon = serializers.SerializerMethodField()
    favicon = serializers.SerializerMethodField()
    georepo_api_key = serializers.SerializerMethodField()

    def get_icon(self, obj: SitePreferences):
        """Return icon."""
        return obj.icon.url if obj.icon else ''

    def get_favicon(self, obj: SitePreferences):
        """Return favicon."""
        return obj.favicon.url if obj.favicon else ''

    def get_georepo_api_key(self, obj: SitePreferences):
        """Return georepo_api_key."""
        return obj.georepo_api_key if obj.georepo_api_key else ''

    class Meta:  # noqa: D106
        model = SitePreferences
        fields = '__all__'
