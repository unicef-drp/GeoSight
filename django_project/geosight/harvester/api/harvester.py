"""Return HarvesterLog data API."""
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from geosight.harvester.models.harvester_log import HarvesterLog
from geosight.harvester.serializer.harvester import HarvesterLogSerializer


class HarvesterLogData(APIView):
    """Return HarvesterLog data API."""

    def get(self, request, pk):
        """Return log data."""
        log = get_object_or_404(
            HarvesterLog, pk=pk
        )
        return Response(
            HarvesterLogSerializer(log).data
        )
