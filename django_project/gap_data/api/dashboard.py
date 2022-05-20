"""Context Analysis API.."""

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.dashboard import Dashboard
from gap_data.models.reference_layer import ReferenceLayer
from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.serializer.context_layer import ContextLayerSerializer
from gap_data.serializer.dashboard import WidgetSerializer
from gap_data.serializer.indicator import IndicatorSerializer
from gap_data.serializer.reference_layer import (
    GeometrySerializer, ReferenceLayerSerializer
)


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        dashboard = get_object_or_404(Dashboard, slug=slug)
        context = {
            'referenceLayer': ReferenceLayerSerializer(
                dashboard.reference_layer
            ).data,
            'indicators': IndicatorSerializer(
                dashboard.indicators, many=True
            ).data,
            'basemapsLayers': BasemapLayerSerializer(
                dashboard.basemap_layers.order_by('id'), many=True
            ).data,
            'contextLayers': ContextLayerSerializer(
                dashboard.context_layers, many=True
            ).data,
            'extent': dashboard.extent.extent,
            'widgets': WidgetSerializer(
                dashboard.widget_set.all().order_by('pk'), many=True
            ).data
        }
        return Response(context)


class ReferenceLayerGeojson(APIView):
    """Reference Layer Geojson."""

    def get(self, request, uuid, level):
        """Return all context analysis data."""
        reference_layer = get_object_or_404(ReferenceLayer, identifier=uuid)
        level = get_object_or_404(
            reference_layer.referencelayerlevel_set,
            level_name__name__iexact=level
        ).level_name
        return Response(
            GeometrySerializer(
                reference_layer.geometries.filter(geometry_level=level),
                many=True
            ).data
        )
