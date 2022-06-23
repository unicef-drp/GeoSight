"""HarvestedUsingExposedAPIByExternalClient harvester view."""
from geosight.harvester.harveters.using_exposed_api import UsingExposedAPI
from ._base import HarvesterFormView


class HarvestedUsingExposedAPIByExternalClientView(HarvesterFormView):
    """HarvestedUsingExposedAPIByExternalClient harvester view."""

    harvester_class = UsingExposedAPI
    template_name = 'admin/harvesters/forms/using_exposed_api.html'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        return context
