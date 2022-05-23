"""Dashboard Create View."""

from frontend.views.dashboard._base import BaseDashboardView


class DashboardCreateView(BaseDashboardView):
    """Dashboard Detail View."""

    template_name = 'frontend/dashboard/edit.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard crate'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context['dashboard'] = {'id': -99}
        return context
