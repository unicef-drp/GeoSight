"""Base dashboard View."""
from abc import ABC

from django.shortcuts import get_object_or_404

from gap_dashboard.views._base import BaseView
from gap_data.models.instance import Instance


class BaseDashboardView(ABC, BaseView):
    """Base dashboard View."""

    instance = None

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        self.instance = get_object_or_404(
            Instance, slug=kwargs.get('slug', '')
        )
        context['instance'] = self.instance
        return context

    @property
    def content_title(self):
        """Return content title."""
        raise NotImplementedError

    @property
    def page_title(self):
        """Return page title."""
        return 'Dashboard'
