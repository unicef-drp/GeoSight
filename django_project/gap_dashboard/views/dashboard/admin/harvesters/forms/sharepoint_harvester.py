from django.conf import settings

from gap_dashboard.views.dashboard.admin.harvesters.forms._base import (
    HarvesterFormView
)
from gap_data.utils import path_to_dict
from gap_harvester.harveters.sharepoint_harvester import SharepointHarvester


class SharepointHarvesterView(HarvesterFormView):
    harvester_class = SharepointHarvester
    template_name = (
        'dashboard/admin/harvesters/forms/sharepoint_harvester.html'
    )

    def get_context_data(self, **kwargs) -> dict:
        context = super().get_context_data(**kwargs)
        context['dir'] = path_to_dict(
            settings.ONEDRIVE_ROOT, settings.ONEDRIVE_ROOT, ['.xlsx', '.xls']
        )
        return context
