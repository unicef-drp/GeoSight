"""Base dashboard View."""
from abc import ABC

from frontend.views._base import BaseView
from gap_data.models.instance import Instance
from gap_data.serializer.link import LinkSerializer


class BaseDashboardView(ABC, BaseView):
    """Base dashboard View."""

    instance = None

    def get_context_data(self, **kwargs) -> dict:
        """Return context data."""
        context = super().get_context_data(**kwargs)

        # TODO:
        #  This will be linked to dashboard model
        self.instance = Instance.objects.get(slug='somalia')
        context['instance'] = self.instance
        context['dashboard'] = {
            'id': kwargs.get('slug', '')
        }

        links = self.instance.links
        if not self.request.user.is_staff:
            links = links.exclude(is_public=False)
        context['links'] = [
            dict(d) for d in LinkSerializer(links, many=True).data
        ]
        return context

    @property
    def content_title(self):
        """Return content title."""
        raise NotImplementedError

    @property
    def page_title(self):
        """Return page title."""
        return 'Dashboard'
