"""Base dashboard View."""
from abc import ABC

from frontend.views._base import BaseView
from geosight.data.models.dashboard.widget import LayerUsed


class BaseDashboardView(ABC, BaseView):
    """Base dashboard View."""

    instance = None
    template_name = 'frontend/dashboard.html'

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)

        context['definition'] = {
            'WidgetLayerUsed': {
                name: value for name, value in vars(LayerUsed).items() if
                name.isupper()
            },
        }
        return context

    @property
    def page_title(self):
        """Return page title that used on tab bar."""
        return 'Dashboard'

    @property
    def content_title(self):
        """Return content title that used on page title indicator."""
        raise NotImplementedError
