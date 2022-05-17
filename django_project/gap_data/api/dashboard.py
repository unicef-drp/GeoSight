"""Context Analysis API.."""
from django.http import Http404
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
        instance = Instance.objects.first()
        if not instance:
            raise Http404('Instance not found')

        # TODO:
        #  This slug should be the dashboard slug
        indicator = instance.user_indicators(
            request.user
        ).filter(name__iexact=slug).first()
        if not instance:
            raise Http404('Instance not found')

        reference_layer = IndicatorSerializer(indicator).data
        context = {
            'referenceLayer': reference_layer,
            'basemapsLayers': BasemapLayerSerializer(
                instance.basemap_layers, many=True
            ).data,
            'contextLayers': ContextLayerSerializer(
                instance.context_layers, many=True
            ).data,
        }
        return Response(context)
