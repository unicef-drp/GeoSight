"""Dashboard List View."""
from frontend.views.dashboard._base import BaseDashboardView


class DashboardDetailView(BaseDashboardView):
    """Dashboard Detail View."""

    template_name = 'webapp/dashboard.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard detail'
