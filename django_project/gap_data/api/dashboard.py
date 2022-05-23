"""Context Analysis API.."""

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.dashboard import Dashboard
from gap_data.models.reference_layer import ReferenceLayer
from gap_data.serializer.dashboard import DashboardSerializer
from gap_data.serializer.reference_layer import GeometrySerializer


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        dashboard = get_object_or_404(Dashboard, slug=slug)
        return Response(DashboardSerializer(dashboard).data)


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
