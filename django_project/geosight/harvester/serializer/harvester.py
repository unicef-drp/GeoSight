"""Harvester Log Serializer."""
from rest_framework import serializers

from geosight.harvester.models.harvester_log import HarvesterLog


class HarvesterLogSerializer(serializers.ModelSerializer):
    """Harvester Log Serializer."""

    html_detail = serializers.SerializerMethodField()

    def get_html_detail(self, obj: HarvesterLog):
        """Return detail in html."""
        return obj.html_detail()

    class Meta:  # noqa: D106
        model = HarvesterLog
        fields = '__all__'
