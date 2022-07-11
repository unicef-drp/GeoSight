"""Context Analysis API.."""

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import AdminAuthenticationPermission
from geosight.data.models.basemap_layer import BasemapLayer
from geosight.data.models.dashboard import Dashboard
from geosight.data.serializer.basemap_layer import BasemapLayerSerializer
from geosight.data.serializer.dashboard import (
    DashboardBasicSerializer, DashboardSerializer
)


class DashboardListAPI(APIView):
    """Return DashboardLayer list."""

    def get(self, request):
        """Return DashboardLayer list."""
        return Response(
            DashboardBasicSerializer(
                Dashboard.objects.order_by('name'), many=True
            ).data
        )


CREATE_SLUG = ':CREATE'


class DashboardDetail(APIView):
    """Return all dashboard data."""

    permission_classes = (IsAuthenticated, AdminAuthenticationPermission,)

    def delete(self, request, slug):
        """Delete an basemap."""
        dashboard = get_object_or_404(Dashboard, slug=slug)
        dashboard.delete()
        return Response('Deleted')


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        if slug != CREATE_SLUG:
            dashboard = get_object_or_404(Dashboard, slug=slug)
            data = DashboardSerializer(dashboard).data
        else:
            dashboard = Dashboard()
            basemaps = BasemapLayer.objects.all()
            data = DashboardSerializer(dashboard).data
            data['basemapsLayers'] = BasemapLayerSerializer(
                basemaps, many=True).data
            if basemaps.count():
                data['defaultBasemapLayer'] = basemaps[0].id

        return Response(data)
