"""Serializer for dashboard."""
import json

from rest_framework import serializers

from geosight.data.models.dashboard import Dashboard, Widget
from geosight.data.serializer.basemap_layer import BasemapLayerSerializer
from geosight.data.serializer.context_layer import ContextLayerSerializer
from geosight.data.serializer.dashboard_relation import (
    DashboardIndicatorSerializer, DashboardBasemapSerializer,
    DashboardContextLayerSerializer
)
from geosight.data.serializer.indicator import BasicIndicatorSerializer


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

    description = serializers.SerializerMethodField()
    referenceLayer = serializers.SerializerMethodField()
    indicators = serializers.SerializerMethodField()
    basemapsLayers = serializers.SerializerMethodField()
    contextLayers = serializers.SerializerMethodField()
    widgets = serializers.SerializerMethodField()
    extent = serializers.SerializerMethodField()
    filters = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()

    def get_description(self, obj: Dashboard):
        """Return description."""
        return obj.description if obj.description else ''

    def get_referenceLayer(self, obj: Dashboard):
        """Return reference_layer."""
        reference_layer = obj.reference_layer
        return {
            'identifier': reference_layer.identifier,
            'detail_url': reference_layer.detail_url
        }

    def get_indicators(self, obj: Dashboard):
        """Return indicators."""
        output = []
        for model in obj.dashboardindicator_set.all():
            data = BasicIndicatorSerializer(model.object).data
            data.update(
                DashboardIndicatorSerializer(model).data
            )
            output.append(data)

        return output

    def get_basemapsLayers(self, obj: Dashboard):
        """Return basemapsLayers."""
        output = []
        for model in obj.dashboardbasemap_set.all():
            data = BasemapLayerSerializer(model.object).data
            data.update(
                DashboardBasemapSerializer(model).data
            )
            output.append(data)

        return output

    def get_contextLayers(self, obj: Dashboard):
        """Return contextLayers."""
        output = []
        for model in obj.dashboardcontextlayer_set.all():
            data = ContextLayerSerializer(model.object).data
            data.update(
                DashboardContextLayerSerializer(model).data
            )
            output.append(data)

        return output

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

    def get_filters(self, obj: Dashboard):
        """Return filters."""
        if obj.filters:
            return json.loads(obj.filters)
        else:
            return []

    def get_category(self, obj: Dashboard):
        """Return dashboard category name."""
        return obj.group.name if obj.group else ''

    def get_group(self, obj: Dashboard):
        """Return dashboard group name."""
        return obj.group.name if obj.group else ''

    class Meta:  # noqa: D106
        model = Dashboard
        fields = (
            'id', 'icon', 'name', 'description',
            'referenceLayer', 'indicators',
            'basemapsLayers', 'contextLayers',
            'widgets', 'extent', 'filters', 'category', 'group'
        )


class DashboardBasicSerializer(serializers.ModelSerializer):
    """Serializer for Dashboard."""

    id = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    modified_at = serializers.SerializerMethodField()

    def get_id(self, obj: Dashboard):
        """Return dashboard id."""
        return obj.slug

    def get_group(self, obj: Dashboard):
        """Return dashboard group name."""
        return obj.group.name if obj.group else ''

    def get_category(self, obj: Dashboard):
        """Return dashboard category name."""
        return obj.group.name if obj.group else ''

    def get_modified_at(self, obj: Dashboard):
        """Return dashboard last modified."""
        return obj.modified_at.strftime('%Y-%m-%d %H:%M:%S')

    class Meta:  # noqa: D106
        model = Dashboard
        fields = (
            'id', 'icon', 'name', 'modified_at',
            'description', 'group', 'category'
        )
