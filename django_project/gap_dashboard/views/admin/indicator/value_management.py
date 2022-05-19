"""Value management forms of indicator."""
import datetime
import json

from django.http import Http404
from django.shortcuts import redirect, reverse, get_object_or_404

from gap_dashboard.views.admin._base import AdminView
from gap_data.models import Indicator, IndicatorExtraValue
from gap_data.models.indicator.indicator import IndicatorValueRejectedError
from gap_data.serializer.reference_layer import GeometryContextSerializer


class IndicatorValueManagementMapView(AdminView):
    """Indicator Value Management Map View."""

    template_name = 'dashboard/admin/indicator/value-management-map.html'
    indicator = None

    @property
    def content_title(self):
        """Return content title."""
        return f'Indicator Value Manager Map : {self.indicator.full_name} '

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        try:
            self.indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )

            legends = {
                'NODATA': {
                    'name': 'No Data',
                    'color': 'gray'
                },
                'LATESTDATAFOUND': {
                    'name': 'Has Data',
                    'color': 'green'
                },
                'NEEDUPDATE': {
                    'name': 'Need Update Data',
                    'color': 'red'
                }
            }
            context.update(
                {
                    'indicator': self.indicator,
                    'geometry': json.loads(
                        json.dumps(
                            GeometryContextSerializer(
                                self.indicator.reporting_units,
                                many=True).data
                        )
                    ),
                    'geometry_has_updated_value': list(
                        set(
                            self.indicator.query_value(
                                datetime.date.today()
                            ).values_list('geometry', flat=True)
                        )
                    ),
                    'geometry_has_value': list(
                        set(
                            self.indicator.indicatorvalue_set.values_list(
                                'geometry', flat=True
                            )
                        )
                    ),
                    'legends': legends,
                    'url_value_by_geometry': reverse(
                        'indicator-values-by-geometry', args=[
                            self.indicator.id, 0
                        ])
                }
            )
            return context
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')


class IndicatorValueManagementTableView(AdminView):
    """Indicator Value Management Form View."""

    template_name = 'dashboard/admin/indicator/value-management-form.html'
    indicator = None

    @property
    def content_title(self):
        """Return content title."""
        return (
            f'<span>Indicator Value Manager Form</span> : '
            f'{self.indicator.full_name} '
        )

    @property
    def context_view(self) -> dict:
        """Return context for specific view by instance."""
        try:
            self.indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )

            context = {
                'indicator': self.indicator,
                'geometry_reporting_units':
                    self.indicator.reporting_units.order_by('name'),
                'values': self.indicator.indicatorvalue_set.order_by('date')
            }
            return context
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')

    def post(self, request, **kwargs):
        """Save value of indicator."""
        indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        date = request.POST.get('date', None)
        if date:
            indicator_values = {}
            for reporting_unit in indicator.reporting_units:
                try:
                    value = float(
                        request.POST.get(f'{reporting_unit.id}', None)
                    )
                except ValueError:
                    pass
                else:
                    try:
                        indicator_value = indicator.save_value(
                            date, reporting_unit, value)
                        indicator_values[
                            f'{reporting_unit.id}'] = indicator_value
                    except IndicatorValueRejectedError:
                        pass

            # we need to check extra value
            for key, extra_value in request.POST.dict().items():
                if 'extra-value' in key:
                    keys = key.split('-')
                    reporting_id = keys[0]
                    extra_name = request.POST.get(
                        f'{"-".join(keys[:3])}-name', None
                    )
                    if extra_name and extra_value:
                        try:
                            indicator_value = indicator_values[
                                reporting_id]
                            indicator_extra_value, created = \
                                IndicatorExtraValue.objects.get_or_create(
                                    indicator_value=indicator_value,
                                    name=extra_name
                                )
                            indicator_extra_value.value = extra_value
                            indicator_extra_value.save()
                        except KeyError:
                            pass

        return redirect(
            reverse(
                'indicator-management-view', args=[self.instance.slug]
            )
        )
