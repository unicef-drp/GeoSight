"""Geometry API.
TODO:
 This will be moved to georepo
"""

from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.reference_layer import Geometry, GeometryLevelName
from gap_data.serializer.reference_layer import GeometrySerializer


class GeometryGeojsonAPI(APIView):
    """Return geometry of instance."""

    def get(self, request, geometry_level):
        """Return geometry in geojson.

        :param geometry_level: the geometry level that will be returned
        :return:
        """
        try:
            geometry_level = GeometryLevelName.objects.get(
                name__iexact=geometry_level
            )
            geometries = Geometry.objects.filter(
                geometry_level=geometry_level)
            return Response(
                GeometrySerializer(geometries, many=True).data
            )
        except GeometryLevelName.DoesNotExist:
            raise Http404('The geometry level is not recognized')
        except ValueError:
            return HttpResponseBadRequest('Date format is not correct')


class GeometryDetailAPI(APIView):
    """Return geometry of instance."""

    def post(self, request, pk):
        """Update the values for geometry.

        :param pk: pk of the indicator
        :return:
        """
        try:
            geometry = get_object_or_404(
                Geometry, pk=pk
            )
            data = request.data
            name = data.get('name', None)
            if name is not None:
                geometry.name = name
            alias = data.get('alias', None)
            if alias is not None:
                geometry.alias = alias
            dashboard_link = data.get('dashboard_link', None)
            if dashboard_link is not None:
                geometry.dashboard_link = dashboard_link
            geometry.save()
            return Response(GeometrySerializer(geometry).data)
        except Geometry.DoesNotExist:
            raise Http404('The geometry does not found')
