"""HarvesterAPIWithGeographyAndDate Harvester View."""
from geosight.harvester.harveters.api_with_geography_and_date import (
    APIWithGeographyAndDate
)
from ._base import HarvesterFormView


class HarvesterAPIWithGeographyAndDateView(HarvesterFormView):
    """HarvesterAPIWithGeographyAndDate Harvester View."""

    harvester_class = APIWithGeographyAndDate
    template_name = 'admin/harvesters/forms/api_with_geography.html'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        return context
