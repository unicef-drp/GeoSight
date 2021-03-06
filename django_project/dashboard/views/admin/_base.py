from abc import ABC

from braces.views import SuperuserRequiredMixin

from dashboard.views._base import BaseView


class AdminView(SuperuserRequiredMixin, BaseView, ABC):
    """Base dashboard View."""

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        return context

    @property
    def content_title(self):
        """Return content title."""
        raise NotImplementedError

    @property
    def page_title(self):
        """Return page title."""
        return 'Dashboard'
