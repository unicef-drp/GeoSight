"""API for detail of indicator."""
from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import AdminAuthenticationPermission
from gap_data.models.indicator import Indicator


class IndicatorDetailAPI(APIView):
    """API for detail of indicator."""

    permission_classes = (IsAuthenticated, AdminAuthenticationPermission,)

    def delete(self, request, pk):
        """Delete an indicator."""
        indicator = get_object_or_404(Indicator, pk=pk)
        indicator.delete()
        return Response('Deleted')


class IndicatorValuesAPI(APIView):
    """API for Values of indicator."""

    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, **kwargs):
        """Return Values."""
        indicator = get_object_or_404(Indicator, pk=pk)
        return Response(indicator.values(datetime.now()))
