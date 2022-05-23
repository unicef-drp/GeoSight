"""Context Analysis API.."""

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.dashboard import Dashboard
from gap_data.serializer.dashboard import DashboardSerializer

CREATE_SLUG = ':CREATE'


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        if slug != CREATE_SLUG:
            dashboard = get_object_or_404(Dashboard, slug=slug)
        else:
            dashboard = Dashboard()
        return Response(DashboardSerializer(dashboard).data)
