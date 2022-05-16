"""Context Analysis API.."""
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.instance import Instance
from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.serializer.context_layer import ContextLayerSerializer
from gap_data.serializer.indicator import IndicatorSerializer


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        # TODO:
        #  Check this from dashboard
        instance = Instance.objects.get(slug='somalia')

        context = {
            'indicators': IndicatorSerializer(
                instance.user_indicators(request.user), many=True
            ).data,

            'basemaps': BasemapLayerSerializer(
                instance.basemap_layers, many=True
            ).data,

            'contextLayers': ContextLayerSerializer(
                instance.context_layers, many=True
            ).data,
        }
        return Response(context)
