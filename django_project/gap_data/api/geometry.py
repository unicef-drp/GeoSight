from datetime import datetime

from django.http import Http404, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from gap_data.models.geometry import Geometry, GeometryLevelName
from gap_data.models.instance import Instance
from gap_data.serializer.geometry import GeometrySerializer


class GeometryGeojsonAPI(APIView):
    """
    Return geometry of instance
    """

    def get(self, request, slug, geometry_level, date):
        """
        Return geometry in geojson

        :param geometry_level: the geometry level that will be returned
        :param date: the date of data
        :return:
        """
        try:
            instance = get_object_or_404(
                Instance, slug=slug
            )
            date = datetime.strptime(date, "%Y-%m-%d").date()
            geometry_level = GeometryLevelName.objects.get(name__iexact=geometry_level)
            geometries = instance.geometries(date).filter(geometry_level=geometry_level).order_by('identifier')
            return Response(GeometrySerializer(geometries, many=True).data)
        except GeometryLevelName.DoesNotExist:
            raise Http404('The geometry level is not recognized')
        except ValueError:
            return HttpResponseBadRequest('Date format is not correct')


class GeometryDetailAPI(APIView):
    """
    Return geometry of instance
    """

    def post(self, request, slug, pk):
        """
        Update the values for geometry

        :param slug: slug of the instance
        :param pk: pk of the indicator
        :return:
        """
        instance = get_object_or_404(
            Instance, slug=slug
        )
        try:
            geometry = Geometry.objects.get(
                instance=instance,
                pk=pk
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
