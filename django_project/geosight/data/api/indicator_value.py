"""API for indicator value."""
from datetime import datetime

from django.http import HttpResponseBadRequest, HttpResponseNotFound
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import AdminAuthenticationPermission
from geosight.data.authentication import (
    IndicatorHarvesterTokenAndBearerAuthentication
)
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
            return HttpResponseNotFound('Not found')


class IndicatorValues(APIView):
    """
    Return Scenario value for country with the indicator geometry level
    """
    authentication_classes = (IndicatorHarvesterTokenAndBearerAuthentication,)

    def post(self, request, pk):
        """
        Save value for specific date

        :param slug: slug of the instance
        :param pk: pk of the indicator
        :return:
        """
        try:
            data = request.data
            indicator = get_object_or_404(Indicator, pk=pk)

            # Validate the data
            try:
                date = datetime.strptime(
                    data['date'], "%Y-%m-%d").date()
            except ValueError:
                return HttpResponseBadRequest(
                    'Date format should be YYYY-MM-DD')
            try:
                value = float(data['value'])
            except ValueError:
                return HttpResponseBadRequest('Value need to be number')

            # extra data needs to be dictionary
            extra_data = data.get('extra_data', None)
            if extra_data:
                try:
                    extra_data.keys()
                except AttributeError:
                    return HttpResponseBadRequest(
                        'The extra_data needs to be json')

            # Check if value already exist
            geometry_code = data['geometry_code']
            try:
                indicator.indicatorvalue_set.get(
                    date=date,
                    geom_identifier=geometry_code
                )
                return HttpResponseBadRequest(
                    'The value on this date already exist')
            except IndicatorValue.DoesNotExist:
                pass
            indicator_value = indicator.save_value(
                date, geometry_code, value, extra_data
            )
            return Response(
                IndicatorValueBasicSerializer(indicator_value).data
            )
        except KeyError as e:
            return HttpResponseBadRequest(f'{e} is required')
        except IndicatorValueRejectedError as e:
            return HttpResponseBadRequest(f'{e}')


class IndicatorValuesBatch(APIView):
    """
    Return Scenario value for country with the indicator geometry level
    """
    authentication_classes = (IndicatorHarvesterTokenAndBearerAuthentication,)

    def post(self, request, slug, pk):
        """
        Save value for specific date

        :param slug: slug of the instance
        :param pk: pk of the indicator
        :return:
        """
        try:
            data = request.data
            rows = request.data
            indicator = get_object_or_404(Indicator, pk=pk)

            replace = False
            if 'replace' in request.query_params:
                replace = eval(request.query_params['replace'])

            if replace:
                indicator.indicatorvalue_set.all().delete()

            indicator_values = []
            for data in rows:
                # Validate the data
                try:
                    date = datetime.strptime(
                        data['date'], "%Y-%m-%d").date()
                except ValueError:
                    return HttpResponseBadRequest(
                        'Date format should be YYYY-MM-DD')
                try:
                    value = float(data['value'])
                except ValueError:
                    return HttpResponseBadRequest('Value need to be number')

                # extra data needs to be dictionary
                extra_data = data.get('extra_data', None)
                if extra_data:
                    try:
                        extra_data.keys()
                    except AttributeError:
                        return HttpResponseBadRequest(
                            'The extra_data needs to be json')

                # Check if value already exist
                try:
                    geometry_code = data['geometry_code']
                    indicator.indicatorvalue_set.get(
                        date=date,
                        geometry=geometry_code
                    )
                    continue
                except IndicatorValue.DoesNotExist:
                    pass
                indicator_values.append(
                    indicator.save_value(
                        date, geometry_code, value, extra_data
                    )
                )
            return Response(
                IndicatorValueBasicSerializer(
                    indicator_values, many=True).data
            )
        except KeyError as e:
            return HttpResponseBadRequest(f'{e} is required')
        except IndicatorValueRejectedError as e:
            return HttpResponseBadRequest(f'{e}')
        except NameError:
            return HttpResponseBadRequest(f'replace needs to be True or False')
