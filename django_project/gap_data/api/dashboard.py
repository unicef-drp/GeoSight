"""Context Analysis API.."""
from django.contrib.gis.geos import Polygon
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.indicator import Indicator
from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.serializer.context_layer import ContextLayerSerializer
from gap_data.serializer.indicator import IndicatorSerializer


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        # TODO:
        #  This slug should be the dashboard slug
        indicator = Indicator.objects.filter(name__iexact=slug).first()
        if not indicator:
            raise Http404('Indicator not found')

        reference_layer = IndicatorSerializer(indicator).data
        extent = Polygon(
            (
                (39.5409183, 12.854323),
                (55.014220, 12.854323),
                (55.014220, -2.365759),
                (39.5409183, 2.365759),
                (39.5409183, 12.854323)
            )
        )
        context = {
            'referenceLayer': reference_layer,
            'basemapsLayers': BasemapLayerSerializer(
                indicator.instance.basemap_layers, many=True
            ).data,
            'contextLayers': ContextLayerSerializer(
                indicator.instance.context_layers, many=True
            ).data,
            'extent': extent.extent,
            'plugins': [
                {
                    'id': 1,
                    'title': indicator.name,
                    'description': indicator.description,
                    'unit': indicator.unit,
                    'type': 'GeneralWidget',
                    'column': 'value',
                    'operation': 'Sum',
                    'layer_id': indicator.id,
                    'layer_type': 'Reference Layer'
                }
            ]
        }
        return Response(context)
