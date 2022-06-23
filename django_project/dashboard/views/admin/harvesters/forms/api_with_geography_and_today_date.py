"""HarvesterAPIWithGeographyAndTodayDate harvester view."""
from geosight.harvester.harveters.api_with_geography_and_today_date import (
    APIWithGeographyAndTodayDate
)
from ._base import HarvesterFormView


class HarvesterAPIWithGeographyAndTodayDateView(HarvesterFormView):
    """HarvesterAPIWithGeographyAndTodayDate harvester view."""

    harvester_class = APIWithGeographyAndTodayDate
    template_name = 'admin/harvesters/forms/api_with_geography.html'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        return context
