"""Indicator API."""

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.instance import Instance
from gap_data.serializer.indicator import IndicatorSerializer


class IndicatorsList(APIView):
    """Return Indicator List With it's Scenario."""

    def get(self, request, slug):
        """Return Indicator List With it's Scenario."""
        instance = get_object_or_404(
            Instance, slug=slug
        )
        return Response(
            IndicatorSerializer(
                instance.indicators, many=True
            ).data
        )
