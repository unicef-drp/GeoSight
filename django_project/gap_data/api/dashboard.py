"""Context Analysis API.."""
import datetime
import json

from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.dashboard import Dashboard
from gap_data.models.geometry import GeometryLevelInstance, Geometry
from gap_data.serializer.basemap_layer import BasemapLayerSerializer
from gap_data.serializer.context_layer import ContextLayerSerializer
from gap_data.serializer.dashboard import (
    PluginSerializer
)
from gap_data.serializer.indicator import IndicatorSerializer


class DashboardData(APIView):
    """Return all dashboard data."""

    def get(self, request, slug):
        """Return all context analysis data."""
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )

        reference_layer = IndicatorSerializer(
            dashboard.reference_layers.first()
        ).data
        reference_layer['name'] = dashboard.name
        context = {
            'referenceLayer': reference_layer,
            'basemapsLayers': BasemapLayerSerializer(
                dashboard.basemap_layers, many=True
            ).data,
            'contextLayers': ContextLayerSerializer(
                dashboard.context_layers, many=True
            ).data,
            'extent': dashboard.extent.extent,
            'plugins': PluginSerializer(
                dashboard.plugin_set.all().order_by('pk'), many=True
            ).data
        }
        return Response(context)


class DashboardReferenceGeojson(APIView):
    """Reference Layer Data in Geojson."""

    def get(self, request, slug):
        """Return all context analysis data."""
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )
        default_indicator = dashboard.reference_layers.first()
        geometry_level = GeometryLevelInstance.objects.filter(
            instance=default_indicator.instance
        ).filter(
            parent__isnull=True
        ).first()

        if not geometry_level:
            return HttpResponseBadRequest(
                'No most top level of geometry level.'
            )

        geom_input = default_indicator.instance.geometries().filter(
            geometry_level=geometry_level.level
        ).first()
        if not geom_input:
            return HttpResponseBadRequest(
                'No most top level of geometry level.')

        date = datetime.datetime.today()

        features = {}
        for indicator in dashboard.reference_layers.all():
            # get indicator value
            values = indicator.values(
                geom_input, indicator.geometry_reporting_level, date,
                more_information=True
            )
            for value in values:
                value[indicator.name] = value['value']
                del value['value']
                try:
                    geometry = Geometry.objects.get(id=value['geometry_id'])
                    if value['geometry_id'] not in features:
                        features[value['geometry_id']] = {
                            "type": "Feature",
                            "properties": {},
                            "geometry": json.loads(
                                geometry.geometry.geojson
                            )
                        }
                    features[value['geometry_id']]['properties'].update(value)
                except Geometry.DoesNotExist:
                    pass

        return Response(
            {
                "type": "FeatureCollection",
                "features": [feature for key, feature in features.items()]
            }
        )
