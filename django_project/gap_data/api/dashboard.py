"""Context Analysis API.."""

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.basemap_layer import BasemapLayer
from gap_data.models.dashboard import Dashboard
from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.serializer.dashboard import DashboardSerializer

CREATE_SLUG = ':CREATE'


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        if slug != CREATE_SLUG:
            dashboard = get_object_or_404(Dashboard, slug=slug)
            data = DashboardSerializer(dashboard).data
        else:
            dashboard = Dashboard()
            basemaps = BasemapLayer.objects.filter(
                dashboard_default=True
            )
            data = DashboardSerializer(dashboard).data
            data['basemapsLayers'] = BasemapLayerSerializer(
                basemaps, many=True).data
            if basemaps.count():
                data['defaultBasemapLayer'] = basemaps[0].id

        return Response(data)
