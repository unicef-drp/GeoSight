"""Dashboard Detail View."""
from braces.views import LoginRequiredMixin
from django.shortcuts import get_object_or_404

from frontend.views.dashboard._base import BaseDashboardView
from geosight.data.models.dashboard import Dashboard


class DashboardDetailView(LoginRequiredMixin, BaseDashboardView):
    """Dashboard Detail View."""

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        return 'Dashboard detail'

    def get_context_data(self, slug, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        dashboard = get_object_or_404(
            Dashboard, slug=slug
        )

        context['dashboard'] = {'id': dashboard.slug}
        return context
