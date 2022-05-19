"""Backups View."""
from braces.views import SuperuserRequiredMixin
from django.conf import settings

from gap_data.utils import path_to_dict
from ._base import BaseView


class BackupsView(SuperuserRequiredMixin, BaseView):
    """Backups View."""

    template_name = 'pages/backups.html'

    def get_context_data(self, **kwargs):
        """Return context data."""
        context = super().get_context_data(**kwargs)
        context['dir'] = path_to_dict(
            settings.BACKUPS_ROOT, settings.BACKUPS_ROOT, ['.dmp'], True
        )
        return context

    @property
    def page_title(self):
        """Return page title."""
        return 'Backups'

    @property
    def content_title(self):
        """Return content title."""
        return 'Backups'
