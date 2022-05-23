"""Geometry API.

TODO:
 This will be moved to georepo
"""

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.reference_layer import ReferenceLayer
from gap_data.serializer.reference_layer import (
    GeometrySerializer, ReferenceLayerSerializer
)


class ReferenceLayerListAPI(APIView):
    """Return Reference Layer list."""

    def get(self, request):
        """Return Reference Layer list."""
        return Response(
            ReferenceLayerSerializer(
                ReferenceLayer.objects.all(), many=True
            ).data
        )


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
