"""Basemap API."""

from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.basemap_layer import BasemapLayer
from gap_data.serializer.basemap_layer import BasemapLayerSerializer


class BasemapListAPI(APIView):
    """Return BasemapLayer list."""

    def get(self, request):
        """Return BasemapLayer list."""
        return Response(
            BasemapLayerSerializer(
                BasemapLayer.objects.all(), many=True
            ).data
        )
