"""Basemap API."""

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import AdminAuthenticationPermission
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


class BasemapDetailAPI(APIView):
    """API for detail of basemap."""

    permission_classes = (IsAuthenticated, AdminAuthenticationPermission,)

    def delete(self, request, pk):
        """Delete an basemap."""
        basemap = get_object_or_404(BasemapLayer, pk=pk)
        basemap.delete()
        return Response('Deleted')
