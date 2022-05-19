"""Dashboard List View."""
from ._base import BaseView


class DashboardListView(BaseView):
    """Dashboard List View."""

    @property
    def template_name(self):
        """Return template name."""
        return 'pages/dashboards.html'

    @property
    def page_title(self):
        """Return page title."""
        return 'Dashboards'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboards'
