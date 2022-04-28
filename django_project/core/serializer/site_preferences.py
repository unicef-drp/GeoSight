from rest_framework import serializers

from core.models.preferences import SitePreferences


class SitePreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitePreferences
        fields = '__all__'
