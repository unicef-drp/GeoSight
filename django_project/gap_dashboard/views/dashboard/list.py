"""Dashboard List View."""
from gap_dashboard.views.dashboard._base import BaseDashboardView


class DashboardListView(BaseDashboardView):
    """Dashboard List View."""

    template_name = 'dashboard/list.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard list'
