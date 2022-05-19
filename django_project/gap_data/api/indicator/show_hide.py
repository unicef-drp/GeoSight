"""Show/Hide indicator API."""
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import AdminAuthenticationPermission
from gap_data.models.indicator import Indicator


class IndicatorShow(APIView):
    """Show indicator."""

    permission_classes = (IsAuthenticated, AdminAuthenticationPermission,)

    def patch(self, request, pk):
        """Show indicator."""
        try:
            indicator = get_object_or_404(
                Indicator, id=pk
            )
            indicator.show_in_context_analysis = True
            indicator.save()
            return Response()
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')


class IndicatorHide(APIView):
    """Hide indicator."""

    permission_classes = (
        IsAuthenticated, AdminAuthenticationPermission,
    )

    def patch(self, request, pk):
        """Hide indicator."""
        try:
            indicator = get_object_or_404(
                Indicator, id=pk
            )
            indicator.show_in_context_analysis = False
            indicator.save()
            return Response()
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')
