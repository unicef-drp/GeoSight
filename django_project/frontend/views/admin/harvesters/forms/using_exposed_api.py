"""HarvestedUsingExposedAPIByExternalClient harvester view."""
from geosight.harvester.harveters.using_exposed_api import UsingExposedAPI
from geosight.harvester.models.harvester import Harvester
from ._base import HarvesterFormView


class HarvestedUsingExposedAPIByExternalClientView(HarvesterFormView):
    """HarvestedUsingExposedAPIByExternalClient harvester view."""

    harvester_class = UsingExposedAPI
    template_name = 'frontend/admin/harvesters/exposed_api.html'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        try:
            self.indicator.harvester
        except Harvester.DoesNotExist:
            attributes = []
            for attr in context['attributes']:
                if attr['name'] not in ['token', 'API URL']:
                    attributes.append(attr)
            context['attributes'] = attributes
        return context
