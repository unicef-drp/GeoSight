"""Serializer for dashboard."""

from rest_framework import serializers

from geosight.data.models.dashboard import (
    DashboardIndicator, DashboardBasemap, DashboardContextLayer
)


class DashboardIndicatorSerializer(serializers.ModelSerializer):
    """Serializer for DashboardIndicator."""
    group = serializers.SerializerMethodField()

    def get_group(self, obj: DashboardIndicator):
        """Return dashboard group name."""
        return obj.group if obj.group else ''

    class Meta:  # noqa: D106
        model = DashboardIndicator
        fields = ('order', 'group', 'visible_by_default')


class DashboardBasemapSerializer(serializers.ModelSerializer):
    """Serializer for DashboardBasemap."""
    group = serializers.SerializerMethodField()

    def get_group(self, obj: DashboardBasemap):
        """Return dashboard group name."""
        return obj.group if obj.group else ''

    class Meta:  # noqa: D106
        model = DashboardBasemap
        fields = ('order', 'group', 'visible_by_default')


class DashboardContextLayerSerializer(serializers.ModelSerializer):
    """Serializer for DashboardContextLayer."""
    group = serializers.SerializerMethodField()

    def get_group(self, obj: DashboardContextLayer):
        """Return dashboard group name."""
        return obj.group if obj.group else ''

    class Meta:  # noqa: D106
        model = DashboardContextLayer
        fields = ('order', 'group', 'visible_by_default')
