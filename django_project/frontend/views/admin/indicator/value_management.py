"""Value management forms of indicator."""
import datetime

from braces.views import SuperuserRequiredMixin
from django.shortcuts import redirect, reverse, get_object_or_404

from frontend.views._base import BaseView
from geosight.data.models import Indicator, IndicatorExtraValue


class IndicatorValueManagementMapView(SuperuserRequiredMixin, BaseView):
    """Indicator Value Management Map View."""

    template_name = 'frontend/admin/indicator/value-management-map.html'
    indicator = None

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Indicator Value Manager Map'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        return (
            f'<span>Indicators</span> <span>></span> '
            f'<span>{self.indicator.__str__()}</span> <span>></span> '
            f'<span>Value Manager Map </span>'
        )

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        context = super().get_context_data(**kwargs)
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
                'geometry_has_updated_value': list(
                    set(
                        self.indicator.query_value(
                            datetime.date.today()
                        ).exclude(
                            geom_identifier='undefined'
                        ).values_list('geom_identifier', flat=True)
                    )
                ),
                'geometry_has_value': list(
                    set(
                        self.indicator.indicatorvalue_set.values_list(
                            'geom_identifier', flat=True
                        )
                    )
                ),
                'legends': legends,
                'url_value_by_geometry': reverse(
                    'indicator-values-by-geometry', args=[
                        self.indicator.id, 0
                    ]
                )
            }
        )
        return context


class IndicatorValueManagementTableView(SuperuserRequiredMixin, BaseView):
    """Indicator Value Management Form View."""

    template_name = 'frontend/admin/indicator/value-management-form.html'
    indicator = None

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Indicator Value Manager Form'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        return f'Indicator Value Manager Form : {self.indicator.__str__()} '

    def get_context_data(self, **kwargs) -> dict:
        """Return context."""
        context = super().get_context_data(**kwargs)
        self.indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        context.update(
            {
                'indicator': self.indicator,
                'values': self.indicator.indicatorvalue_set.order_by('-date')
            }
        )
        return context

    def post(self, request, **kwargs):
        """Save value of indicator."""
        indicator = get_object_or_404(
            Indicator, id=self.kwargs.get('pk', '')
        )
        date = request.POST.get('date', None)
        if date:
            indicator_values = {}
            # save data by geometry
            for key, value in request.POST.dict().items():
                if value and 'geometry:' in key:
                    code = key.replace('geometry:', '')
                    indicator_value = indicator.save_value(
                        date, code, float(value))
                    indicator_values[code] = indicator_value

            # we need to check extra value
            for key, extra_value in request.POST.dict().items():
                if 'extra_value' in key:
                    keys = key.split(':')
                    reporting_id = keys[2]
                    extra_name = request.POST.get(
                        key.replace('extra_value', 'extra_name'), None
                    )
                    if extra_name and extra_value:
                        try:
                            indicator_value = indicator_values[reporting_id]
                            indicator_extra_value, created = \
                                IndicatorExtraValue.objects.get_or_create(
                                    indicator_value=indicator_value,
                                    name=extra_name
                                )
                            indicator_extra_value.value = extra_value
                            indicator_extra_value.save()
                        except KeyError:
                            pass

        return redirect(reverse('admin-indicator-list-view'))
