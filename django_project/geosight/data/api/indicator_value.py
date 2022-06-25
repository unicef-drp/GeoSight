"""API for indicator value."""

from django.http import HttpResponseBadRequest, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import AdminAuthenticationPermission
from geosight.data.models.indicator import (
    Indicator, IndicatorValueRejectedError, IndicatorValue
)
from geosight.data.serializer.indicator import IndicatorValueBasicSerializer


class IndicatorValuesByGeometry(APIView):
    """Return Scenario value for the specific geometry for all date."""

    permission_classes = (IsAuthenticated, AdminAuthenticationPermission)

    def get(self, request, pk, geometry_code):
        """Return values of the indicator.

        :param pk: pk of the indicator
        :param geometry_code: the geometry code
        :return:
        """
        indicator = get_object_or_404(Indicator, pk=pk)
        values = indicator.indicatorvalue_set.filter(
            geom_identifier=geometry_code).order_by('-date')
        return Response(IndicatorValueBasicSerializer(values, many=True).data)

    def post(self, request, pk, geometry_code):
        """Return values of the indicator.

        :param pk: pk of the indicator
        :param geometry_code: the geometry code
        :return:
        """
        indicator = get_object_or_404(Indicator, pk=pk)
        try:
            value = float(request.POST['value'])
            indicator.save_value(request.POST['date'], geometry_code, value)
            return Response('OK')
        except ValueError:
            return HttpResponseBadRequest('Value is not a number')
        except IndicatorValueRejectedError as e:
            return HttpResponseBadRequest(f'{e}')


class IndicatorValueDetail(APIView):
    """Return Scenario value for the specific geometry for all date."""

    permission_classes = (IsAuthenticated, AdminAuthenticationPermission)

    def get(self, request, pk, value_id):
        """Return extra values of the indicator.

        :param pk: pk of the indicator
        :param value_id: the id of value
        :return:
        """
        indicator = get_object_or_404(Indicator, pk=pk)
        try:
            indicator_value = indicator.indicatorvalue_set.get(pk=value_id)
            # for details
            details = []
            for row in indicator_value.indicatorvalueextradetailrow_set.all():
                columns = {}
                for column in row.indicatorvalueextradetailcolumn_set.all():
                    columns[column.name] = column.value
                details.append(columns)
            return Response({
                'details': details
            })
        except IndicatorValue.DoesNotExist:
            return HttpResponseNotFound(f'Not found')
