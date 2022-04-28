from django.http import Http404
from django.shortcuts import reverse

from gap_dashboard.views.dashboard.admin._base import AdminView
from gap_data.models import Indicator


class IndicatorReportingUnitView(AdminView):
    template_name = 'dashboard/admin/indicator/reporting-unit.html'
    indicator = None

    @property
    def content_title(self):
        return (
            f'<span>Indicator Reporting Units</span> : {self.indicator.name} '
        )

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        try:
            self.indicator = self.instance.indicators.get(
                id=self.kwargs.get('pk', '')
            )

            context.update(
                {
                    'indicator': self.indicator,
                    'geometries': self.instance.geometries().filter(
                        geometry_level=self.indicator.geometry_reporting_level
                    ).order_by('name'),
                    'geometry_reporting_units': list(
                        self.indicator.reporting_units.values_list(
                            'id', flat=True
                        )
                    ),
                    'url': reverse(
                        'indicator-reporting-units-api', args=[
                            self.instance.slug, self.indicator.pk
                        ]
                    )
                }
            )
            return context
        except Indicator.DoesNotExist:
            raise Http404('Indicator does not exist')
