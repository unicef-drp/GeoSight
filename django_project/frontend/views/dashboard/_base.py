"""Base dashboard View."""
from abc import ABC

from django.shortcuts import get_object_or_404

from frontend.views._base import BaseView
from gap_data.models.dashboard import Dashboard
from gap_data.models.dashboard.plugin import Type, LayerUsed, Operation


class BaseDashboardView(ABC, BaseView):
    """Base dashboard View."""

    instance = None

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)
        dashboard = get_object_or_404(
            Dashboard, slug=kwargs.get('slug', '')
        )

        context['dashboard'] = {
            'id': dashboard.slug
        }

        context['definition'] = {
            'PluginType': {
                name: value for name, value in vars(Type).items() if
                name.isupper()
            },
            'PluginOperation': {
                name: value for name, value in vars(Operation).items() if
                name.isupper()
            },
            'PluginLayerUsed': {
                name: value for name, value in vars(LayerUsed).items() if
                name.isupper()
            },
        }
        return context

    @property
    def content_title(self):
        """Return content title."""
        raise NotImplementedError

    @property
    def page_title(self):
        """Return page title."""
        return 'Dashboard'
