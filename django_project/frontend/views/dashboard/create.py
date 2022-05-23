"""Dashboard Create View."""

from frontend.views.dashboard._base import BaseDashboardView
from gap_data.api.dashboard import CREATE_SLUG


class DashboardCreateView(BaseDashboardView):
    """Dashboard Detail View."""

    template_name = 'frontend/dashboard/view.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard crate'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context['dashboard'] = {'id': CREATE_SLUG}
        context['edit_mode'] = True
        return context
