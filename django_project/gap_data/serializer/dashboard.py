"""Serializer for dashboard."""

from rest_framework import serializers

from gap_data.models.dashboard import (
    Plugin
)


class PluginSerializer(serializers.ModelSerializer):
    """Serializer for Plugin."""

    layer_id = serializers.SerializerMethodField()

    def get_layer_id(self, obj: Plugin):
        """Return layer id of plugin."""
        return obj.layer_id

    class Meta:  # noqa: D106
        model = Plugin
        exclude = ('reference_layer', 'context_layer')
