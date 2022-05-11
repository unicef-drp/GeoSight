"""Dashboard List View."""
from frontend.views.dashboard._base import BaseDashboardView


class CounterView(BaseDashboardView):
    """Counter View."""

    template_name = 'frontend/counter.html'

    @property
    def content_title(self):
        """Return content title."""
        return 'Dashboard detail'
