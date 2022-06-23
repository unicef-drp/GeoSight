"""SharepointHarvester Harvester view."""
from django.conf import settings

from dashboard.views.admin.harvesters.forms._base import HarvesterFormView
from geosight.data.utils import path_to_dict
from geosight.harvester.harveters.sharepoint_harvester import (
    SharepointHarvester
)


class SharepointHarvesterView(HarvesterFormView):
    """SharepointHarvester Harvester view."""

    harvester_class = SharepointHarvester
    template_name = 'admin/harvesters/forms/sharepoint_harvester.html'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context['dir'] = path_to_dict(
            settings.ONEDRIVE_ROOT, settings.ONEDRIVE_ROOT, ['.xlsx', '.xls']
        )
        return context
