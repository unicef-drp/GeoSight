"""Dashboard Detail View."""
from django.shortcuts import get_object_or_404

from frontend.views.dashboard._base import BaseDashboardView
from gap_data.models.dashboard import Dashboard


class DashboardDetailView(BaseDashboardView):
    """Dashboard Detail View."""

    template_name = 'frontend/dashboard/view.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard detail'

    def get_context_data(self, slug, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )

        context['dashboard'] = {'id': dashboard.slug}
        return context
