from gap_harvester.harveters.api_with_geography_and_date import APIWithGeographyAndDate
from ._base import HarvesterFormView


class HarvesterAPIWithGeographyAndDateView(HarvesterFormView):
    harvester_class = APIWithGeographyAndDate
    template_name = 'dashboard/admin/harvesters/forms/api_with_geography.html'

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context['reporting_units'] = self.indicator.reporting_units.order_by('name')
        return context
