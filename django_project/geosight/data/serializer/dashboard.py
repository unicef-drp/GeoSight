"""Serializer for dashboard."""

import json

from rest_framework import serializers

from geosight.data.models.dashboard import Dashboard, Widget
from geosight.data.models.reference_layer import ReferenceLayer
from geosight.data.serializer.basemap_layer import BasemapLayerSerializer
from geosight.data.serializer.context_layer import ContextLayerSerializer
from geosight.data.serializer.indicator import BasicIndicatorSerializer
from geosight.data.serializer.reference_layer import ReferenceLayerSerializer


class WidgetSerializer(serializers.ModelSerializer):
    """Serializer for Widget."""

    layer_id = serializers.SerializerMethodField()

    def get_layer_id(self, obj: Widget):
        """Return layer id of Widget."""
        return obj.layer_id

    class Meta:  # noqa: D106
        model = Widget
        exclude = ('indicator', 'context_layer', 'dashboard')


class DashboardSerializer(serializers.ModelSerializer):
    """Serializer for Dashboard."""

    referenceLayer = serializers.SerializerMethodField()
    indicators = serializers.SerializerMethodField()
    basemapsLayers = serializers.SerializerMethodField()
    contextLayers = serializers.SerializerMethodField()
    widgets = serializers.SerializerMethodField()
    extent = serializers.SerializerMethodField()
    defaultBasemapLayer = serializers.SerializerMethodField()
    filters = serializers.SerializerMethodField()

    def get_referenceLayer(self, obj: Dashboard):
        """Return reference_layer."""
        try:
            return ReferenceLayerSerializer(obj.reference_layer).data
        except ReferenceLayer.DoesNotExist:
            return {}

    def get_indicators(self, obj: Dashboard):
        """Return indicators."""
        if obj.id:
            return BasicIndicatorSerializer(obj.indicators, many=True).data
        else:
            return []

    def get_basemapsLayers(self, obj: Dashboard):
        """Return basemapsLayers."""
        if obj.id:
            return BasemapLayerSerializer(
                obj.basemap_layers.order_by('id'), many=True
            ).data
        else:
            return []

    def get_contextLayers(self, obj: Dashboard):
        """Return contextLayers."""
        if obj.id:
            return ContextLayerSerializer(
                obj.context_layers, many=True
            ).data
        else:
            return []

    def get_widgets(self, obj: Dashboard):
        """Return widgets."""
        if obj.id:
            return WidgetSerializer(
                obj.widget_set.all(), many=True
            ).data
        else:
            return []

    def get_extent(self, obj: Dashboard):
        """Return extent."""
        return obj.extent.extent if obj.extent else [0, 0, 0, 0]

    def get_defaultBasemapLayer(self, obj: Dashboard):
        """Return defaultBasemapLayer."""
        return obj.default_basemap_layer.id \
            if obj.default_basemap_layer else None

    def get_filters(self, obj: Dashboard):
        """Return filters."""
        return obj.filters

    class Meta:  # noqa: D106
        model = Dashboard
        fields = (
            'id', 'name', 'description',
            'referenceLayer', 'indicators',
            'basemapsLayers', 'contextLayers',
            'widgets', 'extent', 'defaultBasemapLayer',
            'filters'
        )
