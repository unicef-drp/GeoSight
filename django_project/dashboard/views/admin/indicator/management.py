"""Indicator Management View."""
from dashboard.views.admin._base import AdminView
from geosight.data.models.indicator import IndicatorGroup
from geosight.harvester.models.harvester import UsingExposedAPI


class IndicatorManagementView(AdminView):
    """Indicator Management View."""

    template_name = 'admin/indicator/management.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Indicator Management'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        indicators_in_groups = {
            group.name: group.indicator_set.order_by('name')
            for group in IndicatorGroup.objects.order_by('name')
        }
        context.update(
            {
                'indicators_in_groups': indicators_in_groups,
                'external_exposed_api': UsingExposedAPI[0]
            }
        )
        return context
