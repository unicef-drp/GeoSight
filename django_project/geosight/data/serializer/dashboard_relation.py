"""Serializer for dashboard."""

from rest_framework import serializers

from geosight.data.models.dashboard import (
    DashboardIndicator, DashboardBasemap, DashboardContextLayer
)


class DashboardIndicatorSerializer(serializers.ModelSerializer):
    """Serializer for DashboardIndicator."""

    class Meta:  # noqa: D106
        model = DashboardIndicator
        fields = ('order', 'group', 'visible_by_default')


class DashboardBasemapSerializer(serializers.ModelSerializer):
    """Serializer for DashboardBasemap."""

    class Meta:  # noqa: D106
        model = DashboardBasemap
        fields = ('order', 'group', 'visible_by_default')


class DashboardContextLayerSerializer(serializers.ModelSerializer):
    """Serializer for DashboardContextLayer."""

    class Meta:  # noqa: D106
        model = DashboardContextLayer
        fields = ('order', 'group', 'visible_by_default')
