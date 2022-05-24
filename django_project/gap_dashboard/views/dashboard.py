"""Dashboard List View."""
from django.shortcuts import reverse

from gap_data.models.dashboard import Dashboard
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

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        if self.request.user.is_staff:
            context['dashboards'] = [
                {
                    'slug': dashboard.slug,
                    'name': dashboard.name,
                    'description': dashboard.description,
                    'icon': dashboard.icon.url,
                    'edit': dashboard.icon.url,
                    'can_edit': dashboard.can_edit(self.request.user),
                    'url': reverse(
                        'dashboard-detail-view',
                        args=[dashboard.slug]
                    )
                }
                for dashboard in Dashboard.objects.all()
            ]
        else:
            context['dashboard'] = []
        return context
