"""Basemap API."""

from rest_framework.response import Response
from rest_framework.views import APIView

from geosight.data.models.basemap_layer import BasemapLayer
from geosight.data.serializer.basemap_layer import BasemapLayerSerializer


class BasemapListAPI(APIView):
    """Return BasemapLayer list."""

    def get(self, request):
        """Return BasemapLayer list."""
        return Response(
            BasemapLayerSerializer(
                BasemapLayer.objects.order_by('name'), many=True
            ).data
        )
