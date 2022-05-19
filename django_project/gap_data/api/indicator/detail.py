"""API for detail of indicator."""
from django.http import Http404
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
        try:
            indicator = Indicator.objects.get(id=pk)
            indicator.delete()
            return Response('Deleted')
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')
