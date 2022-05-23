"""Serializer for dashboard."""

from rest_framework import serializers

from gap_data.models.dashboard import Dashboard, Widget
from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.serializer.context_layer import ContextLayerSerializer
from gap_data.serializer.indicator import IndicatorSerializer
from gap_data.serializer.reference_layer import ReferenceLayerSerializer


class WidgetSerializer(serializers.ModelSerializer):
    """Serializer for Widget."""

    layer_id = serializers.SerializerMethodField()

    def get_layer_id(self, obj: Widget):
        """Return layer id of Widget."""
        return obj.layer_id

    class Meta:  # noqa: D106
        model = Widget
        exclude = ('indicator', 'context_layer')


class DashboardSerializer(serializers.ModelSerializer):
    """Serializer for Dashboard."""

    referenceLayer = serializers.SerializerMethodField()
    indicators = serializers.SerializerMethodField()
    basemapsLayers = serializers.SerializerMethodField()
    contextLayers = serializers.SerializerMethodField()
    widgets = serializers.SerializerMethodField()
    extent = serializers.SerializerMethodField()
    defaultBasemapLayer = serializers.SerializerMethodField()

    def get_referenceLayer(self, obj: Dashboard):
        """Return reference_layer."""
        return ReferenceLayerSerializer(obj.reference_layer).data

    def get_indicators(self, obj: Dashboard):
        """Return indicators."""
        return IndicatorSerializer(obj.indicators, many=True).data

    def get_basemapsLayers(self, obj: Dashboard):
        """Return basemapsLayers."""
        return BasemapLayerSerializer(
            obj.basemap_layers.order_by('id'), many=True
        ).data

    def get_contextLayers(self, obj: Dashboard):
        """Return contextLayers."""
        return ContextLayerSerializer(
            obj.context_layers, many=True
        ).data

    def get_widgets(self, obj: Dashboard):
        """Return widgets."""
        return WidgetSerializer(
            obj.widget_set.all().order_by('pk'), many=True
        ).data

    def get_extent(self, obj: Dashboard):
        """Return extent."""
        return obj.extent.extent

    def get_defaultBasemapLayer(self, obj: Dashboard):
        """Return defaultBasemapLayer."""
        return obj.default_basemap_layer.id \
            if obj.default_basemap_layer else None

    class Meta:  # noqa: D106
        model = Dashboard
        fields = (
            'referenceLayer', 'indicators',
            'basemapsLayers', 'contextLayers',
            'widgets', 'extent', 'defaultBasemapLayer'
        )
